import axios from "axios";
import { API_BASE_URL } from "../config";


const customAxios = axios.create({
  baseURL: API_BASE_URL
});

let logoutFunction = null;
customAxios.setLogoutFunction = (logout) => {
  logoutFunction = logout;
};

customAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest.headers['X-Refresh-Request']) {
        try{
          await customAxios.post("/auth/refresh",{}, {
            withCredentials: true,
            headers: {
              'X-Refresh-Request': true 
            } ,
          })
          return axios(originalRequest);
        } catch(err) {
          logoutFunction();
          return Promise.resolve();
        }
      } else {
        return Promise.reject(error);
      }
    }
  );

export default customAxios;