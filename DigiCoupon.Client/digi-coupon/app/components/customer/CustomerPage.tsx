"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Phone,
  Plus,
  Search,
  TicketCheck,
  Users,
} from "lucide-react";

import styles from "./CustomerPage.module.css";
import { getCustomers } from "@/app/services/customer.service";
import CustomerFormModal from "./CustomerFormModal";

interface ActivePass {
  id: number;
  totalUsage: number;
  usedUsage: number;
  remainingUsage: number;
}

interface Customer {
  id: number;
  name: string;
  restaurantId: number;
  nickname?: string | null;
  mobile: string;
  isActive: boolean;
  activePass?: ActivePass | null;
}

export default function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 12;

  const [loading, setLoading] = useState(true);

  /*
   * Temporary data.
   *
   * Replace this with your customer API.
   */
  useEffect(() => {
    let data: Customer[] = [
      {
        id: 1,
        name: "Rahul Patel",
        nickname: "Rahul",
        restaurantId: 9,
        mobile: "9876543210",
        isActive: true,
        activePass: {
          id: 101,
          totalUsage: 30,
          usedUsage: 12,
          remainingUsage: 18,
        },
      },
      {
        id: 2,
        name: "Amit Shah",
        nickname: "Amit",
        restaurantId: 9,
        mobile: "9825212345",
        isActive: true,
        activePass: null,
      },
      {
        id: 3,
        name: "Jay Mehta",
        nickname: "Jay",
        mobile: "9898012345",
        restaurantId: 9,
        isActive: true,
        activePass: {
          id: 102,
          totalUsage: 15,
          usedUsage: 8,
          remainingUsage: 7,
        },
      },
      {
        id: 4,
        name: "Karan Joshi",
        nickname: "Karan",
        mobile: "9879012345",
        restaurantId: 9,
        isActive: true,
        activePass: {
          id: 103,
          totalUsage: 30,
          usedUsage: 25,
          remainingUsage: 5,
        },
      },
      {
        id: 5,
        name: "Vivek Patel",
        nickname: "Vicky",
        mobile: "9909012345",
        restaurantId: 9,
        isActive: true,
        activePass: null,
      },
    ];

    setCustomers(data);
    setLoading(false);
  }, []);

  const filteredCustomers = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return customers;
    }

    return customers.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(value) ||
        customer.nickname?.toLowerCase().includes(value) ||
        customer.mobile.includes(value)
      );
    });
  }, [customers, search]);

  /*
   * Temporary client-side pagination.
   *
   * Later replace this with server-side pagination
   * using pageNumber/pageSize in your API.
   */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / pageSize),
  );

  const paginatedCustomers = filteredCustomers.slice(
    (pageNumber - 1) * pageSize,
    pageNumber * pageSize,
  );

  function handleSearch(value: string) {
    setSearch(value);
    setPageNumber(1);
  }

  function handleRedeem(customer: Customer) {
    if (!customer.activePass) {
      return;
    }

    /*
     * Open redeem confirmation modal here.
     *
     * Later:
     * POST /api/customer-coupons/{passId}/redeem
     */
    console.log("Redeem customer:", customer);
  }

  async function handleAddCustomer(data: Customer) {
    try {
      setSaving(true);

      console.log("Customer data:", data);

      // Later replace this with your API call
      // await Fetch("/customers", {
      //   method: "POST",
      //   body: JSON.stringify(data),
      // });

      setShowAddCustomer(false);
    } catch (error) {
      console.error("Failed to add customer:", error);
    } finally {
      setSaving(false);
    }
  }

  function handleView(customer: Customer) {
    console.log("View customer:", customer);
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
          onClick={() => console.log("Add customer")}
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
      ) : paginatedCustomers.length === 0 ? (
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
              onClick={() => console.log("Add customer")}
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
            {paginatedCustomers.map((customer) => {
              const pass = customer.activePass;

              return (
                <div key={customer.id} className={styles.customerCard}>
                  {/* Card Header */}

                  <div className={styles.cardHeader}>
                    <div className={styles.customerIdentity}>
                      <div className={styles.avatar}>
                        {getInitials(customer.name)}
                      </div>

                      <div className={styles.customerName}>
                        <h3>{customer.name}</h3>

                        {customer.nickname && <span>{customer.nickname}</span>}
                      </div>
                    </div>

                    <button
                      type="button"
                      className={styles.viewIconButton}
                      title="View customer"
                      onClick={() => handleView(customer)}
                    >
                      <Eye size={17} />
                    </button>
                  </div>

                  {/* Mobile */}

                  <div className={styles.mobileNumber}>
                    <Phone size={16} />

                    <span>{customer.mobile}</span>
                  </div>

                  {/* Pass */}

                  {pass ? (
                    <div
                      className={`${styles.passStatus} ${
                        pass.remainingUsage <= 5
                          ? styles.passWarning
                          : styles.passActive
                      }`}
                    >
                      <div className={styles.passIcon}>
                        <TicketCheck size={17} />
                      </div>

                      <div className={styles.passInfo}>
                        <strong>{pass.remainingUsage} uses left</strong>

                        <span>
                          {pass.usedUsage} of {pass.totalUsage} used
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
                    <button
                      type="button"
                      className={styles.viewButton}
                      onClick={() => handleView(customer)}
                    >
                      View Customer
                    </button>

                    {pass && pass.remainingUsage > 0 && (
                      <button
                        type="button"
                        className={styles.redeemButton}
                        onClick={() => handleRedeem(customer)}
                      >
                        <TicketCheck size={17} />
                        Redeem
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= PAGINATION ================= */}

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                type="button"
                className={styles.pageButton}
                disabled={pageNumber === 1}
                onClick={() => setPageNumber((p) => p - 1)}
              >
                <ChevronLeft size={17} />
                <span className={styles.desktopOnly}>Previous</span>
              </button>

              <div className={styles.pageNumbers}>
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`${styles.pageNumber} ${
                      pageNumber === page ? styles.pageNumberActive : ""
                    }`}
                    onClick={() => setPageNumber(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className={styles.pageButton}
                disabled={pageNumber === totalPages}
                onClick={() => setPageNumber((p) => p + 1)}
              >
                <span className={styles.desktopOnly}>Next</span>
                <ChevronRight size={17} />
              </button>
            </div>
          )}
        </>
      )}
      <CustomerFormModal
        open={showAddCustomer}
        loading={saving}
        onClose={() => setShowAddCustomer(false)}
        onSubmit={handleAddCustomer}
      />
      ;
    </div>
  );
}
