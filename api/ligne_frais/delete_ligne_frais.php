<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
// include database and object file
include_once '../config/database.php';
include_once '../objects/ligne_frais.php';
  
// get database connection
$database = new Database();
$db = $database->getConnection();
  
// prepare ligne_frais object
$ligne_frais = new LigneFrais($db);
  
// get ligne_frais id _ use POST method to inject into body of request
$data = json_decode(file_get_contents("php://input"));
  
// set ligne_frais id to be deleted
$ligne_frais->id = $data->id;
  
// delete the ligne_frais
if($ligne_frais->delete()){
  
    // set response code - 200 ok
    http_response_code(200);
  
    // tell client
    echo json_encode(array("id" => $data->id));
}
  
// if unable to delete the ligne_frais
else{
  
    // set response code - 503 service unavailable
    http_response_code(503);
  
    // tell the ligne_frais
    echo json_encode(array("message" => "Impossible de supprimer la ligne frais."));
}
?>