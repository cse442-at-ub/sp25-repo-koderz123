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
    user: "root",  
    password: "",  
    database: "galactic_tower_defense_td"
});

db.connect(err => {
    if (err) {
        console.error("❌ Database connection failed:", err);
        process.exit(1); // Stop server if DB fails to connect
    }
    console.log("✅ Connected to MySQL");
});

//  SIGNUP (New User Registration)
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
    }

    try {
        // Check if username already exists
        db.query("SELECT * FROM global_players_db WHERE playerName = ?", [username], async (err, results) => {
            if (err) {
                console.error("❌ Database error (checking user):", err);
                return res.status(500).json({ error: "Database error." });
            }
            if (results.length > 0) {
                return res.status(400).json({ error: "Username already taken." });
            }

            // Hash password before storing
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert new player into database
            db.query("INSERT INTO global_players_db (playerName, playerPassword, playerAccountLvl) VALUES (?, ?, ?)", 
                [username, hashedPassword, 1], // Default account level is 1
                (err, result) => {
                    if (err) {
                        console.error("❌ Error inserting user:", err);
                        return res.status(500).json({ error: "Error creating account." });
                    }
                    console.log("✅ New user created:", username);
                    res.json({ message: "Account created successfully!" });
                }
            );
        });
    } catch (error) {
        console.error("❌ Unexpected error:", error);
        res.status(500).json({ error: "Server error." });
    }
});

//  LOGIN (Authenticate User)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
    }

    db.query("SELECT * FROM global_players_db WHERE playerName = ?", [username], async (err, results) => {
        if (err) {
            console.error("❌ Database error (login):", err);
            return res.status(500).json({ error: "Database error." });
        }
        if (results.length === 0) {
            return res.status(400).json({ error: "User not found." });
        }

        const user = results[0];

        // Compare password with stored hash
        const isMatch = await bcrypt.compare(password, user.playerPassword);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password." });
        }

        res.json({ message: "Login successful!" });
    });
});

//  Start the backend server
const PORT = 3100;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
