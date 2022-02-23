<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// files needed to connect to database
include_once '../config/database.php';
include_once '../objects/bordereau.php';
 
// get database connection
$database = new Database();
$db = $database->getConnection();
 
// instantiate bordereau object with empty property values
$bordereau = new Bordereau($db);
 
// get input data posted, turn it into JSON string then convert it into PHP variable 
$data = json_decode(file_get_contents("php://input"));
 
 
// set bordereau property values according to posted data
$bordereau->id = $data->id;
$bordereau->etre_valide = $data->valide;

// update the bordereau record
if($bordereau->validerBordereau()){
    
    // set response code
    http_response_code(200);
            
    // response in json format
    echo json_encode(array("message" => "Le bordereau a bien été modifié! ."));
}
// message if unable to update bordereau
else{
    // set response code - service unavailable
    http_response_code(503);
    // show error message
    echo json_encode(array("message" => "Impossible de mettre à jour le bodereau."));
    }

?>