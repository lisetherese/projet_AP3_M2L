<?php
// required headers
header("Access-Control-Allow-Origin: http://localhost/M2L/");
header('Content-Type: application/json; charset=UTF-8');
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
// include database and object files
include_once '../config/database.php';
include_once '../objects/ligne_frais.php';
  
// get database connection
$database = new Database();
$db = $database->getConnection();
  
// prepare ligne_frais object
$ligne_frais = new LigneFrais($db);
  
// set ID property of record to read 
$ligne_frais->id = isset($_GET['id']) ? $_GET['id'] : die();

// read the details of ligne_frais to be edited
$result = $ligne_frais->readOne();
  
if($result){
    // create array
    $ligne_frais_arr = array(
        "id" => $ligne_frais->id,
        "date_ligne_frais" => $ligne_frais->date_ligne_frais,
        "trajet" => $ligne_frais->trajet,
        "km" =>$ligne_frais->km,
        "km_valide" => $ligne_frais->km_valide,
        "cout_peage" => $ligne_frais->cout_peage,
        "peage_valide" => $ligne_frais->peage_valide,
        "peage_justificatif" => $ligne_frais->peage_justificatif,
        "cout_repas" => $ligne_frais->cout_repas,
        "repas_valide" => $ligne_frais->repas_valide,
        "repas_justificatif" => $ligne_frais->repas_justificatif,
        "cout_hebergement" => $ligne_frais->cout_hebergement,
        "hebergement_valide" => $ligne_frais->hebergement_valide,
        "justificatif" => $ligne_frais->justificatif,
        "etre_valide" =>$ligne_frais->etre_valide,
        "id_user" => $ligne_frais->id_user,
        "id_motif" => $ligne_frais->id_motif
    );
  
    // set response code - 200 OK
    http_response_code(200);
  
    // make it json format
    echo json_encode($ligne_frais_arr);
}
  
else{
    // set response code - 404 Not found
    http_response_code(404);
  
    // tell client that the ligne_frais does not exist
    echo json_encode(array("message" => "La ligne frais n'existe pas."));
}
?>