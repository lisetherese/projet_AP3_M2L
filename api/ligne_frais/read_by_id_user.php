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
  
// get database connection
$database = new Database();
$db = $database->getConnection();
  
// prepare ligne_frais object
$ligne_frais = new LigneFrais($db);

// get data 
$ligne_frais->id_user = isset($_GET['id']) ? $_GET['id'] : die();

// read the details of ligne_frais to be edited
$stmt = $ligne_frais->readByIdUser($from_record_num, $records_per_page);
$num = $stmt->rowCount();

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
            "peage_valide" => $peage_valide,
            "repas_valide" => $repas_valide,
            "hebergement_valide" => $hebergement_valide,
            "id_motif" => $id_motif,
            "etre_valide" => $etre_valide
        );
  
        array_push($lignes_frais_arr["records"], $ligne_frais_item);
    }
  
  
    // include paging
    $total_rows=$ligne_frais->countUser();
    $page_url="{$home_url}ligne_frais/read_by_id_user.php?id={$ligne_frais->id_user}&";
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
        array("message" => "Aucune ligne frais trouvée pour l'utilisateur {$ligne_frais->id_user}.")
    );
}

?>