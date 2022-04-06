<?php
// required header
header('Content-Type: application/json');
  
// include database and object files
include_once '../config/database.php';
include_once '../objects/salle.php';
  
// instantiate database and salle object
$database = new Database();
$db = $database->getConnection();
  
// initialize object
$salle = new Salle($db);
  
// query salles
$stmt = $salle->read();
$num = $stmt->rowCount();
  
// check if more than 0 record found
if($num>0){
  
    // products array
    $salles_arr=array();
    //$salles_arr["records"]=array();
  

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        
        extract($row);
  
        $salle_item=array(
            "id" => $id_salle,
            "nom" => $nom,
            "capacite" => $capacite,
            "id_domaine" => $id_domaine
        );
  
        array_push($salles_arr, $salle_item);
    }
  
    // set response code - 200 OK
    http_response_code(200);
  
    // show categories data in json format
    echo json_encode($salles_arr);
}
  
else{
  
    // set response code - 404 Not found
    http_response_code(404);
  
    // tell the user no categories found
    echo json_encode(
        array("message" => "Aucun salle trouvé.")
    );
}
?>