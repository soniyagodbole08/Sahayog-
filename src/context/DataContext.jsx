import { useState } from "react";
import { DataCtx } from "./useData";
import { bookings as seedBookings, providerRequests as seedRequests } from "../data";

export function DataProvider({ children }) {
  const [bookings, setBookings] = useState(seedBookings);
  const [requests, setRequests] = useState(seedRequests);

  function cancelBooking(id) {
    setBookings((list) =>
      list.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
    );
  }

  function completeBooking(id) {
    setBookings((list) =>
      list.map((b) => (b.id === id ? { ...b, status: "completed" } : b))
    );
  }

  function addBooking(booking) {
    setBookings((list) => [booking, ...list]);
  }

  function respondRequest(id, status) {
    setRequests((list) => list.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  return (
    <DataCtx.Provider
      value={{ bookings, cancelBooking, completeBooking, addBooking, requests, respondRequest }}
    >
      {children}
    </DataCtx.Provider>
  );
}