<?php
// required headers
header("Access-Control-Allow-Origin: http://localhost/M2L/");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// files needed to connect to database
include_once '../config/database.php';
include_once '../objects/bordereau.php';
 
// get database connection
$database = new Database();
$db = $database->getConnection();
 
// instantiate object
$bordereau = new Bordereau($db);
 
// get posted data
//file_get_contents() to read the contents of a file into a string and json_decode() to turn it into object json
$data = json_decode(file_get_contents("php://input"));
 
// set product property values
$bordereau->src_bordereau = $data->src_bordereau;
$bordereau->id_user = $data->id_user;

// create the bordereau
if(
    !empty($bordereau->src_bordereau) &&
    !empty($bordereau->id_user) &&
    $bordereau->create()
){
 
    // set response code
    http_response_code(200);
 
    // display message: bordereau was created
    echo json_encode(array("message" => "Le bordereau a été créé."));
}
 
// message if unable to create bordereau
else{
 
    // set response code
    http_response_code(400);
 
    // display message: unable to create bordereau
    echo json_encode(array("message" => "Impossible de créer le bordereau ."));
}
?>