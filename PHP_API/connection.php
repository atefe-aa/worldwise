<?php
$link = new mysqli("localhost", "root", "", "world_wise");
if($link->connect_error){
    die("ERROR: Unable to connect: " . $link->connect_error);
}
?>