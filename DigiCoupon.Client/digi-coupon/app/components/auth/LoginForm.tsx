"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "../../services/auth.service";
import { setAuth, setToken } from "@/lib/auth";

export default function LoginForm() {
  const router = useRouter();

  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    // Basic validation
    if (!mobileNo.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const data = {
        UserName: mobileNo.trim(),
        Password: password,
      };
      console.log("data => ", data);
      const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserName: mobileNo.trim(),
          Password: password,
        }),
      });

      const result = await response.json();
      console.log("login component response => ", result);
      if (!response.ok || !result.status) {
        throw new Error(result.message || "Unable to login.");
      }
      if (!result.data.isRestuarantCreated) {
        router.push("/restuarant/create");
        return;
      }
      router.push("/");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to login. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo / Brand */}
        <div className="login-brand">
          <div className="brand-icon">🍽</div>

          <h1>DigiCoupon</h1>

          <p>Restaurant Pass Management</p>
        </div>

        {/* Heading */}
        <div className="login-heading">
          <h2>Welcome back 👋</h2>

          <p>Sign in to manage your restaurant passes</p>
        </div>

        {/* Error */}
        {error && (
          <div className="login-error" role="alert">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email address</label>

            <input
              id="email"
              type="text"
              placeholder="Enter your mobile no"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <div className="password-label">
              <label htmlFor="password">Password</label>

              <a href="/forgot-password">Forgot password?</a>
            </div>

            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={loading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <>
                <span className="login-spinner" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <span>→</span>
              </>
            )}
          </button>
        </form>

        {/* Register */}
        <div className="register-section">
          <span>Don't have an account?</span>

          <a href="/auth/register">Create your restaurant account</a>
        </div>
      </div>
    </div>
  );
}
