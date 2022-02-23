<?php
// required headers
header("Access-Control-Allow-Origin: http://localhost/M2L/");
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
 
// instantiate object
$ligue = new Ligue($db);
 
// get posted data
//file_get_contents() to read the contents of a file into a string and json_decode() to turn it into object json
$data = json_decode(file_get_contents("php://input"));
 
// set product property values
$ligue->nom = $data->nom;
$ligue->sigle = $data->sigle;
$ligue->president = $data->president;
$ligue->reser_hors = intval($data->reser_hors);
$ligue->reser_am = intval($data->reser_am);
$ligue->reser_con = intval($data->reser_con);
 
// create the ligue
if(
    !empty($ligue->nom) &&
    !empty($ligue->sigle) &&
    !empty($ligue->president) &&
    !empty($ligue->reser_hors) &&
    $ligue->create()
){
 
    // set response code
    http_response_code(200);
 
    // display message: ligue was created
    echo json_encode(array("message" => "La ligue a été créée."));
}
 
// message if unable to create ligue
else{
 
    // set response code
    http_response_code(400);
 
    // display message: unable to create ligue
    echo json_encode(array("message" => "Impossible de créer la ligue ."));
}
?>