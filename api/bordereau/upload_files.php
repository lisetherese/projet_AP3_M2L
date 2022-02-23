<?php

$response = '';
$this_year = date("Y");
$dir = 'C:\\xampp\\htdocs\\M2L\\assets\\files\\bordereaux\\';
$dir_cerfa = 'C:\\xampp\\htdocs\\M2L\\assets\\files\\cerfa\\';

if(isset($_POST['data'])){
     
    $img = $_POST['data'];
    $img = str_replace('data:image/jpeg;base64,', '', $img);
    $img = str_replace(' ', '+', $img);
    //retrieve content of file using base64 decoding
    $fileData = base64_decode($img);
    //saving in name as below
    $fileName = $dir."user_id_{$_POST['idUser']}_{$this_year}.jpg";
    // Write the content back to the fileName
    if(file_put_contents($fileName, $fileData)){
        $response .= 'Bordereau téléchargement réussi. ';
    }else{$response .= 'Impossible de télécharger votre bordereau. ';};

   echo $response;
   
}else if(isset($_POST['datapdf'])){
    //retrieve content of file using base64 decoding
    $cerfa = base64_decode($_POST['datapdf']);
    //saving in name as below
    $cerfaName = $dir_cerfa."user_id_{$_POST['idUser']}_{$this_year}.pdf";
    // Write the content back to the cerfaName
    if(file_put_contents($cerfaName, $cerfa)){
        $response .= 'CERFA téléchargement réussi. ';
    }else{$response .= 'Impossible de télécharger le CERFA. ';};

    echo $response;
    
}else if(isset($_FILES)){
    if(isset($_FILES['src_bordereau']['name'])){
        $bordereau_file_name = $_FILES['src_bordereau']['name'];
        //$location_1 = $dir.$bordereau_file_name;
        $path_parts = pathinfo($bordereau_file_name);
        $extension1 = $path_parts['extension'];
        $location_bor = $dir."user_id_".$_POST['id_user']."_".$this_year.".".$extension1;
        // Upload file
        if(move_uploaded_file($_FILES['src_bordereau']['tmp_name'],$location_bor)){
            $response .= 'Bordereau téléchargement réussi. ' ;
        } 
    }
    if(isset($_FILES['cerfa']['name'])){
        $cerfa_file_name = $_FILES['cerfa']['name'];
        $path_part = pathinfo($cerfa_file_name);
        $extension2 = $path_part['extension'];
        $location_cer = $dir_cerfa."user_id_".$_POST['id_user']."_".$this_year.".".$extension;
        // Upload file
        if(move_uploaded_file($_FILES['cerfa']['tmp_name'],$location_cer)){
            $response .= 'CERFA fichier téléchargement réussi. ' ;
        } 
    }
    echo $response;
}
?>