import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function BackButton({ children = "Back", className = "" }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className={`back-btn ${className}`.trim()}
      onClick={() => navigate(-1)}
      aria-label={typeof children === "string" ? children : "Go back"}
    >
      <ArrowLeft size={16} />
      <span>{children}</span>
    </button>
  );
}

export default BackButton;