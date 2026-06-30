import { Navigate } from "react-router-dom";

function PublicOnlyRoute({ children }) {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");

    // If user is already logged in, redirect to home
    if (token && user) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default PublicOnlyRoute;