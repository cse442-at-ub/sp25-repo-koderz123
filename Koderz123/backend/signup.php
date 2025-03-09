<?php
header("Content-Type: application/json");

$config = json_decode(file_get_contents("./config.json"));

$connection = new mysqli("localhost", $config->username, $config->password, $config->db_name);

if ($connection->connect_error) {
    http_response_code(500);
    die(json_encode(["status" => 500, "message" => "Database connection failed"]));
}

$json = json_decode(file_get_contents("php://input"), true);

if (!isset($json["username"]) || !isset($json["password"])) {
    http_response_code(400);
    die(json_encode(["status" => 400, "message" => "Missing required fields"]));
}

$signup_name = $json["username"];
$signup_pass = password_hash($json["password"], PASSWORD_DEFAULT);

// ✅ Use a prepared statement to prevent SQL injection
$stmt = $connection->prepare("INSERT INTO global_players_db (username, password) VALUES (?, ?)");
$stmt->bind_param("ss", $signup_name, $signup_pass);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(["status" => 201, "message" => "User registered successfully"]);
} else {
    http_response_code(409);
    echo json_encode(["status" => 409, "message" => "Username already exists or another conflict"]);
}

$stmt->close();
$connection->close();
