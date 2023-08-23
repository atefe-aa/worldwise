<?php
include "./connection.php";
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$user_id = 1;

$sql = "SELECT * FROM cities WHERE user_id = '$user_id' AND `status`= 1 ";
$result = $link->query($sql);

$all_users = array();

if($result->num_rows > 0){
    while($row = $result->fetch_assoc()) {
        $cities [] = $row;
    }
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(file_get_contents("php://input"), true);
    $response = array();

    $city = $data['cityName'];
    $country = $data['country'];
    $date = $data['date'];
    $emoji = $data['emoji'];
    $notes = $data['notes'];
    $position = serialize($data['position']);

    $insert_sql = "INSERT INTO cities 
    (user_id, city, country, emoji, notes, date, position)
VALUES
    ('$user_id', '$city','$country','$emoji', '$notes', '$date', '$position')";
    if($link->query($insert_sql)){
        $response = ['success'=> 'City added successfully!'];
    }else{
        $response = ['error' => 'Adding City failed!'];
    }
    echo json_encode($response);
}
