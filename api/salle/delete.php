<?php
// required headers
header('Content-Type: application/json');
  
// include database and object file
include_once '../config/database.php';
include_once '../objects/salle.php';
  
// get database connection
$database = new Database();
$db = $database->getConnection();
  
// prepare salle object
$salle = new Salle($db);
  
// set salle id to be deleted
$salle->id = intval($_POST['id']);
  
// delete the salle
if($salle->delete()){
  
    // set response code - 200 ok
    http_response_code(200);
  
    // tell client
    echo json_encode(array("message" => "success"));
}
  
// if unable to delete the salle
else{
  
    // set response code - 503 service unavailable
    http_response_code(503);
  
    // tell the salle
    echo json_encode(array("message" => "fail"));
}
?>