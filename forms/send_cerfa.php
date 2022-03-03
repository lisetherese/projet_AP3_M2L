<?php
  /**
  * Requires the "PHP Email Form" library
  * The library should be uploaded to: vendor/php-email-form/php-email-form.php
  */

  $receiving_email_address = $_POST['email'];

  if( file_exists($php_email_form = '../assets/vendor/php-email-form/php-email-form.php' )) {
    include( $php_email_form );
  } else {
    die( 'Unable to load the "PHP Email Form" Library!');
  }


  $contact = new PHP_Email_Form;
  $contact->ajax = true;
  $contact->smtp = array(
    'host' => 'smtp.gmail.com',
    'username' => 'hanhtrinhvedathua@gmail.com',
    'password' => 'Hanhtrinh2019',
    'port' => '587'
  );
  //add info for the head of email
  $contact->to = $receiving_email_address;
  $contact->from_name = "Maison des Ligues";
  $contact->from_email = 'maisonliguescontact@gmail.com';
  //add subject of email
  $contact->subject = "Votre document CERFA est disponible en ligne";
  // add content of email
  $contact->add_message( 'Veuillez vous connecter à votre compte sur notre site pour consulter votre document CERFA.', 'Important');

  //common 'send' function!
  echo $contact->send();
?>
