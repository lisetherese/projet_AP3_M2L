 // jQuery codes
 $(document).ready(function(){

    //functions to fill/ unfill cases in CERFA form (divided into 2 div )
    $(document).on('click',"#div1 p span", function(){
        $("#div1>p,#div1>p>span").removeClass("bg-dark");
        $(this).addClass("bg-dark");
    });
    $(document).on('click',"#div2 p span", function(){
        $("#div2>p,#div2>p>span").removeClass("bg-dark");
        $(this).addClass("bg-dark");
    });

    // show or hide password on typing by clicking icon 'the eye'
    $(document).on('click', '#togglePassword', function(){
        const type = $('#password').attr("type") === "password" ? "text" : "password";
        $('#password').attr("type", type);
        $('#togglePassword').toggleClass('bi-eye');
    })
    // prevent auto-reload page on submiting form
    $('form').submit(function(e){
        e.preventDefault();
    })

    // show sign up / registration form
    $(document).on('click', '#sign_up', function(){
        changePageTitle("S'inscrire");
        clearResponse();
        showSignUpForm();
    });
 

    // trigger when registration form is submitted
    $(document).on('submit', '#sign_up_form', function(){
    
        // get form data to parse through it to make an object and finally JSON.stringify() to make a string in form json
        var form_data=JSON.stringify($(this).serializeObject());

        // submit form data to api using HTTP connection
        $.ajax({
            url: "api/user/create_user.php",
            type : "POST",
            contentType : 'application/json',
            data : form_data,
            success : function(result) {
                showLoginPage();
                // if response is a success, tell the user it was a successful sign up
                $('#response').html("<div class='alert alert-success'>Inscription réussie. Veuillez vous connecter.</div>");
            },
            error: function(xhr, resp, text){
                // on error, tell the user sign up failed
                $('#response').html("<div class='alert alert-danger'>Impossible de s'incrire. Veuillez contacter l'administrateur.</div>");
            }
        });

        return false;
    });
 
    /*// show login form
    $(document).on('click', '#login', function(){
        showLoginPage();
    });*/

    
    // trigger when login form is submitted
    $(document).on('submit', '#login_form', function(){
    
        // create object from form data
        var form_data=$(this).serializeObject();
        //convert object above in form of json string
        var new_form_data = JSON.stringify(form_data);
        //declare variable to take result from first ajax post result
        var role_user;
        // submit form data to api login.php, take back a JSON object named 'result' with all data of user, except for password 
        // to display nav-bar according to user_role
        $.ajax({
            url: "api/user/login.php",
            type : "POST",
            contentType : 'application/json',
            data : new_form_data,
            success : function(result){
                // store jwt(json web token) from result into cookie
                setCookie("jwt", result.jwt, 1);
                // show home page's content & tell the user it was a successful login
                showHomePage(result.role, result.email);
                $('#response').html("<div class='alert alert-success'>Connexion réussie.</div>");
                //display email of user near icon on page
                $('#nom_user').text(result.email);
                //display log in menu according to role of user
                showLoggedInMenu(result.role);
                //set value for variable declared above
                role_user = result.role;    
                //add id_user found in this result in form data
                form_data.id_user = result.id;
            },
            //display nav-bar for user according to status: 'not yet asked d'adhesion' or 'already sent demande'
            complete:function(){
                if(role_user=='user'){
                    //convert into json string with form updated (added id_user)
                    var dt = JSON.stringify(form_data);
                    //submit form to search if user already sent a 'demande adhésion'
                    $.ajax({
                    type: "post",
                    url: "api/demandeur/read_by_id_user.php",
                    contentType : 'application/json',
                    data: dt,
                    success: function(data){
                        //if user already demand adhesion, display function 'gerer demande'
                        $('#gerer-demande').removeClass('d-none');
                    },
                    error:function(){
                        // if not, display function to demand 'adhesion formulaire'
                        $('#demander-adhesion').removeClass('d-none');
                    }
                    });
                }
            },
            error: function(xhr, resp, text){
                // on error, tell the user login has failed & empty the input boxes
                $('#response').html("<div class='alert alert-danger'>Echec de la connexion. Email ou mot de passe incorrect.</div>");
                $('#login_form').find('input').val('');
            }
        });
        // prevent reload page
        return false;
    });

    // on submitting form 'contactez-nous'
    $(document).on('submit', '#contact-form', function(e){
        //stop form from functioning as usual
        e.preventDefault();
        //declare variables for sending email using PHP mail form
        let thisForm = this;
        let action = thisForm.getAttribute('action');
        let formData = new FormData( thisForm );
        //display or hide <div> under the form to inform user of reseult
        thisForm.querySelector('.loading').classList.add('d-block');
        thisForm.querySelector('.error-message').classList.remove('d-block');
        thisForm.querySelector('.sent-message').classList.remove('d-block');
        //send mail by function created in page.js
        php_email_form_submit(thisForm, action, formData);

        return false;
    });

    //onlick button Ligue
    $(document).on('click', '#gerer-ligue', function(){
        // clear response content
        clearResponse();
        // show list of ligues
        showLiguesFirstPage();
        //change title
        changePageTitle("Liste des ligues");  

    });
    
    // when a 'page' button was clicked
    $(document).on('click', '.ligues li', function(){
        // get json url
        var json_url=$(this).find('a').attr('data-page');

        // show list of ligues
        showLigues(json_url);
    });

    // when a 'update ligue' button was clicked
    $(document).on('click', '.update-ligue-button', function(){
        //get ligue id from button with data-id='val.id' in form showLigues()
        var id = $(this).attr('data-id');
        // read one record based on given ligue id
        $.getJSON("api/ligue/read_one_ligue.php?id=" + id, function(data){
            updateOneLigue(data);
        });

        //change title
        changePageTitle("Mettre à jour la ligue");

        // prevent whole page reload
        return false;

    });
    
    $(document).on('submit', '#update-ligue-form', function(){
        // take checked value in radio input and assign to form
        $('input[name="reser_am"]:checked').val();
        $('input[name="reser_con"]:checked').val();

        var form_data=JSON.stringify($(this).serializeObject());
        // post JSON string above to file controller
        $.ajax({
            url: "api/ligue/modify_ligue.php",
            type : "POST",
            contentType : 'application/json',
            data : form_data,
            success : function(result) {
        
                // tell it was updated
                $('#response').html("<div class='alert alert-success'>La ligue a été mise à jour.</div>");

                //remove title
                $('#page-title').text('');

                // replace content div
                showAllLiguesButton();
            },
        
            // show error message to ligue
            error: function(xhr, resp, text){
               
                $('#response').html("<div class='alert alert-danger'>Impossible de mettre à jour la ligue.</div>");
                //remove title
                $('#page-title').text('');
                showAllLiguesButton();
            }
        });

        return false;

    });
    // when a 'read one ligue' button was clicked
    $(document).on('click', '.read-one-ligue-button', function(){
        // get ligue id
        var id = $(this).attr('data-id');
        // read ligue record based on given ID
        $.getJSON("api/ligue/read_one_ligue.php?id=" + id, function(data){
            // show HTML template
            showOneLigueTemplate(data);
            // chage page title
            changePageTitle("Info ligue");
            // prevent whole page reload
            return false;
        });
    });

    // when 'all ligues' button was clicked
    $(document).on('click', '.all-ligues-button', function(){
        clearResponse();
        showLiguesFirstPage();
        changePageTitle("Liste des ligues");
    });

    

    // when a 'search ligues' button was clicked
    $(document).on('submit', '#search-ligue-form', function(){
        clearResponse();
 
        // get search keywords
        var keywords = $(this).find(":input[name='keywords']").val();
        
        // chage page title
        changePageTitle("Chercher ligues: " + keywords);
 
        // get data from the api based on search keywords
        $.getJSON("api/ligue/search_ligue.php?s=" + keywords, function(data){
            if(data.message){$('#response').html(`<div class='alert alert-danger'>${data.message}.</div>`)}else{
            // template in ligues.js
            showLiguesTemplate(data, keywords);}
 
        });
 
        // prevent whole page reload
        return false;
    });

    // when a 'delete' button was clicked
    $(document).on('click', '.delete-ligue-button', function(){
        // get the id
        var ligue_id = $(this).attr('data-id');

        // bootbox for good looking 'confirm pop up'
        bootbox.confirm({
        
            message: "<h4>Vous êtes sur de supprimer ?</h4>",
            buttons: {
                confirm: {
                    label: '<span><i class="bi bi-check-lg"></i></span> Oui',
                    className: 'btn-danger'
                },
                cancel: {
                    label: '<span><i class="bi bi-x-lg"></i></span> Non',
                    className: 'btn-primary'
                }
            },
            callback: function (result) {
                // delete request will be here
                if(result==true){
 
                    // send delete request to api / remote server
                    $.ajax({
                        url: "api/ligue/delete_ligue.php",
                        type : "POST",
                        dataType : 'json',
                        data : JSON.stringify({ id: ligue_id }),
                        success : function(result) {
                 
                            // re-load list of ligues
                            showLiguesFirstPage();
                            changePageTitle('Liste des ligues');
                        },
                        error: function(xhr, resp, text) {
                            $('#response').html("<div class='alert alert-danger'>Impossible de supprimer la ligue. Veuillez contacter l'administrateur.</div>");
                        }
                    });
                 
                }
            }
        });
    });

     // when 'create ligue' button was clicked
    $(document).on('click', '.create-ligue-button', function(){
        changePageTitle("Créer la ligue"); 
        clearResponse();
        createLigue();
    });
    // on submitting form create ligue
    $(document).on('submit', '#create-ligue-form', function(){
        var form_data=JSON.stringify($(this).serializeObject());
        // submit form data to api
        $.ajax({
            url: "api/ligue/create_ligue.php",
            type : "POST",
            contentType : 'application/json',
            data : form_data,
            success : function(result) {
                // ligue was created, go back to ligues list
                showLiguesFirstPage();
            },
            error: function(xhr, resp, text) {
                // show error
                $('#response').html("<div class='alert alert-danger'>Impossible de créer la ligue. Veuillez contacter l'administrateur.</div>");
            }
        });
        
        return false;
    });



    $(document).on('click', '#gerer-user', function(){
        // clear response content
        clearResponse();
        // show list of users
        showUsersFirstPage();
        //change title
        changePageTitle("Liste d'utilisateurs"); 
        
    });
    // when a 'page' button was clicked
    $(document).on('click', '.users li', function(){
        // get json url
        var json_url=$(this).find('a').attr('data-page');

        // show list of users
        showUsers(json_url);
    });


    // when a 'update user' button was clicked
    $(document).on('click', '.update-user-button', function(){
        //get user id from button with data-id='val.id' in form showUsers()
        var id = $(this).attr('data-id');
        // read one record based on given user id
        $.getJSON("api/user/read_one_user.php?id=" + id, function(data){
            updateOneUser(data);
        });

        //change title
        changePageTitle("Mettre à jour l'utilisateur");

        // prevent whole page reload
        return false;

    });

    $(document).on('submit', '#update-user-form', function(){
        // take checked value in radio input and assign to form
        $('input[name="droit_reservation"]:checked').val();
        $("#role:selected").val();

        var form_data=JSON.stringify($(this).serializeObject());
        // post JSON string above to file controller
        $.ajax({
            url: "api/user/modify_user.php",
            type : "POST",
            contentType : 'application/json',
            data : form_data,
            success : function(result) {
        
                // tell the user account was updated
                $('#response').html("<div class='alert alert-success'>L'utilisateur a été mis à jour.</div>");

                //remove title
                $('#page-title').text('');

                // replace content div
                showAllUsersButton();
            },
        
            // show error message to user
            error: function(xhr, resp, text){
               
                $('#response').html("<div class='alert alert-danger'>Impossible de mettre à jour l'utilisateur.</div>");
                //remove title
                $('#page-title').text('');
                showAllUsersButton();
            }
        });

        return false;

    });

    // when a 'read one user' button was clicked
    $(document).on('click', '.read-one-user-button', function(){
        // get user id
        var id = $(this).attr('data-id');
        // read user record based on given ID
        $.getJSON("api/user/read_one_user.php?id=" + id, function(data){
            // show HTML template
            showOneUserTemplate(data);
            // chage page title
            changePageTitle("Info utilisateur");
            // prevent whole page reload
            return false;
        });
    });

    // when 'all users' button was clicked
    $(document).on('click', '.all-users-button', function(){
        clearResponse();
        showUsersFirstPage();
        changePageTitle("Liste d'utilisateurs");
    });

    
    // when a 'search users' button was clicked
    $(document).on('submit', '#search-user-form', function(){
        clearResponse();
 
        // get search keywords
        var keywords = $(this).find(":input[name='keywords']").val();
        
        // chage page title
        changePageTitle("Chercher utilisateurs: " + keywords);
 
        // get data from the api based on search keywords
        $.getJSON("api/user/search_user.php?s=" + keywords, function(data){
            if(data.message){$('#response').html(`<div class='alert alert-danger'>${data.message}.</div>`)}else{
            // template in users.js
            showUsersTemplate(data, keywords);}
 
        });
 
        // prevent whole page reload
        return false;
    });

    // when a 'delete user' button was clicked
    $(document).on('click', '.delete-user-button', function(){
        // get the product id
        var user_id = $(this).attr('data-id');

        // bootbox for good looking 'confirm pop up'
        bootbox.confirm({
        
            message: "<h4>Vous êtes sûr de le supprimer ?</h4>",
            buttons: {
                confirm: {
                    label: '<span><i class="bi bi-check-lg"></i></span> Oui',
                    className: 'btn-danger'
                },
                cancel: {
                    label: '<span><i class="bi bi-x-lg"></i></span> Non',
                    className: 'btn-primary'
                }
            },
            callback: function (result) {
                // delete request will be here
                if(result==true){
 
                    // send delete request to api / remote server
                    $.ajax({
                        url: "api/user/delete_user.php",
                        type : "POST",
                        dataType : 'json',
                        data : JSON.stringify({ id: user_id }),
                        success : function(result) {
                 
                            // re-load list of users
                            showUsersFirstPage();
                            changePageTitle("Liste d'utilisateurs");

                            $('#response').html(`<div class='alert alert-success'>L'utilisateur id ${user_id} est bien été supprimé.</div>`);
                        },
                        error: function(xhr, resp, text) {
                            $('#response').html("<div class='alert alert-danger'>Impossible de supprimer l'utilisateur. Veuillez contacter l'administrateur.</div>");
                        }
                    });
                 
                }
            }
        });
    });

     // when 'create user' button was clicked
    $(document).on('click', '.create-user-button', function(){
        changePageTitle("Créer l'utilisateur"); 
        clearResponse();
        createUser();
    });
    // on submitting form create user
    $(document).on('submit', '#create-user-form', function(){
        var form_data=JSON.stringify($(this).serializeObject());
        // submit form data to api
        $.ajax({
            url: "api/user/create_user.php",
            type : "POST",
            contentType : 'application/json',
            data : form_data,
            success : function(result) {
                // user was created, go back to users list
                showUsersFirstPage();
                changePageTitle("Liste d'utilisateurs");
                $('#response').html("<div class='alert alert-success'>Le nouvel utilisateur a été créé avec succès!</div>");
                
            },
            error: function(xhr, resp, text) {
                // show error
                $('#response').html("<div class='alert alert-danger'>Impossible de créer l'utilisateur. Veuillez contacter l'administrateur.</div>");
            }
        });
        
        return false;
    });

    // show home page
    $(document).on('click', '#home', function(){
        //showHomePage(role,email);
        clearResponse();
        changePageTitle('');
        showPageAccueil();
    });
    
    // show update account form
    $(document).on('click', '#update_account', function(){
        // validate jwt to verify access
        var jwt = getCookie('jwt');
        $.post("api/validate_token.php", JSON.stringify({ jwt:jwt })).done(function(result) {

            changePageTitle("Mettre à jour votre compte");

            // if response is valid, put user details in the form
            showUpdateAccountHTML(result);
            
            clearResponse();
        })
        // on error/fail, tell the user he needs to login to show the account page
        .fail(function(result){
            showLoginPage();
            $('#response').html("<div class='alert alert-danger'>Veuillez vous connecter pour accéder à votre compte.</div>");
        });   
    });

    // trigger when 'update account' form is submitted
    $(document).on('submit', '#update_account_form', function(){
        // take checked value in radio input and assign to form
        $('input[name="droit_reservation"]:checked').val();

        // validate jwt to verify access: retrieve $jwt -> value of $cookie-key 'jwt'
        var jwt = getCookie('jwt');

        // get form data, turn variable above into object
        var update_account_form_obj = $(this).serializeObject()
        
        // add jwt to the object of data input file
        update_account_form_obj.jwt = jwt;
        
        // convert object to json string
        var form_data=JSON.stringify(update_account_form_obj);
        
        // post JSON string above to file controller
        $.ajax({
            url: "api/user/update_user.php",
            type : "POST",
            contentType : 'application/json',
            data : form_data,
            success : function(result) {
        
                // tell the user account was updated
                $('#response').html("<div class='alert alert-success'>Votre compte a été mis à jour.</div>");

                //remove title
                $('#page-title').text('');
        
                // store new jwt to coookie
                setCookie("jwt", result.jwt, 1);

                // remove content div
                $('#content').html('');
            },
        
            // show error message to user
            error: function(xhr, resp, text){
                if(xhr.responseJSON.message=="Impossible de mettre à jour l'utilisateur."){
                    $('#response').html("<div class='alert alert-danger'>Impossible de mettre à jour votre compte.</div>");
                }
            
                else if(xhr.responseJSON.message=="Accès refusé."){
                    showLoginPage();
                    $('#response').html("<div class='alert alert-success'>Accès refusé. Veuillez vous connecter.</div>");
                }
            }
        });

        return false;
    });

    // logout the user
    $(document).on('click', '#logout', function(){
        showLoginPage();   
        $('#response').html("<div class='alert alert-info'>Vous êtes déconnecté.</div>");
        adherent_id=null;
    });

    //onlick button Demandeur
    $(document).on('click', '#gerer-demandeur', function(){
        clearResponse();
        showDemandeursFirstPage();
        changePageTitle("Liste des demandeurs");

    });
    // when a 'page' button was clicked
    $(document).on('click', '.demandeurs li', function(){
        // get json url
        var json_url=$(this).find('a').attr('data-page');

        // show list of demandeurs
        showDemandeurs(json_url);
    });

    // when a 'update demandeur' button was clicked
    $(document).on('click', '.update-demandeur-button', function(){
        
        //get demandeur id from button with data-id='val.id' in form showDemandeurs()
        var id = $(this).attr('data-id');
        // read one record based on given demandeur id
        $.getJSON("api/demandeur/read_one_demandeur.php?id=" + id, function(data){
            clearResponse();
             //change title
            changePageTitle("Mettre à jour le demandeur");
            updateOneDemandeur(data);
        });
        // prevent whole page reload
        return false;

    });

    // when 'valider demandeur' button was clicked to convert demandeur into adhérent
    $(document).on('click', '.valider-demandeur-button', function(){
        var demandeur_id = $(this).attr('data-id');
        var user_id = 0;
        $.getJSON("api/demandeur/read_one_demandeur.php?id=" + demandeur_id, function(resultat){
            user_id = resultat.id_user;
            // bootbox for good looking 'confirm pop up'
            bootbox.confirm({
            
                message: "<h4>Vous êtes sûr de valider l'adhésion ?</h4>",
                buttons: {
                    confirm: {
                        label: '<span><i class="bi bi-check-lg"></i></span> Oui',
                        className: 'btn-danger'
                    },
                    cancel: {
                        label: '<span><i class="bi bi-x-lg"></i></span> Non',
                        className: 'btn-primary'
                    }
                },
                callback: function (result) {
                    // request succeeded!
                    if(result==true){
                        // change status "etre_adherent" of demandeur and change role 'adherent' in table utilisateur and show message 
                        addAdhesion(demandeur_id, user_id);
    
                    }
                }
            });
        });
        
    });
    
    // when click button 'Sauvegarder' in form: 'Mettre à jour le demandeur'
    $(document).on('submit', '#update-demandeur-form', function(){
        $("#id_ligue:selected").val();
        var form_data=JSON.stringify($(this).serializeObject());
        // post JSON string above to file controller
        $.ajax({
            url: "api/demandeur/modify_demandeur.php",
            type : "POST",
            contentType : 'application/json',
            data : form_data,
            success : function(result) {
        
                // tell it was updated
                $('#response').html("<div class='alert alert-success'>Le demandeur a été mis à jour.</div>");

                //remove title
                $('#page-title').text('');

                // replace content div by list of all demandeurs
                showAllDemandeursButton();
            },
        
            // show error message to user
            error: function(xhr, resp, text){
                
                showAllDemandeursButton();
                $('#response').html("<div class='alert alert-danger'>Impossible de mettre à jour le demandeur.</div>");
                //remove title
                $('#page-title').text('');
            }
        });
        //prevent re-load page
        return false;

    });
    // when a 'read one demandeur' button was clicked
    $(document).on('click', '.read-one-demandeur-button', function(){
        clearResponse();
        // get demandeur id
        var id = $(this).attr('data-id');
        // read demandeur record based on given ID
        $.getJSON("api/demandeur/read_one_demandeur.php?id=" + id, function(data){
            // show HTML template
            showOneDemandeurTemplate(data);
            // chage page title
            changePageTitle("Info du demandeur");
        });
        // prevent whole page reload
        return false;
    });

    // when 'Tous Demandeurs' button was clicked
    $(document).on('click', '.all-demandeurs-button', function(){
        showDemandeursFirstPage();
        changePageTitle("Liste des demandeurs");
    });

    
    // when a 'search demandeurs' form was clicked (submitted)
    $(document).on('submit', '#search-demandeur-form', function(){
        clearResponse();
    
        // get search keywords
        var keywords = $(this).find(":input[name='keywords']").val();
        
        // chage page title
        changePageTitle("Chercher demandeurs: " + keywords);
    
        // get data from the api based on search keywords
        $.getJSON("api/demandeur/search_demandeur.php?s=" + keywords, function(data){
            // if can't be found -> display div alert-danger telling user of the result
            if(data.message){$('#response').html(`<div class='alert alert-danger'>${data.message}.</div>`)}else{
            // if succeeded, show template in demandeurs.js: show all demandeurs correspond to the search
            showDemandeursTemplate(data, keywords);}
    
        });
    
        // prevent whole page reload
        return false;
    });

    // when a 'delete' button was clicked
    $(document).on('click', '.delete-demandeur-button', function(){
        // get the id
        var demandeur_id = $(this).attr('data-id');

        // bootbox for good looking 'confirm pop up'
        bootbox.confirm({
        
            message: "<h4>Vous êtes sûr de supprimer ce demandeur ?</h4>",
            buttons: {
                confirm: {
                    label: '<span><i class="bi bi-check-lg"></i></span> Oui',
                    className: 'btn-danger'
                },
                cancel: {
                    label: '<span><i class="bi bi-x-lg"></i></span> Non',
                    className: 'btn-primary'
                }
            },
            callback: function (result) {
                // delete request will be here
                if(result==true){
    
                    // send delete request to api / remote server
                    $.ajax({
                        url: "api/demandeur/delete_demandeur.php",
                        type : "POST",
                        dataType : 'json',
                        data : JSON.stringify({ id: demandeur_id }),
                        success : function(result) {
                    
                            // re-load list of demandeurs
                            showDemandeursFirstPage();
                            // tell user that demandeur was deleted
                            $('#response').html("<div class='alert alert-success'>Le demandeur a été supprimé.</div>");
                        },
                        error: function(xhr, resp, text) {
                            $('#response').html("<div class='alert alert-danger'>Impossible de supprimer le demandeur. Veuillez contacter l'administrateur.</div>");
                        }
                    });
                    
                }
            }
        });
    });

        // when 'create demandeur' button was clicked, show formulaire to create demandeur
    $(document).on('click', '.create-demandeur-button', function(){
        //change title of page
        changePageTitle("Créer le demandeur"); 
        //clear previous response
        clearResponse();
        var content = createDemandeurForm();
        $.getJSON("api/ligue/read.php", function(data){
            // loop through returned list of data
            $.each(data.records, function(key, val){
                // pre-select option is category id is the same
                content+=`<option value='` + val.id + `'>` + val.nom + `</option>`; 
            });
            //connect with the ending of form
            content+=
                        `   </select>
                                </td>
                            </tr>
                            <tr>
                                <td><div class='btn btn-info all-demandeurs-button'><span><i class="bi bi-arrow-left-short"></i></span> Retourner</div></td>
                                <td><button type='submit' class='btn btn-primary'><span><i class="bi bi-plus"></i></span> Créer</button></td>
                            </tr>
                        </table>
                    </div>
                </form>`;
            // inject content in div 'content' of page
            $('#content').html(content);

        });

    });

    // on submitting form create demandeur (when clicking 'Créer' button at the end of 'Créer le demandeur' formulaire)
    $(document).on('submit', '#create-demandeur-form', function(){
        //take value selected in 'Ligue' drop-down list in form
        $("#id_ligue:selected").val();
        //prepare form data in JSON form to send by ajax
        var form_data=JSON.stringify($(this).serializeObject());
        // submit form data to api
        $.ajax({
            url: "api/demandeur/create_demandeur.php",
            type : "POST",
            contentType : 'application/json',
            data : form_data,
            success : function(result) {
              
                // demandeur was created, go back to demandeurs list
                showDemandeursFirstPage();
                // tell user that demandeur was created
                $('#response').html("<div class='alert alert-success'>Le demandeur a été créé.</div>");
            },
            error: function(xhr, resp, text) {
                // show error
                $('#response').html("<div class='alert alert-danger'>Impossible de créer le demandeur. Veuillez contacter l'administrateur.</div>");
            }
        });
        
        return false;
    });
    //=========== BUTTON ON NAV-BAR OF USER WHO ASKS FOR ADHESION ==========
    // when 'Demander d'adhésion' button was clicked by user (not yet become demandeur)
    $(document).on('click', '#demander-adhesion', function(){
        var jwt = getCookie('jwt');
        $.post("api/validate_token.php", JSON.stringify({ jwt:jwt })).done(function(result) {
            //change page title
            changePageTitle("Formulaire de demander d'adhésion");
            // if response is valid, user can input details in the HTML form created in user.js
            demanderAdhesionFormulaire(result);
            //clear all possible previous response
            clearResponse();
        })
        // on error/fail, tell the user he needs to login to show the account page
        .fail(function(result){
            showLoginPage();
            $('#response').html("<div class='alert alert-danger'>Veuillez vous connecter pour compléter votre demande d'adhésion.</div>");
        });
        
    });

    
    // on submitting form named 'Formulaire de demander d'adhésion' by clicking 'Envoyer la demande'
    $(document).on('submit', '#demander-adhesion-form', function(e){
        //stop form from functioning as usual
        e.preventDefault();
        //add value of id_ligue selected according to name of ligue to the form
        var val = $(this).find(':selected').data('id');
        var form_data = $(this).serializeObject();
        form_data.id_ligue = val;
        //declare variables for sending email using PHP mail form
        let thisForm = this;
        let action = thisForm.getAttribute('action');
        let formData = new FormData( thisForm );
        //display or hide <div> under the form to inform user of reseult
        thisForm.querySelector('.loading').classList.add('d-block');
        thisForm.querySelector('.error-message').classList.remove('d-block');
        thisForm.querySelector('.sent-message').classList.remove('d-block');
        //send mail by function created in page.js
        php_email_form_submit(thisForm, action, formData);
        //prepare form including id_ligue in form json string to use POST ajax
        var update_form_data=JSON.stringify(form_data);
        // submit form data to api
        $.ajax({
            url: "api/demandeur/create_demandeur.php",
            type : "POST",
            contentType : 'application/json',
            data : update_form_data,
            success : function(result) {
                //hide form
                $(".form-group,.btn").addClass('d-none');
                //erase page title 
                changePageTitle('');
                // tell user that demandeur was created
                $('#response').html("<div class='alert alert-success'>Votre demande d'adhésion a été créée.</div>");
                //set conditions to switch 'displaying butttons' on nav-bar of user
                if(!$('#demander-adhesion').hasClass('d-none')){
                    $('#demander-adhesion').addClass('d-none');
                }
                if($('#gerer-demande').hasClass('d-none')){
                    $('#gerer-demande').removeClass('d-none');
                }
                
            },
            error: function(xhr, resp, text) {
                // show error
                $('#response').html("<div class='alert alert-danger'>Impossible de créer la demande. Veuillez nous contacter directement par mail dans la page d'accueil. Merci!</div>");
            }
        });

        
        return false;

    });
    // when 'gerer la demande' button was clicked
    $(document).on('click', '#gerer-demande', function(){
        var jwt = getCookie('jwt');
        $.post("api/validate_token.php", JSON.stringify({ jwt:jwt })).done(function(result) {

            changePageTitle("Votre demande d'adhésion");
            // if response is valid, user can see and modify details in the form
            displayAdhesionFormulaire(result);
            // inform user of the status of his demande
            $('#response').html(`<div class='alert alert-primary'>Votre demande d'adhésion est en train d'être examiner. Vous pouvez renvoyer votre demande en cas de modification.</div>`);
        })
        // on error/fail, tell the user he needs to login to show the account page
        .fail(function(result){
            showLoginPage();
            $('#response').html("<div class='alert alert-danger'>Veuillez vous connecter pour modifier votre demande d'adhésion.</div>");
        });
        
    });

    // on submitting form to modify la demande
    $(document).on('submit', '#adhesion-form-modified', function(e){
        //stop form from functioning as usual
        e.preventDefault();
        //add value of id_ligue selected according to name of ligue to the form
        var val = $(this).find(':selected').data('id');
        var form_data = $(this).serializeObject();
        form_data.id_ligue = val;
        //declare variables for sending email using PHP mail form
        let thisForm = this;
        let action = thisForm.getAttribute('action');// =  var action = $(this).attr('action');
        let formData = new FormData( thisForm );
        //display or hide <div> under the form to inform user of result
        thisForm.querySelector('.loading').classList.add('d-block'); // = $('.loading).addClass('d-block); (.hasClass/.addClass/.removeClass)
        thisForm.querySelector('.error-message').classList.remove('d-block');
        thisForm.querySelector('.sent-message').classList.remove('d-block');
        //send mail by /forms/contact.php and display response by function php_email_form_submit() created in page.js
        php_email_form_submit(thisForm, action, formData);
        
        //prepare form including id_ligue in form json string to use POST ajax
        var update_form_data=JSON.stringify(form_data);
        // submit form data to api
        $.ajax({
            url: "api/demandeur/modify_demandeur.php",
            type : "POST",
            contentType : 'application/json',
            data : update_form_data,
            success : function(result) {
                //hide form
                $(".form-group,.btn").addClass('d-none');
                //erase page title 
                changePageTitle('');
                // tell user that demandeur was modified
                $('#response').html("<div class='alert alert-success'>Votre demande d'adhésion a été modifiée.</div>");
                //conditions to switch functions on menu of user
                if(!$('#demander-adhesion').hasClass('d-none')){
                    $('#demander-adhesion').addClass('d-none');
                }
                if($('#gerer-demande').hasClass('d-none')){
                    $('#gerer-demande').removeClass('d-none');
                }
                
            },
            error: function(xhr, resp, text) {
                // show error
                $('#response').html("<div class='alert alert-danger'>Impossible de modifier la demande. Veuillez nous contacter directement par mail dans la page d'accueil. Merci!</div>");
            }
        });

        
        return false;

    });
    //=============== BUTTONS ON ADMIN NAV-BAR ===============
    //onlick button 'Motifs'
    $(document).on('click', '#gerer-motif', function(){
        // clear response content
        clearResponse();
        // show list of motifs
        showMotifsFirstPage();
        //change title
        changePageTitle("Liste des motifs");  

    });
    // when a 'page' button in Motifs listwas clicked
    $(document).on('click', '.motifs li', function(){
        // get json url
        var json_url=$(this).find('a').attr('data-page');
        // show list of motifs by page
        showMotifs(json_url);
    });

    // when a 'update motif' button was clicked
    $(document).on('click', '.update-motif-button', function(){
        //get motif id from button with data-id='val.id' in form showMotifs()
        var id = $(this).attr('data-id');
        // read one record based on given motif id
        $.getJSON("api/motif/read_one_motif.php?id=" + id, function(data){
            updateOneMotif(data);
        });

        //change title
        changePageTitle("Mettre à jour le motif");

        // prevent whole page reload
        return false;

    });

    $(document).on('submit', '#update-motif-form', function(){
        //prepare form-data in JSON form string
        var form_data=JSON.stringify($(this).serializeObject());
        // post JSON string above to file controller
        $.ajax({
            url: "api/motif/modify_motif.php",
            type : "POST",
            contentType : 'application/json',
            data : form_data,
            success : function(result) {
        
                // tell it was updated
                $('#response').html("<div class='alert alert-success'>Le motif a été mis à jour.</div>");

                //remove title
                $('#page-title').text('');

                // display button 'Tous motifs'
                showAllMotifsButton();
            },
        
            // show error message to motif
            error: function(xhr, resp, text){
                //display response
                $('#response').html("<div class='alert alert-danger'>Impossible de mettre à jour le motif.</div>");
                //remove title
                $('#page-title').text('');
                // display button 'Tous motifs'
                showAllMotifsButton();
            }
        });
        //prevent re-load auto
        return false;

    });

    // when 'all motifs' button was clicked
    $(document).on('click', '.all-motifs-button', function(){
        clearResponse();
        showMotifsFirstPage();
        changePageTitle("Liste des motifs");
    });



    // when a 'search motifs' button was clicked
    $(document).on('submit', '#search-motif-form', function(){
        clearResponse();

        // get search keywords
        var keywords = $(this).find(":input[name='keywords']").val();
        
        // chage page title
        changePageTitle("Chercher motifs: " + keywords);

        // get data from the api based on search keywords
        $.getJSON("api/motif/search_motif.php?s=" + keywords, function(data){
            if(data.message){$('#response').html("<div class='alert alert-danger'>${data.message}.</div>")}else{
            // template in motifs.js
            showMotifsTemplate(data, keywords);}

        });

        // prevent whole page reload
        return false;
    });

    // when a 'delete' button was clicked
    $(document).on('click', '.delete-motif-button', function(){
        // get the id
        var motif_id = $(this).attr('data-id');

        // bootbox for good looking 'confirm pop up'
        bootbox.confirm({
        
            message: "<h4>Vous êtes sur de supprimer ce motif ?</h4>",
            buttons: {
                confirm: {
                    label: '<span><i class="bi bi-check-lg"></i></span> Oui',
                    className: 'btn-danger'
                },
                cancel: {
                    label: '<span><i class="bi bi-x-lg"></i></span> Non',
                    className: 'btn-primary'
                }
            },
            callback: function (result) {
                // delete request will be here
                if(result==true){

                    // send delete request to api / remote server
                    $.ajax({
                        url: "api/motif/delete_motif.php",
                        type : "POST",
                        dataType : 'json',
                        data : JSON.stringify({ id: motif_id }),
                        success : function(result) {
                            // re-load list of motifs
                            showMotifsFirstPage();
                            changePageTitle('Liste des motifs');
                            $('#response').html("<div class='alert alert-success'>Le motif a été bien supprimé.</div>");
                        },
                        error: function(xhr, resp, text) {
                            $('#response').html("<div class='alert alert-danger'>Impossible de supprimer le motif. Veuillez contacter l'administrateur.</div>");
                        }
                    });
                
                }
            }
        });
    });

    // when 'Créer Motif' button was clicked
    $(document).on('click', '.create-motif-button', function(){
        changePageTitle("Créer le motif"); 
        clearResponse();
        createMotif();
    });
    // on submitting form create motif: clicking 'Créer' at the bottom of the form
    $(document).on('submit', '#create-motif-form', function(){
        var form_data=JSON.stringify($(this).serializeObject());
        // submit form data to api
        $.ajax({
            url: "api/motif/create_motif.php",
            type : "POST",
            contentType : 'application/json',
            data : form_data,
            success : function(result) {
                // motif was created, go back to motifs list
                showMotifsFirstPage();
                changePageTitle('Liste des motifs');
                $('#response').html("<div class='alert alert-success'>Le motif a été crée.</div>");
            },
            error: function(xhr, resp, text) {
                // show error
                $('#response').html("<div class='alert alert-danger'>Impossible de créer le motif. Veuillez contacter l'administrateur.</div>");
            }
        });
        
        return false;
    });

    //onlick button 'Lignes frais' on nav-bar
    $(document).on('click', '#gerer-ligne-frais', function(){
        clearResponse();
        // show list of lignes frais + change page title to 'Liste de lignes frais'
        showLignesFraisFirstPage(); 
    });
    // when click the button 'Actions' beside the 'Lire' button for each row of ligne frais
    $(document).on("click",".selectButton",function() {
        //retrieve data contained in div 'selectButton'
        var id_ligne =  $(this).attr('id');
        var id_user = $(this).attr('data-id');
        var valide = $(this).attr('data-valide');
        //request data from table bordereau according to id_user
        $.getJSON("api/bordereau/read_by_id_user.php?id=" + id_user, function(da){
            //replace button 'Actions' by the other buttons 
            //if no bordereau found and the ligne frais is not yet validated
            // or if bordereau found and its not yet validated and the ligne frais itself is not validated too 
            //admin or tresorier will see buttons: Modifier + Supprimer + Valider
            if((!da.id && valide == "Non") || (da.id && da.etre_valide != "1" && valide == "Non")){
                $('#'+ id_ligne).html(`<button class="btn btn-info m-r-10px update-ligne-frais-button" data-id='${id_ligne}'>Modifier</button>
                <button class="btn btn-danger m-r-10px delete-ligne-frais-button" data-id='${id_ligne}'>Supprimer</button>
                <button class="btn btn-dark m-r-10px valider-ligne-frais-button" data-id='${id_ligne}'>Valider</button>`);
            //if bordereau found and its not yet validated and the ligne frais is already validated
            //or if bordereau not found and the ligne frais is validated
            //admin and tresorier will see button: Invalider
            }else if((da.id && da.etre_valide != "1" && valide != "Non") || (da.message && valide == "Oui")){
                $('#'+ id_ligne).html(`<button class="btn btn-warning m-r-10px invalider-ligne-frais-button" data-id='${id_ligne}'>Invalider</button>`);
            //other cases: no action possible
            }else{
                $('#'+ id_ligne).html(`<button class="btn btn-secondary m-r-10px">Aucune action possible</button>`);
            }
        });
    });

    // when a 'page' button was clicked
    $(document).on('click', '.lignes li', function(){
        // get json url
        var json_url=$(this).find('a').attr('data-page');

        // show list of motifs
        showLignesFrais(json_url);
    });
    
    // when 'create ligne frais' button was clicked
    $(document).on('click', '.create-ligne-frais-button', function(){
        changePageTitle("Créer la ligne frais"); 
        clearResponse();
        var html = createLigneFraisForm();
        //get all motifs to put into 'select' of the form to create ligne frais
        $.getJSON("api/motif/read.php", function(data){
            
            $.each(data.records, function(key, val){
                // pre-select option is category id is the same
                html+=`<option value='` + val.id + `'>` + val.libelle + `</option>`; 
            });

            html+=`</select>
                </td>
                </tr>
                <tr>
                    <td><div class='btn btn-info all-ligne-frais-button'><span><i class="bi bi-arrow-left-short"></i></span> Retourner</div></td>
                    <td><button type='submit' class='btn btn-primary'><span><i class="bi bi-plus"></i></span> Créer</button></td>
                </tr>
                </table>
                </div>
                </form>`;
            $('#content').html(html);
            //on displaying form, at first, hide all div(s) below
            $('.div-peage, .div-repas, .div-hebergement').hide();
        }); 
       
    });
    //if each div corresponding is clicked -> show that div in form to input data
    $(document).on('click', '#ajout-peage', function(){
        $('.div-peage').show('slow');
    });
    $(document).on('click', '#ajout-repas', function(){
        $('.div-repas').show('slow');
    });
    $(document).on('click', '#ajout-heberge', function(){
        $('.div-hebergement').show('slow');
    });
    // on submitting form create ligne frais
    $(document).on('submit', '#create-ligne-frais-form', function(){
        var data = $(this).serializeObject();
        //take only the names of files chosen, remove all fakepath added auto to that file by the system 
        var peageJustif = $('#p_justificatif').val().replace(/C:\\fakepath\\/i, '');
        var repasJustif = $('#r_justificatif').val().replace(/C:\\fakepath\\/i, '');
        var hebergeJustif = $('#h_justificatif').val().replace(/C:\\fakepath\\/i, '');
        //add those files' names into  data form
        data.peage_justificatif = peageJustif;
        data.repas_justificatif = repasJustif;
        data.justificatif = hebergeJustif;
        //convert form-data into json string
        var form_data=JSON.stringify(data);
        //for uploading files by XHTTP
        var formData = new FormData();
        //add value input in #id_user in form to formData declared above using integrated function .append() of class Formdata
        formData.append("id_user",$('#id_user').val());
        //if file is chosen, attach that file to formdata
        if(peageJustif){
            var file_peage = document.getElementById("p_justificatif").files;
            formData.append("peage_jus", file_peage[0]);
        }
        if(repasJustif){
            var file_repas = document.getElementById("r_justificatif").files;
            formData.append("repas_jus", file_repas[0]);
        }
        if(hebergeJustif){
            var file_heberge = document.getElementById("h_justificatif").files;
            formData.append("heberge_jus", file_heberge[0]);
        }
        //using xhttp to upload attached files in formData to our folder: assets/files/ligne_frais
        var xhttp = new XMLHttpRequest();
         // Set POST method and ajax file path
        xhttp.open("POST", "api/ligne_frais/upload_files.php", true);
        // call on request changes state
        xhttp.onreadystatechange = function() {
            // if uploading file succeeded
            if (this.readyState == 4 && this.status == 200) {
                //alert response defined in file 'upload_files.php'
                var response = this.responseText;
                alert(response);
            }
        };
        // Send request with data
        xhttp.send(formData);

        // Then, submit form data to api to inject ligne frais into our DB
        $.ajax({
            url: "api/ligne_frais/create_ligne_frais.php",
            type : "POST",
            contentType : 'application/json',
            data : form_data,
            success : function(result) {
                // ligne frais was created, go back to list
                showLignesFraisFirstPage();
                $('#response').html("<div class='alert alert-success'>La ligne frais a été créée.</div>");
            },
            error: function(xhr, resp, text) {
                // show error
                $('#response').html("<div class='alert alert-danger'>Impossible de créer la ligne frais. Veuillez contacter l'administrateur.</div>");
            }
        });
        //prevent auto reload
        return false;
    });

    // when 'Supprimer' button was clicked for ligne frais
    $(document).on('click', '.delete-ligne-frais-button', function(){
        // get the id
        var ligne_id = $(this).attr('data-id');

        // bootbox for good looking 'confirm pop up'
        bootbox.confirm({
        
            message: "<h4>Vous êtes sur de supprimer cette ligne frais ?</h4>",
            buttons: {
                confirm: {
                    label: '<span><i class="bi bi-check-lg"></i></span> Oui',
                    className: 'btn-danger'
                },
                cancel: {
                    label: '<span><i class="bi bi-x-lg"></i></span> Non',
                    className: 'btn-primary'
                }
            },
            callback: function (result) {
                // delete request will be here
                if(result==true){
                    // delete files of a ligne frais in folder files\ligne_frais
                    deleteFilesById(ligne_id);
 
                    // then send delete request to api to delete the ligne frais in DB
                    $.ajax({
                        url: "api/ligne_frais/delete_ligne_frais.php",
                        type : "POST",
                        dataType : 'json',
                        data : JSON.stringify({ id: ligne_id }),
                        success : function(result) {
                            // re-load list
                            showLignesFraisFirstPage();
                            $('#response').html("<div class='alert alert-success'>La ligne frais a été supprimée.</div>");
                        },
                        error: function(xhr, resp, text) {
                            $('#response').html("<div class='alert alert-danger'>Impossible de supprimer la ligne frais. Veuillez contacter l'administrateur.</div>");
                        }
                    });
                 
                }
            }
        });
    });

    // when a 'search lignes frais' button was clicked
    $(document).on('submit', '#search-ligne-frais-form', function(){
        clearResponse();
 
        // get search keywords
        var keywords = $(this).find(":input[name='keywords']").val();
        
        // chage page title
        changePageTitle("Chercher lignes frais: " + keywords);
 
        // get data from the api based on search keywords
        $.getJSON("api/ligne_frais/search_ligne_frais.php?s=" + keywords, function(data){
            if(data.message){$('#response').html("<div class='alert alert-danger'>Aucune ligne frais trouvée ou la recherche invalide.</div>");}
            else{
            // show template
            showLignesFraisTemplate(data, keywords);}
 
        });
 
        // prevent whole page reload
        return false;
    });
    // when 'all lignes frais' button was clicked
    $(document).on('click', '.all-ligne-frais-button', function(){
        clearResponse();
        showLignesFraisFirstPage();
    });

    // when a 'read one ligne frais' button was clicked
    $(document).on('click', '.read-one-ligne-frais-button', function(){
        // get demandeur id
        var id = $(this).attr('data-id');
        // read record based on given ID
        $.getJSON("api/ligne_frais/read_one_ligne_frais.php?id=" + id, function(data){
            // show HTML template
            showOneLigneFraisTemplate(data);
            //clear response
            clearResponse();
            // chage page title
            changePageTitle("Info de la ligne frais");
            // prevent whole page reload
            return false;
        });
    });
    // when 'Modifier' lignefrais button was clicked
    $(document).on('click', '.update-ligne-frais-button', function(){
        clearResponse();
        //get id from button with data-id='val.id'
        var id = $(this).attr('data-id');
        // read one record based on given id
        $.getJSON("api/ligne_frais/read_one_ligne_frais.php?id=" + id, function(data){
            
            updateOneLigneFrais(data);
        });

        //change title
        changePageTitle("Mettre à jour la ligne frais");

        // prevent whole page reload
        return false;

    });
    //when click button 'Sauvegarder' at the bottom of 'Mettre a jour la ligne frais'
    $(document).on('submit', '#update-ligne-frais-form', function(){
        //take values selected in options
        $("#type_trajet:selected").val();
        $("#multip_peage:selected").val();
        //create object from data filled in the form
        var data = $(this).serializeObject();
        //take the name of the file selected by user, remove all fakepath added auto to the filename
        var peageJustif = $('#p_justificatif').val().replace(/C:\\fakepath\\/i, '');
        var repasJustif = $('#r_justificatif').val().replace(/C:\\fakepath\\/i, '');
        var hebergeJustif = $('#h_justificatif').val().replace(/C:\\fakepath\\/i, '');
        //add names of files in object created by form data
        data.peage_justificatif = peageJustif;
        data.repas_justificatif = repasJustif;
        data.justificatif = hebergeJustif;
        //turn object into string Json
        var form_data=JSON.stringify(data);

        //first: delete existing files by XHTTP
        var formData = new FormData();
        formData.append("id_user", $('#id_user').val());
        //set conditions to delete old files: either (old exists + new exists + cout exists) or (old exists + no new + no cout)
        if(($('#p_jus').val() && (document.getElementById("p_justificatif").files.length != 0) && (($('#cout_peage').val() !== '') || ($('#cout_peage').val() !== '0'))) || ($('#p_jus').val() && (document.getElementById("p_justificatif").files.length == 0) && (($('#cout_peage').val() === '') || ($('#cout_peage').val() === '0')))){
            formData.append("peage_jus", $('#p_jus').val());
        }
        if(($('#r_jus').val() && (document.getElementById("r_justificatif").files.length != 0) && (($('#cout_repas').val() !== '') || ($('#cout_repas').val() !== '0'))) || ($('#r_jus').val() && (document.getElementById("r_justificatif").files.length == 0) && (($('#cout_repas').val() === '') || ($('#cout_repas').val() === '0')))){
            formData.append("repas_jus", $('#r_jus').val());
        }
        if(($('#h_jus').val() && (document.getElementById("h_justificatif").files.length != 0) && (($('#cout_hebergement').val() !== '') || ($('#cout_hebergement').val() !== '0'))) || ($('#h_jus').val() && (document.getElementById("h_justificatif").files.length == 0) && (($('#cout_hebergement').val() === '') || ($('#cout_hebergement').val() === '0')))){
            formData.append("heberge_jus", $('#h_jus').val());
        }
        var xhttp1 = new XMLHttpRequest();
        // Set POST method and ajax file path
        xhttp1.open("POST", "api/ligne_frais/delete_files.php", true);
        // call on request changes state
        xhttp1.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {

                var response = this.responseText;
                if(response !==''){
                    // if something done in 'delete_files.php' then alert it, if nothing changed, no alert.
                    alert(response);
                }
            
            }
        };
        // Send request with data
        xhttp1.send(formData);

        //second: uploading new files by XHTTP to our folder assets/files/lignes_frais
        var formData1 = new FormData();
        formData1.append("id_user",$('#id_user').val());
        if(peageJustif){
            var file_peage = document.getElementById("p_justificatif").files;
            formData1.append("peage_jus", file_peage[0]);
        }
        if(repasJustif){
            var file_repas = document.getElementById("r_justificatif").files;
            formData1.append("repas_jus", file_repas[0]);
        }
        if(hebergeJustif){
            var file_heberge = document.getElementById("h_justificatif").files;
            formData1.append("heberge_jus", file_heberge[0]);
        }
        var xhttp = new XMLHttpRequest();
        // Set POST method and ajax file path
        xhttp.open("POST", "api/ligne_frais/upload_files.php", true);
        // call on request changes state
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
    
                var response1 = this.responseText;
                if(response1 !== ''){
                    alert(response1);
                }
            }
        };
        // Send request with data
        xhttp.send(formData1);
    
        // post JSON string above to file controller to make change in database
        $.ajax({
            url: "api/ligne_frais/modify_ligne_frais.php",
            type : "POST",
            contentType : 'application/json',
            data : form_data,
            success : function(result) {
                
                // tell it was updated
                $('#response').html("<div class='alert alert-success'>La ligne frais a été mise à jour.</div>");

                //remove title
                $('#page-title').text('');

                // replace content div
                showAllLignesFraisButton();
            },
        
            // show error message to ligne-frais
            error: function(xhr, resp, text){
               
                $('#response').html("<div class='alert alert-danger'>Impossible de mettre à jour la ligne frais.</div>");
                //remove title
                $('#page-title').text('');
                showAllLignesFraisButton();
            }
        });

        return false;

    });
    // when 'valider demandeur' button was clicked to convert demandeur into adhérent
    $(document).on('click', '.valider-ligne-frais-button', function(){
        var ligne_id = $(this).attr('data-id');
        // bootbox for good looking 'confirm pop up'
        bootbox.confirm({
        
            message: "<h4>Vous êtes sûr de valider la ligne frais ?</h4>",
            buttons: {
                confirm: {
                    label: '<span><i class="bi bi-check-lg"></i></span> Oui',
                    className: 'btn-danger'
                },
                cancel: {
                    label: '<span><i class="bi bi-x-lg"></i></span> Non',
                    className: 'btn-primary'
                }
            },
            callback: function (result) {
                // request will be here
                if(result==true){
 
                    // send request to api / remote server
                    $.ajax({
                        url: "api/ligne_frais/change_status.php",
                        type : "POST",
                        dataType : 'json',
                        data : JSON.stringify({ id: ligne_id, valide: 1}),
                        success : function(result) {
                            // re-load list of lignes frais
                            showLignesFraisFirstPage();
                            //response to user
                            $('#response').html(`<div class='alert alert-success'>${result.message}</div>`);
                        },
                        error: function(xhr, resp, text) {
                            $('#response').html("<div class='alert alert-danger'>Impossible de valider la ligne frais. Veuillez contacter l'administrateur.</div>");
                        }
                    });
                 
                }
            }
        });
    });
    // when 'invalider' button was clicked
    $(document).on('click', '.invalider-ligne-frais-button', function(){
        var ligne_id = $(this).attr('data-id');
        // bootbox for good looking 'confirm pop up'
        bootbox.confirm({
        
            message: "<h4>Vous êtes sûr d'invalider cette ligne frais ?</h4>",
            buttons: {
                confirm: {
                    label: '<span><i class="bi bi-check-lg"></i></span> Oui',
                    className: 'btn-danger'
                },
                cancel: {
                    label: '<span><i class="bi bi-x-lg"></i></span> Non',
                    className: 'btn-primary'
                }
            },
            callback: function (result) {
                // delete request will be here
                if(result==true){
 
                    // send request to api / remote server
                    $.ajax({
                        url: "api/ligne_frais/change_status.php",
                        type : "POST",
                        dataType : 'json',
                        data : JSON.stringify({ id: ligne_id, valide: null}),
                        success : function(result) {
                            // re-load list of lignes frais
                            showLignesFraisFirstPage();
                            $('#response').html(`<div class='alert alert-success'>La ligne frais a été invalidée !</div>`);
                        },
                        error: function(xhr, resp, text) {
                            $('#response').html("<div class='alert alert-danger'>Impossible d'invalider la ligne frais. Veuillez contacter l'administrateur.</div>");
                        }
                    });
                 
                }
            }
        });
    });
    // ========== ADHERENT FUNCTIONS===============
    //declare variable to set id_user for adherent to use in functions corresponding
    var adherent_id;
    // when 'gerer la ligne frais' button was clicked  by adherent
   $(document).on('click', '#gerer-ligne', function(){
        var jwt = getCookie('jwt');
        $.post("api/validate_token.php", JSON.stringify({ jwt:jwt })).done(function(result) {
            //set id adherent
            adherent_id = result.data.id;
            //show all lignes frais of cet adherent
            showLignesFraisFirstPageUser(adherent_id);
            clearResponse();
        })
        // on error/fail, tell the user he needs to login to show the account page
        .fail(function(resultat){
            showLoginPage();
            $('#response').html("<div class='alert alert-danger'>Veuillez vous connecter pour modifier votre demande d'adhésion.</div>");
        });

    });

    // when a 'page' button was clicked to show lignes frais of user by page
    $(document).on('click', '.lignesUser li', function(){
        // get json url
        var json_url=$(this).find('a').attr('data-page');

        // show list of lignes frais
        showLignesFraisUser(json_url, adherent_id);
        clearResponse();
    });

    // when 'all lignes frais' button was clicked by adherent
    $(document).on('click', '.all-ligne-frais-button-user', function(){
        showLignesFraisFirstPageUser(adherent_id);
        clearResponse();
    });

     // when a 'search lignes frais' button was clicked by adherent
     $(document).on('submit', '#search-ligne-frais-form-user', function(){
        clearResponse();
 
        // get search keywords
        var keywords = $(this).find(":input[name='keywords']").val();
        
        // chage page title
        changePageTitle("Chercher lignes frais: " + keywords);
 
        // get data from the api based on search keywords
        $.getJSON("api/ligne_frais/search_ligne_frais_user.php?s=" + keywords + "&id=" + adherent_id, function(data){
            if(data.message){$('#response').html("<div class='alert alert-danger'>Aucune ligne frais trouvée ou la recherche invalide.</div>");}
            else{
                // show template
                showLignesFraisTemplateUser(data, keywords);
                addBordereauControlButton(adherent_id);
            }
 
        });
 
        // prevent whole page reload
        return false;
    });
    // when 'Créer' ligne frais button was clicked by adherent
    $(document).on('click', '.create-ligne-frais-button-user', function(){
        changePageTitle("Créer la ligne frais"); 
        clearResponse();
        var html = createLigneFraisFormUser(adherent_id);
        //rettrieve all motifs to put in select motifs form
        $.getJSON("api/motif/read.php", function(data){
            
            $.each(data.records, function(key, val){
                // pre-select option is category id is the same
                html+=`<option value='` + val.id + `'>` + val.libelle + `</option>`; 
            });

            html+=`</select>
                </td>
                </tr>
                <tr>
                    <td><div class='btn btn-info all-ligne-frais-button-user'><span><i class="bi bi-arrow-left-short"></i></span> Retourner</div></td>
                    <td><button type='submit' class='btn btn-primary'><span><i class="bi bi-plus"></i></span> Créer</button></td>
                </tr>
                </table>
                </div>
                </form>`;
            $('#content').html(html);
            //on displaying form, at first, hide all div below
            $('.div-peage, .div-repas, .div-hebergement').hide();
        }); 
       
    });
    // on submitting form create ligne frais
    $(document).on('submit', '#create-ligne-frais-form-user', function(){
        var data = $(this).serializeObject();
        var peageJustif = $('#p_justificatif').val().replace(/C:\\fakepath\\/i, '');
        var repasJustif = $('#r_justificatif').val().replace(/C:\\fakepath\\/i, '');
        var hebergeJustif = $('#h_justificatif').val().replace(/C:\\fakepath\\/i, '');
        data.peage_justificatif = peageJustif;
        data.repas_justificatif = repasJustif;
        data.justificatif = hebergeJustif;
        var form_data=JSON.stringify(data);
        //for uploading files by XHTTP
        var formData = new FormData();
        formData.append("id_user",$('#id_user').val());
        if(peageJustif){
            var file_peage = document.getElementById("p_justificatif").files;
            formData.append("peage_jus", file_peage[0]);
        }
        if(repasJustif){
            var file_repas = document.getElementById("r_justificatif").files;
            formData.append("repas_jus", file_repas[0]);
        }
        if(hebergeJustif){
            var file_heberge = document.getElementById("h_justificatif").files;
            formData.append("heberge_jus", file_heberge[0]);
        }
        var xhttp = new XMLHttpRequest();
         // Set POST method and ajax file path
        xhttp.open("POST", "api/ligne_frais/upload_files.php", true);
        // call on request changes state
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
    
            var response = this.responseText;
            alert(response);
            }
        };
        // Send request with data
        xhttp.send(formData);

        // submit form data to api
        $.ajax({
            url: "api/ligne_frais/create_ligne_frais.php",
            type : "POST",
            contentType : 'application/json',
            data : form_data,
            success : function(result) {
                // ligne frais was created, go back to list
                showLignesFraisFirstPageUser(adherent_id);
                //addBordereauControlButton(adherent_id)
                $('#response').html("<div class='alert alert-success'>La ligne frais a été créée.</div>");
            },
            error: function(xhr, resp, text) {
                // show error
                $('#response').html("<div class='alert alert-danger'>Impossible de créer la ligne frais. Veuillez contacter l'administrateur.</div>");
            }
        });
        
        return false;
    });

    // when a 'read one ligne frais' button was clicked
    $(document).on('click', '.read-one-ligne-frais-button-user', function(){
        // get lign frais id attached to button 'Lire'
        var id = $(this).attr('data-id');
        // read record based on given ID
        $.getJSON("api/ligne_frais/read_one_ligne_frais.php?id=" + id, function(data){
            clearResponse();
            // show HTML template
            showOneLigneFraisTemplateUser(data);
            // chage page title
            changePageTitle("Info de la ligne frais");
            // prevent whole page reload
            return false;
        });
    });

    // when a 'update lignefrais' button was clicked by adherent
    $(document).on('click', '.update-ligne-frais-button-user', function(){
        clearResponse();
        //get id from button with data-id='val.id'
        var id = $(this).attr('data-id');
        // read one record based on given id
        $.getJSON("api/ligne_frais/read_one_ligne_frais.php?id=" + id, function(data){
            
            //show form to input data to update la ligne frais
            updateOneLigneFraisUser(data);
        });

        //change title
        changePageTitle("Mettre à jour la ligne frais");

        // prevent whole page reload
        return false;

    });
    $(document).on('submit', '#update-ligne-frais-form-user', function(){
        //take values selected in options
        $("#type_trajet:selected").val();
        $("#multip_peage:selected").val();
        //create object from data filled in the form
        var data = $(this).serializeObject();
        //take the name of the file selected by user
        var peageJustif = $('#p_justificatif').val().replace(/C:\\fakepath\\/i, '');
        var repasJustif = $('#r_justificatif').val().replace(/C:\\fakepath\\/i, '');
        var hebergeJustif = $('#h_justificatif').val().replace(/C:\\fakepath\\/i, '');
        //add names of files in object created by form data
        data.peage_justificatif = peageJustif;
        data.repas_justificatif = repasJustif;
        data.justificatif = hebergeJustif;
        //turn object into string Json
        var form_data=JSON.stringify(data);

        //fisrt: delete existing files by XHTTP
        var formData = new FormData();
        //set conditions to delete old files: either (old exists + new exists + cout exists) or (old exists + no new + no cout)
        formData.append("id_user", $('#id_user').val());
        if(($('#p_jus').val() && (document.getElementById("p_justificatif").files.length != 0) && (($('#cout_peage').val() !== '') || ($('#cout_peage').val() !== '0'))) || ($('#p_jus').val() && (document.getElementById("p_justificatif").files.length == 0) && (($('#cout_peage').val() === '') || ($('#cout_peage').val() === '0')))){
            formData.append("peage_jus", $('#p_jus').val());
        }
        if(($('#r_jus').val() && (document.getElementById("r_justificatif").files.length != 0) && (($('#cout_repas').val() !== '') || ($('#cout_repas').val() !== '0'))) || ($('#r_jus').val() && (document.getElementById("r_justificatif").files.length == 0) && (($('#cout_repas').val() === '') || ($('#cout_repas').val() === '0')))){
            formData.append("repas_jus", $('#r_jus').val());
        }
        if(($('#h_jus').val() && (document.getElementById("h_justificatif").files.length != 0) && (($('#cout_hebergement').val() !== '') || ($('#cout_hebergement').val() !== '0'))) || ($('#h_jus').val() && (document.getElementById("h_justificatif").files.length == 0) && (($('#cout_hebergement').val() === '') || ($('#cout_hebergement').val() === '0')))){
            formData.append("heberge_jus", $('#h_jus').val());
        }
        var xhttp1 = new XMLHttpRequest();
        // Set POST method and ajax file path
        xhttp1.open("POST", "api/ligne_frais/delete_files.php", true);
        // call on request changes state
        xhttp1.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {

                var response = this.responseText;
                if(response !==''){
                    alert(response);
                }
            }
        };
        // Send request with data
        xhttp1.send(formData);

        //second: uploading new files by XHTTP
        var formData1 = new FormData();
        formData1.append("id_user",$('#id_user').val());
        if(peageJustif){
            var file_peage = document.getElementById("p_justificatif").files;
            formData1.append("peage_jus", file_peage[0]);
        }
        if(repasJustif){
            var file_repas = document.getElementById("r_justificatif").files;
            formData1.append("repas_jus", file_repas[0]);
        }
        if(hebergeJustif){
            var file_heberge = document.getElementById("h_justificatif").files;
            formData1.append("heberge_jus", file_heberge[0]);
        }
        var xhttp = new XMLHttpRequest();
        // Set POST method and ajax file path
        xhttp.open("POST", "api/ligne_frais/upload_files.php", true);
        // call on request changes state
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
    
                var response1 = this.responseText;
                if(response1 !== ''){
                    alert(response1);
                }
            }
        };
        // Send request with data
        xhttp.send(formData1);

        // post JSON string above to file controller to make change in database
        $.ajax({
            url: "api/ligne_frais/modify_ligne_frais.php",
            type : "POST",
            contentType : 'application/json',
            data : form_data,
            success : function(result) {
        
                // tell it was updated
                $('#response').html("<div class='alert alert-success'>La ligne frais a été mise à jour.</div>");

                //remove title
                $('#page-title').text('');

                // show button 'Toutes Lignes Frais'
                showAllLignesFraisButtonUser();
            },
        
            // show error message to ligne-frais
            error: function(xhr, resp, text){
               
                $('#response').html("<div class='alert alert-danger'>Impossible de mettre à jour la ligne frais.</div>");
                //remove title
                $('#page-title').text('');
                showAllLignesFraisButtonUser();
            }
        });

        return false;

    });
    // when a 'delete' button was clicked
    $(document).on('click', '.delete-ligne-frais-button-user', function(){
        // get the id
        var ligne_id = $(this).attr('data-id');

        // bootbox for good looking 'confirm pop up'
        bootbox.confirm({
        
            message: "<h4>Vous êtes sûr de supprimer cette ligne frais ?</h4>",
            buttons: {
                confirm: {
                    label: '<span><i class="bi bi-check-lg"></i></span> Oui',
                    className: 'btn-danger'
                },
                cancel: {
                    label: '<span><i class="bi bi-x-lg"></i></span> Non',
                    className: 'btn-primary'
                }
            },
            callback: function (result) {
                // delete request will be here
                if(result==true){
                    // delete files of a ligne frais in folder files\ligne_frais
                    deleteFilesById(ligne_id);
    
                    // send delete request to api / remote server to delete in DB
                    $.ajax({
                        url: "api/ligne_frais/delete_ligne_frais.php",
                        type : "POST",
                        dataType : 'json',
                        data : JSON.stringify({ id: ligne_id }),
                        success : function(result) {
                            // re-load list
                            showLignesFraisFirstPageUser(adherent_id);
                            $('#response').html("<div class='alert alert-success'>Cette ligne frais a été supprimée! </div>");
                        },
                        error: function(xhr, resp, text) {
                            $('#response').html("<div class='alert alert-danger'>Impossible de supprimer la ligne frais. Veuillez contacter l'administrateur.</div>");
                        }
                    });
                    
                }
            }
        });
    });
     // when a 'create bordereau' button was clicked
     $(document).on('click', '.create-bordereau-button-user', function(){
         clearResponse();
         changePageTitle('Votre bordereau');
         showBordereau(adherent_id);
     });

    // when click: retrieve bordereau in pdf and send to server 
    $(document).on('click', '#send_getPDF', function(){
          // bootbox for good looking 'confirm pop up'
        bootbox.confirm({
        
            message: "<h4>Vous êtes sûr d'envoyer votre bordereau ?</h4>",
            buttons: {
                confirm: {
                    label: '<span><i class="bi bi-check-lg"></i></span> Oui',
                    className: 'btn-danger'
                },
                cancel: {
                    label: '<span><i class="bi bi-x-lg"></i></span> Non',
                    className: 'btn-primary'
                }
            },
            callback: function (result) {
                //if choice = yes
                if(result==true){
                   // save bordereau on server in folder files/bordereaux, download bordereau on user's end and display message of result
                   sendAndGetPDF(adherent_id);
                    // check if bordereau already exists in DB by using 'read one record based on given id'
                    $.getJSON("api/bordereau/read_by_id_user.php?id=" + adherent_id, function(data){
                        //if not yet created in DB then create:
                        if(!data.id){
                            //define name of bordereau to inject in database
                            var today = new Date();
                            var this_year = today.getFullYear();
                            var src = `user_id_${adherent_id}_${this_year}.jpg`;
                            // make change in table bordereau in database
                            $.ajax({
                                url: "api/bordereau/create_bordereau.php",
                                type : "POST",
                                dataType : 'json',
                                data : JSON.stringify({ id_user: adherent_id, src_bordereau: src }),
                                success : function(result) {
                                    // re-load list
                                    showLignesFraisFirstPageUser(adherent_id);
                                    $('#response').append("<div class='alert alert-success'>Action réussie. Vous pouvez modifier et renvoyer votre bordereau jusqu'à la validation du bordereau. </div>");
                                },
                                error: function(xhr, resp, text) {
                                    $('#response').append("<div class='alert alert-danger'>Impossible de sauvegarder votre bordereau dans la base de données. Veuillez contacter l'administrateur.</div>");
                                }
                            });

                        }else{
                            // re-load list
                            showLignesFraisFirstPageUser(adherent_id);
                            $('#response').append("<div class='alert alert-success'>Action réussie. Vous pouvez modifier et renvoyer votre bordereau jusqu'à la validation du bordereau. </div>");
                        }
                    });  
                     
                    
                }
            }
        });

    });

    // when a 'voir bordereau validé' button was clicked
    $(document).on('click', '.show-bordereau-button-user', function(){
        clearResponse();
        changePageTitle('Votre bordereau validé');
        //show file saved in files/bordereaux corresponding to this adherent_id (piece HTML in bordereau.js)
        showBordereauValide(adherent_id);
    });

    // when click 'téléchager en PDF' button at the bottom of 'Votre bordereau validé'
    $(document).on('click', '#getPDF', function(){
        //save validated bordereau on user's computer 
        var nomFichier = "bordereau_validé.pdf";
        //function to export from img to pdf file and save on computer of user in page.js
        getPDF(nomFichier);        
    });

    // when a 'voir CERFA' button was clicked
    $(document).on('click', '.show-cerfa-button-user', function(){
        clearResponse();
        changePageTitle('Votre CERFA');
        //show file saved in files/cerfa corresponding to this adherent_id (piece HTML in cerfa.js)
        showCERFAValide(adherent_id);
    });

    // ========== ADMIN FUNCTIONS FOR BORDEREAU===============
    // when 'gerer la ligne frais' button was clicked  by adherent
   $(document).on('click', '#gerer-bordereau', function(){
        // show list of motifs
        showBordereauxFirstPage(); 
        clearResponse();
    });

    // when a 'page of bordereau' button was clicked
    $(document).on('click', '.bordereau li', function(){
        // get json url
        var json_url=$(this).find('a').attr('data-page');

        // show list
        showBordereaux(json_url);
        clearResponse();
    });

    // when a 'lire' bordereau button was clicked
    $(document).on('click', '.read-one-bordereau-button', function(){
        // get demandeur id
        var id = $(this).attr('data-id');
        // read record based on given ID
        $.getJSON("api/bordereau/read_one_bordereau.php?id=" + id, function(data){
            // show HTML template
            showOneBordereauTemplate(data);
            // chage page title
            changePageTitle("Info du bordereau");
            // prevent whole page reload
            return false;
        });
    });

    // when a 'Modifier' bordereau button was clicked
    $(document).on('click', '.update-bordereau-button', function(){
        clearResponse();
        //get bordereau id from button with data-id='val.id' in form showBordereaux()
        var id = $(this).attr('data-id');
        // read one record based on given bordereau id
        $.getJSON("api/bordereau/read_one_bordereau.php?id=" + id, function(data){
            updateOneBordereau(data);
        });

        //change title
        changePageTitle("Mettre à jour le bordereau");

        // prevent whole page reload
        return false;

    });

    //when click show div to add cerfa in form update bordereau
    $(document).on('click', '#ajout-cerfa', function(){
        $('.div-cerfa').show('slow');
    });

    // on submit update bordereau form _ for admin role
    $(document).on('submit', '#update-bordereau-form', function(){
        //create object from data filled in the form
        var data = $(this).serializeObject();
        //take the names of files chosen
        var bordereau = $('#src_b').val().replace(/C:\\fakepath\\/i, '');
        var cerfa = $('#src_c').val().replace(/C:\\fakepath\\/i, '');
        //add names of files in object created by form data
        data.src_bordereau = bordereau;
        data.cerfa = cerfa;
        //turn object into string Json
        var form_data=JSON.stringify(data);

        /*********************/
        //first: delete existing files by XHTTP
        var formData = new FormData();
        // set condition to delete old files: if there are both old and new file chosen
        if($('#src_bor').val() && (document.getElementById("src_b").files.length != 0)){
            formData.append("src_bordereau", $('#src_bor').val());
        }
        if($('#src_cer').val() && (document.getElementById("src_c").files.length != 0)){
            formData.append("cerfa", $('#src_cer').val());
        }
        var xhttp1 = new XMLHttpRequest();
        // Set POST method and ajax file path
        xhttp1.open("POST", "api/bordereau/delete_files.php", true);
        // call on request changes state
        xhttp1.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {

                var response = this.responseText;
                if(response !==''){
                    alert(response);
                }
            
            }
        };
        // Send request with data
        xhttp1.send(formData);

        /********************/
        //second: uploading new files to DB by XHTTP
        var formData1 = new FormData();
        //add id_user in formData to post
        formData1.append("id_user",$('#id_user').val());
        //if new file of bordereau and cerfa was added to the form
        if(bordereau){
            var file_bordereau = document.getElementById("src_b").files;
            formData1.append("src_bordereau", file_bordereau[0]);
        }
        if(cerfa){
            var file_cerfa = document.getElementById("src_c").files;
            formData1.append("cerfa", file_cerfa[0]);
        }
        var xhttp = new XMLHttpRequest();
        // Set POST method and ajax file path
        xhttp.open("POST", "api/bordereau/upload_files.php", true);
        // call on request changes state
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
    
                var response1 = this.responseText;
                if(response1 !== ''){
                    alert(response1);
                }
            }
        };
        // Send request with data
        xhttp.send(formData1);

        /*************************/
        // third:post JSON string above to file controller to make changes in DB
        $.post("api/bordereau/modify_bordereau.php", form_data).done(function(result) {
           
                // tell it was updated
                $('#response').html("<div class='alert alert-success'>Le bordereau a été mis à jour.</div>");

                //remove title
                $('#page-title').text('');

                // show button 'tous bordereaux'
                showAllBordereauxButton();
        })
        // on error/fail, tell the user we cant update le bordereau
        .fail(function(resultat){
            //message error
            $('#response').html("<div class='alert alert-danger'>Impossible de mettre à jour le bordereau.</div>");
            //remove title
            $('#page-title').text('');
            // show button 'tous bordereaux'
            showAllBordereauxButton();
            
        });

        return false;

    });

    // when 'all bordereaux' button was clicked
    $(document).on('click', '.all-bordereaux-button', function(){
        //show list all bordereaux
        showBordereauxFirstPage();
        clearResponse();
    });



    // when a 'search bordereaux' button was clicked
    $(document).on('submit', '#search-bordereau-form', function(){
        clearResponse();

        // get search keywords
        var keywords = $(this).find(":input[name='keywords']").val();
        
        // chage page title
        changePageTitle("Chercher bordereau: " + keywords);

        // get data from the api based on search keywords
        $.getJSON("api/bordereau/search_bordereau.php?s=" + keywords, function(data){
            if(data.message){$('#response').html(`<div class='alert alert-danger'>${data.message}.</div>`)}else{
            // template in bordereaux.js
            showBordereauxTemplate(data, keywords);}

        });

        // prevent whole page reload
        return false;
    });

    // when a 'delete' button was clicked
    $(document).on('click', '.delete-bordereau-button', function(){
        // get the id
        var bordereau_id = $(this).attr('data-id');

        // bootbox for good looking 'confirm pop up'
        bootbox.confirm({
        
            message: "<h4>Vous êtes sûr de supprimer ce bordereau?</h4>",
            buttons: {
                confirm: {
                    label: '<span><i class="bi bi-check-lg"></i></span> Oui',
                    className: 'btn-danger'
                },
                cancel: {
                    label: '<span><i class="bi bi-x-lg"></i></span> Non',
                    className: 'btn-primary'
                }
            },
            callback: function (result) {
                // delete request will be here
                if(result==true){
                     // delete files of bordereau in folder files\bordereaux
                     deleteFilesByIdBordereau(bordereau_id);

                    // send delete request to api / remote server to delete bordereau in DB
                    $.ajax({
                        url: "api/bordereau/delete_bordereau.php",
                        type : "POST",
                        dataType : 'json',
                        data : JSON.stringify({ id: bordereau_id }),
                        success : function(result) {
                
                            // re-load list of bordereaux
                            showBordereauxFirstPage();
                            $('#response').html(`<div class='alert alert-success'>Le bordereau a été supprimé.</div>`);
                        },
                        error: function(xhr, resp, text) {
                            $('#response').html("<div class='alert alert-danger'>Impossible de supprimer le bordereau. Veuillez contacter l'administrateur.</div>");
                        }
                    });
                
                }
            }
        });
    });

    // when 'valider bordereau' button was clicked to validate le bordereau and all its lignes frais corresponding
    $(document).on('click', '.valider-bordereau-button', function(){
        var bordereau_id = $(this).attr('data-id');
        // bootbox for good looking 'confirm pop up'
        bootbox.confirm({
        
            message: "<h4>Vous êtes sur de valider le bordereau et toutes ses lignes frais ?</h4>",
            buttons: {
                confirm: {
                    label: '<span><i class="bi bi-check-lg"></i></span> Oui',
                    className: 'btn-danger'
                },
                cancel: {
                    label: '<span><i class="bi bi-x-lg"></i></span> Non',
                    className: 'btn-primary'
                }
            },
            callback: function (result) {
                // valider request will be here
                if(result==true){
                    
                    // send request to api to change status of bordereau: become etre_validé ou 'etre_valide = 1' in DB
                    $.ajax({
                        url: "api/bordereau/change_status.php",
                        type : "POST",
                        dataType : 'json',
                        data : JSON.stringify({ id: bordereau_id, valide: 1}),
                        success : function(result) {
                            // re-load list of bordereaux
                            showBordereauxFirstPage();
                            $('#response').html("<div class='alert alert-success'>Le statut du bordereau a été changé à 'validé'</div>");
                        },
                        error: function(xhr, resp, text) {
                            $('#response').html("<div class='alert alert-danger'>Impossible de valider le bordereau. Veuillez contacter l'administrateur.</div>");
                        }
                    });
                    // read one record based on given bordereau id
                    $.getJSON("api/bordereau/read_one_bordereau.php?id=" + bordereau_id, function(data){
                        //retrieve all lignes frais by id user
                        $.getJSON("api/ligne_frais/read_by_id_user.php?id=" + data.id_user, function(da){
                            var counter = 0;
                            // loop through returned list of data
                            $.each(da.records, function(key, val) {
                                if(val.etre_valide != 1){
                                    $.ajax({
                                        type: 'POST',
                                        url: 'api/ligne_frais/change_status.php',
                                        data: JSON.stringify({ id: val.id, valide: 1 }),
                                        async: false, //set to false to wait for the counter augmented.
                                        success: function() {
                                            counter = counter + 1;
                                        },
                                        error: function() {
                                            $('#response').append("<div class='alert alert-danger'>Impossible de valider certaine ligne de frais.</div>");
                                        }
                                    });
                                }
                                
                            });
                            $('#response').append(`<div class='alert alert-success'>${counter} ligne(s) frais relative(s) ont été validée(s) par cette action !</div>`);
                        }); 
                    });
                
                }
            }
        });
    });
    // when 'invalider' button was clicked
    $(document).on('click', '.invalider-bordereau-button', function(){
        var ligne_id = $(this).attr('data-id');
        // bootbox for good looking 'confirm pop up'
        bootbox.confirm({
        
            message: "<h4>Vous êtes sûr d'invalider le bordereau ?</h4>",
            buttons: {
                confirm: {
                    label: '<span><i class="bi bi-check-lg"></i></span> Oui',
                    className: 'btn-danger'
                },
                cancel: {
                    label: '<span><i class="bi bi-x-lg"></i></span> Non',
                    className: 'btn-primary'
                }
            },
            callback: function (result) {
                // delete request will be here
                if(result==true){

                    // send request to api / remote server to change etre_valide = null in DB
                    $.ajax({
                        url: "api/bordereau/change_status.php",
                        type : "POST",
                        dataType : 'json',
                        data : JSON.stringify({ id: ligne_id, valide: null}),
                        success : function(result) {
                            // re-load list of lignes frais
                            showBordereauxFirstPage();
                            $('#response').html(`<div class='alert alert-success'>${result.message}</div>`);
                        },
                        error: function(xhr, resp, text) {
                            $('#response').html("<div class='alert alert-danger'>Impossible d'invalider le bordereau. Veuillez contacter l'administrateur.</div>");
                        }
                    });
                
                }
            }
        });
    });
    //when click Créer bordereau button
    $(document).on('click', '.create-bordereau-button', function(){
        changePageTitle("Créer le bordereau pour l'utilisateur"); 
        clearResponse();
        createBordereau();
    });
    // when 'Voir ses lignes frais' button was clicked 
    $(document).on('click', '.all-ligne-frais-button-of-user', function(){
        adherent_id = $('#create-bordereau-form').find(":input[name='id_user']").val();
        //if user don't input id_user
        if(!adherent_id){
           //message remind user to input Id_user
            $('#response').html("<div class='alert alert-danger'>Veuillez choisir id d'utilisateur!</div>");
        
        }else{
            //check if id_user input is valid or not
            $.getJSON("api/user/read_one_user.php?id="+adherent_id, function(da){
                //if cant find that id_user or if found but role is different than 'adherent'
                if(da.message || (da.id && da.role != 'adherent')){
                    //display response
                    $('#response').html(`<div class='alert alert-danger'>L'utilisateur ${adherent_id} n'est pas un adhérent!</div>`);
                }else{
                    //check if this id_user has any lignes frais
                    $.getJSON("api/ligne_frais/read_by_id_user.php?id="+adherent_id, function(data){
                        //if found then display all lignes frais of that user
                        if(data.records){
                            clearResponse();
                            showLignesFraisFirstPageUser(adherent_id);
                            addBordereauControlButton(adherent_id);
                        }else if(data.message){
                            //if not found, tell admin that 'lignes frais pas encore déclarée'
                            $('#response').html(`<div class='alert alert-danger'>L'utilisateur ${adherent_id} n'a pas encore déclaré ses lignes frais.</div>`);
                        }
                    });
                    
                }
                    
            
            });
        } 
        // prevent whole page reload
        return false;
        
    });
    // on submitting form (click 'Créer Bordereau' button in form Créer le bordereau pour l'utilisateur)
    $(document).on('submit', '#create-bordereau-form', function(){
         // get input data 
         adherent_id = $(this).find(":input[name='id_user']").val();
         // check if id_user input is valid or not
         $.getJSON("api/user/read_one_user.php?id="+adherent_id, function(da){
                //if cant find that id_user or if found but role is different than 'adherent'
                if(!da.id || (da.id && da.role != 'adherent')){
                    //display response
                    $('#response').html(`<div class='alert alert-danger'>L'utilisateur ${adherent_id} n'est pas un adhérent!</div>`);
                }else{
                    //check if this id_user has any lignes frais
                    $.getJSON("api/ligne_frais/read_by_id_user.php?id="+adherent_id, function(data){
                        //if found his lignes frais then check if this user has bordereau or not yet
                        if(data.records){
                            $.getJSON("api/bordereau/read_by_id_user.php?id=" + adherent_id, function(d){
                                //if not yet created his bordereau then show bordereau to save in system
                                if(d.message){
                                    clearResponse();
                                    changePageTitle(`Bordereau de l'utilisateur ${adherent_id}`);
                                    showBordereauAdmin(adherent_id);
                                }else{
                                     // if bordereau is already created, then show form to update a bordereau 
                                     updateOneBordereau(d);
                                     changePageTitle(`Modifier le bordereau de l'utilisateur ${adherent_id}`);
                                    $('#response').html(`<div class='alert alert-danger'>Le bordereau de l'utilisateur ${adherent_id} existe déjà.</div>`);
                                }
                            });
                            
                        }else if(data.message){
                            //if not found, tell admin that 'lignes frais pas encore déclarée'
                            $('#response').html(`<div class='alert alert-danger'>L'utilisateur ${adherent_id} n'a pas encore déclaré ses lignes frais. Créer ses lignes frais tout d'abord! </div>`);
                        }
                    });
                    
                }
                    
            
         });
        
        // prevent whole page reload
        return false;
    });

    //====================Partie CERFA===================================
    //onclick : show CERFA form button
    $(document).on('click', '.show-cerfa-form-button', function(){
        adherent_id = $(this).attr('data-id');
        clearResponse();
        changePageTitle('CERFA formulaire');
        showCERFAForm(adherent_id);
    });

    // when click the button bottom of the cerfa form, it will retrieve CERFA in pdf and send to server 
    $(document).on('click', '#send_getPDF_cerfa', function(){
        // bootbox for good looking 'confirm pop up'
      bootbox.confirm({
      
          message: "<h4>Vous êtes sûr de sauvegarder le CERFA et le télécharger ?</h4>",
          buttons: {
              confirm: {
                  label: '<span><i class="bi bi-check-lg"></i></span> Oui',
                  className: 'btn-danger'
              },
              cancel: {
                  label: '<span><i class="bi bi-x-lg"></i></span> Non',
                  className: 'btn-primary'
              }
          },
          callback: function (result) {
              //if choice = yes
              if(result==true){
                // save cerfa on server and download cerfa on user's end
                sendAndGetCERFA(adherent_id);
                //send email to inform adherent about the cerfa is ready using ajax
                var response = '';
                $.getJSON("api/user/read_one_user.php?id=" + adherent_id, function(d){

                    $.ajax({
                        url: "forms/send_cerfa.php",
                        type : "POST",
                        dataType : 'json',
                        data : { email: d.email },
                        success : function(result) {
                            response += `Email envoyé à l'utilisateur. ` + result;
                            $('#response').append(`<div class='alert alert-success'>${response}</div>`);
                        },
                        error: function(xhr, resp, text) {
                            response += `Impossible d'envoyer la notification à l'adhérent.`;
                            $('#response').append(`<div class='alert alert-danger'>${response}</div>`);
                        }
                    });
                });
                // check if cerfa already exists in DB by using 'read one record based on given id'
                $.getJSON("api/bordereau/read_by_id_user.php?id=" + adherent_id, function(data){
                    //if not yet created in DB then create:
                    if(!data.cerfa){
                    //define name of bordereau to inject in database
                    var today = new Date();
                    var this_year = today.getFullYear();
                    var src_cerfa = `user_id_${adherent_id}_${this_year}.pdf`;
                    // make change in table bordereau in database
                    $.ajax({
                        url: "api/bordereau/add_cerfa.php",
                        type : "POST",
                        dataType : 'json',
                        data : JSON.stringify({ id_user: adherent_id, src_cerfa: src_cerfa }),
                        success : function(result) {
                            // re-load list of bordereaux
                            showBordereauxFirstPage();
                            $('#response').append(`<div class='alert alert-success'>${result.message}</div>`);  
                        },
                        error: function(xhr, resp, text) {
                            $('#response').append("<div class='alert alert-danger'>Impossible de sauvegarder le CERFA dans la base de données. Veuillez contacter l'administrateur.</div>");
                        }
                    });

                    }else{
                        // re-load list
                        showBordereauxFirstPage();
                        $('#response').append(`<div class='alert alert-success'>Le nouveau CERFA a été bien enregistré dans le système</div>`);
                        
                    }
                });  
                  
              }
          }
      });

  });
 
    //========================TRESORIER FUNCTIONS ======================
    $(document).on('click', '#consulter-bordereau', function(){
        // show list of bordereaux and change title
        showBordereauxFirstPageTresorier(); 
        //clear previous response
        clearResponse();

        
    });
    // when a 'page' button was clicked
    $(document).on('click', '.bordereaux li', function(){
        // get json url
        var json_url=$(this).find('a').attr('data-page');
        // show list of motifs
        showBordereauxTresorier(json_url);
        clearResponse();
    });

    // when a 'Lire' bordereau button was clicked by tresorier
    $(document).on('click', '.read-one-bordereau-button-tresorier', function(){
        // get demandeur id
        var id = $(this).attr('data-id');
        // read record based on given ID
        $.getJSON("api/bordereau/read_one_bordereau.php?id=" + id, function(data){
            // show HTML template
            showOneBordereauTemplateTresorier(data);
            // chage page title
            changePageTitle("Info du bordereau");
        });
        // prevent whole page reload
        return false;
    });
    
    // when 'Tous bordereaux' button was clicked by tresorier or retourner à la liste
    $(document).on('click', '.all-bordereaux-button-tresorier', function(){
        //show list all bordereaux
        showBordereauxFirstPageTresorier();
        clearResponse();
    });

    //onclick : show CERFA form button by tresorier (button 'Modifier CERFA' or 'Créer CERFA') in case edit or create new CERFA
    $(document).on('click', '.show-cerfa-form-button-tresorier', function(){
        adherent_id = $(this).attr('data-id');
        clearResponse();
        changePageTitle('CERFA formulaire');
        showCERFAFormTresorier(adherent_id);
    });

    // when click the button bottom of the cerfa form, it will retrieve CERFA in pdf and send to server 
    $(document).on('click', '#send_getPDF_cerfa_tresorier', function(){
        // bootbox for good looking 'confirm pop up'
      bootbox.confirm({
      
          message: "<h4>Vous êtes sûr de sauvegarder le CERFA, le télécharger et l'envoyer à l'adhérent ?</h4>",
          buttons: {
              confirm: {
                  label: '<span><i class="bi bi-check-lg"></i></span> Oui',
                  className: 'btn-danger'
              },
              cancel: {
                  label: '<span><i class="bi bi-x-lg"></i></span> Non',
                  className: 'btn-primary'
              }
          },
          callback: function (result) {
              //if choice = yes
              if(result==true){
                // save cerfa on server and download cerfa on user's end
                sendAndGetCERFA(adherent_id);
                //send email to inform adherent about the cerfa is ready using ajax
                var response = '';
                $.getJSON("api/user/read_one_user.php?id=" + adherent_id, function(d){

                    $.ajax({
                        url: "forms/send_cerfa.php",
                        type : "POST",
                        dataType : 'json',
                        data : { email: d.email },
                        success : function(result) {
                            response += `Email envoyé à l'utilisateur. ` + result;
                            $('#response').append(`<div class='alert alert-success'>${response}</div>`);
                        },
                        error: function(xhr, resp, text) {
                            response += `Impossible d'envoyer la notification à l'adhérent.`;
                            $('#response').append(`<div class='alert alert-danger'>${response}</div>`);
                        }
                    });
                });

                // check if cerfa already exists in DB by using 'read one record based on given id'
                $.getJSON("api/bordereau/read_by_id_user.php?id=" + adherent_id, function(data){
                    //if not yet created in DB then create:
                    if(!data.cerfa){
                    //define name of bordereau to inject in database
                    var today = new Date();
                    var this_year = today.getFullYear();
                    var src_cerfa = `user_id_${adherent_id}_${this_year}.pdf`;
                    // make change in table bordereau in database
                    $.ajax({
                        url: "api/bordereau/add_cerfa.php",
                        type : "POST",
                        dataType : 'json',
                        data : JSON.stringify({ id_user: adherent_id, src_cerfa: src_cerfa }),
                        success : function(result) {
                            // re-load list of bordereaux
                            showBordereauxFirstPageTresorier();
                            $('#response').append(`<div class='alert alert-success'>${result.message}</div>`);  
                        },
                        error: function(xhr, resp, text) {
                            $('#response').append("<div class='alert alert-danger'>Impossible de sauvegarder le CERFA dans la base de données. Veuillez contacter l'administrateur.</div>");
                        }
                    });

                    }else{
                        // if already created, pretend that its there!
                        showBordereauxFirstPageTresorier();
                        $('#response').append(`<div class='alert alert-success'>Le nouveau CERFA a été bien enregistré dans le système</div>`);
                        
                    }
                });  
                  
              }
          }
      });

  });

    // when 'invalider' button was clicked by tresorier
    $(document).on('click', '.invalider-bordereau-button-tresorier', function(){
        var ligne_id = $(this).attr('data-id');
        // bootbox for good looking 'confirm pop up'
        bootbox.confirm({
        
            message: "<h4>Vous êtes sûr d'invalider ce bordereau ?</h4>",
            buttons: {
                confirm: {
                    label: '<span><i class="bi bi-check-lg"></i></span> Oui',
                    className: 'btn-danger'
                },
                cancel: {
                    label: '<span><i class="bi bi-x-lg"></i></span> Non',
                    className: 'btn-primary'
                }
            },
            callback: function (result) {
                // request will be here
                if(result==true){

                    // send request to api / remote server to change 'etre_valide= null'
                    $.ajax({
                        url: "api/bordereau/change_status.php",
                        type : "POST",
                        dataType : 'json',
                        data : JSON.stringify({ id: ligne_id, valide: null}),
                        success : function(result) {
                            // re-load list of lignes frais
                            showBordereauxFirstPageTresorier();
                            $('#response').html(`<div class='alert alert-success'>${result.message}</div>`);
                        },
                        error: function(xhr, resp, text) {
                            $('#response').html("<div class='alert alert-danger'>Impossible d'invalider le bordereau. Veuillez contacter l'administrateur.</div>");
                        }
                    });
                
                }
            }
        });
    });
   
    // when 'valider bordereau' button was clicked by tresorier to complete "la partie conservée pour l'association"
    $(document).on('click', '.valider-bordereau-button-tresorier', function(){
        clearResponse();
        adherent_id = $(this).attr('data-id');
        // bootbox for good looking 'confirm pop up'
        bootbox.confirm({
        
            message: "<h4>Vous êtes sûr d'accéder à ce bordereau pour le valider ?</h4>",
            buttons: {
                confirm: {
                    label: '<span><i class="bi bi-check-lg"></i></span> Oui',
                    className: 'btn-danger'
                },
                cancel: {
                    label: '<span><i class="bi bi-x-lg"></i></span> Non',
                    className: 'btn-primary'
                }
            },
            callback: function (result) {
                // valider request will be here
                if(result==true){
                    //display form bordereau including the part reserved to input trésorier info
                    showBordereauTresorier(adherent_id);
                    //changer title
                    changePageTitle(`Le bordereau de l'utilisateur id ${adherent_id}`);
                }
            }
        });
    });

   // when click by tresorier to save down le bordereau in pdf and validate then send it to server 
   $(document).on('click', '#send_getPDF_tresorier', function(){
         // bootbox for good looking 'confirm pop up'
       bootbox.confirm({
       
           message: "<h4>Vous êtes sûr de valider ce bordereau et toutes ses lignes frais ?</h4>",
           buttons: {
               confirm: {
                   label: '<span><i class="bi bi-check-lg"></i></span> Oui',
                   className: 'btn-danger'
               },
               cancel: {
                   label: '<span><i class="bi bi-x-lg"></i></span> Non',
                   className: 'btn-primary'
               }
           },
           callback: function (result) {
               //if choice = yes
               if(result==true){

                   // save bordereau on server and download bordereau on user's end
                   sendAndGetPDF(adherent_id); 

                    $.getJSON("api/bordereau/read_by_id_user.php?id=" + adherent_id, function(data){
                        // send request to api to change status of bordereau: become etre_validé
                        $.ajax({
                            url: "api/bordereau/change_status.php",
                            type : "POST",
                            dataType : 'json',
                            data : JSON.stringify({ id: data.id, valide: 1}),
                            success : function(result) {
                                // re-load list of bordereaux
                                showBordereauxFirstPageTresorier();
                                $('#response').append("<div class='alert alert-success'>Le statut du bordereau a été changé à 'validé'</div>");
                            },
                            error: function(xhr, resp, text) {
                                $('#response').append("<div class='alert alert-danger'>Impossible de valider le bordereau. Veuillez contacter l'administrateur.</div>");
                            }
                        });
                    });
                    //retrieve all lignes frais by id user to change status of all lignes frais corresponding 'etre_valide = 1'
                   $.getJSON("api/ligne_frais/read_by_id_user.php?id=" + adherent_id, function(da){
                        //set counter to count number of lignes frais affected
                        var counter = 0;
                        // loop through returned list of data
                        $.each(da.records, function(key, val) {
                            if(val.etre_valide != 1){
                                $.ajax({
                                    type: 'POST',
                                    url: 'api/ligne_frais/change_status.php',
                                    data: JSON.stringify({ id: val.id, valide: 1 }),
                                    async: false, //set to false to wait for the counter to get augmented.
                                    success: function() {
                                        counter = counter + 1;
                                    },
                                    error: function() {
                                        $('#response').append("<div class='alert alert-danger'>Impossible de valider certaine ligne de frais.</div>");
                                    }
                                });
                            }
                            
                        });
                        $('#response').append(`<div class='alert alert-success'>${counter} ligne(s) frais relative(s) ont été validée(s) par cette action !</div>`);
                   });

               }
           }
       });

   });
   //============= PARTIE MDP OUBLIE==============

   // on clicking on button 'mdp oublié'
   $(document).on('click', '#button_mdp_oublie', function(e){
        $('#email_of_user').removeAttr('hidden');
        $('#button_mdp_oublie').remove();
        $('#addButton').append(`<button type="submit" class="btn btn-danger w-100" id="sendLink"> Envoyez-moi un mail</button>`);
    });

    // on clicking on button 'Envoyez-moi un mail'
   $(document).on('submit', '#mdp_oublie_form', function(e){
        //stop form from functioning as usual
        e.preventDefault();
        //search to see if the email exists in DB
        var email = $('#email_of_user').val();
        var action = "forms/contact_user.php";
        var thisForm = document.getElementById("mdp_oublie_form");
        var formData = new FormData(document.getElementById("mdp_oublie_form"));
       
        $.post("api/user/search_email_user.php", JSON.stringify({ email: email })).done(function(result) {
            $('.alert').remove();
            php_email_form_submit(thisForm, action, formData);  
            //to avoid the authentification of email input of PHPEmail function, we dont 'catch error' in this email-sending-form, we suppose as if email exists in DB -> as if its real!
            $('#mdp_oublie_form').append(`<div class='alert alert-success my-3'>Le lien à changer votre mot de passe a été envoyé. Veuillez vérifier votre boite mail!</div>`);
        })
        // on error/fail, tell the user
        .fail(function(resultat){
            $('.alert').remove();
            $('#mdp_oublie_form').append(`<div class='alert alert-danger my-3'>L'email saisi ne correspond à aucun utilisateur dans notre système.</div>`);
        });
        //prevent re-load page
        return false;
   });

    // on submiting update pw form
   $(document).on('submit', '#update_pw_form', function(){
       //take values of formulaire input 
       var mdp_confirm = $('#mdp_to_confirm').val();
       var email = $('#email_to_change').val();
       var mdp = $('#mdp_to_change').val();
       //check if both input mdp are the same
      if(mdp==mdp_confirm){
        // submit form data to api update_pw: check for (email exists and update mdp done in DB)
        $.ajax({
            url: "api/user/update_pw.php",
            type : "POST",
            dataType : 'json',
            data : JSON.stringify({ email: email, mdp: mdp}),
            success : function(result){
                // redirect to home page of M2L
                window.location.href = "http://localhost/M2L/index.html";
                // pop alert telling user
                alert('Votre nouveau mot de passe a été bien sauvegardé! Veuillez vous connecter pour accéder à votre compte!');
            },
            error: function(xhr, resp, text){
                // on error of email input (email not exists), tell the user login has failed & empty the input boxes
                $('#response').html(`<div class='alert alert-danger'>Echec de la mise à jour du mot de passe. Veuillez vérifier vos saisies!</div>`);
            
                }
            });
        }else{
            //en cas le mdp input and the mdp confirm are not the same
            $('#response').html(`<div class='alert alert-danger'>Echec de la mise à jour du mot de passe. Veuillez vérifier vos saisies!</div>`);
        }
   });



});