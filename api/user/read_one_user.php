<?php
// required headers
header("Access-Control-Allow-Origin: http://localhost/M2L/");
header('Content-Type: application/json; charset=UTF-8');
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
// include database and object files
include_once '../config/database.php';
include_once '../objects/user.php';
  
// get database connection
$database = new Database();
$db = $database->getConnection();
  
// prepare user object
$user = new User($db);
  
// set ID property of record to read : if (isset($_GET['id])) {$user->id = $_GET['id'] } else { die()}
// use GET method to inject into head of request the id number corresponding
$user->id = isset($_GET['id']) ? $_GET['id'] : die();

// read the details of user to be edited
$result = $user->readOne();
  
if($result){
    // create array
    $user_arr = array(
        "id" => $user->id,
        "email" => $user->email,
        "role" => $user->role,
        "droit_reservation" => $user->droit_reservation,
        "niveau_tarif" => $user->niveau_tarif
    );
  
    // set response code - 200 OK
    http_response_code(200);
  
    // make it json format
    echo json_encode($user_arr);
}
  
else{
    // set response code - 404 Not found
    //http_response_code(404);
  
    // tell client that the user does not exist
    echo json_encode(array("message" => "L'utilisateur n'existe pas."));
}
?>