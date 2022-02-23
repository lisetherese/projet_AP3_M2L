<?php

if(isset($_POST)){
    $folder = "user_id_{$_POST['id_user']}";
    $dir = 'C:\\xampp\\htdocs\\M2L\\assets\\files\\ligne_frais\\';
    // Location
    $location = $dir.$folder;
    $response = '';
    if(isset($_POST['peage_jus'])){
        $location_1 = $location.'\\'.$_POST['peage_jus'];
        if(unlink($location_1)){
            $response .='Peage justificatif suppression réussi. ';
        }
    }
    if(isset($_POST['repas_jus'])){
        $location_2 = $location.'\\'.$_POST['repas_jus'];
        if(unlink($location_2)){
            $response .='Repas justificatif suppression réussi. ';
        }else{
            $response .= 'Pas de suppression du repas justificatif nécessaire';
        }
    }
    if(isset($_POST['heberge_jus'])){
        $location_3 = $location.'\\'.$_POST['heberge_jus'];
        if(unlink($location_3)){
            $response .='Hébergement justificatif suppression réussi. ';
        }
    }
    //check if after all delete above, folder of user is empty or not
    $isDirEmpty = !(new \FilesystemIterator($location))->valid();
    if($isDirEmpty){
        if(rmdir($location)){
            $response .=`Dossier de l'utilisateur a été supprimé. `;
        }
    }
    echo $response;
    exit;
}

?>