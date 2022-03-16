<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// required to decode jwt
include_once '../config/core.php';
include_once '../libs/BeforeValidException.php';
include_once '../libs/ExpiredException.php';
include_once '../libs/SignatureInvalidException.php';
include_once '../libs/JWT.php';
include_once '../libs/Key.php';
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

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
 
// get jwt
$jwt=isset($data->jwt) ? $data->jwt : "";
 
// if jwt is not empty
if($jwt){
    // if decode succeed, show user details
    try {
 
        // decode jwt
        $decoded = JWT::decode($jwt, new Key($key, 'HS256'));
 
        // set user property values according to posted data except for id_user set in $token
        $user->role = $data->role;
        $user->droit_reservation = intval($data->droit_reservation);
        $user->niveau_tarif = $data->niveau_tarif;
        $user->email = $data->email;
        $user->id = $decoded->data->id; //keep id as id_user in $token['data'=>"id": id_user]
        if (!empty($data->mdp)){
            $user->mdp = $data->mdp;
        }
        //set variable to check if email of new user already existed or not, to make email of user is unique in BD
        $email_exists = $user->checkEmailExists();

        // update the user record
        if($email_exists && $user->update()){
            // we need to re-generate jwt because user details might be different
            $token = array(
                "iat" => $issued_at,
                "exp" => $expiration_time,
                "data" => array(
                    "id" => $user->id,
                    "email" => $user->email,
                    "role" => $user->role,
                    "droit_reservation" => $user->droit_reservation, // int value
                    "niveau_tarif" => $user->niveau_tarif
                )
            );
            $jwt = JWT::encode($token, $key, 'HS256');
            
            // set response code
            http_response_code(200);
            
            // response in json format
            echo json_encode(
                    array(
                        "message" => "L'utilisateur a été mis à jour.",
                        "jwt" => $jwt //this key 'jwt' contains all data of user except password
                        
                    )
                );
        }
        
        // message if unable to update user
        else{
            // set response code unauthorized
            http_response_code(401);
        
            // show error message
            echo json_encode(array("message" => "Impossible de mettre à jour l'utilisateur car l'adresse email déjà utilisé."));
        }
    }
 
    // if decode fails, it means jwt is invalid
    catch (Exception $e){
    
        // set response code unauthorized
        http_response_code(401);
    
        // show error message
        echo json_encode(array(
            "message" => "Accès refusé.",
            "error" => $e->getMessage()
        ));
    }
}
 
// show error message if jwt is empty
else{
 
    // set response code unauthorized
    http_response_code(401);
 
    // tell the user access denied
    echo json_encode(array("message" => "Accès refusé."));
}
?>