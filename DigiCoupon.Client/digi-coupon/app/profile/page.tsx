"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
    Building2,
    CheckCircle2,
    Key,
    LoaderCircle,
    Lock,
    Mail,
    MapPin,
    Phone,
    Save,
    Store,
    UserRound,
    XCircle,
} from "lucide-react";
import styles from "./profile.module.css";
import { useAuth } from "../context/AuthContext";
import { RestaurantProfile, UserProfile } from "../type/auth";
import {
    getMyProfile,
    getMyRestaurant,
    updateRestaurantProfile,
    updateUserProfile,
} from "../services/profile.service";

// ── Types ─────────────────────────────────────────────────────────────────────

type ApiMessage = { type: "success" | "error"; text: string };

const emptyUser: UserProfile = {
    id: 0,
    name: "",
    email: "",
    mobile: "",
    firstName: "",
    lastName: "",
};

const emptyRestaurant: RestaurantProfile = {
    id: 0,
    name: "",
    email: "",
    mobile: "",
    address: "",
    fssaiLicenseNo: "",
    city: "",
    state: "",
    pincode: "",
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProfilePage() {
    const { restaurant: authRestaurant, user: authUser } = useAuth();

    // Local editable copies — initialised from auth context, then from API
    const [user, setUser] = useState<UserProfile>(authUser ?? emptyUser);
    const [restaurant, setRestaurant] = useState<RestaurantProfile>(
        authRestaurant ?? emptyRestaurant,
    );

    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [savingUser, setSavingUser] = useState(false);
    const [savingRestaurant, setSavingRestaurant] = useState(false);
    const [userMessage, setUserMessage] = useState<ApiMessage | null>(null);
    const [restaurantMessage, setRestaurantMessage] = useState<ApiMessage | null>(
        null,
    );

    // ── Load ──────────────────────────────────────────────────────────────────

    const loadProfile = useCallback(async () => {
        setLoading(true);
        setLoadError("");

        try {
            const [profileResult, restaurantResult] = await Promise.allSettled([
                getMyProfile(),
                getMyRestaurant(),
            ]);

            if (profileResult.status === "fulfilled" && profileResult.value?.user) {
                const u = profileResult.value.user;
                setUser({
                    id: u.id ?? 0,
                    name: u.name ?? "",
                    email: u.email ?? "",
                    mobile: u.mobile ?? "",
                    firstName: u.firstName ?? "",
                    lastName: u.lastName ?? "",
                });
            }

            if (restaurantResult.status === "fulfilled" && restaurantResult.value) {
                const r = restaurantResult.value;
                setRestaurant({
                    id: r.id ?? 0,
                    name: r.name ?? "",
                    email: r.email ?? "",
                    mobile: r.mobile ?? "",
                    address: r.address ?? "",
                    fssaiLicenseNo: r.fssaiLicenseNo ?? "",
                    city: r.city ?? "",
                    state: r.state ?? "",
                    pincode: r.pincode ?? "",
                });
            }

            const errors: string[] = [];
            if (profileResult.status === "rejected")
                errors.push("Could not load user details.");
            if (restaurantResult.status === "rejected")
                errors.push("Could not load restaurant details.");
            if (errors.length) setLoadError(errors.join(" "));
        } catch {
            setLoadError("Unable to load profile. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadProfile();
    }, [loadProfile]);

    // ── Field helpers ─────────────────────────────────────────────────────────

    function patchUser<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
        setUser((prev) => ({ ...prev, [key]: value }));
        setUserMessage(null);
    }

    function patchRestaurant<K extends keyof RestaurantProfile>(
        key: K,
        value: RestaurantProfile[K],
    ) {
        setRestaurant((prev) => ({ ...prev, [key]: value }));
        setRestaurantMessage(null);
    }

    // ── Save handlers ─────────────────────────────────────────────────────────

    async function saveUser(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSavingUser(true);
        setUserMessage(null);
        try {
            const res = await updateUserProfile({
                name: user.name,
                email: user.email,
                mobile: user.mobile,
            });
            if (res.status) {
                setUserMessage({ type: "success", text: "User details saved successfully." });
            } else {
                setUserMessage({ type: "error", text: res.message || "Failed to save." });
            }
        } catch {
            setUserMessage({ type: "error", text: "Unable to save user details." });
        } finally {
            setSavingUser(false);
        }
    }

    async function saveRestaurant(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSavingRestaurant(true);
        setRestaurantMessage(null);
        try {
            const res = await updateRestaurantProfile(restaurant.id, {
                id: restaurant.id,
                name: restaurant.name,
                email: restaurant.email ?? "",
                mobile: restaurant.mobile ?? "",
                address: restaurant.address,
                fssaiLicenseNo: restaurant.fssaiLicenseNo,
            });
            if (res.status) {
                setRestaurantMessage({
                    type: "success",
                    text: "Restaurant details saved successfully.",
                });
            } else {
                setRestaurantMessage({ type: "error", text: res.message || "Failed to save." });
            }
        } catch {
            setRestaurantMessage({ type: "error", text: "Unable to save restaurant details." });
        } finally {
            setSavingRestaurant(false);
        }
    }

    // ── Render ────────────────────────────────────────────────────────────────

    if (loading) {
        return (
            <main className={styles.page}>
                <div className={styles.loading}>
                    <LoaderCircle className={styles.spinner} size={28} />
                    <p>Loading profile…</p>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.page}>
            {/* ── Page header ───────────────────────────────────────── */}
            <div className={styles.pageHeader}>
                <div>
                    <div className={styles.eyebrow}>ACCOUNT SETTINGS</div>
                    <h1>My Profile</h1>
                    <p>Manage your personal account and restaurant information.</p>
                </div>
                <div className={styles.headerIcon}>
                    <Store size={28} />
                </div>
            </div>

            {loadError && (
                <div className={styles.loadError} role="alert">
                    <XCircle size={16} />
                    <span>{loadError}</span>
                    <button type="button" onClick={() => void loadProfile()}>
                        Retry
                    </button>
                </div>
            )}

            {/* ── User details card ──────────────────────────────────── */}
            <section className={styles.profileCard}>
                <div className={styles.cardHeader}>
                    <div className={styles.sectionIcon}>
                        <UserRound size={22} />
                    </div>
                    <div>
                        <h2>User Details</h2>
                        <p>Your personal account information</p>
                    </div>
                </div>

                <form onSubmit={saveUser} className={styles.form}>
                    <div className={styles.avatarRow}>
                        <div className={styles.avatar}>
                            <UserRound size={30} />
                        </div>
                        <div>
                            <strong>{user.name || "Your name"}</strong>
                            <p>{user.email || "No email set"}</p>
                        </div>
                    </div>

                    <div className={styles.formGrid}>
                        <div className={`${styles.field} ${styles.fullWidth}`}>
                            <label htmlFor="userName">Full name *</label>
                            <input
                                id="userName"
                                value={user.name}
                                onChange={(e) => patchUser("name", e.target.value)}
                                autoComplete="name"
                                maxLength={200}
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="userEmail">Email address *</label>
                            <div className={styles.inputWithIcon}>
                                <Mail size={17} />
                                <input
                                    id="userEmail"
                                    type="email"
                                    value={user.email}
                                    onChange={(e) => patchUser("email", e.target.value)}
                                    autoComplete="email"
                                    maxLength={254}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="userMobile">Mobile number *</label>
                            <div className={styles.inputWithIcon}>
                                <Phone size={17} />
                                <input
                                    id="userMobile"
                                    type="tel"
                                    value={user.mobile}
                                    onChange={(e) => patchUser("mobile", e.target.value)}
                                    autoComplete="tel"
                                    maxLength={20}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {userMessage && (
                        <div
                            className={
                                userMessage.type === "success"
                                    ? styles.successMessage
                                    : styles.errorMessage
                            }
                            role="status"
                        >
                            {userMessage.type === "success" ? (
                                <CheckCircle2 size={16} />
                            ) : (
                                <XCircle size={16} />
                            )}
                            {userMessage.text}
                        </div>
                    )}

                    <div className={styles.formFooter}>
                        <button
                            className={styles.primaryButton}
                            type="submit"
                            disabled={savingUser}
                        >
                            {savingUser ? (
                                <LoaderCircle className={styles.spinner} size={16} />
                            ) : (
                                <Save size={16} />
                            )}
                            {savingUser ? "Saving…" : "Save User Details"}
                        </button>
                    </div>
                </form>
            </section>

            {/* ── Restaurant details card ────────────────────────────── */}
            <section className={styles.profileCard}>
                <div className={styles.cardHeader}>
                    <div className={styles.sectionIcon}>
                        <Building2 size={22} />
                    </div>
                    <div>
                        <h2>Restaurant Details</h2>
                        <p>Business information shown on your DigiCoupon profile</p>
                    </div>
                </div>

                <form onSubmit={saveRestaurant} className={styles.form}>

                    <div className={styles.formGrid}>
                        <div className={`${styles.field}`}>
                            <label htmlFor="restaurantName">Restaurant name *</label>
                            <input
                                id="restaurantName"
                                value={restaurant.name}
                                onChange={(e) => patchRestaurant("name", e.target.value)}
                                autoComplete="organization"
                                maxLength={200}
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="restaurantEmail">Restaurant email</label>
                            <div className={styles.inputWithIcon}>
                                <Mail size={17} />
                                <input
                                    id="restaurantEmail"
                                    type="email"
                                    value={restaurant.email ?? ""}
                                    onChange={(e) => patchRestaurant("email", e.target.value)}
                                    maxLength={254}
                                    placeholder="restaurant@example.com"
                                />
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="restaurantMobile">Mobile number</label>
                            <div className={styles.inputWithIcon}>
                                <Phone size={17} />
                                <input
                                    id="restaurantMobile"
                                    type="tel"
                                    value={restaurant.mobile ?? ""}
                                    onChange={(e) => patchRestaurant("mobile", e.target.value)}
                                    maxLength={20}
                                    placeholder="+91 00000 00000"
                                />
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="fssai">FSSAI / Food license no.</label>
                            <div className={styles.inputWithIcon}>
                                <Key size={17} />
                                <input
                                    id="fssai"
                                    value={restaurant.fssaiLicenseNo ?? ""}
                                    onChange={(e) =>
                                        patchRestaurant("fssaiLicenseNo", e.target.value)
                                    }
                                    maxLength={100}
                                    placeholder="Enter license number"
                                />
                            </div>
                        </div>

                        <div className={`${styles.field} ${styles.fullWidth}`}>
                            <label htmlFor="address">Street address</label>
                            <textarea
                                id="address"
                                value={restaurant.address ?? ""}
                                onChange={(e) => patchRestaurant("address", e.target.value)}
                                rows={2}
                                maxLength={500}
                                placeholder="Street, building, floor…"
                            />
                        </div>
                    </div>

                    {restaurantMessage && (
                        <div
                            className={
                                restaurantMessage.type === "success"
                                    ? styles.successMessage
                                    : styles.errorMessage
                            }
                            role="status"
                        >
                            {restaurantMessage.type === "success" ? (
                                <CheckCircle2 size={16} />
                            ) : (
                                <XCircle size={16} />
                            )}
                            {restaurantMessage.text}
                        </div>
                    )}

                    <div className={styles.formFooter}>
                        <button
                            className={styles.primaryButton}
                            type="submit"
                            disabled={savingRestaurant}
                        >
                            {savingRestaurant ? (
                                <LoaderCircle className={styles.spinner} size={16} />
                            ) : (
                                <Save size={16} />
                            )}
                            {savingRestaurant ? "Saving…" : "Save Restaurant Details"}
                        </button>
                    </div>
                </form>
            </section>

            {/* ── Security note ──────────────────────────────────────── */}
            <div className={styles.securityNote}>
                <Lock size={16} />
                <span>
                    To change your password go to{" "}
                    <strong>Account Settings → Security</strong>. Keep your contact and
                    restaurant information up to date so your DigiCoupon records stay
                    accurate.
                </span>
            </div>

            {/* ── Change password card ───────────────────────────────── */}
            <section className={styles.profileCard}>
                <div className={styles.cardHeader}>
                    <div className={styles.sectionIcon}>
                        <Key size={22} />
                    </div>
                    <div>
                        <h2>Security</h2>
                        <p>Change your account password</p>
                    </div>
                </div>
                <div className={styles.form}>
                    <ChangePasswordForm />
                </div>
            </section>
        </main>
    );
}

// ── Change Password sub-component ─────────────────────────────────────────────

function ChangePasswordForm() {
    const [current, setCurrent] = useState("");
    const [next, setNext] = useState("");
    const [confirm, setConfirm] = useState("");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<ApiMessage | null>(null);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (next !== confirm) {
            setMessage({ type: "error", text: "New passwords do not match." });
            return;
        }
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch("/api/proxy/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "same-origin",
                body: JSON.stringify({ currentPassword: current, newPassword: next }),
            });
            const json = await res.json();
            if (json.status) {
                setMessage({ type: "success", text: "Password changed successfully." });
                setCurrent("");
                setNext("");
                setConfirm("");
            } else {
                setMessage({ type: "error", text: json.message || "Failed to change password." });
            }
        } catch {
            setMessage({ type: "error", text: "Unable to change password. Please try again." });
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
                <div className={`${styles.field} ${styles.fullWidth}`}>
                    <label htmlFor="currentPwd">Current password *</label>
                    <div className={styles.inputWithIcon}>
                        <Lock size={17} />
                        <input
                            id="currentPwd"
                            type="password"
                            value={current}
                            onChange={(e) => { setCurrent(e.target.value); setMessage(null); }}
                            autoComplete="current-password"
                            required
                        />
                    </div>
                </div>
                <div className={styles.field}>
                    <label htmlFor="newPwd">New password *</label>
                    <div className={styles.inputWithIcon}>
                        <Lock size={17} />
                        <input
                            id="newPwd"
                            type="password"
                            value={next}
                            onChange={(e) => { setNext(e.target.value); setMessage(null); }}
                            autoComplete="new-password"
                            minLength={6}
                            required
                        />
                    </div>
                </div>
                <div className={styles.field}>
                    <label htmlFor="confirmPwd">Confirm new password *</label>
                    <div className={styles.inputWithIcon}>
                        <Lock size={17} />
                        <input
                            id="confirmPwd"
                            type="password"
                            value={confirm}
                            onChange={(e) => { setConfirm(e.target.value); setMessage(null); }}
                            autoComplete="new-password"
                            required
                        />
                    </div>
                </div>
            </div>

            {message && (
                <div
                    className={
                        message.type === "success" ? styles.successMessage : styles.errorMessage
                    }
                    role="status"
                >
                    {message.type === "success" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    {message.text}
                </div>
            )}

            <div className={styles.formFooter}>
                <button
                    className={styles.primaryButton}
                    type="submit"
                    disabled={saving}
                >
                    {saving ? <LoaderCircle className={styles.spinner} size={16} /> : <Key size={16} />}
                    {saving ? "Updating…" : "Change Password"}
                </button>
            </div>
        </form>
    );
}