import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Plus, TrendingUp, CheckCircle2 } from "lucide-react";
import AppLayout from "../components/AppLayout";
import StatCard from "../components/StatCard";
import BookingCard from "../components/BookingCard";
import BookingTable from "../components/BookingTable";
import BackButton from "../components/BackButton";
import { services, providers, formatINR } from "../data";
import { useToast } from "../useToast";
import { useData } from "../context/useData";

const tabs = [
  { id: "all", label: "All" },
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

function Bookings() {
  const [tab, setTab] = useState("all");
  const { bookings, cancelBooking } = useData();
  const toast = useToast();

  const serviceMap = useMemo(() => Object.fromEntries(services.map((s) => [s.id, s])), []);
  const providerMap = useMemo(() => Object.fromEntries(providers.map((p) => [p.id, p])), []);

  const upcoming = (list) => list.filter((b) => b.status === "confirmed" || b.status === "pending");
  const completed = (list) => list.filter((b) => b.status === "completed");
  const cancelled = (list) => list.filter((b) => b.status === "cancelled");

  const lists = useMemo(
    () => ({
      all: upcoming(bookings),
      upcoming: upcoming(bookings),
      completed: completed(bookings),
      cancelled: cancelled(bookings),
    }),
    [bookings]
  );

  const activeList = lists[tab] || lists.all;
  const upcomingCount = lists.upcoming.length;
  const spend = completed(bookings).reduce((s, b) => s + b.price, 0);

  function handleCancel(id) {
    cancelBooking(id);
    toast(`Booking ${id} cancelled. Refund processed in 3-5 days.`, "info");
  }

  const tableRows = bookings.filter((b) =>
    tab === "all" || b.status === tab || (tab === "upcoming" && (b.status === "confirmed" || b.status === "pending"))
  );

  return (
    <AppLayout
      role="customer"
      title="My Bookings"
      subtitle="Track, manage and review all your services"
    >
      <BackButton />
      <div className="stat-grid">
        <StatCard
          title="Upcoming"
          value={upcomingCount}
          change="+2 this week"
          type="blue"
          icon={<CalendarDays size={20} />}
        />
        <StatCard
          title="Completed"
          value={completed(bookings).length}
          change="98% on-time"
          type="green"
          icon={<CheckCircle2 size={20} />}
        />
        <StatCard
          title="Total Spent"
          value={formatINR(spend)}
          change="+8% vs last qtr"
          type="violet"
          icon={<TrendingUp size={20} />}
        />
      </div>

      <div className="card">
        <div className="card-toolbar">
          <div className="tabs">
            {tabs.map((t) => (
              <button
                key={t.id}
                className={tab === t.id ? "tab active" : "tab"}
                onClick={() => setTab(t.id)}
              >
                {t.label}
                <span className="tab-count">{lists[t.id]?.length || 0}</span>
              </button>
            ))}
          </div>

          <Link to="/services" className="btn btn-primary btn-sm">
            <Plus size={16} /> New Booking
          </Link>
        </div>

        {activeList.length === 0 ? (
          <div className="empty-state">
            <CalendarDays size={30} />
            <h3>No {tab !== "all" ? tab : ""} bookings yet</h3>
            <p>Ready to book a service? Your neighbourhood is waiting.</p>
            <Link to="/services" className="btn btn-primary btn-sm">
              Browse Services
            </Link>
          </div>
        ) : (
          <>
            <div className="booking-cards">
              {activeList.map((b) => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  service={serviceMap[b.serviceId]}
                  provider={providerMap[b.providerId]}
                  onCancel={handleCancel}
                />
              ))}
            </div>

            <div className="table-block">
              <h3 className="card-title">All activity</h3>
              <BookingTable
                bookings={tableRows}
                serviceMap={serviceMap}
                providerMap={providerMap}
              />
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}

export default Bookings;