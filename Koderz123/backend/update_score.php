<?php
session_start();
require_once 'config.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Only allow logged-in users
if (!isset($_SESSION['username'])) {
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

$username = $_SESSION['username'];
$score = isset($_POST['score']) ? intval($_POST['score']) : 0;

$conn = new mysqli($servername, $username_db, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

// Update topScore only if the new score is higher
$sql = "UPDATE global_players_db SET topScore = GREATEST(topScore, ?) WHERE playerName = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $score, $username);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(["success" => true, "score" => $score]);
} else {
    echo json_encode(["success" => false, "message" => "Score not updated"]);
}

$stmt->close();
$conn->close();
?>
