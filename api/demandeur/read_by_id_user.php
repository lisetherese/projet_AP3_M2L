<?php
// required headers
header("Access-Control-Allow-Origin: http://localhost/M2L/");
header('Content-Type: application/json; charset=UTF-8');
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
// include database and object files
include_once '../config/database.php';
include_once '../objects/demandeur.php';
  
// get database connection
$database = new Database();
$db = $database->getConnection();
  
// prepare demandeur object
$demandeur = new Demandeur($db);

// get input data posted, turn it into JSON string then convert it into PHP variable 

$data = json_decode(file_get_contents("php://input"));

// set property of demandeur
$demandeur->id_user = $data->id_user;

// read the details of demandeur to be edited
$result = $demandeur->readByIdUser();
if($result){
    // create array
    $demandeur_arr = array(
        "id" => $demandeur->id,
        "nom" => $demandeur->nom,
        "prenom" => $demandeur->prenom,
        "rue" =>$demandeur->rue,
        "ville" => $demandeur->ville,
        "cp" => $demandeur->cp,
        "num_licence" => $demandeur->num_licence,
        "date_naissance" => $demandeur->date_naissance,
        "etre_adherent" =>$demandeur->etre_adherent,
        "id_user" => $demandeur->id_user,
        "id_ligue" => $demandeur->id_ligue
    );
  
    // set response code - 200 OK
    http_response_code(200);
    // make it json format
    echo json_encode($demandeur_arr);
}
  
else{
  
    // set response code - 404 Not found
    http_response_code(404);
  
    // tell client that the demandeur does not exist
    echo json_encode(array("message" => "Pas encore deposé la demande"));
}

?>