import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function NotFound() {
  return (
    <div className="page-wrap">
      <Navbar />
      <div className="page-inner center-col">
        <div className="empty-state large">
          <div className="notfound-icon">
            <Compass size={40} />
          </div>
          <span className="mono huge">404</span>
          <h1>Page not on this map</h1>
          <p>
            The page you're looking for doesn't exist or has moved.
            Let's get you back on track.
          </p>
          <div className="btn-row center">
            <Link to="/" className="btn btn-primary">
              Go Home
            </Link>
            <Link to="/services" className="btn btn-outline">
              Browse Services
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default NotFound;