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
include_once '../objects/demandeur.php';
  
// utilities
$utilities = new Utilities();
  
// instantiate database and demandeur object
$database = new Database();
$db = $database->getConnection();
  
// initialize object
$demandeur = new Demandeur($db);
  
// query demandeurs
$stmt = $demandeur->readPaging($from_record_num, $records_per_page);
$num = $stmt->rowCount();
  
// check if more than 0 record found
if($num>0){
  
    // declare demandeurs array as empty
    $demandeurs_arr=array();
    $demandeurs_arr["records"]=array();
    $demandeurs_arr["paging"]=array();
  
    // retrieve our table contents
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){

        // extract row : this will make $row['name'] to just $name only
        extract($row);
  
        $demandeur_item=array(
            "id" => $id_demandeur,
            "nom" => $nom,
            "prenom" => $prenom,
            "rue" =>$rue,
            "ville" => $ville,
            "cp" => $cp,
            "num_licence" => $num_licence,
            "etre_adherent" => $etre_adherent
        );
  
        array_push($demandeurs_arr["records"], $demandeur_item);
    }
  
  
    // include paging
    $total_rows=$demandeur->count();
    $page_url="{$home_url}demandeur/read_paging_demandeurs.php?";
    $paging=$utilities->getPaging($page, $total_rows, $records_per_page, $page_url);
    $demandeurs_arr["paging"]=$paging;
  
    // set response code - 200 OK
    http_response_code(200);
  
    // make it json format
    echo json_encode($demandeurs_arr);
}
  
else{
  
    // set response code - 404 Not found
    http_response_code(404);
  
    // tell the demandeur demandeurs does not exist
    echo json_encode(
        array("message" => "Aucun demandeur trouvé.")
    );
}
?>