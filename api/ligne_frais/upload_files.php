<?php

if(isset($_FILES)){
    $folder = "user_id_{$_POST['id_user']}";
    $dir = 'C:\\xampp\\htdocs\\M2L\\assets\\files\\ligne_frais\\';
    // Location
   $location = $dir.$folder;
   if(!file_exists($location)){
    mkdir($location,0777);
   }
    // Valid extensions
    $valid_ext = array("pdf","jpg","png","jpeg");

    $response = '';
    
    if(isset($_FILES['peage_jus']['name'])){
        $peage_file_name = $_FILES['peage_jus']['name'];
        $location_1 = $location.'\\'.$peage_file_name;
        $file_extension_1 = strtolower(pathinfo($location_1, PATHINFO_EXTENSION));
        if(in_array($file_extension_1,$valid_ext)){
            // Upload file
            if(move_uploaded_file($_FILES['peage_jus']['tmp_name'],$location_1)){
               $response .= 'Peage justificatif téléchargement réussi. ' ;
            } 
         }
    }
    if(isset($_FILES['repas_jus']['name'])){
        $repas_file_name = $_FILES['repas_jus']['name'];
        $location_2 = $location.'\\'.$repas_file_name;
        $file_extension_2 = strtolower(pathinfo($location_2, PATHINFO_EXTENSION));
        if(in_array($file_extension_2,$valid_ext)){
            // Upload file
            if(move_uploaded_file($_FILES['repas_jus']['tmp_name'],$location_2)){
            $response .= 'Repas justificatif téléchargement réussi. ';
            } 
        }
    }
    if(isset($_FILES['heberge_jus']['name'])){
        $heberge_file_name = $_FILES['heberge_jus']['name'];
        $location_3 = $location.'\\'.$heberge_file_name;
        $file_extension_3 = strtolower(pathinfo($location_3, PATHINFO_EXTENSION));
        if(in_array($file_extension_3,$valid_ext)){
            // Upload file
            if(move_uploaded_file($_FILES['heberge_jus']['tmp_name'],$location_3)){
            $response .='Hébergement justificatif téléchargement réussi. ';
            } 
        }
    } 

   echo $response;
   exit;
}
?>