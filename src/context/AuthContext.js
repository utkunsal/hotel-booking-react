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

  const login = async (payload) => {
    /* const response1 = await customAxios.post("/auth/register", payload, {
      withCredentials: false,
    }); */
    const response = await customAxios.post("/auth/authenticate", payload, {
      withCredentials: true,
    });
    localStorage.setItem("userProfile", JSON.stringify(response.data));
    setUser(response.data);
    navigate("/");
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
      <AuthContext.Provider value={{ user, login, logout }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};
 
export default AuthContext;