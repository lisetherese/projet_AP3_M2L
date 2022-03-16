<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
// include database and object file
include_once '../config/database.php';
include_once '../objects/user.php';
  
// get database connection
$database = new Database();
$db = $database->getConnection();
  
// prepare user object
$user = new User($db);
  
// get user id _ use POST method to inject into body of request
$data = json_decode(file_get_contents("php://input"));
  
// set user id to be deleted
$user->id = $data->id;
  
// delete the user
if($user->delete()){
  
    // set response code - 200 ok
    http_response_code(200);
  
    // tell the user
    echo json_encode(array("message" => "L'utilisateur a été supprimé ."));
}
  
// if unable to delete the user
else{
  
    // set response code - 503 service unavailable , the server is temporarily unable to handle the request but is otherwise functioning as normal
    http_response_code(503);
  
    // tell the user
    echo json_encode(array("message" => "Impossible de supprimer l'utilisateur."));
}
?>