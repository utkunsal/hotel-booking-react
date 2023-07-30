import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import PopupLoginForm from "./forms/PopupLoginForm";
import PopupRegisterForm from "./forms/PopupRegisterForm";

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const [isLoginPopupOpen, setLoginPopupOpen] = useState(false);
  const [isRegisterPopupOpen, setRegisterPopupOpen] = useState(false);

  const handleOpenLoginPopup = () => {
    if (!user) {
      setLoginPopupOpen(true);
    }
  };

  const handleCloseLoginPopup = () => {
    setLoginPopupOpen(false);
  };

  const handleOpenRegisterPopup = () => {
    if (!user) {
      setRegisterPopupOpen(true);
    }
  };

  const handleCloseRegisterPopup = () => {
    setRegisterPopupOpen(false);
  };

  return (
    <>
      <header className="header">
        <nav className="nav">
          <Link to="/search" className="nav-link">
            Search
          </Link>
          {true && (
            <Link to="/reviews" className="nav-link" onClick={handleOpenLoginPopup}>
              Reviews
            </Link>
          )}
          <div className="nav-right">
            {user && <span className="nav-username">{user.name}</span>}
            {!user && (
              <>
                <button className="auth-button" onClick={handleOpenLoginPopup}>
                  Sign In
                </button>
                <button className="auth-button" onClick={handleOpenRegisterPopup}>
                  Create Account
                </button>
              </>
            )}
            {user && (
              <button className="auth-button" onClick={() => logout()}>
                Logout
              </button>
            )}
          </div>
        </nav>
      </header>
      <main className="container">{children}</main>
      <PopupLoginForm isOpen={isLoginPopupOpen} onClose={handleCloseLoginPopup} openRegister={handleOpenRegisterPopup}/>
      <PopupRegisterForm isOpen={isRegisterPopupOpen} onClose={handleCloseRegisterPopup} openLogin={handleOpenLoginPopup} />
    </>
  );
};
 
export default Layout;