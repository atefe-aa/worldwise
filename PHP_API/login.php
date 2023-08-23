<?php
session_start();
include "./connection.php";
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$query_users = "SELECT * FROM users";
$result = $link->query($query_users);

$all_users = array();

if($result->num_rows > 0){
    while($row = $result->fetch_assoc()) {
        $all_users [] = $row;
    }
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $user_id ="";
    $data = json_decode(file_get_contents("php://input"), true);
    $response = array();

    // Process the data as needed
    $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    $password = $data['password'];
    $hashed_password = "";
    $user_exists = false;

    foreach($all_users as $user){
        if($user['email'] === $email) {
            $user_exists = true;
            $hashed_password = $user['password'];
            $user_id = $user['id'];
        }
    }
    $is_valid = password_verify($password, $hashed_password);
    if(!$user_exists){
        $response = ['error' => 'User doesn\'t exist!'];
    }elseif(!$is_valid){
        $response = ['error' => 'Incorrect Password!'];
    }else{
        $_SESSION['user_id'] = $user_id;
        $response = ['success' => 'User\'s inputs are valid!'];
    }

    echo json_encode($response);
}
