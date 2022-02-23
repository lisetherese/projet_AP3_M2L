<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// files needed to connect to database
include_once '../config/database.php';
include_once '../objects/demandeur.php';
 
// get database connection
$database = new Database();
$db = $database->getConnection();
 
// instantiate demandeur object with empty property values
$demandeur = new Demandeur($db);
 
// get input data posted, turn it into JSON string then convert it into PHP variable 
$data = json_decode(file_get_contents("php://input"));
 
 
// set demandeur property values according to posted data
$demandeur->id = $data->id;
$demandeur->etre_adherent = 1 ;

// update the demandeur record
if($demandeur->becomeAdherent()){
    
    // set response code
    http_response_code(200);
            
    // response in json format
    echo json_encode(array("message" => "Le demandeur est devenu adherent! ."));
}
// message if unable to update demandeur
else{
    // set response code - service unavailable
    http_response_code(503);
    // show error message
    echo json_encode(array("message" => "Impossible de mettre à jour le demandeur."));
    }

?>