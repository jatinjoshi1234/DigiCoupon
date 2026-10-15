"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    CheckCircle2,
    Download,
    FileText,
    Icon,
    LoaderCircle,
    RefreshCw,
    Search,
    TicketCheck,
    Users,
    Utensils,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import styles from "./reports.module.css";
import { PaginationRequest } from "../type/api-response";
import { useAuth } from "../context/AuthContext";
import { Customer, getPagedData, getReportData } from "../services/customer.service";
import Pagination from "../components/shared/Pagination";
import { SelectList } from "../type/select-list";

async function getReport(
    payload: PaginationRequest
) {
    const res = await getPagedData(payload);
    console.log("report page => res => ", res);
    return res;
}

const statIconMap: Record<
    string,
    { icon: React.ElementType; color: string; description: string }
> = {
    Customers: {
        icon: Users,
        color: "purple",
        description: "Total customers",
    },
    "Total Pass": {
        icon: TicketCheck,
        color: "orange",
        description: "Total passes",
    },
    "Total Redemption": {
        icon: Utensils,
        color: "green",
        description: "Total redemption quantities",
    },
    "Passes used": {
        icon: FileText,
        color: "blue",
        description: "Distinct passes used",
    },
};

export default function ReportsPage() {

    const { restaurantId } = useAuth();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [reportStats, setReportStats] = useState<SelectList[]>([]);

    const loadReport = useCallback(
        async () => {
            if (!restaurantId) {
                setError("Restaurant information is not available.");
                return;
            }

            setLoading(true);
            setError("");

            try {

                await getStatistics();
                const result = await getReport({
                    Data: restaurantId ?? 0,
                    Page: page,
                    Search: search,
                    PageSize: pageSize
                });

                setCustomers(result.items)
                setTotalRecords(result.totalRecords)
                setPage(result.page)
                setPageSize(result.pageSize)
                setLoaded(true);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to load report."
                );
                setLoaded(false);
            } finally {
                setLoading(false);
            }
        },
        [restaurantId, search, page, pageSize]
    );

    useEffect(() => {
        if (restaurantId) {
            void loadReport();
        }
    }, [restaurantId, loadReport]);

    async function getStatistics() {
        const res = await getReportData(restaurantId ?? 0);
        if (res)
            setReportStats(res);
    }


    return (
        <main className={styles.page}>
            <header className={styles.pageHeader}>
                <div>
                    <div className={styles.eyebrow}>BUSINESS INSIGHTS</div>
                    <h1>Pass Reports</h1>
                    <p>
                        Track customer pass redemptions and export reports for any date
                        range.
                    </p>
                </div>

                <button
                    type="button"
                    className={styles.pdfButton}
                    disabled={!loaded || !customers.length || downloading || loading}
                >
                    {downloading ? (
                        <LoaderCircle className={styles.spinner} size={18} />
                    ) : (
                        <Download size={18} />
                    )}
                    {downloading ? "Generating PDF..." : "Download PDF"}
                </button>
            </header>

            {/* <section className={styles.filterCard}>
                <div className={styles.filterHeading}>
                    <div className={styles.filterIcon}>
                        <CalendarDays size={20} />
                    </div>
                    <div>
                        <h2>Filter report</h2>
                        <p>Select the redemption period you want to review.</p>
                    </div>
                </div>
            </section> */}

            {error && (
                <div className={styles.errorBanner} role="alert">
                    <span>{error}</span>
                    <button
                        type="button"
                        onClick={() => void loadReport()}
                    >
                        Retry
                    </button>
                </div>
            )}

            <section className={styles.summaryGrid}>
                {
                    reportStats && reportStats.length > 0 && reportStats.map((stat) => {
                        const config = statIconMap[stat.text] ?? {
                            icon: FileText,
                            color: "blue",
                            description: "Report statistics",
                        };
                        return (
                            <article className={styles.summaryCard}>
                                <div
                                    className={`${styles.summaryIcon} ${styles[config.color as keyof typeof styles]
                                        }`}
                                >
                                    {config.icon && <config.icon size={21} />}
                                </div>
                                <div>
                                    <p>{stat.text}</p>
                                    <strong>{loading ? "—" : stat.id}</strong>
                                    <span>Records in filtered results</span>
                                </div>
                            </article>
                        );
                    })
                }
                {/* <article className={styles.summaryCard}>
                    <div className={`${styles.summaryIcon} ${styles.green}`}>
                        <Utensils size={21} />
                    </div>
                    <div>
                        <p>Total uses / persons</p>
                        <strong>{loading ? "—" : 0}</strong>
                        <span>Sum of redemption quantities</span>
                    </div>
                </article>

                <article className={styles.summaryCard}>
                    <div className={`${styles.summaryIcon} ${styles.purple}`}>
                        <Users size={21} />
                    </div>
                    <div>
                        <p>Customers</p>
                        <strong>{loading ? "—" : ''}</strong>
                        <span>Distinct customers in results</span>
                    </div>
                </article>

                <article className={styles.summaryCard}>
                    <div className={`${styles.summaryIcon} ${styles.blue}`}>
                        <FileText size={21} />
                    </div>
                    <div>
                        <p>Passes used</p>
                        <strong>{loading ? "—" : "0"}</strong>
                        <span>Distinct pass numbers in results</span>
                    </div>
                </article> */}
            </section>

            <section className={styles.reportCard}>
                <div className={styles.reportHeader}>
                    <div>
                        <h2>Redemption history</h2>
                    </div>
                    <div className={styles.recordCount}>
                        {customers.length} records
                    </div>
                </div>

                <div className={styles.tableToolbar}>
                    <div className={styles.searchBox}>
                        <Search size={17} />
                        <input
                            type="search"
                            aria-label="Search report"
                            placeholder="Search customer, mobile or pass number..."
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value)
                                setPage(1)
                            }}
                        />
                    </div>
                </div>

                <div className={styles.tableWrap}>
                    <table>
                        <thead>
                            <tr>
                                <th>CUSTOMER</th>
                                <th>MOBILE</th>
                                <th>Total Pass</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className={styles.stateCell}>
                                        <LoaderCircle className={styles.spinner} size={22} />
                                        <span>Loading report...</span>
                                    </td>
                                </tr>
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className={styles.stateCell}>
                                        <div className={styles.emptyIcon}>
                                            <FileText size={25} />
                                        </div>
                                        <strong>No redemption records found</strong>
                                        <span>
                                            Try another date range or clear your search.
                                        </span>
                                    </td>
                                </tr>
                            ) : (
                                customers.map((row) => (
                                    <tr key={row.customerId}>
                                        {/* <td className={styles.dateCell}>
                                            {formatDate(row.frop)}
                                        </td> */}
                                        <td>
                                            <strong className={styles.customerName}>
                                                {row.name || "—"}
                                            </strong>
                                            &nbsp;&nbsp;(<span className={styles.nickName}>
                                                {row.nickName || "—"}
                                            </span>)
                                        </td>
                                        <td>{row.mobile || "—"}</td>
                                        <td>
                                            <span className={styles.typeBadge}>
                                                {row.totalPass || "—"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <footer className={styles.tableFooter}>
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
                </footer>
            </section>
        </main>
    );
}
