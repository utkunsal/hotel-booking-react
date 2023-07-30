import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { Route, Routes, Navigate } from "react-router-dom";
import Search from "./pages/Search";
import Reviews from "./pages/Reviews";
import HotelDetails from "./pages/HotelDetails";
import PageNotFound from "./pages/PageNotFound";
import { AuthContextProvider } from "./context/AuthContext";

function App() {
  return (
    <>
      <AuthContextProvider>
        <Layout>
          <Routes>
            <Route path="*" element={<Navigate to="/404" />}/>
            <Route path="/404" element={<PageNotFound />} />
            <Route path="/" element={<Navigate to="/search" />}/>
            <Route path="/search" element={<Search />}></Route>
            <Route path="/hotels/:hotelId" element={<HotelDetails />}></Route>
            <Route path="/reviews" element={
              <ProtectedRoute accessBy="authenticated">
                <Reviews source={"user"} size={2} includeHotelName={true}/>
              </ProtectedRoute>
            }></Route>
          </Routes>
        </Layout>
      </AuthContextProvider>
    </>
  );
}

export default App;
