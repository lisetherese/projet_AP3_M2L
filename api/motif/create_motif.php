<?php
// required headers
header("Access-Control-Allow-Origin: http://localhost/M2L/");
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
 
// instantiate object
$motif = new Motif($db);
 
// get posted data
//file_get_contents() to read the contents of a file into a string and json_decode() to turn it into object json
$data = json_decode(file_get_contents("php://input"));
 
// set motif property values
$motif->libelle = $data->libelle;

// create the motif
if(
    !empty($motif->libelle) &&
    $motif->create()
){
 
    // set response code
    http_response_code(200);
 
    // display message: motif was created
    echo json_encode(array("message" => "Le motif a été créé."));
}
 
// message if unable to create motif
else{
 
    // set response code
    http_response_code(400);
 
    // display message: unable to create motif
    echo json_encode(array("message" => "Impossible de créer le motif ."));
}
?>