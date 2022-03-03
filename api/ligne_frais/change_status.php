<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// files needed to connect to database
include_once '../config/database.php';
include_once '../objects/ligne_frais.php';
 
// get database connection
$database = new Database();
$db = $database->getConnection();
 
// instantiate ligne_frais object with empty property values
$ligne_frais = new LigneFrais($db);
 
// get input data posted, turn it into JSON string then convert it into PHP variable 
$data = json_decode(file_get_contents("php://input"));
 
 
// set ligne_frais property values according to posted data
$ligne_frais->id = $data->id;
$ligne_frais->etre_valide = $data->valide;

// update the ligne_frais record
if($ligne_frais->validerLigneFrais()){
    
    // set response code
    http_response_code(200);
            
    // response in json format
    echo json_encode(array("message" => "La ligne frais a bien été validée! "));
}
// message if unable to update ligne_frais
else{
    // set response code - service unavailable
    http_response_code(503);
    // show error message
    echo json_encode(array("message" => "Impossible de mettre à jour la ligne frais."));
    }

?>