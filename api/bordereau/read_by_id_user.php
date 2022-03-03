<?php
// required headers
header("Access-Control-Allow-Origin: http://localhost/M2L/");
header('Content-Type: application/json; charset=UTF-8');
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
// include database and object files
include_once '../config/database.php';
include_once '../objects/bordereau.php';
  
// get database connection
$database = new Database();
$db = $database->getConnection();
  
// prepare bordereau object
$bordereau = new Bordereau($db);

// get data 
$bordereau->id_user = isset($_GET['id']) ? $_GET['id'] : die();

// read the details of bordereau to be edited
$result=$bordereau->readByIdUser();


if($result){
    // declare bordereau array as empty
    $bordereau_arr=array(
        "id" => $bordereau->id,
        "src_bordereau" => $bordereau->src_bordereau,
        "cerfa" => $bordereau->cerfa,
        "id_user" =>$bordereau->id_user,
        "etre_valide" => $bordereau->etre_valide
    );
    
  
    // set response code - 200 OK
    http_response_code(200);
  
    // make it json format
    echo json_encode($bordereau_arr);
    
}
  
else{
  
    // set response code - 404 Not found
   // http_response_code(404);
  
    // tell user the bordereau does not exist
    echo json_encode(
        array("message" => "Aucun bordereau trouvé.")
    );
}

?>