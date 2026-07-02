import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import Notification from "../components/Notification";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [usernameStatus, setUsernameStatus] = useState({
        available: null,
        message: "",
        suggestions: []
    });
    const [checkingUsername, setCheckingUsername] = useState(false);
    const [notification, setNotification] = useState(null);
    const [otp, setOtp] = useState("");
    const [verificationStage, setVerificationStage] = useState(false);
    const navigate = useNavigate();

    // Debounced username check
    useEffect(() => {
        const timer = setTimeout(() => {
            if (username && username.length >= 3) {
                checkUsername(username);
            } else {
                setUsernameStatus({ available: null, message: "", suggestions: [] });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [username]);

    const checkUsername = async (usernameToCheck) => {
        setCheckingUsername(true);
        try {
            const { data } = await axiosInstance.post("/users/check-username", {
                username: usernameToCheck
            });
            setUsernameStatus({
                available: data.available,
                message: data.message,
                suggestions: data.suggestions || []
            });
        } catch (err) {
            console.error("Username check failed:", err);
        } finally {
            setCheckingUsername(false);
        }
    };

    const handleSuggestionClick = (suggestedUsername) => {
        setUsername(suggestedUsername);
        setUsernameStatus({
            available: true,
            message: "Username is available",
            suggestions: []
        });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        // Check if username is available
        if (usernameStatus.available === false) {
            setNotification({
                message: "Please choose an available username or use one of the suggestions",
                type: "error"
            });
            return;
        }

        if (usernameStatus.available === null && username.length >= 3) {
            setNotification({
                message: "Please wait for username validation",
                type: "warning"
            });
            return;
        }

        try {
            await axiosInstance.post("/users/register", { username, email, password });
            localStorage.setItem("pendingEmail", email);
            setVerificationStage(true);
            setNotification({
                message: "Registration successful! Enter the OTP sent to your email.",
                type: "success"
            });
        } catch (err) {
            setNotification({
                message: err.response?.data?.message || "Registration failed",
                type: "error"
            });
        }
    };

    const verifyOtpHandler = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post("/users/verify-otp", { email, otp });
            localStorage.removeItem("pendingEmail");
            setNotification({
                message: "Account verified successfully! You can now log in.",
                type: "success"
            });
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setNotification({
                message: err.response?.data?.message || "OTP verification failed",
                type: "error"
            });
        }
    };

    const resendOtpHandler = async () => {
        try {
            await axiosInstance.post("/users/resend-otp", { email });
            setNotification({
                message: "A new OTP has been sent to your email.",
                type: "success"
            });
        } catch (err) {
            setNotification({
                message: err.response?.data?.message || "Failed to resend OTP",
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
                <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "800", marginBottom: "8px", background: "linear-gradient(135deg, #ef4444, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Create Account</h1>
                <p style={{ textAlign: "center", color: "#9ca3af", marginBottom: "32px" }}>Join the GameHub community</p>
                <form onSubmit={verificationStage ? verifyOtpHandler : submitHandler} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                        <input 
                            type="text" 
                            placeholder="Username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required
                            style={{ 
                                padding: "14px 16px", 
                                borderRadius: "12px", 
                                border: `1px solid ${usernameStatus.available === true ? 'rgba(34,197,94,0.5)' : usernameStatus.available === false ? 'rgba(239,68,68,0.5)' : 'rgba(239,68,68,0.2)'}`, 
                                background: "rgba(255,255,255,0.05)", 
                                color: "#fff", 
                                fontSize: "1rem", 
                                outline: "none",
                                width: "100%"
                            }} 
                        />
                        {checkingUsername && (
                            <p style={{ color: "#9ca3af", fontSize: "0.875rem", marginTop: "4px" }}>Checking availability...</p>
                        )}
                        {!checkingUsername && usernameStatus.message && (
                            <p style={{ 
                                color: usernameStatus.available ? '#22c55e' : '#ef4444', 
                                fontSize: "0.875rem", 
                                marginTop: "4px" 
                            }}>
                                {usernameStatus.message}
                            </p>
                        )}
                        {usernameStatus.suggestions.length > 0 && (
                            <div style={{ marginTop: "8px", padding: "12px", borderRadius: "8px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                                <p style={{ color: "#9ca3af", fontSize: "0.875rem", marginBottom: "8px" }}>Try these available usernames:</p>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                    {usernameStatus.suggestions.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            style={{
                                                padding: "6px 12px",
                                                borderRadius: "6px",
                                                border: "1px solid rgba(239,68,68,0.3)",
                                                background: "rgba(239,68,68,0.1)",
                                                color: "#ef4444",
                                                fontSize: "0.875rem",
                                                cursor: "pointer",
                                                transition: "all 0.2s"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = "rgba(239,68,68,0.2)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = "rgba(239,68,68,0.1)";
                                            }}
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                        style={{ padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(239,68,68,0.2)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "1rem", outline: "none" }} 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                        style={{ padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(239,68,68,0.2)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "1rem", outline: "none" }} 
                    />
                    {verificationStage ? (
                        <>
                            <input 
                                type="text" 
                                placeholder="Enter OTP" 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value)} 
                                required
                                style={{ padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(239,68,68,0.2)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "1rem", outline: "none" }} 
                            />
                            <button 
                                type="submit"
                                style={{ 
                                    padding: "14px", 
                                    borderRadius: "12px", 
                                    border: "none", 
                                    background: "linear-gradient(135deg, #22c55e, #14b8a6)", 
                                    color: "#fff", 
                                    fontSize: "1rem", 
                                    fontWeight: "700", 
                                    cursor: "pointer",
                                    marginTop: "8px"
                                }}
                            >
                                Verify OTP
                            </button>
                            <button 
                                type="button"
                                onClick={resendOtpHandler}
                                style={{ 
                                    padding: "14px", 
                                    borderRadius: "12px", 
                                    border: "1px solid rgba(239,68,68,0.2)", 
                                    background: "transparent", 
                                    color: "#ef4444", 
                                    fontSize: "1rem", 
                                    fontWeight: "700", 
                                    cursor: "pointer",
                                    marginTop: "8px"
                                }}
                            >
                                Resend OTP
                            </button>
                        </>
                    ) : (
                        <button 
                            type="submit"
                            disabled={usernameStatus.available === false}
                            style={{ 
                                padding: "14px", 
                                borderRadius: "12px", 
                                border: "none", 
                                background: usernameStatus.available === false ? "rgba(239,68,68,0.5)" : "linear-gradient(135deg, #dc2626, #ea580c)", 
                                color: "#fff", 
                                fontSize: "1rem", 
                                fontWeight: "700", 
                                cursor: usernameStatus.available === false ? "not-allowed" : "pointer",
                                marginTop: "8px",
                                opacity: usernameStatus.available === false ? 0.6 : 1
                            }}
                        >
                            Create Account
                        </button>
                    )}
                    <p style={{ textAlign: "center", margin: "8px 0 0", color: "#9ca3af" }}>
                        Already have an account? <Link to="/login" style={{ color: "#ef4444", textDecoration: "none", fontWeight: "600" }}>Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;