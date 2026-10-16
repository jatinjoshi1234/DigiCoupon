
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    Clock3,
    History,
    Ticket,
    UtensilsCrossed,
} from "lucide-react";
import styles from "./page.module.css";
import { getPagedData } from "@/app/services/coupon.service";
import { Customer } from "@/app/services/customer.service";
import { PaginationRequest } from "@/app/type/api-response";
import { useAuth } from "@/app/context/AuthContext";

type Redemption = {
    id: number;
    date: string;
    quantity: number;
};

type CustomerPass = {
    id: number;
    number: string;
    name: string;
    type: "Fixed" | "Unlimited";
    totalUsage: number | null;
    used: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    redemptions: Redemption[];
};

const samplePasses: CustomerPass[] = [
    {
        id: 1,
        number: "DC-2026-0042",
        name: "Monthly Dining Pass",
        type: "Fixed",
        totalUsage: 30,
        used: 12,
        startDate: "2026-10-01",
        endDate: "2026-10-31",
        isActive: true,
        redemptions: [
            { id: 1, date: "2026-10-15T13:15:00", quantity: 1 },
            { id: 2, date: "2026-10-14T13:05:00", quantity: 1 },
            { id: 3, date: "2026-10-12T13:20:00", quantity: 2 },
        ],
    },
    {
        id: 2,
        number: "DC-2026-0018",
        name: "Previous Dining Pass",
        type: "Fixed",
        totalUsage: 15,
        used: 15,
        startDate: "2026-09-01",
        endDate: "2026-09-30",
        isActive: false,
        redemptions: [
            { id: 4, date: "2026-09-30T13:10:00", quantity: 1 },
            { id: 5, date: "2026-09-29T13:00:00", quantity: 1 },
        ],
    },
];

function formatDate(value: string) {
    return new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function formatDateTime(value: string) {
    return new Date(value).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function PublicCustomerPage() {
    const params = useParams<{ publicToken: string }>();
    const { restaurantId } = useAuth();
    const [selectedPassId, setSelectedPassId] = useState(1);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [search, setSearch] = useState("");
    // Replace these sample values with data from your .NET API.
    const customer = {
        name: "Rahul Patel",
        restaurantName: "Shreeji Dining Hall",
    };

    async function fetchPublicCustomerData(token: string) {
        const payload: PaginationRequest = {
            Data: restaurantId ?? 0,
            Page: page,
            PageSize: pageSize,
            Search: search,
        };
        const data = await getPagedData(payload);
        console.log("public data =>", data);
    }

    async function fetchCustomers(token: string) {
        try {
            const response = await fetch(`/api/v1/coupons`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data. Status: ${response.status}`);
            }
            const data = await response.json();
            if (data && data.status) {
                const customersData = data.data as Customer[];
                setCustomers(customersData);
                setTotalRecords(customersData.length);
                if (customersData.length > 0) {
                    //setSelectedCustomerId(customersData[0].id);
                }
            } else {
                console.error("Unexpected API response structure:", data);
            }
        } catch (error: any) {
            console.error("Error fetching customers:", error.message);
            setCustomers([]);
            setTotalRecords(0);
            //setSelectedCustomerId(null);
        } finally {
            setLoading(false);
        }
    }


    const passes = samplePasses;
    const selectedPass =
        passes.find((pass) => pass.id === selectedPassId) ?? passes[0];

    const remaining =
        selectedPass.type === "Unlimited" ||
            selectedPass.totalUsage === null
            ? null
            : Math.max(0, selectedPass.totalUsage - selectedPass.used);

    const usagePercent =
        selectedPass.totalUsage && selectedPass.totalUsage > 0
            ? Math.min(100, (selectedPass.used / selectedPass.totalUsage) * 100)
            : 0;

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <div className={styles.brand}>
                        <div className={styles.logo}>
                            <Ticket size={25} strokeWidth={2.3} />
                        </div>
                        <div>
                            <div className={styles.brandName}>DigiCoupon</div>
                            <div className={styles.brandCaption}>
                                Your dining pass, simplified
                            </div>
                        </div>
                    </div>
                    <div className={styles.secureLabel}>
                        <CheckCircle2 size={15} />
                        Pass overview
                    </div>
                </div>
            </header>

            <div className={styles.container}>
                <section className={styles.restaurantCard}>
                    <div className={styles.restaurantIcon}>
                        <UtensilsCrossed size={25} />
                    </div>
                    <div className={styles.restaurantInfo}>
                        <div className={styles.eyebrow}>YOUR RESTAURANT</div>
                        <h1>{customer.restaurantName}</h1>
                        <p>Welcome, {customer.name}</p>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeading}>
                        <div>
                            <h2>Your passes</h2>
                            <p>Select a pass to view its redemption history.</p>
                        </div>
                        <span className={styles.countBadge}>{passes.length} passes</span>
                    </div>

                    <div className={styles.passList}>
                        {passes.map((pass) => {
                            const isSelected = pass.id === selectedPassId;
                            const passRemaining =
                                pass.type === "Unlimited" || pass.totalUsage === null
                                    ? null
                                    : Math.max(0, pass.totalUsage - pass.used);

                            const percent =
                                pass.totalUsage && pass.totalUsage > 0
                                    ? Math.min(100, (pass.used / pass.totalUsage) * 100)
                                    : 0;

                            return (
                                <button
                                    type="button"
                                    key={pass.id}
                                    className={`${styles.passCard} ${isSelected ? styles.passCardSelected : ""
                                        }`}
                                    onClick={() => setSelectedPassId(pass.id)}
                                    aria-pressed={isSelected}
                                >
                                    <div className={styles.passTop}>
                                        <div className={styles.passIcon}>
                                            <Ticket size={21} />
                                        </div>
                                        <div className={styles.passTitle}>
                                            <h3>{pass.name}</h3>
                                            <span>{pass.number}</span>
                                        </div>
                                        <span
                                            className={`${styles.status} ${pass.isActive ? styles.active : styles.expired
                                                }`}
                                        >
                                            {pass.isActive ? "Active" : "Expired"}
                                        </span>
                                    </div>

                                    <div className={styles.stats}>
                                        <div className={styles.stat}>
                                            <span>Total</span>
                                            <strong>
                                                {pass.totalUsage === null
                                                    ? "∞"
                                                    : pass.totalUsage}
                                            </strong>
                                        </div>
                                        <div className={styles.stat}>
                                            <span>Used</span>
                                            <strong>{pass.used}</strong>
                                        </div>
                                        <div className={styles.stat}>
                                            <span>Remaining</span>
                                            <strong className={styles.remainingValue}>
                                                {passRemaining === null ? "∞" : passRemaining}
                                            </strong>
                                        </div>
                                    </div>

                                    {pass.totalUsage !== null && (
                                        <div className={styles.progressTrack}>
                                            <div
                                                className={styles.progressFill}
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                    )}

                                    <div className={styles.passBottom}>
                                        <span>
                                            <CalendarDays size={14} />
                                            Until {formatDate(pass.endDate)}
                                        </span>
                                        <span className={styles.viewHistory}>
                                            {isSelected ? "Selected" : "View history"}
                                            <ChevronRight size={16} />
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>

                <section className={styles.historySection} id="redemption-history">
                    <div className={styles.historyHeading}>
                        <div className={styles.historyIcon}>
                            <History size={21} />
                        </div>
                        <div>
                            <h2>Redemption history</h2>
                            <p>Transactions for the selected pass</p>
                        </div>
                    </div>

                    <div className={styles.selectedPassInfo}>
                        <div>
                            <span>SELECTED PASS</span>
                            <strong>{selectedPass.name}</strong>
                            <small>{selectedPass.number}</small>
                        </div>
                        <span className={styles.transactionCount}>
                            {selectedPass.redemptions.length} records
                        </span>
                    </div>

                    {selectedPass.redemptions.length > 0 ? (
                        <div className={styles.historyList}>
                            {selectedPass.redemptions.map((item) => (
                                <div className={styles.historyRow} key={item.id}>
                                    <div className={styles.historyDateIcon}>
                                        <CalendarDays size={19} />
                                    </div>
                                    <div className={styles.historyDetails}>
                                        <strong>{formatDateTime(item.date)}</strong>
                                        <span>
                                            <Clock3 size={13} />
                                            Pass redeemed
                                        </span>
                                    </div>
                                    <div className={styles.quantity}>
                                        <strong>−{item.quantity}</strong>
                                        <span>used</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <History size={30} />
                            <strong>No redemptions yet</strong>
                            <p>Redemption records will appear here when this pass is used.</p>
                        </div>
                    )}
                </section>

                <footer className={styles.footer}>
                    <div className={styles.footerLogo}>
                        <Ticket size={17} />
                        DigiCoupon
                    </div>
                    <p>Your passes. Your history. All in one place.</p>
                </footer>
            </div>
        </main>
    );
}
