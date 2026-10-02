"use client";

import { FormEvent, useState } from "react";
import { X, UserPlus } from "lucide-react";
import styles from "./AddCustomerModal.module.css";
import { Customer, CustomerRequest } from "../../services/customer.service";

interface CustomerFormModalProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerRequest) => Promise<void>;
}

export default function CustomerFormModal({
  open,
  loading,
  onClose,
  onSubmit,
}: CustomerFormModalProps) {
  const [firstName, setfirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [nickname, setNickname] = useState("");

  if (!open) {
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !mobile.trim()) {
      return;
    }

    await onSubmit({
      id: 0,
      firstName: firstName,
      lastName: lastName,
      nickName: nickname.trim(),
      mobile: mobile.trim(),
      restaurantId: 9,
    });

    setfirstName("");
    setLastName("");
    setMobile("");
    setNickname("");
  }

  return (
    <div className={styles.backdrop} onMouseDown={onClose}>
      {" "}
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        {" "}
        {/* Header */}{" "}
        <div className={styles.header}>
          {" "}
          <div className={styles.title}>
            {" "}
            <div className={styles.icon}>
              {" "}
              <UserPlus size={20} />{" "}
            </div>{" "}
            <div>
              {" "}
              <h3>Add Customer</h3>{" "}
              <p>Create a new restaurant customer.</p>{" "}
            </div>{" "}
          </div>{" "}
          <button type="button" className={styles.close} onClick={onClose}>
            {" "}
            <X size={20} />{" "}
          </button>{" "}
        </div>{" "}
        {/* Form */}{" "}
        <form onSubmit={handleSubmit}>
          {" "}
          <div className={styles.formBody}>
            {" "}
            <div className={styles.formGroup}>
              {" "}
              <label>
                {" "}
                First Name <span>*</span>{" "}
              </label>{" "}
              <input
                type="text"
                placeholder="Enter customer first name"
                value={firstName}
                onChange={(e) => setfirstName(e.target.value)}
                required
              />{" "}
            </div>{" "}
            <div className={styles.formGroup}>
              {" "}
              <label>
                {" "}
                Last Name <span>*</span>{" "}
              </label>{" "}
              <input
                type="text"
                placeholder="Enter customer last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />{" "}
            </div>{" "}
            <div className={styles.formGroup}>
              {" "}
              <label>
                {" "}
                Mobile Number <span>*</span>{" "}
              </label>{" "}
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="Enter mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                required
              />{" "}
            </div>{" "}
            <div className={styles.formGroup}>
              {" "}
              <label>Nickname</label>{" "}
              <input
                type="text"
                placeholder="Optional"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />{" "}
            </div>{" "}
          </div>{" "}
          {/* Footer */}{" "}
          <div className={styles.footer}>
            {" "}
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={onClose}
              disabled={loading}
            >
              {" "}
              Cancel{" "}
            </button>{" "}
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={loading}
            >
              {" "}
              {loading ? "Creating..." : "Create Customer"}{" "}
            </button>{" "}
          </div>{" "}
        </form>{" "}
      </div>{" "}
    </div>
  );
}
