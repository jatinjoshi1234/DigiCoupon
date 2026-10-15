"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Edit3,
  IndianRupee,
  Phone,
  Plus,
  Ticket,
  TicketCheck,
  UserRound,
  Users,
  XCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import styles from "./CustomerDetailsPage.module.css";
import RedeemPassModal from "@/app/components/customer/Coupon/redemptions/RedeemPassModal";

type PassType = 1 | 2;

interface Redemption {
  id: number;
  redemptionDate: string;
  quantity: number;
  createdOn: string;
}

interface CustomerPass {
  id: number;
  couponNumber: string;
  type: PassType;
  price: number;

  startDate: string;
  endDate: string;

  isActive: boolean;

  totalUsage: number | null;
  usedUsage: number;
  remainingUsage: number | null;

  redemptionCount: number;
  redemptions: Redemption[];
}

interface CustomerDetails {
  id: number;
  firstName: string;
  lastName: string;
  nickname: string | null;
  mobile: string;

  isActive: boolean;
  createdOn: string;

  totalPasses: number;
  activePasses: number;
  totalRedemptions: number;

  passes: CustomerPass[];
}

interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T | null;
}

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const customerId = Number(params.id);

  const [customer, setCustomer] = useState<CustomerDetails | null>(null);

  const [selectedPassId, setSelectedPassId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showRedeemModal, setShowRedeemModal] = useState(false);

  /*
   * -------------------------------------------------------
   * Load customer
   * -------------------------------------------------------
   */

  const loadCustomer = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/proxy/customer/${customerId}`, {
        method: "GET",
        credentials: "include",
      });

      const result: ApiResponse<CustomerDetails> = await response.json();

      if (!result.status || !result.data) {
        setError(result.message || "Unable to load customer.");
        return;
      }

      setCustomer(result.data);

      /*
       * First priority:
       * 1. Active latest pass
       * 2. Latest pass
       */
      const activeLatestPass = [...result.data.passes]
        .filter((pass) => pass.isActive)
        .sort(
          (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
        )[0];

      const latestPass = [...result.data.passes].sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      )[0];

      setSelectedPassId(activeLatestPass?.id ?? latestPass?.id ?? null);
    } catch (err) {
      setError("Unable to load customer details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!customerId || Number.isNaN(customerId)) {
      setError("Invalid customer.");
      setLoading(false);
      return;
    }

    loadCustomer();
  }, [customerId]);

  /*
   * -------------------------------------------------------
   * Selected pass
   * -------------------------------------------------------
   */

  const selectedPass = useMemo(() => {
    if (!customer || !selectedPassId) {
      return null;
    }

    return customer.passes.find((pass) => pass.id === selectedPassId) ?? null;
  }, [customer, selectedPassId]);

  /*
   * -------------------------------------------------------
   * Helpers
   * -------------------------------------------------------
   */

  const getFullName = () => {
    if (!customer) return "";

    return `${customer.firstName} ${customer.lastName}`.trim();
  };

  const formatDate = (value: string) => {
    if (!value) return "-";

    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (value: string) => {
    if (!value) return "-";

    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPassStatus = (pass: CustomerPass) => {
    const today = new Date();
    const start = new Date(pass.startDate);
    const end = new Date(pass.endDate);

    if (!pass.isActive) {
      return {
        text: "Inactive",
        className: styles.statusInactive,
      };
    }

    if (today < start) {
      return {
        text: "Upcoming",
        className: styles.statusUpcoming,
      };
    }

    if (today > end) {
      return {
        text: "Expired",
        className: styles.statusExpired,
      };
    }

    return {
      text: "Active",
      className: styles.statusActive,
    };
  };

  const isPassExpired = (pass: CustomerPass) => {
    return new Date(pass.endDate) < new Date();
  };

  /*
   * -------------------------------------------------------
   * Loading
   * -------------------------------------------------------
   */

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <span>Loading customer...</span>
        </div>
      </div>
    );
  }

  /*
   * -------------------------------------------------------
   * Error
   * -------------------------------------------------------
   */

  if (error || !customer) {
    return (
      <div className={styles.page}>
        <div className={styles.errorState}>
          <XCircle size={42} />

          <h3>Customer not found</h3>

          <p>{error || "Unable to load customer details."}</p>

          <button type="button" onClick={() => router.back()}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const fullName = getFullName();

  return (
    <div className={styles.page}>
      {/* ==================================================
          TOP BAR
      ================================================== */}

      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => router.back()}
        >
          <ArrowLeft size={18} />
          Customers
        </button>

        <div className={styles.topActions}>
          <button type="button" className={styles.secondaryButton}>
            <Edit3 size={16} />
            Edit Customer
          </button>

          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => {
              if (selectedPass) {
                setShowRedeemModal(true);
              }
            }}
            disabled={!selectedPass}
          >
            <TicketCheck size={17} />
            Redeem Pass
          </button>
        </div>
      </div>

      {/* ==================================================
          CUSTOMER HEADER
      ================================================== */}

      <section className={styles.customerHeader}>
        <div className={styles.customerMain}>
          <div className={styles.avatar}>
            {customer.firstName?.charAt(0).toUpperCase()}
          </div>

          <div className={styles.customerIdentity}>
            <div className={styles.nameRow}>
              <h1>{fullName}</h1>

              {customer.isActive ? (
                <span className={styles.customerActive}>
                  <CheckCircle2 size={13} />
                  Active
                </span>
              ) : (
                <span className={styles.customerInactive}>Inactive</span>
              )}
            </div>

            {customer.nickname && (
              <span className={styles.nickname}>"{customer.nickname}"</span>
            )}

            <div className={styles.contactInfo}>
              <span>
                <Phone size={14} />
                {customer.mobile}
              </span>

              <span>
                <CalendarDays size={14} />
                Customer since {formatDate(customer.createdOn)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SUMMARY
      ================================================== */}

      <section className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={`${styles.summaryIcon} ${styles.orangeIcon}`}>
            <Ticket size={19} />
          </div>

          <div>
            <span>Total Passes</span>
            <strong>{customer.totalPasses}</strong>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={`${styles.summaryIcon} ${styles.greenIcon}`}>
            <TicketCheck size={19} />
          </div>

          <div>
            <span>Active Passes</span>
            <strong>{customer.activePasses}</strong>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={`${styles.summaryIcon} ${styles.blueIcon}`}>
            <Users size={19} />
          </div>

          <div>
            <span>Total Redemptions</span>
            <strong>{customer.totalRedemptions}</strong>
          </div>
        </div>
      </section>

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <div className={styles.contentGrid}>
        {/* =================================================
            ALL PASSES
        ================================================= */}

        <section className={styles.passesSection}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Customer Passes</h2>
              <p>Select a pass to view its redemption history.</p>
            </div>

            <button type="button" className={styles.addPassButton}>
              <Plus size={16} />
              Add Pass
            </button>
          </div>

          <div className={styles.passList}>
            {customer.passes.length === 0 ? (
              <div className={styles.emptyPasses}>
                <Ticket size={30} />

                <h3>No passes found</h3>

                <p>Add a pass to start using this customer account.</p>
              </div>
            ) : (
              customer.passes.map((pass, index) => {
                const status = getPassStatus(pass);
                const selected = selectedPassId === pass.id;

                const isLatest =
                  index === 0 ||
                  pass.id ===
                    [...customer.passes].sort(
                      (a, b) =>
                        new Date(b.startDate).getTime() -
                        new Date(a.startDate).getTime(),
                    )[0]?.id;

                return (
                  <button
                    key={pass.id}
                    type="button"
                    className={`${styles.passCard} ${
                      selected ? styles.selectedPassCard : ""
                    }`}
                    onClick={() => setSelectedPassId(pass.id)}
                  >
                    <div className={styles.passCardTop}>
                      <div className={styles.passNumber}>
                        <div className={styles.passTicketIcon}>
                          <Ticket size={17} />
                        </div>

                        <div>
                          <strong>{pass.couponNumber}</strong>

                          <span>
                            {pass.type === 1 ? "Unlimited Pass" : "Fixed Pass"}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`${styles.passStatus} ${status.className}`}
                      >
                        {status.text}
                      </div>
                    </div>

                    <div className={styles.passBadges}>
                      {isLatest && (
                        <span className={styles.latestBadge}>Latest</span>
                      )}

                      {pass.isActive && !isPassExpired(pass) && (
                        <span className={styles.activeBadge}>Current Pass</span>
                      )}
                    </div>

                    <div className={styles.passDetails}>
                      <div>
                        <span>Validity</span>
                        <strong>
                          {formatDate(pass.startDate)} -{" "}
                          {formatDate(pass.endDate)}
                        </strong>
                      </div>

                      <div>
                        <span>Price</span>
                        <strong>
                          <IndianRupee size={13} />
                          {pass.price.toLocaleString("en-IN")}
                        </strong>
                      </div>
                    </div>

                    <div className={styles.passUsage}>
                      <div>
                        <span>Used</span>
                        <strong>{pass.usedUsage}</strong>
                      </div>

                      <div>
                        <span>Remaining</span>

                        <strong>
                          {pass.type === 1 ? "Unlimited" : pass.remainingUsage}
                        </strong>
                      </div>

                      <div>
                        <span>Redemptions</span>
                        <strong>{pass.redemptionCount}</strong>
                      </div>
                    </div>

                    <div className={styles.passSelectFooter}>
                      <span>View redemption details</span>

                      <ChevronRight size={16} />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        {/* =================================================
            SELECTED PASS DETAILS
        ================================================= */}

        <section className={styles.detailsSection}>
          {!selectedPass ? (
            <div className={styles.selectPassEmpty}>
              <Ticket size={38} />

              <h3>Select a pass</h3>

              <p>Select any customer pass to see its redemption details.</p>
            </div>
          ) : (
            <>
              {/* Selected Pass Header */}

              <div className={styles.detailsHeader}>
                <div>
                  <span className={styles.detailsLabel}>SELECTED PASS</span>

                  <h2>{selectedPass.couponNumber}</h2>

                  <p>
                    {selectedPass.type === 1 ? "Unlimited Pass" : "Fixed Pass"}
                  </p>
                </div>

                <button
                  type="button"
                  className={styles.detailRedeemButton}
                  onClick={() => setShowRedeemModal(true)}
                >
                  <TicketCheck size={17} />
                  Redeem
                </button>
              </div>

              {/* Pass information */}

              <div className={styles.detailInfoGrid}>
                <div className={styles.infoBox}>
                  <CalendarDays size={17} />

                  <div>
                    <span>Start Date</span>
                    <strong>{formatDate(selectedPass.startDate)}</strong>
                  </div>
                </div>

                <div className={styles.infoBox}>
                  <CalendarDays size={17} />

                  <div>
                    <span>End Date</span>
                    <strong>{formatDate(selectedPass.endDate)}</strong>
                  </div>
                </div>

                <div className={styles.infoBox}>
                  <IndianRupee size={17} />

                  <div>
                    <span>Pass Price</span>
                    <strong>
                      ₹{selectedPass.price.toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>

                <div className={styles.infoBox}>
                  <TicketCheck size={17} />

                  <div>
                    <span>Pass Status</span>

                    <strong>{getPassStatus(selectedPass).text}</strong>
                  </div>
                </div>
              </div>

              {/* Usage */}

              <div className={styles.usageSection}>
                <div className={styles.usageHeader}>
                  <div>
                    <h3>Pass Usage</h3>
                    <p>Usage information for this pass.</p>
                  </div>

                  <span className={styles.usageCount}>
                    {selectedPass.type === 1
                      ? `${selectedPass.usedUsage} used`
                      : `${selectedPass.usedUsage} / ${selectedPass.totalUsage}`}
                  </span>
                </div>

                {selectedPass.type === 2 &&
                  selectedPass.totalUsage &&
                  selectedPass.totalUsage > 0 && (
                    <div className={styles.progressTrack}>
                      <div
                        className={styles.progressValue}
                        style={{
                          width: `${Math.min(
                            100,
                            (selectedPass.usedUsage / selectedPass.totalUsage) *
                              100,
                          )}%`,
                        }}
                      />
                    </div>
                  )}

                <div className={styles.usageStats}>
                  <div>
                    <span>Used</span>
                    <strong>{selectedPass.usedUsage}</strong>
                  </div>

                  <div>
                    <span>Remaining</span>
                    <strong>
                      {selectedPass.type === 1
                        ? "Unlimited"
                        : selectedPass.remainingUsage}
                    </strong>
                  </div>

                  <div>
                    <span>Total</span>
                    <strong>
                      {selectedPass.type === 1
                        ? "Unlimited"
                        : selectedPass.totalUsage}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Redemption history */}

              <div className={styles.redemptionSection}>
                <div className={styles.redemptionHeader}>
                  <div>
                    <h3>Redemption History</h3>
                    <p>All redemptions recorded against this pass.</p>
                  </div>

                  <span>{selectedPass.redemptionCount} records</span>
                </div>

                {selectedPass.redemptions.length === 0 ? (
                  <div className={styles.emptyRedemptions}>
                    <Clock3 size={30} />

                    <h4>No redemptions yet</h4>

                    <p>This pass has not been used yet.</p>

                    <button
                      type="button"
                      onClick={() => setShowRedeemModal(true)}
                    >
                      <TicketCheck size={16} />
                      Redeem Pass
                    </button>
                  </div>
                ) : (
                  <div className={styles.redemptionList}>
                    {selectedPass.redemptions.map((redemption) => (
                      <div key={redemption.id} className={styles.redemptionRow}>
                        <div className={styles.redemptionIcon}>
                          <TicketCheck size={16} />
                        </div>

                        <div className={styles.redemptionMain}>
                          <strong>
                            {formatDate(redemption.redemptionDate)}
                          </strong>

                          <span>
                            Recorded {formatDateTime(redemption.createdOn)}
                          </span>
                        </div>

                        <div className={styles.redemptionQuantity}>
                          <strong>{redemption.quantity}</strong>

                          <span>
                            {redemption.quantity === 1 ? "Person" : "People"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Always allow another redemption */}

                {selectedPass.redemptions.length > 0 && (
                  <button
                    type="button"
                    className={styles.bottomRedeemButton}
                    onClick={() => setShowRedeemModal(true)}
                  >
                    <Plus size={17} />
                    Add Redemption
                  </button>
                )}
              </div>
            </>
          )}
        </section>
      </div>

      {/* ==================================================
          REDEEM MODAL
      ================================================== */}

      {showRedeemModal && selectedPass && (
        <RedeemPassModal
          customerName={fullName}
          mobile={customer.mobile}
          customerCouponId={selectedPass.id}
          onClose={() => setShowRedeemModal(false)}
          onSuccess={() => {
            setShowRedeemModal(false);
            loadCustomer();
          }}
        />
      )}
    </div>
  );
}
