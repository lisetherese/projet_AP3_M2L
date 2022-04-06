<?php
// required headers
header('Content-Type: application/json');
 
// files needed to connect to database
include_once '../config/database.php';
include_once '../objects/salle.php';
 
// get database connection
$database = new Database();
$db = $database->getConnection();
 
// instantiate object
$salle = new Salle($db);
 
// set salle property values
$salle->nom = $_POST['nom'];
$salle->capacite = intval($_POST['capacite']);
$salle->id_domaine = intval($_POST['id_domaine']);

// create the salle
if(
    !empty($salle->nom) &&
    $salle->create()
){
 
    // set response code
    http_response_code(200);
 
    // display message: salle was created
    echo json_encode(array("message" => "success"));
}
 
// message if unable to create salle
else{
 
    // set response code
    http_response_code(400);
 
    // display message: unable to create salle
    echo json_encode(array("message" => "fail"));
}
?>