import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import PopupLoginForm from "./forms/PopupLoginForm";
import PopupRegisterForm from "./forms/PopupRegisterForm";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';

const Layout = ({ children }) => {
  const { 
    user, logout,
    isLoginPopupOpen, isRegisterPopupOpen,
    handleOpenLoginPopup, handleCloseLoginPopup,
    handleOpenRegisterPopup, handleCloseRegisterPopup,
  } = useContext(AuthContext);

  return (
    <>
      <header className="header">
        <nav className="nav">
          <Link to="/search" className="nav-link">
            Search
          </Link>
          <Link to="/reviews" className="nav-link" onClick={handleOpenLoginPopup}>
            Reviews
          </Link>
          <Link to="/bookings" className="nav-link" onClick={handleOpenLoginPopup}>
            Bookings
          </Link>
          <div className="nav-right">
            {user ? 
              <>
                <div className="nav-user">
                  {user.name} 
                  <FontAwesomeIcon icon={faUser} style={{ marginLeft: 5, fontSize: 11 }} />
                </div>
                <button className="header-auth-button logout-button" onClick={() => logout()}>
                  <FontAwesomeIcon icon={faArrowRightFromBracket} style={{ fontSize: 14 }} />
                </button>
              </>
            :
              <>
                <button className="header-auth-button" onClick={handleOpenLoginPopup}>
                  Sign In
                </button>
                <button className="header-auth-button" onClick={handleOpenRegisterPopup}>
                  Create Account
                </button>
              </>
            }
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