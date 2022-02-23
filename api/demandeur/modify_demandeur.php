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
$demandeur->nom = $data->nom;
$demandeur->prenom = $data->prenom;
$demandeur->rue = $data->rue;
$demandeur->cp = intval($data->cp);
$demandeur->ville = $data->ville;
$demandeur->num_licence = intval($data->num_licence);
$demandeur->date_naissance = $data->date_naissance;
$demandeur->id_user = intval($data->id_user);
$demandeur->id_ligue = intval($data->id_ligue);

// update the demandeur record
if($demandeur->update()){
    
    // set response code
    http_response_code(200);
            
    // response in json format
    echo json_encode(array("message" => "Le demandeur a été mis à jour."));
}
// message if unable to update demandeur
else{
    // set response code - service unavailable
    http_response_code(503);
    // show error message
    echo json_encode(array("message" => "Impossible de mettre à jour le demandeur."));
    }

?>