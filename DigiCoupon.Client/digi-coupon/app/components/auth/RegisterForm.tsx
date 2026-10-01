"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    mobileNo: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (
      !formData.name.trim() ||
      !formData.mobileNo.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password and confirm password do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: formData.name.trim(),
          Mobile: formData.mobileNo.trim(),
          Email: formData.email.trim(),
          Password: formData.password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.status) {
        throw new Error(result.message || "Registration failed.");
      }

      router.push("/auth/login");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create your account.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="register-card">
        {/* Brand */}
        <div className="register-brand">
          <div className="brand-icon">
            <span>🍽️</span>
          </div>

          <h1>DigiCoupon</h1>

          <p>Restaurant Pass Management</p>
        </div>

        {/* Heading */}
        <div className="register-heading">
          <h2>Create your account</h2>

          <p>
            Register your account and start managing your restaurant passes.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="login-error">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* Mobile + Email */}
          <div className="register-row">
            <div className="form-group">
              <label htmlFor="mobileNo">Mobile Number</label>

              <input
                id="mobileNo"
                name="mobileNo"
                type="tel"
                placeholder="Enter mobile number"
                value={formData.mobileNo}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>

            <div className="register-password-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />

              <button
                type="button"
                className="register-password-toggle"
                onClick={() => setShowPassword((previous) => !previous)}
                tabIndex={-1}
              >
                {showPassword ? "◉" : "○"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>

            <div className="register-password-wrapper">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
              />

              <button
                type="button"
                className="register-password-toggle"
                onClick={() => setShowConfirmPassword((previous) => !previous)}
                tabIndex={-1}
              >
                {showConfirmPassword ? "◉" : "○"}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="register-terms">
            <input id="terms" type="checkbox" required />

            <label htmlFor="terms">
              I agree to the <a href="/terms">Terms of Service</a> and{" "}
              <a href="/privacy">Privacy Policy</a>.
            </label>
          </div>

          {/* Register Button */}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <>
                <span className="login-spinner"></span>
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <span>→</span>
              </>
            )}
          </button>
        </form>

        {/* Login */}
        <div className="register-login-section">
          <span>Already have an account?</span>

          <a href="/auth/login">Sign in</a>
        </div>
      </div>
    </div>
  );
}
