import { useState, useEffect } from "react";

function Notification({ message, type = "info", onClose }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, 4000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!isVisible) return null;

    const getTypeStyles = () => {
        switch (type) {
            case "success":
                return {
                    background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))",
                    border: "1px solid rgba(34,197,94,0.4)",
                    icon: "✓",
                    iconColor: "#22c55e"
                };
            case "error":
                return {
                    background: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))",
                    border: "1px solid rgba(239,68,68,0.4)",
                    icon: "✕",
                    iconColor: "#ef4444"
                };
            case "warning":
                return {
                    background: "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(249,115,22,0.05))",
                    border: "1px solid rgba(249,115,22,0.4)",
                    icon: "⚠",
                    iconColor: "#f97316"
                };
            default:
                return {
                    background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))",
                    border: "1px solid rgba(59,130,246,0.4)",
                    icon: "ℹ",
                    iconColor: "#3b82f6"
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            animation: "slideIn 0.3s ease-out",
            maxWidth: "400px",
            width: "100%"
        }}>
            <div style={{
                padding: "16px 20px",
                borderRadius: "12px",
                background: styles.background,
                border: styles.border,
                backdropFilter: "blur(16px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                display: "flex",
                alignItems: "center",
                gap: "12px"
            }}>
                <div style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: `${styles.iconColor}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                }}>
                    <span style={{
                        color: styles.iconColor,
                        fontSize: "16px",
                        fontWeight: "bold"
                    }}>
                        {styles.icon}
                    </span>
                </div>
                <p style={{
                    color: "#fff",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    flex: 1,
                    margin: 0,
                    lineHeight: "1.4"
                }}>
                    {message}
                </p>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(onClose, 300);
                    }}
                    style={{
                        background: "transparent",
                        border: "none",
                        color: "#9ca3af",
                        fontSize: "20px",
                        cursor: "pointer",
                        padding: "0 4px",
                        lineHeight: 1,
                        transition: "color 0.2s"
                    }}
                    onMouseEnter={(e) => e.target.style.color = "#fff"}
                    onMouseLeave={(e) => e.target.style.color = "#9ca3af"}
                >
                    ×
                </button>
            </div>
            <style>
                {`
                    @keyframes slideIn {
                        from {
                            transform: translateX(400px);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                `}
            </style>
        </div>
    );
}

export default Notification;