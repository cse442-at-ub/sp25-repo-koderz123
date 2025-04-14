<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once 'config.php';

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed"]));
}

$sql = "SELECT playerName, topScore FROM global_players_db ORDER BY topScore DESC LIMIT 100";
$result = $conn->query($sql);

$leaderboard = [];
$rank = 1;

while ($row = $result->fetch_assoc()) {
    $leaderboard[] = [
        "rank" => $rank++,
        "player" => $row["playerName"],
        "score" => $row["topScore"]
    ];
}

echo json_encode($leaderboard);
$conn->close();
?>
