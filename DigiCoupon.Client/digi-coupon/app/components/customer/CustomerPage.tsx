"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  MoreVertical,
  Phone,
  Plus,
  Search,
  Ticket,
  TicketCheck,
  Trash2,
  Users,
} from "lucide-react";

import styles from "./CustomerPage.module.css";
import {
  Customer,
  deleteCustomer,
  getCustomers,
  getPagedData,
} from "@/app/services/customer.service";
import CustomerFormModal from "./CustomerFormModal";
import { ApiResponse, PaginationRequest } from "@/app/type/api-response";
import ConfirmModal from "../confirmModal/ConfirmModal";
import Pagination from "../shared/Pagination";
import CustomerCouponModal from "./Coupon/CustomerCouponModal";
import RedeemPassModal from "./Coupon/redemptions/RedeemPassModal";
import { useAuth } from "@/app/context/AuthContext";

export default function CustomerPage() {
  const [search, setSearch] = useState("");
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null,
  );
  const [passId, setPassId] = useState<number | null>(null);
  const [deleteCustomerId, setDeleteCustomerId] = useState<number | null>(null);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenuCustomerId, setOpenMenuCustomerId] = useState<number | null>(
    null,
  );
  const [showCouponModal, setShowCouponModal] = useState(false);

  const [couponId, setCouponId] = useState<number | null>(null);
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [redeemTitle, setRedeemTitle] = useState<string>("");
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemWarning, setRedeemWarning] = useState("");
  const [showRedeemPopup, setShowRedeemPopup] = useState(false);
  const [redeemCustomer, setRedeemCustomer] = useState<{
    customerCouponId: number;
    customerName: string;
    mobile: string;
  } | null>(null);
  const { restaurant, restaurantId, isLoading: authLoading } = useAuth();
  const currentRestaurantId = restaurant?.id || restaurantId;

  /*
   * Temporary data.
   *
   * Replace this with your customer API.
   */
  useEffect(() => {
    if (authLoading || !currentRestaurantId) return;

    let isMounted = true; // Prevents race conditions if component unmounts quickly

    const fetchData = async () => {
      try {
        const pageData = await loadPagedData(currentRestaurantId);
        if (isMounted) {
          //setCustomers(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to load customers:", error);
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, [page, pageSize, search, currentRestaurantId, authLoading]);

  async function loadPagedData(targetRestId?: number) {
    const activeRestId = targetRestId || currentRestaurantId;
    if (!activeRestId) return;

    const payload: PaginationRequest = {
      Data: activeRestId,
      Page: page,
      PageSize: pageSize,
      Search: search,
    };
    const res = await getPagedData(payload);
    console.log("pagedata => response => ", res);
    setCustomers(res.items);
    setPage(res.page);
    setPageSize(res.pageSize);
    setTotalRecords(res.totalRecords);
  }

  // async function onSuccess() {
  //   const data = await getCustomers(currentRestaurantId);
  //   setCustomers(data);
  // }

  const filteredCustomers = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return customers;
    }

    return customers.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(value) ||
        customer.nickName?.toLowerCase().includes(value) ||
        customer.mobile.includes(value)
      );
    });
  }, [customers, search]);

  function handleSearch(value: string) {
    setSearch(value);
    //setPageNumber(1);
  }

  function onRedeemPopup(customer: Customer) {
    setRedeemCustomer({
      customerCouponId: customer.passId ?? 0,
      customerName: customer.name,
      mobile: customer.mobile,
    });

    if (customer.passId != undefined && customer.passId != null)
      setCouponId(customer.passId ?? 0);
    else setRedeemError("Please select a customer to redeem a pass");
  }

  async function handleDeleteCustomer() {
    const res: ApiResponse = await deleteCustomer(deleteCustomerId ?? 0);
    console.log("delete page res => ", res);
    if (res.status) {
      await loadPagedData();
      setDeleteCustomerId(null);
    } else {
      setError(res.message);
    }
  }

  async function handleRedeem() {
    const res: ApiResponse = await deleteCustomer(deleteCustomerId ?? 0);
    console.log("delete page res => ", res);
    if (res.status) {
      await loadPagedData();
      setDeleteCustomerId(null);
    } else {
      setError(res.message);
    }
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .slice(0, 2)
      .map((x) => x.charAt(0))
      .join("")
      .toUpperCase();
  }

  return (
    <div className={styles.page}>
      {/* ================= HEADER ================= */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <div className={styles.titleIcon}>
            <Users size={21} />
          </div>

          <div>
            <h1>Customers</h1>
            <p>Manage your restaurant customers and their passes.</p>
          </div>
        </div>

        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => {
            setSelectedCustomerId(null);
            setShowAddCustomer(true);
          }}
        >
          <Plus size={18} />
          <span>Add Customer</span>
        </button>
      </div>
      {/* ================= SEARCH ================= */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} />

          <input
            type="text"
            placeholder="Search by name, nickname or mobile..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className={styles.customerCount}>
          {filteredCustomers.length} customers
        </div>
      </div>
      {/* ================= CONTENT ================= */}
      {loading ? (
        <div className={styles.loading}>Loading customers...</div>
      ) : customers.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Users size={28} />
          </div>

          <h3>{search ? "No customers found" : "No customers yet"}</h3>

          <p>
            {search
              ? "Try searching with another name or mobile number."
              : "Add your first customer to start managing meal passes."}
          </p>

          {!search && (
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => {
                setSelectedCustomerId(null);
                setShowAddCustomer(true);
              }}
            >
              <Plus size={18} />
              Add Customer
            </button>
          )}
        </div>
      ) : (
        <>
          {/* ================= CUSTOMER GRID ================= */}

          <div className={styles.customerGrid}>
            {customers.map((customer) => {
              const pass = customer.isActive;

              return (
                <div key={customer.customerId} className={styles.customerCard}>
                  {/* Card Header */}

                  <div className={styles.cardHeader}>
                    <div className={styles.customerIdentity}>
                      <div className={styles.avatar}>
                        {getInitials(customer.name)}
                      </div>

                      <div className={styles.customerName}>
                        <h3>{customer.name}</h3>

                        {customer.nickName && <span>{customer.nickName}</span>}
                      </div>
                    </div>
                    <div className={styles.moreMenuWrapper}>
                      <button
                        type="button"
                        className={styles.moreButton}
                        title="More actions"
                        onClick={() => {
                          setOpenMenuCustomerId(
                            openMenuCustomerId === customer.customerId
                              ? null
                              : customer.customerId,
                          );
                        }}
                      >
                        <MoreVertical size={19} />
                      </button>{" "}
                      {openMenuCustomerId === customer.customerId && (
                        <div className={styles.moreMenu}>
                          <button
                            type="button"
                            className={styles.menuItem}
                            onClick={() => {
                              setSelectedCustomerId(customer.customerId);
                              setShowAddCustomer(true);
                              setOpenMenuCustomerId(null);
                            }}
                          >
                            {" "}
                            <Eye size={16} />
                            <span>View Customer</span>{" "}
                          </button>
                          <button
                            type="button"
                            className={styles.menuItem}
                            onClick={() => {
                              setPassId(customer.passId ?? 0);
                              setSelectedCustomerId(customer.customerId);
                              setShowCouponModal(true);
                              setOpenMenuCustomerId(null);
                            }}
                          >
                            <Ticket size={16} />{" "}
                            <span>
                              {" "}
                              {customer.passId && customer.passId > 0
                                ? "Update Pass"
                                : "Add Pass"}
                            </span>{" "}
                          </button>
                          <button
                            type="button"
                            className={`${styles.menuItem} 
                                ${styles.deleteMenuItem}`}
                            onClick={() => {
                              setDeleteCustomerId(customer.customerId);
                              setOpenMenuCustomerId(null);
                            }}
                          >
                            <Trash2 size={16} />
                            <span>Delete Customer</span>{" "}
                          </button>{" "}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile */}

                  <div className={styles.mobileNumber}>
                    <Phone size={16} />

                    <span>{customer.mobile}</span>
                  </div>

                  {/* Pass */}

                  {pass ? (
                    <div
                      className={`${styles.passStatus} ${customer.remaining <= 5
                        ? styles.passWarning
                        : styles.passActive
                        }`}
                    >
                      <div className={styles.passIcon}>
                        <TicketCheck size={17} />
                      </div>

                      <div className={styles.passInfo}>
                        <strong>{customer.usage} uses left</strong>

                        <span>
                          {customer.remaining} of {customer.total} used
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className={`${styles.passStatus} ${styles.noPass}`}>
                      <div className={styles.passIcon}>
                        <TicketCheck size={17} />
                      </div>

                      <div className={styles.passInfo}>
                        <strong>No active pass</strong>

                        <span>Customer has no current pass</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className={styles.cardActions}>
                    {customer && customer.remaining > 0 && (
                      <button
                        type="button"
                        className={styles.redeemButton}
                        onClick={() => onRedeemPopup(customer)}
                      >
                        {" "}
                        <TicketCheck size={17} />
                        Redeem Pass{" "}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= PAGINATION ================= */}

          <Pagination
            currentPage={page}
            pageSize={pageSize}
            totalRecords={totalRecords}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
            pageSizeOptions={[2, 10, 20, 50, 100]}
          />
        </>
      )}

      {showAddCustomer && (
        <CustomerFormModal
          customerId={selectedCustomerId}
          onClose={() => setShowAddCustomer(false)}
          onSuccess={loadPagedData}
        />
      )}

      {showCouponModal && selectedCustomerId && (
        <CustomerCouponModal
          id={passId ?? 0}
          customerId={selectedCustomerId}
          customerName={
            customers.find((x) => x.customerId === selectedCustomerId)?.name
          }
          onClose={() => {
            setShowCouponModal(false);
            setSelectedCustomerId(null);
          }}
          onSuccess={loadPagedData}
        />
      )}

      <ConfirmModal
        open={deleteCustomerId !== null}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
        confirmText="Yes, Delete"
        error={error}
        cancelText="Cancel"
        loading={deleteLoading}
        onCancel={() => {
          if (!deleteLoading) {
            setDeleteCustomerId(null);
          }
        }}
        onConfirm={handleDeleteCustomer}
      />

      <ConfirmModal
        open={showRedeemPopup}
        title={redeemTitle}
        message={redeemWarning}
        confirmText="Yes, Redeem"
        error={error}
        cancelText="Cancel"
        loading={deleteLoading}
        onCancel={() => {
          if (!redeemLoading) {
            setShowRedeemPopup(false);
          }
        }}
        onConfirm={handleRedeem}
      />

      {redeemCustomer && (
        <RedeemPassModal
          customerCouponId={redeemCustomer.customerCouponId}
          customerName={redeemCustomer.customerName}
          mobile={redeemCustomer.mobile}
          onClose={() => setRedeemCustomer(null)}
          onSuccess={() => {
            setRedeemCustomer(null);
            loadPagedData();
          }}
        />
      )}
    </div>
  );
}
