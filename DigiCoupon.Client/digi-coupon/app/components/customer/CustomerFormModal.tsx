"use client";

import { useEffect, useState } from "react";
import { UserPlus, X } from "lucide-react";

import styles from "./AddCustomerModal.module.css";
import {
  createCustomer,
  CustomerRequest,
  getCustomerById,
  updateCustomer,
} from "@/app/services/customer.service";
import { ApiResponse } from "@/app/type/api-response";
import { useAuth } from "@/app/context/AuthContext";

interface CustomerModalProps {
  customerId?: number | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CustomerModal({
  customerId = null,
  onClose,
  onSuccess,
}: CustomerModalProps) {
  /*
   * ----------------------------------------------------
   * Mode
   * ----------------------------------------------------
   */

  const isEditMode = customerId !== null;

  /*
   * ----------------------------------------------------
   * Form State
   * ----------------------------------------------------
   */
  const { user, restaurant, restaurantId, userName, restaurantName, logout } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [nickname, setNickname] = useState("");

  /*
   * ----------------------------------------------------
   * UI State
   * ----------------------------------------------------
   */

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  /*
   * ----------------------------------------------------
   * Load Customer For Edit
   * ----------------------------------------------------
   */

  useEffect(() => {
    if (customerId) {
      loadCustomer(customerId);
    } else {
      resetForm();
    }
  }, [customerId]);

  /*
   * ----------------------------------------------------
   * Get Customer
   * ----------------------------------------------------
   */

  async function loadCustomer(id: number) {
    try {
      setLoading(true);
      setError("");

      /*
       * Replace this with your actual service:
       *
       * const customer = await getCustomerById(id);
       */

      const result: CustomerRequest = await getCustomerById(id);
      console.log("Modal => res => ", result);
      const customer = result;
      setFirstName(customer?.firstName ?? "");
      setLastName(customer?.lastName ?? "");
      setMobile(customer?.mobile ?? "");
      setNickname(customer?.nickName ?? "");
    } catch (error) {
      console.error("Load customer error:", error);

      setError(
        error instanceof Error ? error.message : "Unable to load customer.",
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * ----------------------------------------------------
   * Reset Form
   * ----------------------------------------------------
   */

  function resetForm() {
    setFirstName("");
    setLastName("");
    setMobile("");
    setNickname("");
    setError("");
  }

  /*
   * ----------------------------------------------------
   * Submit
   * ----------------------------------------------------
   */

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    /*
     * Client-side validation
     */

    if (!firstName.trim()) {
      setError("Please enter first name.");
      return;
    }

    if (!lastName.trim()) {
      setError("Please enter last name.");
      return;
    }

    if (!mobile.trim()) {
      setError("Please enter mobile number.");
      return;
    }

    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    const targetRestaurantId = restaurant?.id || restaurantId || 0;

    if (!targetRestaurantId) {
      setError("Restaurant not identified. Please try logging in again.");
      return;
    }

    const payload: CustomerRequest = {
      id: customerId ?? 0,
      restaurantId: targetRestaurantId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      mobile: mobile.trim(),
      nickName: nickname.trim(),
    };

    try {
      setSaving(true);

      if (isEditMode) {
        /*
         * Update
         */
        const res = await updateCustomer(customerId, payload);
        console.log("modal update res => ", res);
      } else {
        /*
         * Create
         */
        const res = await create(payload);
        console.log("modal create res => ", res);
      }

      /*
       * Refresh customer list
       */
      onSuccess?.();

      /*
       * Close modal
       */
      onClose();
    } catch (error) {
      console.error(
        isEditMode ? "Update customer error:" : "Create customer error:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : isEditMode
            ? "Unable to update customer."
            : "Unable to create customer.",
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * ----------------------------------------------------
   * Close
   * ----------------------------------------------------
   */

  function handleClose() {
    if (saving) {
      return;
    }

    onClose();
  }

  /*
   * ----------------------------------------------------
   * UI
   * ----------------------------------------------------
   */

  return (
    <div className={styles.backdrop} onMouseDown={handleClose}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        {/* =================================================
            Header
        ================================================= */}

        <div className={styles.header}>
          <div className={styles.title}>
            <div className={styles.icon}>
              <UserPlus size={20} />
            </div>

            <div>
              <h3>{isEditMode ? "Edit Customer" : "Add Customer"}</h3>

              <p>
                {isEditMode
                  ? "Update customer information."
                  : "Create a new restaurant customer."}
              </p>
            </div>
          </div>

          <button
            type="button"
            className={styles.close}
            onClick={handleClose}
            disabled={saving}
          >
            <X size={20} />
          </button>
        </div>

        {/* =================================================
            Form
        ================================================= */}

        <form onSubmit={handleSubmit}>
          <div className={styles.formBody}>
            {/* Loading */}

            {loading ? (
              <div className={styles.loading}>Loading customer...</div>
            ) : (
              <>
                {/* First Name */}

                <div className={styles.formGroup}>
                  <label>
                    First Name
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Enter customer first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={saving}
                  />
                </div>

                {/* Last Name */}

                <div className={styles.formGroup}>
                  <label>
                    Last Name
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Enter customer last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={saving}
                  />
                </div>

                {/* Mobile */}

                <div className={styles.formGroup}>
                  <label>
                    Mobile Number
                    <span>*</span>
                  </label>

                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="Enter mobile number"
                    value={mobile}
                    onChange={(e) =>
                      setMobile(e.target.value.replace(/\D/g, ""))
                    }
                    disabled={saving}
                  />
                </div>

                {/* Nickname */}

                <div className={styles.formGroup}>
                  <label>Nickname</label>

                  <input
                    type="text"
                    placeholder="Optional"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    disabled={saving}
                  />
                </div>

                {/* Error */}

                {error && <div className={styles.error}>{error}</div>}
              </>
            )}
          </div>

          {/* =================================================
              Footer
          ================================================= */}

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.primaryButton}
              disabled={loading || saving}
            >
              {saving
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Customer"
                  : "Create Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/*
 * ========================================================
 * API FUNCTIONS
 *
 * Replace these with imports from:
 *
 * services/customer.service.ts
 * ========================================================
 */

async function getCustomer(id: number): Promise<CustomerRequest> {
  return await getCustomerById(id);
}

async function create(data: CustomerRequest & { id: number }) {
  /*
   * Example:
   *
   */
  return await createCustomer(data);

  console.log("CREATE CUSTOMER", data);

  return true;
}

async function update(data: CustomerRequest & { id: number }) {
  /*
   * Example:
   *
   */
  return await updateCustomer(data.id, data);

  console.log("UPDATE CUSTOMER", data);

  return true;
}
