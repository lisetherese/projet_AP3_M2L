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
include_once '../objects/motif.php';
  
// utilities
$utilities = new Utilities();
  
// instantiate database and motif object
$database = new Database();
$db = $database->getConnection();
  
// initialize object
$motif = new Motif($db);
  
// query motifs
$stmt = $motif->readPaging($from_record_num, $records_per_page);
$num = $stmt->rowCount();
  
// check if more than 0 record found
if($num>0){
  
    // declare motifs array as empty
    $motifs_arr=array();
    $motifs_arr["records"]=array();
    $motifs_arr["paging"]=array();
  
    // retrieve our table contents
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){

        // extract row : this will make $row['name'] to just $name only
        extract($row);
  
        $motif_item=array(
            "id" => $id_motif,
            "libelle" => $libelle
        );
  
        array_push($motifs_arr["records"], $motif_item);
    }
  
  
    // include paging
    $total_rows=$motif->count();
    $page_url="{$home_url}motif/read_paging_motifs.php?";
    $paging=$utilities->getPaging($page, $total_rows, $records_per_page, $page_url);
    $motifs_arr["paging"]=$paging;
  
    // set response code - 200 OK
    http_response_code(200);
  
    // make it json format
    echo json_encode($motifs_arr);
}
  
else{
  
    // set response code - 404 Not found
    http_response_code(404);
  
    // tell the motif motifs does not exist
    echo json_encode(
        array("message" => "Aucun motif trouvé.")
    );
}
?>