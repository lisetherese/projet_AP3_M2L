<?php
  /**
  * Requires the "PHP Email Form" library
  * The library should be uploaded to: vendor/php-email-form/php-email-form.php
  */

  $receiving_email_address = 'hanhtrinhvedathua@gmail.com';

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
  $contact->from_name = $_POST['nom'];
  $contact->from_email = $_POST['email'];

  //function send mail for form 'conactez-nous' on front page!
  if(isset($_POST['message'])){
    $contact->subject = "Demande de renseignement";
    $contact->add_message( $_POST['message'], 'Contenu du message');
  }
  else{//function send mail to demande d'adhésion!
    //add subject of email
    $contact->subject = "Demande d'adhésion";
    // add content of email
    $contact->add_message( $_POST['id_user'], 'Id Utilisateur');
    $contact->add_message( $_POST['nom'], 'Nom');
    $contact->add_message( $_POST['prenom'], 'Prénom');
    $contact->add_message( $_POST['rue'], 'Adresse');
    $contact->add_message( $_POST['cp'], 'Code postal');
    $contact->add_message( $_POST['ville'], 'Ville');
    $contact->add_message( $_POST['date_naissance'], 'Date de naissance');
    $contact->add_message( $_POST['num_licence'], 'Numéro de licence');
    $contact->add_message( $_POST['ligue'], 'Nom de la ligue');
    // add attachment
    $contact->add_attachment( $name='justificatif' ); 
  }
  //common 'send' function!
  echo $contact->send();
?>
