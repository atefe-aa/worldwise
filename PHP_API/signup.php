<?php
include "./connection.php";
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$fake_avatar_url = "https://i.pravatar.cc/100?u=";


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
    $name = isset($data['name']) ? htmlspecialchars($data['name']): "";
    $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    $password = password_hash($data['password'], PASSWORD_BCRYPT);
    $passwords_match = isset($data['password']) && isset($data['passwordConfirm']) && ( $data['password'] === $data['passwordConfirm']);
    try {
        $avatar = $fake_avatar_url . openssl_random_pseudo_bytes(5);
    } catch (Exception $e) {
        $response['error'] = $e;
    }


    if(!empty($email) && !empty($name) && !empty($data['password']) && !empty($data['passwordConfirm'])){
        $user_exists = false;
        foreach($all_users as $user){
            if($user['email'] === $email) $user_exists = true;
        }
        if(!$user_exists && $passwords_match ){
            $insert_user_query = "INSERT INTO users (name, email, password, avatar) VALUES ('$name', '$email', '$password', '$avatar')";
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
    }else{
        $response['error'] = "All the fields need to be filled!";
    }



    // Send a response back to React

    echo json_encode($response);
  }
