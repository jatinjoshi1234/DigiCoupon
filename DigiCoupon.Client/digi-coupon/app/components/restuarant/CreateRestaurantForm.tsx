"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateRestaurantForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNo: "",
    fssaiLicenseNo: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
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
      !formData.address.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/restuarant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Id: 0,
          Name: formData.name.trim(),
          Email: formData.email.trim(),
          Mobile: formData.mobileNo.trim(),
          FssaiLicenseNo: formData.fssaiLicenseNo.trim(),
          Address: formData.address.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.status) {
        throw new Error(result.message || "Unable to create restaurant.");
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to create restaurant.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="restaurant-card">
        <div className="restaurant-brand">
          <div className="brand-icon">
            <span>🍽️</span>
          </div>

          <h1>DigiCoupon</h1>
          <p>Restaurant Pass Management</p>
        </div>

        <div className="restaurant-heading">
          <h2>Create your restaurant</h2>
          <p>
            Set up your restaurant to start managing customers and digital
            passes.
          </p>
        </div>

        {error && (
          <div className="login-error">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">
              Restaurant Name <span className="required">*</span>
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter restaurant name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="restaurant-row">
            <div className="form-group">
              <label htmlFor="mobileNo">
                Mobile Number <span className="required">*</span>
              </label>

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

          <div className="form-group">
            <label htmlFor="fssaiLicenseNo">FSSAI License Number</label>

            <input
              id="fssaiLicenseNo"
              name="fssaiLicenseNo"
              type="text"
              placeholder="Enter FSSAI license number"
              value={formData.fssaiLicenseNo}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">
              Restaurant Address <span className="required">*</span>
            </label>

            <textarea
              id="address"
              name="address"
              placeholder="Enter restaurant address"
              value={formData.address}
              onChange={handleChange}
              disabled={loading}
              rows={4}
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <>
                <span className="login-spinner"></span>
                Creating restaurant...
              </>
            ) : (
              <>
                Create Restaurant
                <span>→</span>
              </>
            )}
          </button>
        </form>

        <div className="restaurant-footer">
          <span>
            You can update your restaurant details later from Settings.
          </span>
        </div>
      </div>
    </div>
  );
}
