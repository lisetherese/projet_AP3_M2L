<?php
// required headers
header("Access-Control-Allow-Origin: http://localhost/M2L/");
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
 
// instantiate object
$ligne_frais = new LigneFrais($db);
 
// get posted data
//file_get_contents() to read the contents of a file into a string and json_decode() to turn it into object json
$data = json_decode(file_get_contents("php://input"));
 
// set property values
$ligne_frais->date_ligne_frais = $data->date_ligne_frais;
$ligne_frais->trajet = $data->trajet;
$ligne_frais->km = floatval($data->km);
$ligne_frais->km_valide = $ligne_frais->km*intval($data->type_trajet);
if ($data->cout_peage !== null || $data->cout_peage !== ''){
    $ligne_frais->cout_peage = floatval($data->cout_peage);
    $ligne_frais->peage_valide = $ligne_frais->cout_peage*intval($data->multip_peage);
}
if ($data->peage_justificatif !== null || $data->peage_justificatif !== ''){
    $ligne_frais->peage_justificatif = $data->peage_justificatif;
}
if ($data->cout_repas !== null || $data->cout_repas !== ''){
    $ligne_frais->cout_repas = floatval($data->cout_repas);
    $ligne_frais->repas_valide = $ligne_frais->cout_repas*intval($data->multip_repas);
}
if ($data->repas_justificatif !== null || $data->repas_justificatif !== ''){
    $ligne_frais->repas_justificatif = $data->repas_justificatif;   
}
if ($data->cout_hebergement !== null || $data->cout_hebergement !== ''){
    $ligne_frais->cout_hebergement = floatval($data->cout_hebergement);
    $ligne_frais->hebergement_valide = $ligne_frais->cout_hebergement*intval($data->multip_heberge);
}
if ($data->justificatif !== null || $data->justificatif !== ''){
    $ligne_frais->justificatif = $data->justificatif;   
}

$ligne_frais->id_user = intval($data->id_user);
$ligne_frais->id_motif = intval($data->id_motif);

//manage files uploaded in repository

// create the ligne_frais
if(
    !empty($ligne_frais->date_ligne_frais) &&
    !empty($ligne_frais->trajet) &&
    !empty($ligne_frais->km) &&
    !empty($ligne_frais->km_valide) &&
    $ligne_frais->create()
){
 
    // set response code
    http_response_code(200);
 
    // display message: ligne_frais was created
    echo json_encode(array("message" => "La ligne frais a été créée."));
}
 
// message if unable to create ligne_frais
else{
 
    // set response code
    http_response_code(400);
 
    // display message: unable to create ligne_frais
    echo json_encode(array("message" => "Impossible de créer la ligne frais ."));
}
?>