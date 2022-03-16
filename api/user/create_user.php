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
 
// instantiate product object
$user = new User($db);
 
// get posted data
//file_get_contents() to read the contents of a file into a string and json_decode() to turn it into object json
$data = json_decode(file_get_contents("php://input"));
 
// set product property values
//$user->firstname = $data->firstname;
//$user->lastname = $data->lastname;
$user->email = $data->email;
$user->mdp = $data->mdp;
$user->role = $data->role;
$user->niveau_tarif = intval($data->niveau_tarif);
$user->droit_reservation = intval($data->droit_reservation);
//set variable to check if email of new user already existed or not, to make email of user is unique in BD
$email_exists = $user->checkEmailExists();
 
// create the user
if( !$email_exists &&
    !empty($user->email) &&
    !empty($user->mdp) &&
    $user->create()
){
 
    // set response code
    http_response_code(200);
 
    // display message: user was created
    echo json_encode(array("message" => "L'utilisateur a été créé."));
}
 
// message if unable to create user
else{
 
    // set response code - client error (invalid request)
    http_response_code(400);
 
    // display message: unable to create user
    echo json_encode(array("message" => "Impossible à créer l'utilisateur car l'adresse email déjà utilisé."));
}
?>