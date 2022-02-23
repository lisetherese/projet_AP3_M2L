<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
// include database and object file
include_once '../config/database.php';
include_once '../objects/bordereau.php';
  
// get database connection
$database = new Database();
$db = $database->getConnection();
  
// prepare bordereau object
$bordereau = new Bordereau($db);
  
// get bordereau id _ use POST method to inject into body of request
$data = json_decode(file_get_contents("php://input"));
  
// set bordereau id to be deleted
$bordereau->id = $data->id;
  
// delete the bordereau
if($bordereau->delete()){
  
    // set response code - 200 ok
    http_response_code(200);
  
    // tell client
    echo json_encode(array("id" => $data->id));
}
  
// if unable to delete the bordereau
else{
  
    // set response code - 503 service unavailable
    http_response_code(503);
  
    // tell the bordereau
    echo json_encode(array("message" => "Impossible de supprimer le bordereau."));
}
?>