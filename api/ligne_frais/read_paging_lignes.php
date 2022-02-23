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
include_once '../objects/ligne_frais.php';
  
// utilities
$utilities = new Utilities();
  
// instantiate database and ligne_frais object
$database = new Database();
$db = $database->getConnection();
  
// initialize object
$ligne_frais = new LigneFrais($db);
  
// query ligne_fraiss
$stmt = $ligne_frais->readPaging($from_record_num, $records_per_page);
$num = $stmt->rowCount();
  
// check if more than 0 record found
if($num>0){
  
    // declare ligne_fraiss array as empty
    $lignes_frais_arr=array();
    $lignes_frais_arr["records"]=array();
    $lignes_frais_arr["paging"]=array();
  
    // retrieve our table contents
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){

        // extract row : this will make $row['name'] to just $name only
        extract($row);
  
        $ligne_frais_item=array(
            "id" => $id_ligne_frais,
            "date_ligne_frais" => $date_ligne_frais,
            "trajet" => $trajet,
            "km" =>$km,
            "km_valide" => $km_valide,
            "id_user" => $id_utilisateur,
            "etre_valide" => $etre_valide
        );
  
        array_push($lignes_frais_arr["records"], $ligne_frais_item);
    }
  
  
    // include paging
    $total_rows=$ligne_frais->count();
    $page_url="{$home_url}ligne_frais/read_paging_lignes.php?";
    $paging=$utilities->getPaging($page, $total_rows, $records_per_page, $page_url);
    $lignes_frais_arr["paging"]=$paging;
  
    // set response code - 200 OK
    http_response_code(200);
  
    // make it json format
    echo json_encode($lignes_frais_arr);
}
  
else{
  
    // set response code - 404 Not found
    //http_response_code(404);
  
    // tell the ligne_frais ligne_fraiss does not exist
    echo json_encode(
        array("message" => "Aucune ligne frais trouvée.")
    );
}
?>