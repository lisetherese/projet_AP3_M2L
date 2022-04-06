<?php
// required headers
header('Content-Type: application/json');
  
// include database and object files
include_once '../config/database.php';
include_once '../objects/salle.php';
  
// get database connection
$database = new Database();
$db = $database->getConnection();
  
// prepare salle object
$salle = new Salle($db);
  
// set ID property of record to read 
$salle->id = (int) $_POST['id'];

// read the details of salle to be edited
$result=$salle->readOne();
  
if($result){
    // create array
    $salle_arr = array(
        "id" => $salle->id,
        "nom" => $salle->nom,
        "capacite" => $salle->capacite,
        "id_domaine" => $salle->id_domaine
    );
  
    // set response code - 200 OK
    http_response_code(200);
  
    // make it json format
    echo json_encode($salle_arr);
}
  
else{
    // set response code - 404 Not found
    http_response_code(404);
  
    // tell client that the salle does not exist
    echo json_encode(array("message" => "Le salle n'existe pas."));
}
?>