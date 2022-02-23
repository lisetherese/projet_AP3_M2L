<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// files needed to connect to database
include_once '../config/database.php';
include_once '../objects/ligne_frais.php';
 
// get database connection
$database = new Database();
$db = $database->getConnection();
 
// instantiate ligne_frais object with empty property values
$ligne_frais = new LigneFrais($db);
 
// get input data posted, turn it into JSON string then convert it into PHP variable 
$data = json_decode(file_get_contents("php://input"));
 
 
// set ligne_frais property values according to posted data
$ligne_frais->id = $data->id;
$ligne_frais->date_ligne_frais = $data->date_ligne_frais;
$ligne_frais->trajet = $data->trajet;
$ligne_frais->km = floatval($data->km);
$ligne_frais->km_valide = $ligne_frais->km*intval($data->type_trajet);
if ($data->cout_peage === null || $data->cout_peage === ''){
    $ligne_frais->cout_peage = null;
    $ligne_frais->peage_valide = null;
    $ligne_frais->peage_justificatif = null;
}else{
    $ligne_frais->cout_peage = floatval($data->cout_peage);
    $ligne_frais->peage_valide = $ligne_frais->cout_peage*intval($data->multip_peage);
    if ($data->peage_justificatif === null || $data->peage_justificatif === ''){
        $ligne_frais->peage_justificatif = 'no_modif';
        
    }else{
        $ligne_frais->peage_justificatif = $data->peage_justificatif;
    }
}

if ($data->cout_repas === null || $data->cout_repas === ''){
    $ligne_frais->cout_repas = null;
    $ligne_frais->repas_valide = null;
    $ligne_frais->repas_justificatif = null;
}else{
    $ligne_frais->cout_repas = floatval($data->cout_repas);
    $ligne_frais->repas_valide = $ligne_frais->cout_repas*intval($data->multip_repas);
    if ($data->repas_justificatif === null || $data->repas_justificatif === ''){
        $ligne_frais->repas_justificatif = 'no_modif';       
    }else{
        $ligne_frais->repas_justificatif = $data->repas_justificatif;
    }
}

if ($data->cout_hebergement === null || $data->cout_hebergement === ''){
    $ligne_frais->cout_hebergement = null;
    $ligne_frais->hebergement_valide = null;
    $ligne_frais->justificatif = null;
}else{
    $ligne_frais->cout_hebergement = floatval($data->cout_hebergement);
    $ligne_frais->hebergement_valide = $ligne_frais->cout_hebergement*intval($data->multip_heberge);
    if ($data->justificatif === null || $data->justificatif === ''){
        $ligne_frais->justificatif = 'no_modif';
        
    }else{
        $ligne_frais->justificatif = $data->justificatif;   
    }
}

$ligne_frais->id_user = intval($data->id_user);
$ligne_frais->id_motif = intval($data->id_motif);

// update the ligne_frais record
if($ligne_frais->update()){
    
    // set response code
    http_response_code(200);
            
    // response in json format
    echo json_encode(array("message" => "La ligne frais a été mise à jour."));
}
// message if unable to update ligne_frais
else{
    // set response code - service unavailable
    http_response_code(503);
    // show error message
    echo json_encode(array("message" => "Impossible de mettre à jour la ligne frais."));
    }

?>