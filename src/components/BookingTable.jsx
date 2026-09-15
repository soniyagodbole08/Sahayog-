import { Link } from "react-router-dom";
import { formatINR } from "../data";
import StatusBadge from "./StatusBadge";

function BookingTable({ bookings, serviceMap, providerMap, showCustomer = false, compact }) {
  return (
    <div className="table-wrap">
      <table className="booking-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            {showCustomer && <th>Customer</th>}
            <th>Service</th>
            {!compact && <th>Provider</th>}
            {!compact && <th>Date</th>}
            <th>Amount</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => {
            const svc = serviceMap[b.serviceId];
            const prov = providerMap[b.providerId];
            return (
              <tr key={b.id}>
                <td className="mono">{b.id}</td>
                {showCustomer && <td><strong>{b.customer}</strong></td>}
                <td>{svc ? svc.name : "—"}</td>
                {!compact && <td>{prov ? prov.name : "—"}</td>}
                {!compact && <td>{b.date}</td>}
                <td className="strong">{formatINR(b.price)}</td>
                <td><StatusBadge status={b.status} /></td>
                <td>
                  <Link to={`/bookings/${b.id}`} className="table-link">
                    View
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default BookingTable;