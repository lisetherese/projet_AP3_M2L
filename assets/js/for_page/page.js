// remove any prompt messages
function clearResponse(){
    $('#response').html('');
}

// clear old content
function clearContent(){
    $('#content').html('');
}

// show login page
function showLoginPage(){
    // remove jwt
    setCookie("jwt", "", 1);
    clearResponse();
    showLoggedOutMenu();
    showPageAccueil();
    changePageTitle('');
}
// display information of email sending process
function php_email_form_submit(thisForm, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: {'X-Requested-With': 'XMLHttpRequest'}
    })
    .then(response => {
      if( response.ok ) {
        return response.text()
      } else {
        throw new Error(`${response.status} ${response.statusText} ${response.url}`); 
      }
    })
    .then(data => {
      thisForm.querySelector('.loading').classList.remove('d-block');
      if (data.trim() == 'OK') {
        thisForm.querySelector('.sent-message').classList.add('d-block');
        thisForm.reset(); 
      } else {
        throw new Error(data ? data : 'Form submission failed and no error message returned from: ' + action); 
      }
    })
    .catch((error) => {
      displayError(thisForm, error);
    });
}
// display error div and hide others
function displayError(thisForm, error) {
thisForm.querySelector('.loading').classList.remove('d-block');
thisForm.querySelector('.error-message').innerHTML = error;
thisForm.querySelector('.error-message').classList.add('d-block');
}


// if the user is logged out
function showLoggedOutMenu(){
    // show login and sign up from navbar & hide logout button
    $("#sign_up").show(); 
    $("#logout").hide();
    $('#role-menu').empty();
    $('#nom_user').text('');
    $('#update_account').hide();
}

// show home page
function showHomePage(role, email){
    
    // validate jwt to verify access, retrieve object jwt contains all datat from cookie
    var jwt = getCookie('jwt');
    $.post("api/validate_token.php", JSON.stringify({ jwt:jwt })).done(function(result) {
        //set welcome phrase qu'user ou que tresorier
        var role_phrase = '';
        if(role.startsWith('a') || role.startsWith('u')){
            role_phrase = `qu'`;
        }else{role_phrase = `que `;}

        //role display in full
        if(role=='user'){ role='utilisateur';}else if(role=='admin'){role='administrateur';}

        // if valid, show homepage
        var html = `
            <div class="card">
                <div class="card-header">Bienvenue `+ email +` à la <strong>Maison des ligues</strong>!</div>
                <div class="card-body">
                    <h5 class="card-title">Vous êtes connecté en tant `+ role_phrase + role +` .</h5>
                    <p class="card-text"></p>
                </div>
            </div>
            `;
        
        $('#content').html(html);
        $('#page-title').text('');
    })

    // show login page on error
    .fail(function(result){
        showLoginPage();
        $('#response').html("<div class='alert alert-danger'>Veuillez vous connecter pour accéder à la page d'acceuil.</div>");
    });
}

// if the user is logged in
function showLoggedInMenu(role){
    // hide login and sign up from navbar & show logout button
    $("#sign_up").hide();//#login, 
    $("#logout").show();
    $('#update_account').show();

    // according to the role to add menu to navbar_ can add more functions for reservation
    const menuAdmin = ` <a class="nav-item nav-link" href="#" id='gerer-user'>Utilisateurs</a>
                        <a class="nav-item nav-link" href="#" id='gerer-demandeur'>Demandeurs</a>
                        <a class="nav-item nav-link" href="#" id='gerer-ligue'>Ligues</a>
                        <a class="nav-item nav-link" href="#" id='gerer-bordereau'>Bordereaux</a>
                        <a class="nav-item nav-link" href="#" id='gerer-ligne-frais'>Lignes Frais</a>
                        <a class="nav-item nav-link" href="#" id='gerer-motif'>Motifs</a>
                        `;

    const menuUser = `<a class="d-none nav-item nav-link" href="#" id='demander-adhesion'>Demande d'adhésion</a>
                      <a class="d-none nav-item nav-link" href="#" id='gerer-demande'>Gérer la Demande</a>`;

    const menuTresor = `<a class="nav-item nav-link" href="#" id='consulter-bordereau'>Consulter Bordereaux</a>
                        <a class="nav-item nav-link" href="#" id='gerer-ligne-frais'>Gérer Lignes Frais</a>`;

    const menuAdherent = `<a class="nav-item nav-link" href="#" id='gerer-ligne'>Gérer Lignes Frais</a>`;

    switch (role) {
        case 'admin':
            $('#role-menu').append(menuAdmin);
            break;
        case 'user':
            $('#role-menu').append(menuUser);
            break;
        case 'tresorier':
            $('#role-menu').append(menuTresor);
            break;
        case 'adherent':
            $('#role-menu').append(menuAdherent);
            break;
    }


}


// change page title
function changePageTitle(page_title){

    // change page title
    $('#page-title').text(page_title);

    // change title tag
    document.title=`M2L - ${page_title}`;
}


// function to make form values to json format
$.fn.serializeObject = function(){

    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};


// function to set cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// get or read cookie
function getCookie(cname){
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' '){
            c = c.substring(1);
        }

        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

//function display content of page accueil
function showPageAccueil(){
    var html = `
            <div class="home">
            <div class="banner">
            <div class="banniere">
                <img src="assets/img/M2L net rond.png" id="banner">   
                <div>
                <h1>M2L</h1>
                <h3>Maison des Ligues de Lorraine</h3>
                </div>
            </div>
            </div>

            <div class="container">
                <div class="row">
                    <div class="col-md-3" id="Ligues">
                        <div class="row article">
                        <div class="col-md-12">
                            <div class="card text-white bg-warning hidden">
                                <img src="assets/img/bowling.jpg" class="card-img bowling" alt="..." />
                                <h5 class="card-title titreligue">BOWLING</h5>
                                <div class="card-img-overlay overlay" id="bowling">
                                    <p class="card-text text-hidden"><strong>Le bowling, également appelé jeu de quilles, est un jeu qui consiste à renverser des quilles à l’aide d’une boule.</strong></p>
                                </div>
                            </div>
                        </div>
                        </div>
                        <div class="row article">
                        <div class="col-md-12">
                            <div class="card text-white bg-warning hidden">
                            <img src="assets/img/foot.jpg" class="card-img foot" alt="..." />
                            <h5 class="card-title titreligue">FOOTBALL</h5>
                            <div class="card-img-overlay overlay" id="foot">
                                <p class="card-text text-hidden"><strong>Le football est un sport collectif qui se joue principalement au pied avec un ballon. Il oppose deux équipes de onze joueurs dans un stade, que ce soit sur un terrain gazonné.</strong></p>
                            </div>
                            </div>
                        </div>
                        </div>
                        <div class="row article">
                        <div class="col-md-12">
                            <div class="card text-white bg-warning hidden">
                            <img src="assets/img/tennis.jpg" class="card-img tennis" alt="..." />
                            <h5 class="card-title titreligue">TENNIS</h5>
                            <div class="card-img-overlay overlay" id="tennis">
                                <p class="card-text text-hidden"><strong>Le tennis est un sport de raquette qui oppose soit deux joueurs soit quatre joueurs qui forment deux équipes de deux.</strong></p>
                            </div>
                            </div>
                        </div>
                        </div>
                        <div class="row article">
                        <div class="col-md-12">
                            <div class="card text-white bg-warning hidden">
                                <img src="assets/img/plongee.jpg" class="card-img plongee" alt="..." />
                                <h5 class="card-title titreligue">PLONGEE</h5>
                                <div class="card-img-overlay overlay" id="plongee">
                                    <p class="card-text text-hidden"><strong>La plongée sous-marine est une activité consistant à rester sous l’eau marine soit en apnée dans le cas de la plongée libre, en respirant à l’aide d’un narguilé.</strong></p>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div class="col-md-5" id="M2L">
                        <div class="row">
                        <div class="col-md-12">
                            <img src="assets/img/locaux.jpg" class="card-img" alt="..." />
                        </div>
                        </div>
                        <br />
                        <div class="row">
                            <div class="col-md-12">
                                <h5 class="presentation">Présentation</h5>
                                <p class="pres">
                                La M2L (Maison des Ligues de Lorraine) est une structure financée à 100% par le Conseil Régional de Lorraine qui fournit des espaces et des services aux différentes ligues sportives régionales.
                                Elle est de nos jours dirigé par le CROS (accord passé entre le conseil régional et le Comité Régional Olympique et Sportif de Lorraine).
                                M2L regroupe de nombreux sports, du tennis à la plongée sous-marine en passant par le football.
                                Sur les pages suivantes vous retrouverez les ligues, leurs résultats et leurs actualité. Pour toute question, se référer à la page contact.
                                </p>
                            </div>
                        </div>
                        <br />
                        <div class="row">
                            <div class="col-md-12">
                                <div class="card text-white bg-warning">
                                    <img src="assets/img/president-2.jpg" class="card-img president" alt="..." />
                                    <h5 class="card-title titreligue">Jean-Marc HASS BECKER<br><br>Président du comité régional olympique et sportifs Grand Est</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3" id="Formulaires">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="card login-form">
                                <div class="card-body">
                                    <!-- Titre du formulaire -->
                                    <h3 class="card-title text-center titleForm">CONNEXION</h3>
                                    <div class="card-text">
                                    <!-- Conteneur du formulaire -->
                                    <div class="formulaire">
                                        <form id='login_form'>
                                            <div class="form-group">
                                                <!-- Zone de saisie de l'email -->
                                                <input type="email" id='email_user' name='email' class="form-control form-control-sm" placeholder="Email" required/>
                                            </div>
                                            <div class="form-group my-4 input-group">
                                                <!-- Zone de saisie du mot de passe -->
                                                <input type="password" name="mdp" id="password" class="form-control form-control-sm" placeholder="Mot de passe" required/>
                                                <div class="input-group-append"><i class="bi bi-eye-slash input-group-text" id="togglePassword"></i></div>
                                            </div>
                                                <!-- Bouton de redirection vers la vue correspondante -->
                                                <button type="submit" class="btn btn-warning w-100">Se connecter</button>
                                        </form>
                                
                                        <!-- Zone du mot de passe oublié -->
                                        <form id='mdp_oublie_form' action="forms/contact_user.php" method="post" class="php-email-form">
                                            
                                            
                                            <!--Zone de verifier si le message a été bien envoyé-->
                                            <div class="my-3">
                                                <div class="loading">En cours...</div>
                                                <div class="error-message"></div>
                                                <div class="sent-message">Le lien à changer votre mot de passe a été envoyé. Veuillez vérifier votre boite mail!</div>
                                            </div>
                                            <div class="form-group">
                                                <!--Input hidden until user click mdp oublié-->
                                                <input type="email" id='email_of_user' name='email' class="form-control form-control-sm" placeholder="Email" hidden/>
                                            </div>
                                        </form>
                                        <div id="addButton">
                                            <button id="button_mdp_oublie" class="btn btn-danger w-100"> Mot de passe oublié ?</button>
                                        </div>
                                    
                                    </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div class="row">
                        <div class="col-md-12">
                            <div class="card login-form">
                            <div class="card-body">
                                <!-- Titre du formulaire -->
                                <h3 class="card-title text-center titleForm">CONTACTEZ-NOUS</h3>
                                <div class="card-text">
                                <!-- Conteneur du formulaire de contact -->
                                <div class="formulaire">
                                <form id='contact-form' action="forms/contact.php" method="post" class="php-email-form">
                                <div class="form-group">
                                    <!-- Zone de saisie du nom et du prénom -->
                                    <input type="text"  name="nom" id="nom" class="form-control form-control-sm" placeholder="Nom et prénom" required />
                                </div>
                                <div class="form-group mb-4">
                                    <!-- Zone de saisie de l'email -->
                                    <input type="email" name="email" id="email_contact"class="form-control form-control-sm" placeholder="E-mail" required />
                                </div>
                                <div class="form-group mb-4">
                                    <!-- Zone de saisie du message -->
                                    <textarea class="form-control form-control-sm" name="message" id="message" rows="5" placeholder="Message" required ></textarea>
                                </div>
                                <!--Zone de verifier si le message a été bien envoyé-->
                                <div class="my-3">
                                    <div class="loading">En cours...</div>
                                    <div class="error-message"></div>
                                    <div class="sent-message">Votre message a été envoyé. Merci!</div>
                                </div>
                                <!-- Bouton de redirection vers la vue correspondante -->
                                <button type="submit" class="btn btn-warning w-100">Envoyer</button>
                            </form>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="back-to-top">
                <a href="#banner" class="back-to-top d-flex align-items-center justify-content-center active"><i class="fas fa-arrow-up"></i></a>
            </div>

            <footer class="text-center text-lg-start text-muted">
                <section class="">
                    <div class="container text-center text-md-start mt-5">
                        <div class="row"></div>
                        <div class="row mt-3 textcolor">
                            <div class="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                                <h6 class="text-uppercase fw-bold mb-4">
                                <i class="fas fa-gem me-3"></i> MAISON DES LIGUES DE LORRAINE
                                </h6>
                                <img src="assets/img/M2L flou2.png">  
                            </div>
                            <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                                <h6 class="text-uppercase fw-bold mb-4">LIGUES</h6>
                                <p><a href="#bowling" class="text-reset">Bowling</a></p>
                                <p><a href="#foot" class="text-reset">Foot</a></p>
                                <p><a href="#tennis" class="text-reset">Tennis</a></p>
                                <p><a href="#plongee" class="text-reset">Plongée</a></p>
                            </div>
                            <div class="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                                <h6 class="text-uppercase fw-bold mb-4">NOS RESEAUX</h6>
                                <p><a href="" class="me-4 text-reset"><i class="fab fa-linkedin"></i> M2L Maison Des Ligues</i></a></p>
                                <p><a href="" class="me-4 text-reset"><i class="fab fa-twitter"> @M2L</i></a></p>
                                <p><a href="" class="me-4 text-reset"><i class="fab fa-google"> Maison des Ligues</i></a></p>
                                <p><a href="" class="me-4 text-reset"><i class="fab fa-facebook-f"> Maison des Ligues</i></a></p>
                                <p><a href="" class="me-4 text-reset"><i class="fab fa-instagram"> MaisonDesLigues</i></a></p>
                                <p><a href="" class="me-4 text-reset"><i class="fab fa-github"> M2L_Git</i></a></p>
                            </div>
                            <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                                <h6 class="text-uppercase fw-bold mb-4">CONTACTS</h6>
                                <p><i class="fas fa-home me-3"></i> 13 Rue Jean Moulin, 54510 Tomblaine</p>
                                <p><i class="fas fa-envelope me-3"></i> contact@M2L.com</p>
                                <p><i class="fas fa-phone me-3"></i> 01 02 03 04 05</p>
                                <p><i class="fas fa-print me-3"></i> 06 07 08 09 10</p>
                            </div>
                        </div>
                    </div>
                </section>
                    <div class="text-center p-4 textcolor" style="background-color: rgba(0, 0, 0, 0.05);">© 2021 Copyright :<a class="text-reset fw-bold" href="https://mdbootstrap.com/">MDBootstrap.com</a>. <span><a href="mentionslegales.html" target="_blank">Mentions légales.</a></span></div>
            </footer>
        </div>
                 `;
    $('#content').html(html);
}

//functions to send/save bordereau and export pdf file
function sendAndGetPDF(adherent_id) {

    var HTML_Width = $(".pdf").width();
    var HTML_Height = $(".pdf").height();
    var top_left_margin = 15;
    var PDF_Width = HTML_Width + (top_left_margin * 2);
    var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
    var canvas_image_width = HTML_Width;
    var canvas_image_height = HTML_Height;

    var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

    html2canvas($(".pdf")[0]).then(function (canvas) {
        var imgData = canvas.toDataURL('image/jpeg', 1.0); // Convert canvas image to URL format (base64) of full quality img
        //save to files/bordereaux on server
        $.ajax({
            type: "POST",
            url: "api/bordereau/upload_files.php",
            data: { 
               data: imgData, idUser: adherent_id
            }
          }).done(function(o) {
            $('#response').append(`<div class='alert alert-success'>${o}</div>`);
          });
        //save as pdf file on user computer
        var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
        pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
        for (var i = 1; i <= totalPDFPages; i++) { 
            pdf.addPage(PDF_Width, PDF_Height);
            pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
        }
        pdf.save(`bordereau_utilisateur_${adherent_id}.pdf`);  
       
    });
}

// function to export from img to pdf file and save on computer
function getPDF(nomFichier){
    var HTML_Width = $(".pdf").width();
    var HTML_Height = $(".pdf").height();
    var top_left_margin = 15;
    var PDF_Width = HTML_Width + (top_left_margin * 2);
    var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
    var canvas_image_width = HTML_Width;
    var canvas_image_height = HTML_Height;
    var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

    html2canvas($(".pdf")[0]).then(function (canvas) {
        var imgData = canvas.toDataURL('image/jpeg', 1.0); // Convert canvas image to URL format (base64) of full quality img
        //save as pdf file on user computer
        var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
        pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
        for (var i = 1; i <= totalPDFPages; i++) { 
            pdf.addPage(PDF_Width, PDF_Height);
            pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
        }
        pdf.save(nomFichier);  
       
    });
}

//function to convert canvas into pdf and send + save it on server using upload_files.php
function sendAndGetCERFA(adherent_id) {

    var HTML_Width = $(".pdf").width();
    var HTML_Height = $(".pdf").height();
    var top_left_margin = 15;
    var PDF_Width = HTML_Width + (top_left_margin * 2);
    var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
    var canvas_image_width = HTML_Width;
    var canvas_image_height = HTML_Height;

    var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

    html2canvas($(".pdf")[0]).then(function (canvas) {
        var imgData = canvas.toDataURL('image/jpeg', 1.0); // Convert canvas image to URL format (base64) of full quality img
        
        //save as pdf file on user computer
        var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
        pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
        for (var i = 1; i <= totalPDFPages; i++) { 
            pdf.addPage(PDF_Width, PDF_Height);
            pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
        }
        pdf.save(`bordereau_adherent_${adherent_id}.pdf`); 
        //method btoa() encodes a string in base-64.
        var cerfa =  btoa(pdf.output()); 
        //save to files/bordereaux on server
        $.ajax({
            type: "POST",
            url: "api/bordereau/upload_files.php",
            data: { 
                datapdf: cerfa, idUser: adherent_id
            }
        }).done(function(o) {
            $('#response').html(`<div class='alert alert-success'>${o}Vous pouvez re-télécharger le fichier s'il y a des modifications.</div>`);
        });
    });
}









