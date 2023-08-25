<?php
include "./connection.php";
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$user_id = 1;
$cities= array();
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
    $city_exists = false;

    $city = $data['cityName'];
    $country = $data['country'];
    $date = $data['date'];
    $emoji = $data['emoji'];
    $notes = $data['notes'];
    $position = serialize($data['position']);
//    var_dump($date);
//    echo "<Br>";
//    var_dump($cities[0]['date']);
//    foreach($cities as $item){
//
//        if($city === $item['city'] && $date === $item['date'] ) {
//            $city_exists = true;
//            break;
//        }
//    }

    $insert_sql = "INSERT INTO cities 
    (user_id, city, country, emoji, notes, date, position)
VALUES
    ('$user_id', '$city','$country','$emoji', '$notes', '$date', '$position')";

//    if(!$city_exists){

        if($link->query($insert_sql)){
            $response = [
                'cityName' =>$city ,
                'country'=>$country ,
                'date' =>$date ,
                'emoji'=>$emoji ,
                'notes'=>$notes ,
                'position'=>unserialize($position),
                'id' => $link->insert_id
            ];

        }else{
            $response = ['error' => 'Adding City failed!'];
        }
//    }else{
//        $response = ['error' => 'Already exists!'];
//    }

    echo json_encode($response);
}
