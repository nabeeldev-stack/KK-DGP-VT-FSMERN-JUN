import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axiosInstance.post(`/users/resetpassword/${token}`, { password });
            setMessage(data.message || "Password reset successful");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1a0000, #0a0a0b, #120000)", padding: "20px" }}>
            <div style={{ maxWidth: "420px", width: "100%", padding: "40px", borderRadius: "20px", border: "1px solid rgba(239,68,68,0.2)", background: "rgba(255,255,255,0.03)", backdropFilter: "blur(16px)" }}>
                <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "800", marginBottom: "8px", background: "linear-gradient(135deg, #ef4444, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Reset Password</h1>
                <p style={{ textAlign: "center", color: "#9ca3af", marginBottom: "32px" }}>Enter your new password</p>
                <form onSubmit={submitHandler} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} required
                        style={{ padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(239,68,68,0.2)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "1rem", outline: "none" }} />
                    <button type="submit" disabled={loading}
                        style={{ padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #dc2626, #ea580c)", color: "#fff", fontSize: "1rem", fontWeight: "700", cursor: "pointer", marginTop: "8px", opacity: loading ? 0.6 : 1 }}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                    {message && <p style={{ textAlign: "center", color: "#ef4444", marginTop: "8px" }}>{message}</p>}
                    <p style={{ textAlign: "center", margin: "8px 0 0", color: "#9ca3af" }}>
                        <Link to="/login" style={{ color: "#ef4444", textDecoration: "none" }}>Back to Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;