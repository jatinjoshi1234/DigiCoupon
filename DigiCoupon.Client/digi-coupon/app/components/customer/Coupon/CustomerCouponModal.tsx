"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Search,
  Ticket,
  Users,
  UserStar,
  X,
} from "lucide-react";

import styles from "./CustomerCouponModal.module.css";
import {
  CouponRequest,
  createCoupon,
  getCouponById,
  updateCoupon,
} from "@/app/services/coupon.service";
import { Customer, getCustomers } from "@/app/services/customer.service";
import { useAuth } from "@/app/context/AuthContext";
import { SelectList } from "@/app/type/select-list";

// Default pass validity period in days (easily configurable)
export const DEFAULT_PASS_VALIDITY_DAYS = 30;

export function calculateEndDate(
  startDateStr: string,
  days: number = DEFAULT_PASS_VALIDITY_DAYS,
): string {
  if (!startDateStr) return "";
  const [year, month, day] = startDateStr.split("-").map(Number);
  if (!year || !month || !day) return "";

  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const getTodayISO = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

interface CustomerCouponModalProps {
  id: number;
  customerId?: number;
  customerName?: string;
  customers?: Customer[];
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CustomerCouponModal({
  id,
  customerId = 0,
  customerName,
  customers,
  onClose,
  onSuccess,
}: CustomerCouponModalProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState<number>(
    customerId || 0,
  );
  const [customerList, setCustomerList] = useState<Customer[]>(customers ?? []);
  const [customerSelectList, setCustomerSelectList] = useState<SelectList[]>([]);
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerSelectSearch, setCustomerSelectSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [fromDate, setFromDate] = useState(getTodayISO());
  const [toDate, setToDate] = useState(
    calculateEndDate(getTodayISO(), DEFAULT_PASS_VALIDITY_DAYS),
  );
  const [type, setType] = useState<number>(1);
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (customerId && customerId > 0) {
      setSelectedCustomerId(customerId);
    }
  }, [customerId]);

  const { restaurant, restaurantId } = useAuth();
  const currentRestaurantId = restaurant?.id || restaurantId;

  useEffect(() => {
    if (customers && customers.length > 0) {
      setCustomerList(customers);
    } else if (currentRestaurantId && (!customerId || customerId <= 0)) {
      getCustomers(currentRestaurantId)
        .then((data) => setCustomerSelectList(data))
        .catch((err) => console.error("Error loading customer list", err));
    }
  }, [customers, customerId, currentRestaurantId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsCustomerDropdownOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isCustomerDropdownOpen) {
        setIsCustomerDropdownOpen(false);
      }
    }

    if (isCustomerDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCustomerDropdownOpen]);

  const selectedCustomer = useMemo(
    () => customerList.find((c) => c.customerId === selectedCustomerId),
    [customerList, selectedCustomerId],
  );

  const selectedListCustomer = useMemo(
    () => customerSelectList.find((c) => c.id === selectedCustomerId),
    [customerSelectList, selectedCustomerId],
  );


  const filteredCustomerList = useMemo(() => {
    if (!customerSearch.trim()) return customerList;
    const query = customerSearch.toLowerCase().trim();
    return customerList.filter(
      (c) =>
        c.name?.toLowerCase().includes(query) ||
        c.mobile?.toLowerCase().includes(query),
    );
  }, [customerList, customerSearch]);

  const filteredSeletCustomerList = useMemo(() => {
    if (!customerSelectSearch.trim()) return customerSelectList;
    const query = customerSelectSearch.toLowerCase().trim();
    return customerSelectList.filter(
      (c) =>
        c.text.toLowerCase().includes(query)
    );
  }, [customerSelectList, customerSelectSearch]);

  const handleFromDateChange = (newFromDate: string) => {
    setFromDate(newFromDate);
    if (newFromDate) {
      setToDate(calculateEndDate(newFromDate, DEFAULT_PASS_VALIDITY_DAYS));
    } else {
      setToDate("");
    }
    setError("");
  };

  useEffect(() => {
    console.log("coupon id => ", id);
    if (id && id > 0) {
      loadCoupon(id);
    } else {
      const today = getTodayISO();
      setFromDate(today);
      setToDate(calculateEndDate(today, DEFAULT_PASS_VALIDITY_DAYS));
      setType(1);
      setPrice("");
    }
  }, [id]);

  async function loadCoupon(id: number) {
    try {
      setLoading(true);
      setError("");

      const result: CouponRequest = await getCouponById(id);
      console.log("Modal => res => ", result);
      setFromDate(result.startDate?.split("T")[0] ?? "");
      setToDate(result.endDate?.split("T")[0] ?? "");
      setType(result.couponType ?? 1);
      setPrice(`${result.price ?? ""}`);
      if (result.customerId) {
        setSelectedCustomerId(result.customerId);
      }
    } catch (error) {
      console.error("Load coupon error:", error);

      setError(
        error instanceof Error ? error.message : "Unable to load coupon.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const effectiveCustomerId =
      customerId && customerId > 0 ? customerId : selectedCustomerId;

    if (!effectiveCustomerId || effectiveCustomerId <= 0) {
      setError("Please select a customer.");
      return;
    }

    if (!fromDate) {
      setError("Please select from date.");
      return;
    }

    if (!toDate) {
      setError("Please select to date.");
      return;
    }

    if (new Date(toDate) < new Date(fromDate)) {
      setError("To date cannot be earlier than from date.");
      return;
    }

    if (!price.trim()) {
      setError("Please enter pass price.");
      return;
    }

    const numericPrice = Number(price);

    if (numericPrice <= 0) {
      setError("Please enter a valid price.");
      return;
    }

    const payload: CouponRequest = {
      id: id,
      customerId: effectiveCustomerId,
      startDate: fromDate,
      endDate: toDate,
      couponType: type,
      price: parseFloat(price),
    };

    try {
      setSaving(true);
      console.log(id > 0 ? "UPDATE CUSTOMER PASS" : "CREATE CUSTOMER PASS", payload);

      const res =
        id > 0 ? await updateCoupon(id, payload) : await createCoupon(payload);
      console.log("customer coupon modal res => ", res);
      if (!res.status) {
        setError(res.message);
      } else {
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error("Save customer pass error:", error);

      setError(
        error instanceof Error ? error.message : "Unable to save pass.",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    if (saving) return;

    onClose();
  }

  return (
    <div className={styles.backdrop} onMouseDown={handleClose}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        {/* Header */}

        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.icon}>
              <Ticket size={20} />
            </div>

            <div>
              <h3>{id > 0 ? "Update Pass" : "Add Pass"}</h3>

              <p>
                {id > 0
                  ? customerName
                    ? `Update pass for ${customerName}.`
                    : "Update customer pass."
                  : customerName
                    ? `Create a new pass for ${customerName}.`
                    : "Create a new customer pass."}
              </p>
            </div>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={handleClose}
            disabled={saving}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}

        <form onSubmit={handleSubmit}>
          <div className={styles.formBody}>
            {/* Customer selector when not editing or when customerId is not fixed */}
            {(!customerId || customerId <= 0) && (
              <div className={styles.formGroup}>
                <label>
                  Customer <span>*</span>
                </label>

                <div className={styles.dropdownContainer} ref={dropdownRef}>
                  <button
                    type="button"
                    className={`${styles.dropdownTrigger} ${isCustomerDropdownOpen ? styles.dropdownTriggerActive : ""
                      }`}
                    onClick={() => {
                      if (!saving) {
                        setIsCustomerDropdownOpen((prev) => !prev);
                      }
                    }}
                    disabled={saving}
                    aria-haspopup="listbox"
                    aria-expanded={isCustomerDropdownOpen}
                  >
                    <div className={styles.dropdownLeft}>
                      <Users size={17} className={styles.dropdownIcon} />
                      <div className={styles.dropdownValueWrapper}>
                        {selectedListCustomer ? (
                          <span className={styles.dropdownValue}>
                            <span className={styles.customerNameText}>
                              {selectedListCustomer.text}
                            </span>
                            {/* {selectedListCustomer.mobile && (
                              <span className={styles.customerMobileText}>
                                ({selectedCustomer.mobile})
                              </span>
                            )} */}
                          </span>
                        ) : selectedCustomerId > 0 && customerName ? (
                          <span className={styles.dropdownValue}>
                            <span className={styles.customerNameText}>
                              {customerName}
                            </span>
                          </span>
                        ) : (
                          <span className={styles.dropdownPlaceholder}>
                            Select a customer...
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={styles.dropdownEndIconWrapper}>
                      <ChevronDown
                        size={16}
                        className={`${styles.dropdownChevron} ${isCustomerDropdownOpen ? styles.dropdownChevronOpen : ""
                          }`}
                      />
                    </div>
                  </button>

                  {isCustomerDropdownOpen && (
                    <div
                      className={styles.dropdownExpandArea}
                      role="listbox"
                      aria-label="Select customer"
                    >
                      <div className={styles.dropdownSearchWrapper}>
                        <Search size={14} className={styles.searchIcon} />
                        <input
                          type="text"
                          className={styles.dropdownSearchInput}
                          placeholder="Search customer by name or mobile..."
                          value={customerSelectSearch}
                          onChange={(e) => setCustomerSelectSearch(e.target.value)}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                        {customerSelectSearch && (
                          <button
                            type="button"
                            className={styles.searchClearBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCustomerSearch("");
                            }}
                            aria-label="Clear search"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>

                      <div className={styles.dropdownOptionsList}>
                        {filteredSeletCustomerList.length === 0 ? (
                          <div className={styles.noCustomersFound}>
                            No customers found
                          </div>
                        ) : (
                          filteredSeletCustomerList.map((c) => {
                            const isSelected =
                              selectedCustomerId === c.id;
                            return (
                              <div
                                key={c.id}
                                role="option"
                                aria-selected={isSelected}
                                className={`${styles.dropdownOption} ${isSelected ? styles.dropdownOptionSelected : ""
                                  }`}
                                onClick={() => {
                                  setSelectedCustomerId(c.id);
                                  setIsCustomerDropdownOpen(false);
                                  setCustomerSelectSearch(c.text);
                                  setError("");
                                }}
                              >
                                <div className={styles.optionCustomerDetails}>
                                  <span className={styles.optionCustomerName}>
                                    {c.text}
                                  </span>
                                  {/* {c.mobile && (
                                    <span className={styles.optionCustomerMobile}>
                                      {c.mobile}
                                    </span>
                                  )} */}
                                </div>
                                {isSelected && (
                                  <Check
                                    size={16}
                                    className={styles.optionCheckIcon}
                                  />
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Date */}

            <div className={styles.dateRow}>
              <div className={styles.formGroup}>
                <label>
                  From Date <span>*</span>
                </label>

                <div className={styles.inputWrapper}>
                  <CalendarDays size={17} />

                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => handleFromDateChange(e.target.value)}
                    disabled={saving}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>
                  To Date <span>*</span>
                </label>

                <div className={styles.inputWrapper}>
                  <CalendarDays size={17} />

                  <input
                    type="date"
                    value={toDate}
                    min={fromDate || undefined}
                    onChange={(e) => setToDate(e.target.value)}
                    disabled={saving}
                  />
                </div>
              </div>
            </div>

            {/* Pass Type */}

            <div className={styles.formGroup}>
              <label>
                Pass Type <span>*</span>
              </label>

              <div className={styles.typeOptions}>
                <button
                  type="button"
                  className={`${styles.typeOption} ${type === 2 ? styles.typeOptionActive : ""
                    }`}
                  onClick={() => setType(2)}
                  disabled={saving}
                >
                  <div className={styles.typeIcon}>
                    <Ticket size={18} />
                  </div>

                  <div>
                    <strong>Unlimited</strong>
                    <span>Full meal / unlimited type pass</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`${styles.typeOption} ${type === 1 ? styles.typeOptionActive : ""
                    }`}
                  onClick={() => setType(1)}
                  disabled={saving}
                >
                  <div className={styles.typeIcon}>
                    <Ticket size={18} />
                  </div>

                  <div>
                    <strong>Fixed</strong>
                    <span>Fixed meal / limited type pass</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Price */}

            <div className={styles.formGroup}>
              <label>
                Price <span>*</span>
              </label>

              <div className={styles.priceWrapper}>
                <span>₹</span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter pass price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={saving}
                />
              </div>
            </div>

            {/* Error */}

            {error && <div className={styles.error}>{error}</div>}
          </div>

          {/* Footer */}

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.saveButton}
              disabled={saving}
            >
              {saving
                ? id > 0
                  ? "Updating..."
                  : "Adding..."
                : id > 0
                  ? "Update Pass"
                  : "Add Pass"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
