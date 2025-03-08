import express from "express";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));

// Database Connection Pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// SIGNUP (New User Registration)
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username and password are required." });

    try {
        const [users] = await pool.query("SELECT * FROM global_players_db WHERE playerName = ?", [username]);
        if (users.length > 0) return res.status(400).json({ error: "Username already taken." });

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query("INSERT INTO global_players_db (playerName, playerPassword, playerAccountLvl) VALUES (?, ?, ?)", [username, hashedPassword, 1]);

        res.json({ message: "Account created successfully!" });
    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ error: "Server error." });
    }
});

// LOGIN (Authenticate User)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username and password are required." });

    try {
        const [users] = await pool.query("SELECT * FROM global_players_db WHERE playerName = ?", [username]);
        if (users.length === 0) return res.status(400).json({ error: "User not found." });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.playerPassword);
        if (!isMatch) return res.status(400).json({ error: "Invalid password." });

        res.json({ message: "Login successful!" });
    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ error: "Server error." });
    }
});

// Start the backend server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
