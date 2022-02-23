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
include_once '../objects/bordereau.php';
  
// instantiate database and bordereau object
$database = new Database();
$db = $database->getConnection();
  
// initialize object
$bordereau = new Bordereau($db);
  
// get keywords
$keywords=isset($_GET["s"]) ? $_GET["s"] : "";
  
// query bordereaus
$stmt = $bordereau->search($keywords);
$num = $stmt->rowCount();

// check if more than 0 record found
if($num>0){
  
    // bordereaus array
    $bordereaux_arr=array();
    $bordereaux_arr["records"]=array();
  
    // retrieve our table contents
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        extract($row);
  
        $bordereau_item=array(
            "id" => $id_bordereau,
            "src_bordereau" => $src_bordereau,
            "id_user" => $id_utilisateur,
            "cerfa" =>$cerfa,
            "etre_valide" => $etre_valide
        );
  
        array_push($bordereaux_arr["records"], $bordereau_item);
    }
  
    // set response code - 200 OK
    http_response_code(200);
  
    // show bordereaus data
    echo json_encode($bordereaux_arr);
}
  
else{
    // set response code - 404 Not found
    //http_response_code(404);
  
    // tell the bordereau no bordereau found
    echo json_encode(
        array("message" => "Aucun bordereau trouvé ou la recherche invalide.")
    );
}
?>