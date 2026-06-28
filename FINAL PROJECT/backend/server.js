const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const errorHandler = require("./middleware/errorMiddleware");
const helmet = require("helmet");
dotenv.config();

const connectDB = require("./config/db");

connectDB();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Gaming Platform API Running");
});

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);


const gameRoutes = require("./routes/gameRoutes")
app.use("/api/games", gameRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const siteRoutes = require("./routes/siteRoutes");
app.use("/api/site", siteRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

