import express from "express";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// ✅ MySQL Database Connection (CSE442 Server)
const db = mysql.createConnection({
    host: "localhost",  // Change if MySQL is remote
    user: "mashfiqu",  
    password: "50380344",  
    database: "global_players_db"
});

db.connect(err => {
    if (err) {
        console.error("❌ Database connection failed:", err);
        process.exit(1);
    }
    console.log("✅ Connected to MySQL (global_players_db)");
});

// ✅ JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// ✅ REGISTER (Signup)
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
    }

    try {
        db.query("SELECT * FROM players WHERE playerName = ?", [username], async (err, results) => {
            if (err) {
                console.error("❌ Database error (checking user):", err);
                return res.status(500).json({ error: "Database error." });
            }
            if (results.length > 0) {
                return res.status(400).json({ error: "Username already taken." });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            db.query("INSERT INTO players (playerName, playerPassword, playerAccountLvl) VALUES (?, ?, ?)", 
                [username, hashedPassword, 1],  // Default account level 1
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

// ✅ LOGIN (Authenticate User & Return JWT)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
    }

    db.query("SELECT * FROM players WHERE playerName = ?", [username], async (err, results) => {
        if (err) {
            console.error("❌ Database error (login):", err);
            return res.status(500).json({ error: "Database error." });
        }
        if (results.length === 0) {
            return res.status(400).json({ error: "User not found." });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.playerPassword);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password." });
        }

        // ✅ Generate JWT Token
        const token = jwt.sign({ id: user.playerID, username: user.playerName }, JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login successful!", token });
    });
});

// ✅ PROTECTED ROUTE (Example)
app.get("/protected", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access denied" });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        res.json({ message: "You accessed a protected route!", user: decoded });
    });
});

// ✅ Start Backend Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
