import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
 
const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  return (
    <>
      <header className="header">
        <nav className="nav">
          <Link to="/search" className="nav-link">
            Search
          </Link>
          {user && (
            <Link to="/reviews" className="nav-link">
              Reviews
            </Link>
          )}
          <div className="nav-right">
            {user && <span className="nav-username">{user.name}</span>}
            {!user && (
              <Link to="/login" className="nav-link">
                Login
              </Link>
            )}
            {user && (
              <button className="logout-button" onClick={() => logout()}>
                Logout
              </button>
            )}
          </div>
        </nav>
      </header>
      <main className="container">{children}</main>
    </>
  );
};
 
export default Layout;