import { Navigate } from "react-router-dom";

function RestrictedRoute({ children }) {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");

    // If user is not logged in, redirect to login
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default RestrictedRoute;