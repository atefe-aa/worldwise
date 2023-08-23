<?php
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

    $data = json_decode(file_get_contents("php://input"), true);
    $response = array();

    // Process the data as needed
    $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    $password = password_hash($data['password'], PASSWORD_BCRYPT);
    $passwords_match = ($data['password'] === $data['passwordConfirm']);

    $user_exists = false;
    foreach($all_users as $user){
        if($user['email'] === $email) $user_exists = true;
    }

    if(!$user_exists && $passwords_match){
        $insert_user_query = "INSERT INTO users (email, password) VALUES ('$email', '$password')";
         if($link->query($insert_user_query)){
             $response = ['success' => 'User signup successfully!'];
         }else{
             $response = ['error' => 'creating user failed!'];
         }
    }elseif($user_exists){
        $response = ['error' => 'This email already exists!'];
    }elseif (!$passwords_match){
        $response = ['error' => 'Confirmation Password doesn\'t match the password!'];
    }
    // Send a response back to React

    echo json_encode($response);
  }
