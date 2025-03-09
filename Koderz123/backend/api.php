<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

session_start();
$host = "localhost";
$dbname = "global_players_db";
$user = "mashfiqu";
$pass = "50380344";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

// Helper function to read JSON request body
function getJSONInput()
{
    return json_decode(file_get_contents("php://input"), true);
}

// ✅ USER SIGNUP
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_GET["action"]) && $_GET["action"] === "signup") {
    $data = getJSONInput();
    $username = $data["username"] ?? "";
    $password = $data["password"] ?? "";

    if (empty($username) || empty($password)) {
        echo json_encode(["error" => "Username and password are required."]);
        exit();
    }

    $checkUser = $conn->prepare("SELECT playerID FROM players WHERE playerName = ?");
    $checkUser->bind_param("s", $username);
    $checkUser->execute();
    $checkUser->store_result();

    if ($checkUser->num_rows > 0) {
        echo json_encode(["error" => "Username already exists."]);
        exit();
    }

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $createUser = $conn->prepare("INSERT INTO players (playerName, playerPassword, playerAccountLvl) VALUES (?, ?, 1)");
    $createUser->bind_param("ss", $username, $hashedPassword);

    if ($createUser->execute()) {
        echo json_encode(["message" => "Account created successfully!"]);
    } else {
        echo json_encode(["error" => "Error creating account."]);
    }
    exit();
}

// ✅ USER LOGIN
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_GET["action"]) && $_GET["action"] === "login") {
    $data = getJSONInput();
    $username = $data["username"] ?? "";
    $password = $data["password"] ?? "";

    if (empty($username) || empty($password)) {
        echo json_encode(["error" => "Username and password are required."]);
        exit();
    }

    $query = $conn->prepare("SELECT playerID, playerPassword FROM players WHERE playerName = ?");
    $query->bind_param("s", $username);
    $query->execute();
    $query->store_result();

    if ($query->num_rows === 0) {
        echo json_encode(["error" => "Invalid username or password."]);
        exit();
    }

    $query->bind_result($playerID, $hashedPassword);
    $query->fetch();

    if (password_verify($password, $hashedPassword)) {
        $_SESSION["user_id"] = $playerID;
        $_SESSION["username"] = $username;
        echo json_encode(["message" => "Login successful!", "user_id" => $playerID]);
    } else {
        echo json_encode(["error" => "Invalid username or password."]);
    }
    exit();
}

// ✅ CHECK SESSION (PROTECTED ROUTE)
if ($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET["action"]) && $_GET["action"] === "check_session") {
    if (isset($_SESSION["user_id"])) {
        echo json_encode(["message" => "Session active", "user_id" => $_SESSION["user_id"], "username" => $_SESSION["username"]]);
    } else {
        echo json_encode(["error" => "No active session"]);
    }
    exit();
}

// ✅ USER LOGOUT
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_GET["action"]) && $_GET["action"] === "logout") {
    session_destroy();
    echo json_encode(["message" => "Logged out successfully"]);
    exit();
}

echo json_encode(["error" => "Invalid request"]);
