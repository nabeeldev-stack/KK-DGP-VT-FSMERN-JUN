import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get("/users/profile");
                setUser(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#050816", color: "#fff" }}>
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#050816", color: "#fff", padding: "100px 20px 40px" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ padding: "40px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", backdropFilter: "blur(16px)" }}>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "8px", background: "linear-gradient(135deg, #818cf8, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Dashboard</h1>
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "24px", color: "#e2e8f0" }}>Welcome {user?.username}!</h2>
                    <div style={{ padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)", marginBottom: "24px" }}>
                        <p style={{ marginBottom: "8px" }}><strong style={{ color: "#818cf8" }}>Email:</strong> {user?.email}</p>
                        <p style={{ marginBottom: "8px" }}><strong style={{ color: "#818cf8" }}>Role:</strong> {user?.role}</p>
                        {user?.isBanned && <p style={{ color: "#ef4444", fontWeight: "600" }}>This account is banned</p>}
                    </div>
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        <Link to="/games"
                            style={{ padding: "12px 24px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: "1rem", fontWeight: "700", cursor: "pointer", textDecoration: "none" }}>
                            Browse Games
                        </Link>
                        <button onClick={logout}
                            style={{ padding: "12px 24px", borderRadius: "12px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.1)", color: "#ef4444", fontSize: "1rem", fontWeight: "700", cursor: "pointer" }}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;