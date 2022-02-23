<?php
// required headers
header("Access-Control-Allow-Origin: http://localhost/M2L/");
header('Content-Type: application/json; charset=UTF-8');
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
// include database and object files
include_once '../config/database.php';
include_once '../objects/ligue.php';
  
// get database connection
$database = new Database();
$db = $database->getConnection();
  
// prepare ligue object
$ligue = new Ligue($db);
  
// set ID property of record to read 
$ligue->id = isset($_GET['id']) ? $_GET['id'] : die();

// read the details of ligue to be edited
$result = $ligue->readOne();
  
if($result){
    // create array
    $ligue_arr = array(
        "id" => $ligue->id,
        "nom" => $ligue->nom,
        "sigle" => $ligue->sigle,
        "president" =>$ligue->president,
        "reser_hors" => $ligue->reser_hors,
        "reser_am" => $ligue->reser_am,
        "reser_con" => $ligue->reser_con
    );
  
    // set response code - 200 OK
    http_response_code(200);
  
    // make it json format
    echo json_encode($ligue_arr);
}
  
else{
    // set response code - 404 Not found
    http_response_code(404);
  
    // tell client that the ligue does not exist
    echo json_encode(array("message" => "La ligue n'existe pas."));
}
?>