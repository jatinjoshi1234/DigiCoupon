"use client";
import { useState } from "react";
import { CalendarDays, Minus, Plus, X } from "lucide-react";
import styles from "./RedeemPassModal.module.css";
import {
  createRedemption,
  RedemptionRequest,
} from "@/app/services/redemption.service";
import { ApiResponse } from "@/app/type/api-response";

interface RedeemPassModalProps {
  customerName: string;
  mobile: string;
  customerCouponId: number;
  redemptionDate?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function RedeemPassModal({
  customerName,
  mobile,
  customerCouponId,
  redemptionDate: initialRedemptionDate,
  onClose,
  onSuccess,
}: RedeemPassModalProps) {
  const getTodayISO = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [redemptionDate, setRedemptionDate] = useState(
    initialRedemptionDate || getTodayISO(),
  );

  const [quantity, setQuantity] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleRedeem = async () => {
    if (customerCouponId <= 0) {
      setError("Invalid coupon. Please select a valid coupon.");
      return;
    }
    if (!redemptionDate) {
      setError("Please select redemption date.");
      return;
    }

    if (quantity < 1) {
      setError("Quantity must be at least 1.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload: RedemptionRequest = {
        id: 0,
        customerCouponId: customerCouponId,
        redemptionDate: redemptionDate,
        quantity: quantity,
      };

      console.log("REDEEM PASS", payload);
      const result: ApiResponse = await createRedemption(payload);
      console.log("Redemption page => ", result);
      if (!result.status) {
        setError(result.message || "Failed to redeem pass. Please try again.");
        return;
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to redeem pass. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2>Redeem Pass</h2>
            <p>Record today's pass usage</p>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Customer */}
          <div className={styles.customerBox}>
            <div className={styles.customerInfo}>
              <span className={styles.label}>Customer</span>

              <strong>{customerName}</strong>

              <span className={styles.mobile}>{mobile}</span>
            </div>
          </div>

          {/* Date */}
          <div className={styles.field}>
            <label htmlFor="redemptionDate">Redemption Date</label>

            <div className={styles.inputWrapper}>
              <input
                id="redemptionDate"
                type="date"
                value={redemptionDate}
                onChange={(e) => setRedemptionDate(e.target.value)}
              />

              <CalendarDays size={18} />
            </div>
          </div>

          {/* Quantity */}
          <div className={styles.field}>
            <label>Quantity</label>

            <div className={styles.quantityBox}>
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus size={18} />
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                onClick={increaseQuantity}
                aria-label="Increase quantity"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="button"
            className={styles.redeemButton}
            onClick={handleRedeem}
            disabled={saving}
          >
            {saving ? "Redeeming..." : "Redeem Pass"}
          </button>
        </div>
      </div>
    </div>
  );
}
