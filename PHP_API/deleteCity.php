<?php
include "./connection.php";
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$user_id = 1;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'];

    $update_sql = "UPDATE  cities SET `status` = 0 WHERE id = '$id'";
    if($link->query($update_sql)){
        $response = ['success'=> 'City deleted successfully!' ];
    }else{
        $response = ['error' => 'Deleting City failed!'];
    }
    echo json_encode($response);
}
