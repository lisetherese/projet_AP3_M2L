<?php
// required headers
header("Access-Control-Allow-Origin: http://localhost/M2L/");
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
 
// instantiate object
$demandeur = new Demandeur($db);
 
// get posted data
//file_get_contents() to read the contents of a file into a string and json_decode() to turn it into object json
$data = json_decode(file_get_contents("php://input"));
 
// set product property values
$demandeur->nom = $data->nom;
$demandeur->prenom = $data->prenom;
$demandeur->rue = $data->rue;
$demandeur->cp = intval($data->cp);
$demandeur->ville = $data->ville;
$demandeur->num_licence = intval($data->num_licence);
$demandeur->date_naissance = $data->date_naissance;
$demandeur->id_user = intval($data->id_user);
$demandeur->id_ligue = intval($data->id_ligue);
// create the demandeur
if(
    !empty($demandeur->nom) &&
    !empty($demandeur->prenom) &&
    !empty($demandeur->rue) &&
    !empty($demandeur->cp) &&
    !empty($demandeur->ville) &&
    !empty($demandeur->num_licence) &&
    !empty($demandeur->date_naissance) &&
    $demandeur->create()
){
 
    // set response code
    http_response_code(200);
 
    // display message: demandeur was created
    echo json_encode(array("message" => "Le demandeur a été crée."));
}
 
// message if unable to create demandeur
else{
 
    // set response code
    http_response_code(400);
 
    // display message: unable to create demandeur
    echo json_encode(array("message" => "Impossible de créer le demandeur ."));
}
?>