import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Reviews from "./pages/Reviews";
import { AuthContextProvider } from "./context/AuthContext";

function App() {
  return (
    <>
      <AuthContextProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/login" element={
              <ProtectedRoute accessBy="non-authenticated">
                <Login />
              </ProtectedRoute>
            }></Route>
            <Route path="/reviews" element={
              <ProtectedRoute accessBy="authenticated">
                <Reviews />
              </ProtectedRoute>
            }></Route>
          </Routes>
        </Layout>
      </AuthContextProvider>
    </>
  );
}

export default App;
