<?php
// required headers
header('Content-Type: application/json');

// files needed to connect to database
include_once '../config/database.php';
include_once '../objects/salle.php';
 
// get database connection
$database = new Database();
$db = $database->getConnection();
 
// instantiate salle object with empty property values
$salle = new Salle($db);
 
// set salle property values
$salle->id = intval($_POST['id']);
$salle->nom = $_POST['nom'];
$salle->capacite = intval($_POST['capacite']);
$salle->id_domaine = intval($_POST['id_domaine']);
 

// update the salle record
if($salle->update()){
    
    // set response code
    http_response_code(200);
            
    // response in json format
    echo json_encode(array("message" => "success"));
}
// message if unable to update salle
else{
    // set response code - service unavailable
    http_response_code(503);
    // show error message
    echo json_encode(array("message" => "fail"));
    }

?>