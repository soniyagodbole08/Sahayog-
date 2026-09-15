import { useRef, useState } from "react";
import { CheckCircle2, XCircle, Info } from "lucide-react";
import { ToastCtx } from "../useToast";

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timer = useRef(null);

  const push = (message, type = "success", duration = 3200) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, duration);
  };

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="toast-stack">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.type === "success" && <CheckCircle2 size={18} />}
            {t.type === "error" && <XCircle size={18} />}
            {t.type === "info" && <Info size={18} />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function Toaster() {
  return null;
}