<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

$config_path = __DIR__ . "/config.json";
if (!file_exists($config_path)) {
    die(json_encode(["status" => "failed", "message" => "Config file not found"]));
}

$config = json_decode(file_get_contents($config_path), true);
if (!$config || !isset($config["username"], $config["password"], $config["db_name"])) {
    die(json_encode(["status" => "failed", "message" => "Invalid config file"]));
}

$username = $config["username"];
$password = $config["password"];
$db_name = $config["db_name"];

$connection = new mysqli("localhost", $username, $password, $db_name);
if ($connection->connect_error) {
    die(json_encode(["status" => "failed", "message" => "Database connection failed: " . $connection->connect_error]));
}

$json = json_decode(file_get_contents("php://input"), true);
if (!isset($json["username"]) || !isset($json["password"])) {
    http_response_code(400);
    die(json_encode(["status" => "failed", "message" => "Missing username or password"]));
}

$login_username = $json["username"];
$login_password = $json["password"];

// ✅ Ensure correct table name: global_players_db
$stmt = $connection->prepare("SELECT playerPassword FROM global_players_db WHERE playerName = ?");
$stmt->bind_param("s", $login_username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->bind_result($hashed_password);
    $stmt->fetch();

    if (password_verify($login_password, $hashed_password)) {
        http_response_code(200);
        echo json_encode(["status" => 200, "message" => "Login successful"]);
    } else {
        http_response_code(401);
        echo json_encode(["status" => "failed", "message" => "Incorrect credentials"]);
    }
} else {
    http_response_code(404);
    echo json_encode(["status" => "failed", "message" => "User not found"]);
}

$stmt->close();
$connection->close();
