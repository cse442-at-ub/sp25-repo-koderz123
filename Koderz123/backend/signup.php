<?php
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
    die(json_encode(["status" => "failed", "message" => "Missing required fields"]));
}

$signup_name = $json["username"];
$signup_pass = password_hash($json["password"], PASSWORD_DEFAULT);
$default_level = 1; // ✅ Set default player level

// ✅ Ensure the query matches the bind_param() statement
$stmt = $connection->prepare("INSERT INTO global_players_db (playerName, playerPassword, playerAccountLvl) VALUES (?, ?, ?)");
$stmt->bind_param("ssi", $signup_name, $signup_pass, $default_level);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(["status" => 201, "message" => "User registered successfully"]);
} else {
    http_response_code(409);
    echo json_encode(["status" => 409, "message" => "Username already exists or another conflict"]);
}

$stmt->close();
$connection->close();
