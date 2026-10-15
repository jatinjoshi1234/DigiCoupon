"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AuthSessionData,
  LoginRequest,
  RegisterRequest,
  RestaurantProfile,
  UserProfile,
} from "../type/auth";

interface AuthContextType {
  user: UserProfile | null;
  restaurant: RestaurantProfile | null;
  userId: number | undefined;
  restaurantId: number | undefined;
  userName: string;
  restaurantName: string;
  isRestaurantCreated: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (
    credentials: LoginRequest,
  ) => Promise<{ isRestaurantCreated: boolean }>;
  register: (data: RegisterRequest) => Promise<void>;
  createRestaurant: (data: any) => Promise<void>;
  updateRestaurant: (data: Partial<RestaurantProfile>) => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [restaurant, setRestaurant] = useState<RestaurantProfile | null>(null);
  const [isRestaurantCreated, setIsRestaurantCreated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Track the last path we redirected to — prevents firing router.replace in a loop
  const lastRedirectRef = useRef<string | null>(null);

  const isAuthenticated = useMemo(() => Boolean(user && user.id > 0), [user]);

  const userId = useMemo(() => (user?.id ? user.id : undefined), [user]);
  const restaurantId = useMemo(
    () => (restaurant?.id ? restaurant.id : undefined),
    [restaurant],
  );

  const userName = useMemo(() => user?.name || "", [user]);
  const restaurantName = useMemo(() => {
    if (!restaurant?.name) return "";
    const nameStr = String(restaurant.name).trim();
    if (!isNaN(Number(nameStr)) && Number(nameStr) === restaurant.id) {
      return "";
    }
    return nameStr;
  }, [restaurant]);

  const isPublicAuthRoute = useMemo(
    () => pathname?.startsWith("/auth/login") || pathname?.startsWith("/auth/register"),
    [pathname],
  );

  const isRestaurantCreateRoute = useMemo(
    () => pathname?.startsWith("/restuarant/create"),
    [pathname],
  );

  // Load session from secure server endpoint on initial mount
  const refreshSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/session", {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },
      });

      if (!res.ok) {
        setUser(null);
        setRestaurant(null);
        setIsRestaurantCreated(false);
        return;
      }

      const result = await res.json();
      if (result.status && result.data) {
        const session: AuthSessionData = result.data;
        setUser(session.user);
        setRestaurant(session.restaurant);
        setIsRestaurantCreated(Boolean(session.isRestaurantCreated));

        // If restaurant has an ID but name is missing or numeric ID, query proxy endpoint
        if (
          session.restaurant?.id &&
          session.restaurant.id > 0 &&
          (!session.restaurant.name ||
            String(session.restaurant.name) === String(session.restaurant.id) ||
            !isNaN(Number(session.restaurant.name)))
        ) {
          try {
            const restRes = await fetch(
              `/api/proxy/restuarant/${session.restaurant.id}`,
            );
            if (restRes.ok) {
              const restJson = await restRes.json();
              if (restJson.status && restJson.data) {
                const fetchedName = String(
                  restJson.data.name ?? restJson.data.Name ?? "",
                ).trim();
                if (fetchedName && isNaN(Number(fetchedName))) {
                  setRestaurant((prev) =>
                    prev ? { ...prev, name: fetchedName } : prev,
                  );
                }
              }
            }
          } catch {
            // ignore fallback error
          }
        }
      } else {
        setUser(null);
        setRestaurant(null);
        setIsRestaurantCreated(false);
      }
    } catch (err) {
      console.error("Failed to fetch session:", err);
      setUser(null);
      setRestaurant(null);
      setIsRestaurantCreated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  // Route protection and redirection flow
  useEffect(() => {
    if (isLoading) return;

    // Determine where we need to redirect (null = no redirect needed)
    let redirectTo: string | null = null;

    if (!user) {
      // Unauthenticated: must go to login unless already on a public auth route
      if (!isPublicAuthRoute) {
        redirectTo = "/auth/login";
      }
    } else {
      // Authenticated user on login/register page → push them into the app
      if (isPublicAuthRoute) {
        redirectTo = isRestaurantCreated ? "/" : "/restuarant/create";
      } else if (!isRestaurantCreated && !isRestaurantCreateRoute) {
        // Authenticated but no restaurant → must create one first
        redirectTo = "/restuarant/create";
      }
    }

    // Only redirect if:
    //  1. We actually need to go somewhere
    //  2. We're not already there (pathname !== redirectTo)
    //  3. We haven't already fired this exact redirect (prevents the loop)
    if (
      redirectTo &&
      pathname !== redirectTo &&
      lastRedirectRef.current !== redirectTo
    ) {
      lastRedirectRef.current = redirectTo;
      router.replace(redirectTo);
    } else if (!redirectTo) {
      // No redirect needed — clear the gate so future route changes work
      lastRedirectRef.current = null;
    }
  }, [
    user,
    isRestaurantCreated,
    isLoading,
    isPublicAuthRoute,
    isRestaurantCreateRoute,
    pathname,
    router,
  ]);

  const login = useCallback(
    async (credentials: LoginRequest): Promise<{ isRestaurantCreated: boolean }> => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();
      if (!response.ok || !result.status) {
        throw new Error(result.message || "Login failed.");
      }

      const session: AuthSessionData = result.data;
      setUser(session.user);
      setRestaurant(session.restaurant);
      setIsRestaurantCreated(session.isRestaurantCreated);

      return { isRestaurantCreated: session.isRestaurantCreated };
    },
    [],
  );

  const register = useCallback(
    async (data: RegisterRequest): Promise<void> => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok || !result.status) {
        throw new Error(result.message || "Registration failed.");
      }

      if (result.data) {
        const session: AuthSessionData = result.data;
        setUser(session.user);
        setRestaurant(session.restaurant);
        setIsRestaurantCreated(session.isRestaurantCreated);
      }
    },
    [],
  );

  const createRestaurant = useCallback(
    async (data: any): Promise<void> => {
      const response = await fetch("/api/restuarant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok || !result.status) {
        throw new Error(result.message || "Failed to create restaurant.");
      }

      const newRest: RestaurantProfile = result.data;
      setRestaurant(newRest);
      setIsRestaurantCreated(true);
    },
    [],
  );

  const updateRestaurant = useCallback(
    (data: Partial<RestaurantProfile>): void => {
      setRestaurant((prev) => (prev ? { ...prev, ...data } : null));
    },
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (err) {
      console.error("Logout request error:", err);
    } finally {
      setUser(null);
      setRestaurant(null);
      setIsRestaurantCreated(false);
      // Let the route-guard effect handle the redirect to /auth/login
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      restaurant,
      userId,
      restaurantId,
      userName,
      restaurantName,
      isRestaurantCreated,
      isAuthenticated,
      isLoading,
      login,
      register,
      createRestaurant,
      updateRestaurant,
      logout,
      refreshSession,
    }),
    [
      user,
      restaurant,
      userId,
      restaurantId,
      userName,
      restaurantName,
      isRestaurantCreated,
      isAuthenticated,
      isLoading,
      login,
      register,
      createRestaurant,
      updateRestaurant,
      logout,
      refreshSession,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
