<?php
// required headers
header("Access-Control-Allow-Origin: http://localhost/M2L/");
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
 
// instantiate user object empty
$user = new User($db);
 
// get posted data
//php://input: This is a read-only stream that allows us to read raw data from the request body
$data = json_decode(file_get_contents("php://input")); //take user input value in form and turn it into json object in PHP
 
// set product property values
$user->email = $data->email;
$user->mdp = $data->mdp;
$email_exists = $user->checkEmailExists();
$pw_updated = $user->pwUpdated();
 
// check if email exists and if password input in brut is correct to passeword hashed
if($email_exists && $pw_updated){ //built-in function password_verify — Verifies that a password matches a hash
 
    // set response code
    http_response_code(200);
    // response in json format
    echo json_encode(array("message" => "Le mot de passe de l'utilisateur {$user->email} a été mis à jour."));
 
}
 
// update pw failed
else{
 
    // set response code unauthorized!
    http_response_code(401);
 
    // tell the user login failed
    echo json_encode(array("message" => "Echec la mise à jour de mot de passe."));
}
?>