import { createContext, useContext } from "react";

export const AuthCtx = createContext(null);

export const roleProfiles = {
  customer: {
    name: "Ananya Sharma",
    email: "ananya@example.com",
    location: "Bengaluru, KA",
    initials: "AS",
    phone: "+91 98xxxxx210",
    memberSince: "2025",
  },
  provider: {
    name: "Rekha Kumari",
    email: "rekha@example.com",
    location: "Koramangala, Bengaluru",
    initials: "RK",
    phone: "+91 98xxxxx745",
    memberSince: "2023",
  },
  admin: {
    name: "Sahayog Admin",
    email: "admin@sahayog.in",
    location: "Bengaluru",
    initials: "SA",
    phone: "+91 80xxxxx000",
    memberSince: "2022",
  },
};

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}