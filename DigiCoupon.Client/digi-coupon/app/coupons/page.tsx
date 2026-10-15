"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Pencil,
  Plus,
  Search,
  Ticket,
  TicketCheck,
  X,
} from "lucide-react";
import styles from "./coupons.module.css";
import { Customer, getPagedData } from "../services/customer.service";
import { PaginationRequest } from "../type/api-response";
import CustomerCouponModal from "../components/customer/Coupon/CustomerCouponModal";
import RedeemPassModal from "../components/customer/Coupon/redemptions/RedeemPassModal";
import { useAuth } from "../context/AuthContext";

type PassStatus = "Active" | "Expiring soon" | "Expired" | "Fully used";
type PassType = "Unlimited" | "Fixed";

interface PassItem {
  id: number;
  customerId: number;
  customerName: string;
  mobile: string;
  couponNumber: string;
  type: PassType;
  price: number;
  startDate: string;
  endDate: string;
  totalUsage: number | null;
  usedUsage: number;
  status: PassStatus;
}

const formatDate = (value?: string) => {
  if (!value) return "-";
  const dateObj = new Date(value.includes("T") ? value : `${value}T00:00:00`);
  if (isNaN(dateObj.getTime())) return value;
  return dateObj.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const mapCustomerToPassItem = (c: Customer): PassItem => {
  const priceNumber = Number(c.Price ?? (c as any).price) || 0;
  const startDateRaw = c.FromDate ?? (c as any).fromDate ?? "";
  const endDateRaw = c.ToDate ?? (c as any).toDate ?? "";

  const startDate = startDateRaw;
  const endDate = endDateRaw;

  const totalUsage = c.total && c.total > 0 ? Number(c.total) : null;
  const usedUsage = Number(c.usage) || 0;

  let status: PassStatus = "Active";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(
    endDate && endDate.includes("T") ? endDate : `${endDate}T00:00:00`,
  );
  end.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil(
    (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  const passId = Number((c as any).passId ?? (c as any).PassId ?? c.passId ?? 0);

  if (passId <= 0 || !c.isActive || (totalUsage !== null && usedUsage >= totalUsage)) {
    status = "Fully used";
  } else if (!isNaN(end.getTime()) && end < today) {
    status = "Expired";
  } else if (!isNaN(end.getTime()) && diffDays >= 0 && diffDays <= 5) {
    status = "Expiring soon";
  } else {
    status = "Active";
  }

  const type: PassType = totalUsage !== null ? "Fixed" : "Unlimited";
  const couponNumber =
    passId > 0
      ? `DC-${passId.toString().padStart(5, "0")}`
      : `CUS-${c.customerId}`;

  return {
    id: passId,
    customerId: c.customerId,
    customerName: c.name || "Customer",
    mobile: c.mobile || "",
    couponNumber,
    type,
    price: priceNumber,
    startDate,
    endDate,
    totalUsage,
    usedUsage,
    status,
  };
};

export default function PassesPage() {
  const [passes, setPasses] = useState<PassItem[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const [selectedPass, setSelectedPass] = useState<PassItem | null>(null);
  const [redeemPass, setRedeemPass] = useState<PassItem | null>(null);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponModalId, setCouponModalId] = useState(0);
  const [couponModalCustomerId, setCouponModalCustomerId] = useState(0);
  const [couponModalCustomerName, setCouponModalCustomerName] = useState("");

  const { restaurant, restaurantId, isLoading: authLoading } = useAuth();
  const currentRestaurantId = restaurant?.id || restaurantId;

  async function loadPagedData(targetRestId?: number) {
    const activeRestId = targetRestId || currentRestaurantId;
    if (!activeRestId) return;

    try {
      setLoading(true);
      console.log("coupon page => restaurantId => ", activeRestId);
      const payload: PaginationRequest = {
        Data: activeRestId,
        Page: page,
        PageSize: pageSize,
        Search: search,
      };
      const res = await getPagedData(payload);
      console.log("coupon page => pageData => ", res);
      const items = res?.items ?? [];
      setCustomers(items);
      setPasses(items.map(mapCustomerToPassItem));
      setPage(res.page || page);
      setPageSize(res.pageSize || pageSize);
      setTotalRecords(res.totalRecords || 0);
      return res;
    } catch (err) {
      console.error("Failed to load customer passes:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authLoading || !currentRestaurantId) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        await loadPagedData(currentRestaurantId);
      } catch (error) {
        console.error("Failed to load customer passes:", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [page, pageSize, search, currentRestaurantId, authLoading]);

  const filteredPasses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return passes.filter((pass) => {
      const matchesSearch =
        !query ||
        pass.customerName.toLowerCase().includes(query) ||
        pass.mobile.includes(query) ||
        pass.couponNumber.toLowerCase().includes(query);

      const matchesStatus =
        activeFilter === "All" || pass.status === activeFilter;

      return matchesSearch && matchesStatus;
    });
  }, [passes, search, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const visiblePasses = filteredPasses;

  const activeCount = passes.filter((p) => p.status === "Active").length;
  const expiringCount = passes.filter(
    (p) => p.status === "Expiring soon",
  ).length;
  const expiredCount = passes.filter(
    (p) => p.status === "Expired" || p.status === "Fully used",
  ).length;

  return (
    <main className={styles.page}>
      {" "}
      <header className={styles.pageHeader}>
        <div>
          <div className={styles.eyebrow}>MANAGE YOUR PASSES</div>
          <h1 className={styles.pageTitle}>Pass Management</h1>
          <p className={styles.pageSubtitle}>
            Track customer passes, validity and usage in one place.
          </p>
        </div>
        <div className={styles.headerRight}>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => {
              setCouponModalId(0);
              setCouponModalCustomerId(0);
              setCouponModalCustomerName("");
              setShowCouponModal(true);
            }}
          >
            <Plus size={18} />
            <span>Add Pass</span>
          </button>
          <div className={styles.headerIcon}>
            <Ticket size={24} />
          </div>
        </div>
      </header>
      <section className={styles.statsGrid} aria-label="Pass summary">
        <article className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.orangeIcon}`}>
            <Ticket size={20} />
          </div>
          <div className={styles.statLabel}>Total passes</div>
          <div className={styles.statValue}>
            {totalRecords || passes.length}
          </div>
          <div className={styles.statHint}>All customer passes</div>
        </article>

        <article className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.greenIcon}`}>
            <CheckCircle2 size={20} />
          </div>
          <div className={styles.statLabel}>Active</div>
          <div className={styles.statValue}>{activeCount}</div>
          <div className={styles.statHint}>Currently valid</div>
        </article>

        <article className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.amberIcon}`}>
            <Clock3 size={20} />
          </div>
          <div className={styles.statLabel}>Expiring soon</div>
          <div className={styles.statValue}>{expiringCount}</div>
          <div className={styles.statHint}>Needs attention</div>
        </article>

        <article className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.slateIcon}`}>
            <Archive size={20} />
          </div>
          <div className={styles.statLabel}>Expired / used</div>
          <div className={styles.statValue}>{expiredCount}</div>
          <div className={styles.statHint}>No longer redeemable</div>
        </article>
      </section>
      <section className={styles.listSection}>
        <div className={styles.listHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Customer passes</h2>
            <p className={styles.sectionSubtitle}>
              Search and manage passes issued to your customers.
            </p>
          </div>
          <div className={styles.passCount}>
            {totalRecords || filteredPasses.length}{" "}
            {(totalRecords || filteredPasses.length) === 1 ? "pass" : "passes"}
          </div>
        </div>

        <div className={styles.toolbar}>
          <label className={styles.searchBox}>
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              value={search}
              placeholder="Search customer, mobile or pass number..."
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              aria-label="Search passes"
            />
            {search && (
              <button
                type="button"
                className={styles.clearSearch}
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </label>

          <label className={styles.filterSelect}>
            <span className={styles.filterLabel}>Status</span>
            <select
              value={activeFilter}
              onChange={(event) => {
                setActiveFilter(event.target.value);
                setPage(1);
              }}
            >
              <option value="All">All passes</option>
              <option value="Active">Active</option>
              <option value="Expiring soon">Expiring soon</option>
              <option value="Expired">Expired</option>
              <option value="Fully used">Fully used</option>
            </select>
          </label>
        </div>

        <div className={styles.passList}>
          {visiblePasses.map((pass) => {
            const usagePercent =
              pass.totalUsage === null
                ? null
                : Math.min(
                  100,
                  Math.round((pass.usedUsage / pass.totalUsage) * 100),
                );

            const canRedeem =
              pass.status !== "Expired" && pass.status !== "Fully used";

            return (
              <article className={styles.passCard} key={pass.id}>
                <div className={styles.passCardTop}>
                  <div className={styles.customerInfo}>
                    <div className={styles.avatar}>
                      {getInitials(pass.customerName)}
                    </div>
                    <div className={styles.customerText}>
                      <h3>{pass.customerName}</h3>
                      <div className={styles.customerMeta}>
                        <span>{pass.mobile}</span>
                        <span className={styles.metaDot}>•</span>
                        <span className={styles.passNumber}>
                          {pass.couponNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`${styles.statusBadge} ${pass.status === "Active"
                      ? styles.statusActive
                      : pass.status === "Expiring soon"
                        ? styles.statusExpiring
                        : pass.status === "Fully used"
                          ? styles.statusUsed
                          : styles.statusExpired
                      }`}
                  >
                    <span className={styles.statusDot} />
                    {pass.status}
                  </span>
                </div>

                <div className={styles.passInfoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Pass type</span>
                    <span className={styles.infoValue}>
                      <TicketCheck size={15} className={styles.infoValueIcon} />
                      {pass.type}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Validity</span>
                    <span className={styles.infoValue}>
                      <CalendarDays
                        size={15}
                        className={styles.infoValueIcon}
                      />
                      {formatDate(pass.startDate)} – {formatDate(pass.endDate)}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Pass price</span>
                    <span className={styles.priceValue}>
                      {formatCurrency(pass.price)}
                    </span>
                  </div>
                </div>

                <div className={styles.usageSection}>
                  <div className={styles.usageHeader}>
                    <span className={styles.usageLabel}>
                      {pass.type === "Unlimited"
                        ? "Redemption activity"
                        : "Pass usage"}
                    </span>
                    <span className={styles.usageValue}>
                      {pass.usedUsage} used
                      {pass.totalUsage !== null ? ` / ${pass.totalUsage}` : ""}
                    </span>
                  </div>
                  <div
                    className={styles.progressTrack}
                    role="progressbar"
                    aria-label={`${pass.customerName} pass usage`}
                    aria-valuemin={0}
                    aria-valuemax={
                      pass.totalUsage ?? Math.max(pass.usedUsage, 1)
                    }
                    aria-valuenow={pass.usedUsage}
                  >
                    <div
                      className={styles.progressBar}
                      style={{
                        width: `${usagePercent ?? Math.min(pass.usedUsage * 5, 100)}%`,
                      }}
                    />
                  </div>
                  <div className={styles.usageFooter}>
                    {pass.totalUsage === null
                      ? "Unlimited usage"
                      : `${Math.max(0, pass.totalUsage - pass.usedUsage)} remaining`}
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => setSelectedPass(pass)}
                  >
                    <Eye size={16} />
                    Details
                  </button>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => {
                      setCouponModalId(pass.id);
                      setCouponModalCustomerId(pass.customerId);
                      setCouponModalCustomerName(pass.customerName);
                      setShowCouponModal(true);
                    }}
                  >
                    <Pencil size={15} />
                    Edit Pass
                  </button>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    disabled={!canRedeem}
                    onClick={() => setRedeemPass(pass)}
                  >
                    <TicketCheck size={16} />
                    Redeem
                  </button>
                </div>
              </article>
            );
          })}

          {loading ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <Clock3 size={24} />
              </div>
              <h3>Loading passes...</h3>
              <p>Fetching customer passes from the server.</p>
            </div>
          ) : visiblePasses.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <Search size={24} />
              </div>
              <h3>No passes found</h3>
              <p>Try a different search term or status filter.</p>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => {
                  setSearch("");
                  setActiveFilter("All");
                  setPage(1);
                }}
              >
                Clear filters
              </button>
            </div>
          ) : null}
        </div>

        <footer className={styles.pagination}>
          <span className={styles.paginationText}>
            {totalRecords === 0
              ? "No passes to display"
              : `Showing ${(page - 1) * pageSize + 1}–${Math.min(
                page * pageSize,
                totalRecords,
              )} of ${totalRecords} passes`}
          </span>
          <div className={styles.paginationControls}>
            <button
              type="button"
              className={styles.pageButton}
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              aria-label="Previous page"
            >
              <ChevronLeft size={17} />
              <span>Previous</span>
            </button>
            <span className={styles.pageNumber}>
              {page} / {totalPages}
            </span>
            <button
              type="button"
              className={styles.pageButton}
              disabled={page >= totalPages || loading}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              aria-label="Next page"
            >
              <span>Next</span>
              <ChevronRight size={17} />
            </button>
          </div>
        </footer>
      </section>
      {selectedPass && (
        <div
          className={styles.modalOverlay}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedPass(null);
          }}
        >
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pass-modal-title"
          >
            <header className={styles.modalHeader}>
              <div>
                <h2 id="pass-modal-title">Pass Details</h2>
                <p>
                  {selectedPass.customerName} · {selectedPass.couponNumber}
                </p>
              </div>
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setSelectedPass(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </header>

            <div className={styles.modalBody}>
              <div className={styles.modalSummary}>
                <div>
                  <span className={styles.infoLabel}>Pass type</span>
                  <strong>{selectedPass.type}</strong>
                </div>
                <div>
                  <span className={styles.infoLabel}>Price</span>
                  <strong>{formatCurrency(selectedPass.price)}</strong>
                </div>
                <div>
                  <span className={styles.infoLabel}>Used</span>
                  <strong>
                    {selectedPass.usedUsage}
                    {selectedPass.totalUsage !== null
                      ? ` / ${selectedPass.totalUsage}`
                      : ""}
                  </strong>
                </div>
              </div>

              <div className={styles.detailRow}>
                <span>Mobile</span>
                <strong>{selectedPass.mobile}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>Start date</span>
                <strong>{formatDate(selectedPass.startDate)}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>End date</span>
                <strong>{formatDate(selectedPass.endDate)}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>Status</span>
                <strong>{selectedPass.status}</strong>
              </div>
            </div>

            <footer className={styles.modalFooter}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setSelectedPass(null)}
              >
                Close
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => {
                  const passToEdit = selectedPass;
                  setSelectedPass(null);
                  setCouponModalId(passToEdit.id);
                  setCouponModalCustomerId(passToEdit.customerId);
                  setCouponModalCustomerName(passToEdit.customerName);
                  setShowCouponModal(true);
                }}
              >
                <Pencil size={16} />
                Edit Pass
              </button>
              {selectedPass.id > 0 &&
                selectedPass.status !== "Expired" &&
                selectedPass.status !== "Fully used" && (
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={() => {
                      const passToRedeem = selectedPass;
                      setSelectedPass(null);
                      setRedeemPass(passToRedeem);
                    }}
                  >
                    <TicketCheck size={16} />
                    Redeem Pass
                  </button>
                )}
            </footer>
          </section>
        </div>
      )}

      {redeemPass && (
        <RedeemPassModal
          customerCouponId={redeemPass.id}
          customerName={redeemPass.customerName}
          mobile={redeemPass.mobile}
          onClose={() => setRedeemPass(null)}
          onSuccess={async () => {
            setRedeemPass(null);
            await loadPagedData();
          }}
        />
      )}

      {showCouponModal && (
        <CustomerCouponModal
          id={couponModalId}
          customerId={couponModalCustomerId}
          customerName={couponModalCustomerName}
          customers={customers}
          onClose={() => {
            setShowCouponModal(false);
            setCouponModalId(0);
            setCouponModalCustomerId(0);
            setCouponModalCustomerName("");
          }}
          onSuccess={async () => {
            await loadPagedData();
          }}
        />
      )}
    </main>
  );
}
