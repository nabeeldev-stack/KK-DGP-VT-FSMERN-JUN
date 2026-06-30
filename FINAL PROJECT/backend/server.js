const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const errorHandler = require("./middleware/errorMiddleware");
const helmet = require("helmet");
dotenv.config();

const connectDB = require("./config/db");

connectDB();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.get("/", (req, res) => {
    res.send("Gaming Platform API Running");
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const { setupSocket } = require("./socket/socketHandler");
setupSocket(io);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const friendRoutes = require("./routes/friendRoutes");
app.use("/api/friends", friendRoutes);

const gameRoutes = require("./routes/gameRoutes")
app.use("/api/games", gameRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const siteRoutes = require("./routes/siteRoutes");
app.use("/api/site", siteRoutes);

const chatRoutes = require("./routes/chatRoutes");
app.use("/api/chat", chatRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});