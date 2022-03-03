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
include_once '../objects/demandeur.php';
  
// instantiate database and demandeur object
$database = new Database();
$db = $database->getConnection();
  
// initialize object
$demandeur = new Demandeur($db);
  
// get keywords
$keywords=isset($_GET["s"]) ? $_GET["s"] : "";
  
// query demandeurs
$stmt = $demandeur->search($keywords);
$num = $stmt->rowCount();

// check if more than 0 record found
if($num>0){
  
    // demandeurs array
    $demandeurs_arr=array();
    $demandeurs_arr["records"]=array();
  
    // retrieve our table contents
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        extract($row);
  
        $demandeur_item=array(
            "id" => $id_demandeur,
            "nom" => $nom,
            "prenom" => $prenom,
            "rue" => $rue,
            "ville" => $ville,
            "cp" => $cp,
            "num_licence" => $num_licence,
            "date_naissance" => $date_naissance,
            "etre_adherent" => $etre_adherent,
            "id_user" => $id_utilisateur,
            "id_ligue" => $id_ligue
        );
  
        array_push($demandeurs_arr["records"], $demandeur_item);
    }
  
    // set response code - 200 OK
    http_response_code(200);
  
    // show demandeurs data
    echo json_encode($demandeurs_arr);
}
  
else{
    // set response code - 404 Not found
    http_response_code(404);
  
    // tell the demandeur no demandeurs found
    echo json_encode(
        array("message" => "Aucun demandeur trouvé ou la recherche invalide.")
    );
}
?>