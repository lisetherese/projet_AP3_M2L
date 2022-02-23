<?php
// show error reporting
ini_set('display_errors', 1); //'display_errors' will = 1 during script execution, will be restored when it ends
error_reporting(E_ALL);
 
// set your default time-zone
date_default_timezone_set('Europe/Paris');
 
// variables used for jwt
$key = "key_of_me";
$issued_at = time();
$expiration_time = $issued_at + (60 * 60); // valid for 1 hour
//$issuer = "http://localhost/CodeOfaNinja/RestApiAuthLevel1/";

// home page url
$home_url="http://localhost/M2L/api/";
  
// page given in URL parameter, default page is one
$page = isset($_GET['page']) ? $_GET['page'] : 1;
  
// set number of records per page
$records_per_page = 5;
  
// calculate for the query LIMIT clause
$from_record_num = ($records_per_page * $page) - $records_per_page;
?>