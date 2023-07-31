import { createContext, useState } from "react";
import customAxios from "../services/api";

const AuthContext = createContext();
 
export const AuthContextProvider = ({ children }) => {
  
    const [user, setUser] = useState(() => {
    let userProfle = localStorage.getItem("userProfile");
    if (userProfle) {
      return JSON.parse(userProfle);
    }
    return null;
  });

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

  const login = async (payload, onClose) => {
    const response = await customAxios.post("/auth/authenticate", payload, {
      withCredentials: true,
    });
    if(response?.data){
      localStorage.setItem("userProfile", JSON.stringify(response.data));
      setUser(response.data);
      onClose();
      return response.data
    }
    return null
  };

  const register = async (payload, onClose) => {
    await customAxios.post("/auth/register", payload, {
      withCredentials: false,
    });
    return login(payload, onClose);
  };

  const logout = async () => {
    await customAxios.post("/auth/logout", {}, {withCredentials: true});
    clearUser();
  };

  const clearUser = async () => {
    localStorage.removeItem("userProfile");
    setUser(null);
  };

  customAxios.setLogoutFunction(clearUser);

  return (
    <>
      <AuthContext.Provider value={{ 
        user, login, register, logout,
        isLoginPopupOpen, isRegisterPopupOpen,
        handleOpenLoginPopup, handleCloseLoginPopup,
        handleOpenRegisterPopup, handleCloseRegisterPopup, 
        }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};
 
export default AuthContext;