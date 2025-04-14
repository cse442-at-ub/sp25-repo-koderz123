<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

if (isset($_SESSION["username"])) {
    echo json_encode(["username" => $_SESSION["username"]]);
} else {
    echo json_encode(["username" => null]);
}
?>
