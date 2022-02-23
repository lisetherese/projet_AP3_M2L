<?php
// required headers
header("Access-Control-Allow-Origin: http://localhost/M2L/");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
  
// include database and object files
include_once '../config/core.php';
include_once '../shared/utilities.php';
include_once '../config/database.php';
include_once '../objects/ligue.php';
  
// utilities
$utilities = new Utilities();
  
// instantiate database and ligue object
$database = new Database();
$db = $database->getConnection();
  
// initialize object
$ligue = new Ligue($db);
  
// query ligues
$stmt = $ligue->readPaging($from_record_num, $records_per_page);
$num = $stmt->rowCount();
  
// check if more than 0 record found
if($num>0){
  
    // declare ligues array as empty
    $ligues_arr=array();
    $ligues_arr["records"]=array();
    $ligues_arr["paging"]=array();
  
    // retrieve our table contents
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){

        // extract row : this will make $row['name'] to just $name only
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
  
  
    // include paging
    $total_rows=$ligue->count();
    $page_url="{$home_url}ligue/read_paging_ligues.php?";
    $paging=$utilities->getPaging($page, $total_rows, $records_per_page, $page_url);
    $ligues_arr["paging"]=$paging;
  
    // set response code - 200 OK
    http_response_code(200);
  
    // make it json format
    echo json_encode($ligues_arr);
}
  
else{
  
    // set response code - 404 Not found
    http_response_code(404);
  
    // tell the ligue ligues does not exist
    echo json_encode(
        array("message" => "Aucune ligue trouvée.")
    );
}
?>