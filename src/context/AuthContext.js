import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

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
    navigate("/");
  };

  customAxios.setLogoutFunction(clearUser);

  return (
    <>
      <AuthContext.Provider value={{ user, login, register, logout }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};
 
export default AuthContext;