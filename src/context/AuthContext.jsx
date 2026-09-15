import { useState } from "react";
import { AuthCtx, roleProfiles } from "./useAuth";

const STORAGE_KEY = "sahayog:user";

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  function login(role) {
    const profile = roleProfiles[role];
    if (!profile) return null;
    const account = { ...profile, role };
    setUser(account);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
    return account;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}