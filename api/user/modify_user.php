<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// files needed to connect to database
include_once '../config/database.php';
include_once '../objects/user.php';
 
// get database connection
$database = new Database();
$db = $database->getConnection();
 
// instantiate user object with empty property values
$user = new User($db);
 
// get input data posted, turn it into JSON string then convert it into PHP variable 
$data = json_decode(file_get_contents("php://input"));
 
 
// set user property values according to posted data
$user->id = $data->id;
$user->role = $data->role;
$user->droit_reservation = intval($data->droit_reservation);
$user->niveau_tarif = intval($data->niveau_tarif);
$user->email = $data->email;

// update the user record
if($user->update()){
    
    // set response code
    http_response_code(200);
            
    // response in json format
    echo json_encode(array("message" => "L'utilisateur a été mis à jour."));
}
// message if unable to update user
else{
    // set response code - service unavailable
    http_response_code(503);
    // show error message
    echo json_encode(array("message" => "Impossible de mettre à jour l'utilisateur."));
    }

?>