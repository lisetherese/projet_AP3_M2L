<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
// include database and object file
include_once '../config/database.php';
include_once '../objects/ligue.php';
  
// get database connection
$database = new Database();
$db = $database->getConnection();
  
// prepare ligue object
$ligue = new Ligue($db);
  
// get ligue id _ use POST method to inject into body of request
$data = json_decode(file_get_contents("php://input"));
  
// set ligue id to be deleted
$ligue->id = $data->id;
  
// delete the ligue
if($ligue->delete()){
  
    // set response code - 200 ok
    http_response_code(200);
  
    // tell client
    echo json_encode(array("message" => "La ligue a été supprimée ."));
}
  
// if unable to delete the ligue
else{
  
    // set response code - 503 service unavailable
    http_response_code(503);
  
    // tell the ligue
    echo json_encode(array("message" => "Impossible de supprimer la ligue."));
}
?>