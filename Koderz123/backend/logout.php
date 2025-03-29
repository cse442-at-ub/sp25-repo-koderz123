<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

// Clear all session variables
$_SESSION = array();
session_unset();

// Destroy the session
session_destroy();

// Clear session cookie
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

// Send success response
http_response_code(200);
echo json_encode(["status" => 200, "message" => "Logout successful"]);
?> 