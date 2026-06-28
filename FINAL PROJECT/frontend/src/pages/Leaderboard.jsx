import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";

function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const { data } = await axiosInstance.get("/scores/leaderboard");
                setLeaderboard(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (loading) return <h2>Loading...</h2>;

    return (
        <div className="container">
            <h1>🏆 Leaderboard</h1>
            
            {leaderboard.length === 0 ? (
                <p>No scores yet. Be the first to play!</p>
            ) : (
                <div style={{ maxWidth: "600px", margin: "20px auto" }}>
                    {leaderboard.map((player) => (
                        <div
                            key={player.rank}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "15px",
                                margin: "10px 0",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                backgroundColor: player.rank <= 3 ? "#ffd700" : "#f9f9f9"
                            }}
                        >
                            <div>
                                <span style={{ fontSize: "1.5rem", marginRight: "15px" }}>
                                    #{player.rank}
                                </span>
                                <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                                    {player.username}
                                </span>
                            </div>
                            <div style={{ fontSize: "1.2rem", color: "#333" }}>
                                {player.bestScore} pts
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Leaderboard;