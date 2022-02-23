<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// files needed to connect to database
include_once '../config/database.php';
include_once '../objects/motif.php';
 
// get database connection
$database = new Database();
$db = $database->getConnection();
 
// instantiate motif object with empty property values
$motif = new Motif($db);
 
// get input data posted, turn it into JSON string then convert it into PHP variable 
$data = json_decode(file_get_contents("php://input"));
 
 
// set motif property values according to posted data
$motif->id = $data->id;
$motif->libelle = $data->libelle;


// update the motif record
if($motif->update()){
    
    // set response code
    http_response_code(200);
            
    // response in json format
    echo json_encode(array("message" => "Le motif a été mis à jour."));
}
// message if unable to update motif
else{
    // set response code - service unavailable
    http_response_code(503);
    // show error message
    echo json_encode(array("message" => "Impossible de mettre à jour le motif."));
    }

?>