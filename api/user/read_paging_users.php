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
include_once '../objects/user.php';
  
// utilities
$utilities = new Utilities();
  
// instantiate database and user object
$database = new Database();
$db = $database->getConnection();
  
// initialize object
$user = new User($db);
  
// query users
$stmt = $user->readPaging($from_record_num, $records_per_page);
$num = $stmt->rowCount();
  
// check if more than 0 record found
if($num>0){
  
    // declare users array as empty
    $users_arr=array();
    $users_arr["records"]=array();
    $users_arr["paging"]=array();
  
    // retrieve our table contents
    // fetch() is faster than fetchAll()
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row : this will make $row['name'] to just $name only
        extract($row);
  
        $user_item=array(
            "id" => $id_utilisateur,
            "email" => $email,
            "role" => $role,
            "droit_reservation" => $droit_reservation,
            "niveau_tarif" => $niveau_tarif
        );
  
        array_push($users_arr["records"], $user_item);
    }
  
  
    // include paging
    $total_rows=$user->count();
    $page_url="{$home_url}user/read_paging_users.php?";
    $paging=$utilities->getPaging($page, $total_rows, $records_per_page, $page_url);
    $users_arr["paging"]=$paging;
  
    // set response code - 200 OK
    http_response_code(200);
  
    // make it json format
    echo json_encode($users_arr);
}
  
else{
  
    // set response code - 404 Not found
    http_response_code(404);
  
    // tell the user users does not exist
    echo json_encode(
        array("message" => "Aucun utilisateur trouvé.")
    );
}
?>