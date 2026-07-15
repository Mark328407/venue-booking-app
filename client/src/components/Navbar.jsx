import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          Venuelist
        </Link>
        <nav className="navbar-links">
          <Link to="/">Browse</Link>
          {user && <Link to="/my-bookings">My Bookings</Link>}
          {user ? (
            <button onClick={handleLogout}>Log out</button>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register" className="navbar-cta">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
