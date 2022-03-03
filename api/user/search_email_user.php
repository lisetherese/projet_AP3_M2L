<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
// include database and object files
include_once '../config/database.php';
include_once '../objects/user.php';
  
// instantiate database and user object
$database = new Database();
$db = $database->getConnection();
  
// initialize object
$user = new User($db);
  
// get user email _ use POST method to inject into body of request
$data = json_decode(file_get_contents("php://input"));

$user->email = $data->email;
  
// check if email found (return true)
if($user->search_email()){
  
    // set response code - 200 OK
    http_response_code(200);
  
    // show users data
    echo json_encode(array("message" => "OK"));
}
  
else{
    // set response code - 404 Not found
    http_response_code(404);
  
    // tell the user no user found
    echo json_encode(
        array("message" => "L'email saisi ne correspond à aucun utilisateur dans notre système.")
    );
}
?>