import express from "express";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Database Connection (XAMPP)
const db = mysql.createConnection({
    host: "localhost",
    user: "root",  // Default XAMPP username
    password: "",  // Default XAMPP password (empty)
    database: "galactic_tower_defense_td"
});

db.connect(err => {
    if (err) throw err;
    console.log("✅ Connected to MySQL");
});

// 🔑 SIGNUP (New User Registration)
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    // Check if username already exists
    db.query("SELECT * FROM global_players_db WHERE playerName = ?", [username], async (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length > 0) return res.status(400).json({ error: "Username already taken" });

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new player into database
        db.query("INSERT INTO global_players_db (playerName, playerPassword) VALUES (?, ?)", 
            [username, hashedPassword], 
            (err, result) => {
                if (err) return res.status(500).json({ error: "Error creating account" });
                res.json({ message: "Account created successfully!" });
        });
    });
});

// 🔐 LOGIN (Authenticate User)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if user exists
    db.query("SELECT * FROM global_players_db WHERE playerName = ?", [username], async (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length === 0) return res.status(400).json({ error: "User not found" });

        const user = results[0];

        // Compare password with stored hash
        const isMatch = await bcrypt.compare(password, user.playerPassword);
        if (!isMatch) return res.status(400).json({ error: "Invalid password" });

        res.json({ message: "Login successful!" });
    });
});

// 🚀 Start the backend server on a different port (e.g., 5002)
app.listen(3100, () => {
    console.log("✅ Server running on port 5002");
});
