<?php
session_start();
include "./connection.php";
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

//if(isset($_SESSION['user_id'])){
//    $user_id = $_SESSION['user_id'];
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        $query = "";
        $response = array();

        if(isset($data['id'])){
            $city_id = $data['id'];
            $query = "SELECT * FROM cities WHERE `status` = 1 AND `id` = '$city_id' ";
        }else{
            $query = "SELECT * FROM cities WHERE `status` = 1";
        }


//        $cities_query = "SELECT * FROM cities WHERE id = '$user_id' AND `status` = 1";

        $result = $link->query($query);
        if($result->num_rows > 0){
            while ($row = $result->fetch_assoc()){
                $response['cities'] [] = [
                    'cityName' => $row['city'],
                    'country' => $row['country'],
                    'emoji'=> $row['emoji'],
                    'date' => $row['date'],
                    'notes' => $row['notes'],
                    'position' => unserialize($row['position']),
                    'id' => $row['id']
                ];
            }
        }else{
            $response['error'] = "No City Found!";
        }

        echo json_encode($response);
    }

//}




