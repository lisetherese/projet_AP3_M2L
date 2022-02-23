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
include_once '../objects/motif.php';
  
// instantiate database and motif object
$database = new Database();
$db = $database->getConnection();
  
// initialize object
$motif = new Motif($db);
  
// get keywords
$keywords=isset($_GET["s"]) ? $_GET["s"] : "";
  
// query motifs
$stmt = $motif->search($keywords);
$num = $stmt->rowCount();

// check if more than 0 record found
if($num>0){
  
    // motifs array
    $motifs_arr=array();
    $motifs_arr["records"]=array();
  
    // retrieve our table contents
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        extract($row);
  
        $motif_item=array(
            "id" => $id_motif,
            "libelle" => $libelle
        );
  
        array_push($motifs_arr["records"], $motif_item);
    }
  
    // set response code - 200 OK
    http_response_code(200);
  
    // show motifs data
    echo json_encode($motifs_arr);
}
  
else{
    // set response code - 404 Not found
    http_response_code(404);
  
    // tell the motif no motifs found
    echo json_encode(
        array("message" => "Aucun motif trouvé ou la recherche invalide.")
    );
}
?>