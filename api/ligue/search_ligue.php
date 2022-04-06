<?php
// required headers
header("Access-Control-Allow-Origin: http://localhost/M2L/");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json; charset=UTF-8');
  
// include database and object files
include_once '../config/core.php';
include_once '../config/database.php';
include_once '../objects/ligue.php';
  
// instantiate database and ligue object
$database = new Database();
$db = $database->getConnection();
  
// initialize object
$ligue = new Ligue($db);
  
// get keywords
$keywords=isset($_GET["s"]) ? $_GET["s"] : "";
  
// query ligues
$stmt = $ligue->search($keywords);
$num = $stmt->rowCount();

// check if more than 0 record found
if($num>0){
  
    // ligues array
    $ligues_arr=array();
    $ligues_arr["records"]=array();
  
    // retrieve our table contents
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        extract($row);
  
        $ligue_item=array(
            "id" => $id_ligues,
            "nom" => $nom,
            "sigle" => $sigle,
            "president" => $president,
            "reser_hors" => $reservation_an_hors_amphi,
            "reser_am" => $reservation_amphi,
            "reser_con" => $reservation_convivialite
        );
  
        array_push($ligues_arr["records"], $ligue_item);
    }
  
    // set response code - 200 OK
    http_response_code(200);
  
    // show ligues data
    echo json_encode($ligues_arr);
}
  
else{
    // set response code - 404 Not found
    http_response_code(404);
  
    // tell the ligue no ligues found
    echo json_encode(
        array("message" => "Aucune ligue trouvée ou la recherche invalide.")
    );
}
?>