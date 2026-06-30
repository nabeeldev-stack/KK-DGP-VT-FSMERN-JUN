import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import Notification from "../components/Notification";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axiosInstance.post("/users/login", { email, password });
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("user", JSON.stringify(data.user));
            // Notify Navbar to update
            window.dispatchEvent(new Event("user-updated"));
            setNotification({
                message: "Login successful!",
                type: "success"
            });
            setTimeout(() => {
                navigate(data.user?.role === "admin" ? "/admin-dashboard" : "/");
            }, 1000);
        } catch (err) {
            setNotification({
                message: err.response?.data?.message || "Login failed",
                type: "error"
            });
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1a0000, #0a0a0b, #120000)", padding: "20px" }}>
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            <div style={{ maxWidth: "420px", width: "100%", padding: "40px", borderRadius: "20px", border: "1px solid rgba(239,68,68,0.2)", background: "rgba(255,255,255,0.03)", backdropFilter: "blur(16px)" }}>
                <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "800", marginBottom: "8px", background: "linear-gradient(135deg, #ef4444, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Welcome Back</h1>
                <p style={{ textAlign: "center", color: "#9ca3af", marginBottom: "32px" }}>Sign in to your GameHub account</p>
                <form onSubmit={submitHandler} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
                        style={{ padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(239,68,68,0.2)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "1rem", outline: "none" }} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
                        style={{ padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(239,68,68,0.2)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "1rem", outline: "none" }} />
                    <button type="submit"
                        style={{ padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #dc2626, #ea580c)", color: "#fff", fontSize: "1rem", fontWeight: "700", cursor: "pointer", marginTop: "8px" }}>
                        Sign In
                    </button>
                    <p style={{ textAlign: "center", margin: "8px 0 0", color: "#9ca3af" }}>
                        <Link to="/forgot-password" style={{ color: "#ef4444", textDecoration: "none" }}>Forgot Password?</Link>
                    </p>
                    <p style={{ textAlign: "center", margin: "4px 0 0", color: "#9ca3af" }}>
                        Don't have an account? <Link to="/register" style={{ color: "#ef4444", textDecoration: "none", fontWeight: "600" }}>Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;