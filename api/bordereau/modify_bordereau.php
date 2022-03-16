<?php
// required headers
header("Access-Control-Allow-Origin: *");
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
 
// instantiate bordereau object with empty property values
$bordereau = new Bordereau($db);
 
// get input data posted, turn it into JSON string then convert it into PHP variable 
$data = json_decode(file_get_contents("php://input"));
 
$this_year = date("Y"); 
// set bordereau property values according to posted data
$bordereau->id = $data->id;
$bordereau->id_user = $data->id_user;
if($data->src_bordereau === null || $data->src_bordereau === ''){
    $bordereau->src_bordereau = "no_modif";
}else{
    $pathinfo = pathinfo($data->src_bordereau);
    $extension_bor = $pathinfo['extension'];
    $bordereau->src_bordereau = "user_id_{$data->id_user}_{$this_year}.{$extension_bor}";
}
if($data->cerfa === null || $data->cerfa === ''){
    $bordereau->cerfa = "no_modif";
}else{
    $pathinfo_cer = pathinfo($data->cerfa);
    $extension_cer = $pathinfo_cer['extension'];
    $bordereau->cerfa = "user_id_{$data->id_user}_{$this_year}.{$extension_cer}";
}

// update the bordereau record
if($bordereau->update()){
    
    // set response code
    http_response_code(200);
            
    // response in json format
    echo json_encode(array("message" => "Le bordereau a été mis à jour."));
}
// message if unable to update bordereau
else{
    // set response code - service unavailable
    http_response_code(503);
    // show error message
    echo json_encode(array("message" => "Impossible de mettre à jour le bordereau."));
    }
   // echo json_encode(array("src_bor"=>$bordereau->src_bordereau, "cerfa"=>$bordereau->cerfa, "id"=>$bordereau->id, "id_user"=>$bordereau->id_user));

?>