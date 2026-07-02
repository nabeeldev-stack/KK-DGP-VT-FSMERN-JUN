import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import Games from "./pages/Games";
import AddGame from "./pages/AddGame";
import Friends from "./pages/Friends";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoutes";
import RestrictedRoute from "./components/RestrictedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
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
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <RestrictedRoute>
              <Profile />
            </RestrictedRoute>
          }
        />

        <Route
          path="/user/:userId"
          element={
            <RestrictedRoute>
              <UserProfile />
            </RestrictedRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicOnlyRoute>
              <ForgotPassword />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/reset-password/:token"
          element={
            <PublicOnlyRoute>
              <ResetPassword />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/verify-otp"
          element={
            <PublicOnlyRoute>
              <VerifyOtp />
            </PublicOnlyRoute>
          }
        />

        <Route 
           path="/games"
           element={
            <RestrictedRoute>
              <Games />
            </RestrictedRoute>
           }
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
    element={
      <RestrictedRoute>
        <TopGames />
      </RestrictedRoute>
    }
/>

<Route
    path="/games/:id"
    element={
      <RestrictedRoute>
        <GameDetails />
      </RestrictedRoute>
    }
/>

        <Route
            path="/games/edit/:id"
            element={
                <AdminRoute>
                    <EditGame />
                </AdminRoute>
            }
        />

        <Route
            path="/friends"
            element={
                <RestrictedRoute>
                    <Friends />
                </RestrictedRoute>
            }
        />


      </Routes>

    </BrowserRouter>
  );
}

export default App;