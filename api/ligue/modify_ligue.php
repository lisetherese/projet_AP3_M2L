<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// files needed to connect to database
include_once '../config/database.php';
include_once '../objects/ligue.php';
 
// get database connection
$database = new Database();
$db = $database->getConnection();
 
// instantiate ligue object with empty property values
$ligue = new Ligue($db);
 
// get input data posted, turn it into JSON string then convert it into PHP variable 
$data = json_decode(file_get_contents("php://input"));
 
 
// set ligue property values according to posted data
$ligue->id = $data->id;
$ligue->nom = $data->nom;
$ligue->sigle = $data->sigle;
$ligue->president = $data->president;
$ligue->reser_hors = intval($data->reser_hors);
$ligue->reser_am = intval($data->reser_am);
$ligue->reser_con = intval($data->reser_con);

// update the ligue record
if($ligue->update()){
    
    // set response code
    http_response_code(200);
            
    // response in json format
    echo json_encode(array("message" => "La ligue a été mise à jour."));
}
// message if unable to update ligue
else{
    // set response code - service unavailable
    http_response_code(503);
    // show error message
    echo json_encode(array("message" => "Impossible de mettre à jour la ligue."));
    }

?>