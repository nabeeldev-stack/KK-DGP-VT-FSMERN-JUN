import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Games from "./pages/Games";
import AddGame from "./pages/AddGame";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoutes";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword"
import AdminDashboard from "./pages/AdminDashboard";
import TopGames from "./pages/TopGames";
import GameDetails from "./pages/GameDetails";
import EditGame from "./pages/EditGame";
import VerifyOtp from "./pages/VerifyOtp";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOtp />}
        />

        <Route 
           path="/games"
           element={<Games />}
           />

           <Route 
             path="/add-game"
             element={
                <AdminRoute>
                  <AddGame />
                </AdminRoute>
             }
             />

             <Route
    path="/admin-dashboard"
    element={
        <AdminRoute>
            <AdminDashboard />
        </AdminRoute>
    }
/>
<Route
    path="/top-games"
    element={<TopGames />}
/>

<Route
    path="/games/:id"
    element={<GameDetails />}
/>

        <Route
            path="/games/edit/:id"
            element={
                <AdminRoute>
                    <EditGame />
                </AdminRoute>
            }
        />


      </Routes>

    </BrowserRouter>
  );
}

export default App;