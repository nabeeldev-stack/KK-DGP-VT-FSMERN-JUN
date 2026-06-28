import { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axiosInstance.post("/users/forgotpassword", { email });
            setMessage(data.message || "Reset link sent to your email");
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to send reset link");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#050816", padding: "20px" }}>
            <div style={{ maxWidth: "420px", width: "100%", padding: "40px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", backdropFilter: "blur(16px)" }}>
                <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "800", marginBottom: "8px", background: "linear-gradient(135deg, #818cf8, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Forgot Password</h1>
                <p style={{ textAlign: "center", color: "#64748b", marginBottom: "32px" }}>Enter your email to receive a reset link</p>
                <form onSubmit={submitHandler} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required
                        style={{ padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "1rem", outline: "none" }} />
                    <button type="submit" disabled={loading}
                        style={{ padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: "1rem", fontWeight: "700", cursor: "pointer", marginTop: "8px", opacity: loading ? 0.6 : 1 }}>
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                    {message && <p style={{ textAlign: "center", color: "#818cf8", marginTop: "8px" }}>{message}</p>}
                    <p style={{ textAlign: "center", margin: "8px 0 0", color: "#64748b" }}>
                        <Link to="/login" style={{ color: "#818cf8", textDecoration: "none" }}>Back to Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;