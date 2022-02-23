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
include_once '../objects/bordereau.php';
  
// utilities
$utilities = new Utilities();
  
// instantiate database and bordereau object
$database = new Database();
$db = $database->getConnection();
  
// initialize object
$bordereau = new Bordereau($db);
  
// query bordereaux
$stmt = $bordereau->readPaging($from_record_num, $records_per_page);
$num = $stmt->rowCount();
  
// check if more than 0 record found
if($num>0){
  
    // declare bordereaux array as empty
    $bordereaux_arr=array();
    $bordereaux_arr["records"]=array();
    $bordereaux_arr["paging"]=array();
  
    // retrieve our table contents
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){

        // extract row : this will make $row['name'] to just $name only
        extract($row);
  
        $bordereau_item=array(
            "id" => $id_bordereau,
            "src_bordereau" => $src_bordereau,
            "id_user" => $id_utilisateur,
            "cerfa" => $cerfa,
            "etre_valide" => $etre_valide
        );
  
        array_push($bordereaux_arr["records"], $bordereau_item);
    }
  
  
    // include paging
    $total_rows=$bordereau->count();
    $page_url="{$home_url}bordereau/read_paging_bordereau.php?";
    $paging=$utilities->getPaging($page, $total_rows, $records_per_page, $page_url);
    $bordereaux_arr["paging"]=$paging;
  
    // set response code - 200 OK
    http_response_code(200);
  
    // make it json format
    echo json_encode($bordereaux_arr);
}
  
else{
  
    // set response code - 404 Not found
    //http_response_code(404);
  
    // tell user the bordereaux does not exist
    echo json_encode(
        array("message" => "Aucun bordereau trouvé.")
    );
}
?>