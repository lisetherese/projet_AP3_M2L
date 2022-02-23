<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
// include database and object file
include_once '../config/database.php';
include_once '../objects/motif.php';
  
// get database connection
$database = new Database();
$db = $database->getConnection();
  
// prepare motif object
$motif = new Motif($db);
  
// get motif id _ use POST method to inject into body of request
$data = json_decode(file_get_contents("php://input"));
  
// set motif id to be deleted
$motif->id = $data->id;
  
// delete the motif
if($motif->delete()){
  
    // set response code - 200 ok
    http_response_code(200);
  
    // tell client
    echo json_encode(array("message" => "Le motif a été supprimé ."));
}
  
// if unable to delete the motif
else{
  
    // set response code - 503 service unavailable
    http_response_code(503);
  
    // tell the motif
    echo json_encode(array("message" => "Impossible de supprimer le motif."));
}
?>