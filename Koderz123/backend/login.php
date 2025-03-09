<?php
header("Content-Type: application/json");
$config = json_decode(file_get_contents("../config.json"));

$connection = new mysqli("localhost", $config->username, $config->password, $config->db_name);

if ($connection->connect_error) {
    http_response_code(500);
    die(json_encode(["status" => "failed", "message" => "Database connection failed"]));
}

$json = json_decode(file_get_contents("php://input"), true);

if (!isset($json["username"]) || !isset($json["password"])) {
    http_response_code(400);
    die(json_encode(["status" => "failed", "message" => "Missing username or password"]));
}

$login_username = $json["username"];
$login_password = $json["password"];

// ✅ Secure query to prevent SQL injection
$stmt = $connection->prepare("SELECT user_id, password FROM users WHERE username = ?");
$stmt->bind_param("s", $login_username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 1) {
    $stmt->bind_result($user_id, $hashed_password);
    $stmt->fetch();

    // ✅ Verify password
    if (password_verify($login_password, $hashed_password)) {
        // Generate Secure Token
        $token = bin2hex(random_bytes(32)); // Secure random token
        $hashed_token = hash("sha256", $token);

        // ✅ Remove any existing active session for the user
        $stmt_delete = $connection->prepare("DELETE FROM active_users WHERE user_id = ?");
        $stmt_delete->bind_param("i", $user_id);
        $stmt_delete->execute();
        $stmt_delete->close();

        // ✅ Insert new active session
        $stmt_insert = $connection->prepare("INSERT INTO active_users (user_id, token) VALUES (?, ?)");
        $stmt_insert->bind_param("is", $user_id, $hashed_token);
        $stmt_insert->execute();
        $stmt_insert->close();

        // ✅ Set secure cookies
        setcookie("username", htmlspecialchars($login_username, ENT_QUOTES, 'UTF-8'), [
            "expires" => time() + 3600,
            "path" => "/",
            "httponly" => true,
            "samesite" => "Strict"
        ]);

        setcookie("token", $token, [
            "expires" => time() + 3600,
            "path" => "/",
            "httponly" => true,
            "samesite" => "Strict"
        ]);

        http_response_code(200);
        die(json_encode(["status" => "valid", "message" => "Login successful"]));
    } else {
        http_response_code(401);
        die(json_encode(["status" => "failed", "message" => "Incorrect credentials"]));
    }
} else {
    http_response_code(401);
    die(json_encode(["status" => "failed", "message" => "Incorrect credentials"]));
}

$stmt->close();
$connection->close();
