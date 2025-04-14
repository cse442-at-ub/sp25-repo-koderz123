<?php
// Load DB config
$config = file_get_contents("../config.json");
$data = json_decode($config);

$username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

$conn = new mysqli("localhost", $username, $password, $db_name);

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(["error" => "Database connection failed."]));
}

header("Content-Type: application/json");
$action = $_GET["action"] ?? "";

// ✅ SUBMIT SCORE
if ($action === "submit-score") {
    $json = json_decode(file_get_contents("php://input"), true);
    $playerID = $json["playerID"] ?? null;
    $score = $json["score"] ?? null;
    $mode = $json["mode"] ?? "relaxed";

    if (!$playerID || !$score || !$mode) {
        http_response_code(400);
        echo json_encode(["error" => "Missing data"]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO highscores (playerID, score, mode) VALUES (?, ?, ?)");
    $stmt->bind_param("iis", $playerID, $score, $mode);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Score submitted"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Score submission failed"]);
    }

    $stmt->close();
    exit;
}

// ✅ GLOBAL HIGHSCORES
if ($action === "get-highscores") {
    $result = $conn->query("
        SELECT g.playerName, h.score, h.mode, h.created_at
        FROM highscores h
        JOIN global_players_db g ON g.playerID = h.playerID
        ORDER BY h.score DESC
        LIMIT 10
    ");

    $scores = [];
    while ($row = $result->fetch_assoc()) {
        $scores[] = $row;
    }

    echo json_encode($scores);
    exit;
}

// ✅ USER-SPECIFIC HIGH SCORE BY MODE
if ($action === "get-user-score") {
    $playerID = $_GET["playerID"] ?? null;
    $mode = $_GET["mode"] ?? "relaxed";

    if (!$playerID || !$mode) {
        http_response_code(400);
        echo json_encode(["error" => "Missing playerID or mode"]);
        exit;
    }

    $stmt = $conn->prepare("SELECT MAX(score) AS highscore FROM highscores WHERE playerID = ? AND mode = ?");
    $stmt->bind_param("is", $playerID, $mode);
    $stmt->execute();
    $stmt->bind_result($highscore);
    $stmt->fetch();
    echo json_encode(["highscore" => $highscore ?? 0]);
    $stmt->close();
    exit;
}

http_response_code(400);
echo json_encode(["error" => "Invalid or missing action"]);
$conn->close();
?>
