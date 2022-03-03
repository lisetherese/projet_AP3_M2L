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
include_once '../objects/ligne_frais.php';
  
// instantiate database and ligne_frais object
$database = new Database();
$db = $database->getConnection();
  
// initialize object
$ligne_frais = new LigneFrais($db);
  
// get keywords
$keywords=isset($_GET["s"]) ? $_GET["s"] : "";
  
// query ligne_fraiss
$stmt = $ligne_frais->search($keywords);
$num = $stmt->rowCount();

// check if more than 0 record found
if($num>0){
  
    // ligne_fraiss array
    $lignes_frais_arr=array();
    $lignes_frais_arr["records"]=array();
  
    // retrieve our table contents
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        extract($row);
  
        $ligne_frais_item=array(
            "id" => $id_ligne_frais,
            "date_ligne_frais" => $date_ligne_frais,
            "trajet" => $trajet,
            "km" =>$km,
            "id_user" =>$id_utilisateur,
            "km_valide" => $km_valide,
            "etre_valide" => $etre_valide
        );
  
        array_push($lignes_frais_arr["records"], $ligne_frais_item);
    }
  
    // set response code - 200 OK
    http_response_code(200);
  
    // show ligne_fraiss data
    echo json_encode($lignes_frais_arr);
}
  
else{
    // set response code - 404 Not found
    //http_response_code(404);
  
    // tell the ligne_frais no ligne_frais found
    echo json_encode(
        array("message" => "Aucune ligne frais trouvée ou la recherche invalide.")
    );
}
?>