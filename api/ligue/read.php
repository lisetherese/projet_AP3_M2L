<?php
// required header
header("Access-Control-Allow-Origin: http://localhost/M2L/");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
  
// include database and object files
include_once '../config/database.php';
include_once '../objects/ligue.php';
  
// instantiate database and ligue object
$database = new Database();
$db = $database->getConnection();
  
// initialize object
$ligue = new Ligue($db);
  
// query ligues
$stmt = $ligue->read();
$num = $stmt->rowCount();
  
// check if more than 0 record found
if($num>0){
  
    // products array
    $ligues_arr=array();
    $ligues_arr["records"]=array();
  

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        
        extract($row);
  
        $ligue_item=array(
            "id" => $id_ligues,
            "nom" => $nom,
            "sigle" => $sigle,
            "president" => $president
        );
  
        array_push($ligues_arr["records"], $ligue_item);
    }
  
    // set response code - 200 OK
    http_response_code(200);
  
    // show categories data in json format
    echo json_encode($ligues_arr);
}
  
else{
  
    // set response code - 404 Not found
    http_response_code(404);
  
    // tell the user no categories found
    echo json_encode(
        array("message" => "Aucune ligue trouvée.")
    );
}
?>