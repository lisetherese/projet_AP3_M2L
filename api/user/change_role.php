<?php
// required headers
// Accès depuis n'importe quel site ou appareil
header("Access-Control-Allow-Origin: http://localhost/M2L/");
// Format des données envoyées
header("Content-Type: application/json; charset=UTF-8");
// Méthode autorisée
header("Access-Control-Allow-Methods: POST");
// Durée de vie de la requête
header("Access-Control-Max-Age: 3600");
// Entêtes autorisées
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

// update the user record
if($user->updateRoleAdherent()){
    
    // set response code
    http_response_code(200);
            
    // response in json format
    echo json_encode(array("message" => "L'utilisateur a été mis à jour comme l'adhérent."));
}
// message if unable to update user
else{
    // set response code - service unavailable
    http_response_code(503);
    // show error message
    echo json_encode(array("message" => "Impossible de changer le rôle de l'utilisateur comme adherent. Veuillez contacter l'administrateur."));
    }

?>