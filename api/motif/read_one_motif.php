<?php
// required headers
header("Access-Control-Allow-Origin: http://localhost/M2L/");
header('Content-Type: application/json; charset=UTF-8');
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
// include database and object files
include_once '../config/database.php';
include_once '../objects/motif.php';
  
// get database connection
$database = new Database();
$db = $database->getConnection();
  
// prepare motif object
$motif = new Motif($db);
  
// set ID property of record to read 
$motif->id = isset($_GET['id']) ? $_GET['id'] : die();

// read the details of motif to be edited
$result=$motif->readOne();
  
if($result){
    // create array
    $motif_arr = array(
        "id" => $motif->id,
        "libelle" => $motif->libelle
    );
  
    // set response code - 200 OK
    http_response_code(200);
  
    // make it json format
    echo json_encode($motif_arr);
}
  
else{
    // set response code - 404 Not found
    http_response_code(404);
  
    // tell client that the motif does not exist
    echo json_encode(array("message" => "Le motif n'existe pas."));
}
?>