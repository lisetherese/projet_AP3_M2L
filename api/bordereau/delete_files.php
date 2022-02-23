<?php

if(isset($_POST)){
    // set location
    $dir = 'C:\\xampp\\htdocs\\M2L\\assets\\files\\bordereaux\\';
    $dir_cerfa = 'C:\\xampp\\htdocs\\M2L\\assets\\files\\cerfa\\';

    $response = '';
    
    //declare path of files
    $file= $dir.$_POST['src_bordereau'];
    $cerfa = $dir_cerfa.$_POST['cerfa'];

    if(isset($_POST['src_bordereau'])){
         //if delete bordereau file success
        if(unlink($file)){
            $response .='Bordereau suppression réussi. ';
        }
    }
    //if cerfa exists then delete cerfa
    if(isset($_POST['cerfa'])){
        if(unlink($cerfa)){
            $response .='CERFA suppression réussi. ';
        }
    }

    echo $response;
    exit;
}

?>