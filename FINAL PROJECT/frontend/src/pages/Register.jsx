import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post("/users/register", { username, email, password });
            navigate("/verify-otp", { state: { email } });
        } catch (err) {
            alert(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#050816", padding: "20px" }}>
            <div style={{ maxWidth: "420px", width: "100%", padding: "40px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", backdropFilter: "blur(16px)" }}>
                <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "800", marginBottom: "8px", background: "linear-gradient(135deg, #818cf8, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Create Account</h1>
                <p style={{ textAlign: "center", color: "#64748b", marginBottom: "32px" }}>Join the GameHub community</p>
                <form onSubmit={submitHandler} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required
                        style={{ padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "1rem", outline: "none" }} />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
                        style={{ padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "1rem", outline: "none" }} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
                        style={{ padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "1rem", outline: "none" }} />
                    <button type="submit"
                        style={{ padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: "1rem", fontWeight: "700", cursor: "pointer", marginTop: "8px" }}>
                        Create Account
                    </button>
                    <p style={{ textAlign: "center", margin: "8px 0 0", color: "#64748b" }}>
                        Already have an account? <Link to="/login" style={{ color: "#818cf8", textDecoration: "none", fontWeight: "600" }}>Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;