import { useState } from "react";
import { Toaster } from "./Toast";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function AppLayout({ role = "customer", title, subtitle, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar role={role} open={open} onClose={() => setOpen(false)} />

      <div className="app-main">
        <Topbar title={title} subtitle={subtitle} onMenuClick={() => setOpen(true)} />

        <main className="app-content">
          <div className="content-inner">{children}</div>
        </main>
      </div>

      <Toaster />
    </div>
  );
}

export default AppLayout;