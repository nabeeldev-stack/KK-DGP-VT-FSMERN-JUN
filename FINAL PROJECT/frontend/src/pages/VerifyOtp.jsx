import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

function VerifyOtp() {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || "";

    const verifyHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosInstance.post("/users/verify-otp", { email, otp });
            setMessage("Account verified successfully");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setMessage(err.response?.data?.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        setLoading(true);
        try {
            await axiosInstance.post("/users/resend-otp", { email });
            setMessage("A new OTP has been sent to your email");
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to resend OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1a0000, #0a0a0b, #120000)", padding: "20px" }}>
            <div style={{ maxWidth: "420px", width: "100%", padding: "40px", borderRadius: "20px", border: "1px solid rgba(239,68,68,0.2)", background: "rgba(255,255,255,0.03)", backdropFilter: "blur(16px)" }}>
                <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "800", marginBottom: "8px", background: "linear-gradient(135deg, #ef4444, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Verify OTP</h1>
                <p style={{ textAlign: "center", color: "#9ca3af", marginBottom: "8px" }}>Enter the verification code sent to:</p>
                <p style={{ textAlign: "center", color: "#ef4444", fontWeight: "600", marginBottom: "32px" }}>{email}</p>
                <form onSubmit={verifyHandler} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required
                        style={{ padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(239,68,68,0.2)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "1rem", outline: "none", textAlign: "center", letterSpacing: "8px" }} />
                    <button type="submit" disabled={loading}
                        style={{ padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #dc2626, #ea580c)", color: "#fff", fontSize: "1rem", fontWeight: "700", cursor: "pointer", marginTop: "4px", opacity: loading ? 0.6 : 1 }}>
                        {loading ? "Verifying..." : "Verify"}
                    </button>
                    <button type="button" onClick={resendOtp} disabled={loading}
                        style={{ padding: "12px", borderRadius: "12px", border: "1px solid rgba(239,68,68,0.2)", background: "transparent", color: "#ef4444", fontSize: "0.9rem", fontWeight: "600", cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
                        Resend OTP
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

export default VerifyOtp;