"use client";

import { FormEvent, useState } from "react";
import { X, UserPlus } from "lucide-react";

import { Customer } from "../../services/customer.service";

interface CustomerFormModalProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (data: Customer) => Promise<void>;
}

export default function CustomerFormModal({
  open,
  loading,
  onClose,
  onSubmit,
}: CustomerFormModalProps) {
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [nickname, setNickname] = useState("");
  const [memberCode, setMemberCode] = useState("");
  const [publicToken, setPublicToken] = useState("");

  if (!open) {
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !mobile.trim()) {
      return;
    }

    // await onSubmit({
    //   id: 0,
    //   isActive: false,
    //   mobile: mobile.trim(),
    //   nickname: nickname.trim(),
    //   //memberCode: memberCode.trim(),
    //   //publicToken: publicToken,
    // });

    setfirstName("");
    setfirstName("");
    setMobile("");
    setNickname("");
    setMemberCode("");
    setPublicToken("");
  }

  return (
    <div className="customer-modal-backdrop" onMouseDown={onClose}>
      <div className="customer-modal" onMouseDown={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="customer-modal-header">
          <div className="customer-modal-title">
            <div className="customer-modal-icon">
              <UserPlus size={20} />
            </div>

            <div>
              <h3>Add Customer</h3>
              <p>Create a new restaurant customer.</p>
            </div>
          </div>

          <button
            type="button"
            className="customer-modal-close"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="customer-form-body">
            <div className="customer-form-group">
              <label>
                First Name <span>*</span>
              </label>

              <input
                type="text"
                placeholder="Enter customer first name"
                value={firstName}
                onChange={(e) => setfirstName(e.target.value)}
                required
              />
            </div>

            <div className="customer-form-group">
              <label>
                Last Name <span>*</span>
              </label>

              <input
                type="text"
                placeholder="Enter customer last name"
                value={lastName}
                onChange={(e) => setlastName(e.target.value)}
                required
              />
            </div>

            <div className="customer-form-group">
              <label>
                Mobile Number <span>*</span>
              </label>

              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="Enter mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                required
              />
            </div>

            <div className="customer-form-row">
              <div className="customer-form-group">
                <label>Nickname</label>
                <input
                  type="text"
                  placeholder="Optional"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="customer-modal-footer">
            <button
              type="button"
              className="dc-secondary-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="dc-primary-button"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
