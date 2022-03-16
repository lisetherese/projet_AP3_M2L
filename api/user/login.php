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
$email_exists = $user->emailExists();
 
// generate json web token
include_once '../config/core.php';
include_once '../libs/BeforeValidException.php';
include_once '../libs/ExpiredException.php';
include_once '../libs/SignatureInvalidException.php';
include_once '../libs/JWT.php';
use \Firebase\JWT\JWT;
 
// check if email exists and if password input in brut is correct to passeword hashed
if($email_exists && password_verify($data->mdp, $user->mdp)){ //built-in function password_verify — Verifies that a password matches a hash
 
    $token = array(
       "iat" => $issued_at,
       "exp" => $expiration_time,
       "data" => array(
           "id" => $user->id,
           "email" => $user->email,
           "role" => $user->role,
           "droit_reservation" => $user->droit_reservation,
           "niveau_tarif" => $user->niveau_tarif
       )
    );
    //"iss" => $issuer not obligatory for token but recommended
 
    // set response code
    http_response_code(200);
 
    // generate jwt and create JSON object from array including all user's data
    $alg = 'HS256';
    $jwt = JWT::encode($token, $key, $alg);
    echo json_encode(
            array(
                "message" => "Connexion avec succès.",
                "jwt" => $jwt,
                "id" => $user->id,
                "email" => $user->email,
                "role" => $user->role,
                "droit_reservation" => $user->droit_reservation,
                "niveau_tarif" => $user->niveau_tarif
            )
        );
    
 
}
 
// login failed
else{
 
    // set response code - unauthorized
    http_response_code(401);
 
    // tell the user login failed
    echo json_encode(array("message" => "Echec de la connexion."));
}
?>