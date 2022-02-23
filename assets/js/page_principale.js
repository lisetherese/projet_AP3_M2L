 // jQuery codes
 $(document).ready(function(){

    //functions to fill/ unfill cases in CERFA form
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

        // submit form data to api
        $.ajax({
            url: "api/user/create_user.php",
            type : "POST",
            contentType : 'application/json',
            data : form_data,
            success : function(result) {
                showLoginPage();
                // if response is a success, tell the user it was a successful sign up & empty the input boxes
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
        $.ajax({
            url: "api/user/login.php",
            type : "POST",
            contentType : 'application/json',
            data : new_form_data,
            success : function(result){
                // store jwt to cookie
                setCookie("jwt", result.jwt, 1);
                // show home page's content & tell the user it was a successful login
                showHomePage(result.role, result.email);
                $('#response').html("<div class='alert alert-success'>Connexion réussie.</div>");
                //change look on page
                //$('#page_title').text('');
                $('#nom_user').text(result.email);
                //display log in menu according to role of user
                showLoggedInMenu(result.role);
                //set value for variable dclared above
                role_user = result.role;    
                //add id_user found in this result in form data
                form_data.id_user = result.id;
            },
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
                login_form.find('input').val('');
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

         // when a 'page' button was clicked
        $(document).on('click', '.pagination li', function(){
            // get json url
            var json_url=$(this).find('a').attr('data-page');

            // show list of ligues
            showLigues(json_url);
        });

    });

    // when a 'update ligue' button was clicked
    $(document).on('click', '.update-ligue-button', function(){
        //get ligue id from button with data-id='val.id' in form showLigues()
        var id = $(this).attr('data-id');
        // read one record based on given ligue id
        $.getJSON("http://localhost/M2L/api/ligue/read_one_ligue.php?id=" + id, function(data){
            updateOneLigue(data);
        });

        //change title
        changePageTitle("Mis à jour la ligue");

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
        $.getJSON("http://localhost/M2L/api/ligue/read_one_ligue.php?id=" + id, function(data){
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
        $.getJSON("http://localhost/M2L/api/ligue/search_ligue.php?s=" + keywords, function(data){
            if(data.message){$('#response').html("<div class='alert alert-danger'>${data.message}.</div>")}else{
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
                        url: "http://localhost/M2L/api/ligue/delete_ligue.php",
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
            url: "http://localhost/M2L/api/ligue/create_ligue.php",
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
        
        // when a 'page' button was clicked
        $(document).on('click', '.pagination li', function(){
            // get json url
            var json_url=$(this).find('a').attr('data-page');

            // show list of users
            showUsers(json_url);
        });

    });

    // when a 'update user' button was clicked
    $(document).on('click', '.update-user-button', function(){
        //get user id from button with data-id='val.id' in form showUsers()
        var id = $(this).attr('data-id');
        // read one record based on given user id
        $.getJSON("http://localhost/M2L/api/user/read_one_user.php?id=" + id, function(data){
            updateOneUser(data);
        });

        //change title
        changePageTitle("Mis à jour l'utilisateur");

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
        $.getJSON("http://localhost/M2L/api/user/read_one_user.php?id=" + id, function(data){
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
        $.getJSON("http://localhost/M2L/api/user/search_user.php?s=" + keywords, function(data){
            if(data.message){$('#response').html("<div class='alert alert-danger'>${data.message}.</div>")}else{
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
                        url: "http://localhost/M2L/api/user/delete_user.php",
                        type : "POST",
                        dataType : 'json',
                        data : JSON.stringify({ id: user_id }),
                        success : function(result) {
                 
                            // re-load list of users
                            showUsersFirstPage();
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
            url: "http://localhost/M2L/api/user/create_user.php",
            type : "POST",
            contentType : 'application/json',
            data : form_data,
            success : function(result) {
                // user was created, go back to users list
                showUsersFirstPage();
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

            changePageTitle("Mis à jour votre compte");

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
        showDemandeursFirstPage();
        changePageTitle("Liste des demandeurs");
        
        // when a 'page' button was clicked
        $(document).on('click', '.pagination li', function(){
            // get json url
            var json_url=$(this).find('a').attr('data-page');

            // show list of demandeurs
            showDemandeurs(json_url);
        });

    });

    // when a 'update demandeur' button was clicked
    $(document).on('click', '.update-demandeur-button', function(){
        
        //get demandeur id from button with data-id='val.id' in form showDemandeurs()
        var id = $(this).attr('data-id');
        // read one record based on given demandeur id
        $.getJSON("http://localhost/M2L/api/demandeur/read_one_demandeur.php?id=" + id, function(data){
            clearResponse();
             //change title
            changePageTitle("Mis à jour la demandeur");
            updateOneDemandeur(data);
        });
        // prevent whole page reload
        //return false;

    });

    // when 'valider demandeur' button was clicked to convert demandeur into adhérent
    $(document).on('click', '.valider-demandeur-button', function(){
        var demandeur_id = $(this).attr('data-id');
        var user_id = 0;
        $.getJSON("http://localhost/M2L/api/demandeur/read_one_demandeur.php?id=" + demandeur_id, function(resultat){
            user_id = resultat.id_user;
            // bootbox for good looking 'confirm pop up'
            bootbox.confirm({
            
                message: "<h4>Vous êtes sur de valider l'adhésion ?</h4>",
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
                        // change status "etre_adherent" of demandeur
                        addAdhesion(demandeur_id, user_id);
    
                    }
                }
            });
        });
        
    });
    

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

                // replace content div
                showAllDemandeursButton();
            },
        
            // show error message to demandeur
            error: function(xhr, resp, text){
                
                showAllDemandeursButton();
                $('#response').html("<div class='alert alert-danger'>Impossible de mettre à jour le demandeur.</div>");
            }
        });

        return false;

    });
    // when a 'read one demandeur' button was clicked
    $(document).on('click', '.read-one-demandeur-button', function(){
        clearResponse();
        // get demandeur id
        var id = $(this).attr('data-id');
        // read demandeur record based on given ID
        $.getJSON("http://localhost/M2L/api/demandeur/read_one_demandeur.php?id=" + id, function(data){
            // show HTML template
            showOneDemandeurTemplate(data);
            // chage page title
            changePageTitle("Info demandeur");
            
            
        });
        // prevent whole page reload
        return false;
    });

    // when 'all demandeurs' button was clicked
    $(document).on('click', '.all-demandeurs-button', function(){
        showDemandeursFirstPage();
        changePageTitle("Liste des demandeurs");
    });

    
    // when a 'search demandeurs' button was clicked
    $(document).on('submit', '#search-demandeur-form', function(){
        clearResponse();
    
        // get search keywords
        var keywords = $(this).find(":input[name='keywords']").val();
        
        // chage page title
        changePageTitle("Chercher demandeurs: " + keywords);
    
        // get data from the api based on search keywords
        $.getJSON("http://localhost/M2L/api/demandeur/search_demandeur.php?s=" + keywords, function(data){
            if(data.message){$('#response').html("<div class='alert alert-danger'>${data.message}.</div>")}else{
            // template in demandeurs.js
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
                        url: "http://localhost/M2L/api/demandeur/delete_demandeur.php",
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

        // when 'create demandeur' button was clicked
    $(document).on('click', '.create-demandeur-button', function(){
        changePageTitle("Créer le demandeur"); 
        clearResponse();
        var content = createDemandeurForm();
        $.getJSON("http://localhost/M2L/api/ligue/read.php", function(data){
            // loop through returned list of data
            $.each(data.records, function(key, val){
                // pre-select option is category id is the same
                content+=`<option value='` + val.id + `'>` + val.nom + `</option>`; 
            });
            
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
        
        $('#content').html(content);

        });

    });

    // on submitting form create demandeur
    $(document).on('submit', '#create-demandeur-form', function(){
        $("#id_ligue:selected").val();
        var form_data=JSON.stringify($(this).serializeObject());
        // submit form data to api
        $.ajax({
            url: "http://localhost/M2L/api/demandeur/create_demandeur.php",
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

    // when 'demande adhesion' button was clicked
    $(document).on('click', '#demander-adhesion', function(){
        var jwt = getCookie('jwt');
        $.post("api/validate_token.php", JSON.stringify({ jwt:jwt })).done(function(result) {

            changePageTitle("Formulaire de demander d'adhésion");
            // if response is valid, user can put details in the form
            demanderAdhesionFormulaire(result);
            
            clearResponse();
        })
        // on error/fail, tell the user he needs to login to show the account page
        .fail(function(result){
            showLoginPage();
            $('#response').html("<div class='alert alert-danger'>Veuillez vous connecter pour compléter votre demande d'adhésion.</div>");
        });
        
    });

    
    // on submitting form create demandeur
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
            url: "http://localhost/M2L/api/demandeur/create_demandeur.php",
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
                $('#response').html("<div class='alert alert-danger'>Impossible de créer la demande. Veuillez nous contacter directement par mail. Merci!</div>");
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
            url: "http://localhost/M2L/api/demandeur/modify_demandeur.php",
            type : "POST",
            contentType : 'application/json',
            data : update_form_data,
            success : function(result) {
                //hide form
                $(".form-group,.btn").addClass('d-none');
                //erase page title 
                changePageTitle('');
                // tell user that demandeur was created
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
                $('#response').html("<div class='alert alert-danger'>Impossible de modifier la demande. Veuillez nous contacter directement par mail. Merci!</div>");
            }
        });

        
        return false;

    });

    //onlick button Motif
    $(document).on('click', '#gerer-motif', function(){
        // clear response content
        clearResponse();
        // show list of motifs
        showMotifsFirstPage();
        //change title
        changePageTitle("Liste des motifs");  

        // when a 'page' button was clicked
        $(document).on('click', '.pagination li', function(){
            // get json url
            var json_url=$(this).find('a').attr('data-page');

            // show list of motifs
            showMotifs(json_url);
        });

    });

    // when a 'update motif' button was clicked
    $(document).on('click', '.update-motif-button', function(){
        //get motif id from button with data-id='val.id' in form showMotifs()
        var id = $(this).attr('data-id');
        // read one record based on given motif id
        $.getJSON("http://localhost/M2L/api/motif/read_one_motif.php?id=" + id, function(data){
            updateOneMotif(data);
        });

        //change title
        changePageTitle("Mis à jour le motif");

        // prevent whole page reload
        return false;

    });

    $(document).on('submit', '#update-motif-form', function(){

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

                // replace content div
                showAllMotifsButton();
            },
        
            // show error message to motif
            error: function(xhr, resp, text){
            
                $('#response').html("<div class='alert alert-danger'>Impossible de mettre à jour le motif.</div>");
                showAllMotifsButton();
            }
        });

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
        $.getJSON("http://localhost/M2L/api/motif/search_motif.php?s=" + keywords, function(data){
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
                        url: "http://localhost/M2L/api/motif/delete_motif.php",
                        type : "POST",
                        dataType : 'json',
                        data : JSON.stringify({ id: motif_id }),
                        success : function(result) {
                
                            // re-load list of motifs
                            showMotifsFirstPage();
                            changePageTitle('Liste des motifs');
                        },
                        error: function(xhr, resp, text) {
                            $('#response').html("<div class='alert alert-danger'>Impossible de supprimer le motif. Veuillez contacter l'administrateur.</div>");
                        }
                    });
                
                }
            }
        });
    });

    // when 'create motif' button was clicked
    $(document).on('click', '.create-motif-button', function(){
        changePageTitle("Créer le motif"); 
        clearResponse();
        createMotif();
    });
    // on submitting form create motif
    $(document).on('submit', '#create-motif-form', function(){
        var form_data=JSON.stringify($(this).serializeObject());
        // submit form data to api
        $.ajax({
            url: "http://localhost/M2L/api/motif/create_motif.php",
            type : "POST",
            contentType : 'application/json',
            data : form_data,
            success : function(result) {
                // motif was created, go back to motifs list
                showMotifsFirstPage();
            },
            error: function(xhr, resp, text) {
                // show error
                $('#response').html("<div class='alert alert-danger'>Impossible de créer le motif. Veuillez contacter l'administrateur.</div>");
            }
        });
        
        return false;
    });

    //onlick button ligne frais
    $(document).on('click', '#gerer-ligne-frais', function(){
        // show list of lignes frais
        showLignesFraisFirstPage();
        //change title
        changePageTitle("Liste des lignes frais");  
        // when a 'page' button was clicked
        $(document).on('click', '.pagination li', function(){
            // get json url
            var json_url=$(this).find('a').attr('data-page');

            // show list of motifs
            showLignesFrais(json_url);
        });
    });
    
    // when 'create ligne frais' button was clicked
    $(document).on('click', '.create-ligne-frais-button', function(){
        changePageTitle("Créer la ligne frais"); 
        clearResponse();
        var html = createLigneFraisForm();
        $.getJSON("http://localhost/M2L/api/motif/read.php", function(data){
            
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
            $('.div-peage, .div-repas, .div-hebergement').hide();
        }); 
       
    });
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
        xhttp.open("POST", "http://localhost/M2L/api/ligne_frais/upload_files.php", true);
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
            url: "http://localhost/M2L/api/ligne_frais/create_ligne_frais.php",
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
        
        return false;
    });
    // when a 'delete' button was clicked
    $(document).on('click', '.delete-ligne-frais-button', function(){
        // get the id
        var ligne_id = $(this).attr('data-id');

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
                    // delete files of a ligne frais in folder files\ligne_frais
                    deleteFilesById(ligne_id);
 
                    // send delete request to api / remote server
                    $.ajax({
                        url: "http://localhost/M2L/api/ligne_frais/delete_ligne_frais.php",
                        type : "POST",
                        dataType : 'json',
                        data : JSON.stringify({ id: ligne_id }),
                        success : function(result) {
                            // re-load list
                            showLignesFraisFirstPage();
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
        $.getJSON("http://localhost/M2L/api/ligne_frais/search_ligne_frais.php?s=" + keywords, function(data){
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
        showLignesFraisFirstPage();
    });

    // when a 'read one ligne frais' button was clicked
    $(document).on('click', '.read-one-ligne-frais-button', function(){
        // get demandeur id
        var id = $(this).attr('data-id');
        // read record based on given ID
        $.getJSON("http://localhost/M2L/api/ligne_frais/read_one_ligne_frais.php?id=" + id, function(data){
            // show HTML template
            showOneLigneFraisTemplate(data);
            // chage page title
            changePageTitle("Info ligne frais");
            // prevent whole page reload
            return false;
        });
    });
    // when a 'update lignefrais' button was clicked
    $(document).on('click', '.update-ligne-frais-button', function(){
        //get id from button with data-id='val.id'
        var id = $(this).attr('data-id');
        // read one record based on given id
        $.getJSON("http://localhost/M2L/api/ligne_frais/read_one_ligne_frais.php?id=" + id, function(data){
            updateOneLigneFrais(data);
        });

        //change title
        changePageTitle("Mis à jour la ligne frais");

        // prevent whole page reload
        return false;

    });
    
    $(document).on('submit', '#update-ligne-frais-form', function(){
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
        xhttp1.open("POST", "http://localhost/M2L/api/ligne_frais/delete_files.php", true);
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
        xhttp.open("POST", "http://localhost/M2L/api/ligne_frais/upload_files.php", true);
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
        
            message: "<h4>Vous êtes sur de valider la ligne frais ?</h4>",
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
                        url: "http://localhost/M2L/api/ligne_frais/change_status.php",
                        type : "POST",
                        dataType : 'json',
                        data : JSON.stringify({ id: ligne_id, valide: 1}),
                        success : function(result) {
                            // re-load list of lignes frais
                            showLignesFraisFirstPage();
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
        
            message: "<h4>Vous êtes sur d'invalider la ligne frais ?</h4>",
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
                        url: "http://localhost/M2L/api/ligne_frais/change_status.php",
                        type : "POST",
                        dataType : 'json',
                        data : JSON.stringify({ id: ligne_id, valide: null}),
                        success : function(result) {
                            // re-load list of lignes frais
                            showLignesFraisFirstPage();
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
    //set id_user for adherent
    var adherent_id;
    // when 'gerer la ligne frais' button was clicked  by adherent
   $(document).on('click', '#gerer-ligne', function(){
        var jwt = getCookie('jwt');
        $.post("api/validate_token.php", JSON.stringify({ jwt:jwt })).done(function(result) {
            adherent_id = result.data.id;
            
            showLignesFraisFirstPageUser(adherent_id);
            addBordereauControlButton(adherent_id);
            // when a 'page' button was clicked
            $(document).on('click', '.pagination li', function(){
                // get json url
                var json_url=$(this).find('a').attr('data-page');

                // show list of lignes frais
                showLignesFraisUser(json_url);
                addBordereauControlButton(adherent_id);
            });
        })
        // on error/fail, tell the user he needs to login to show the account page
        .fail(function(resultat){
            showLoginPage();
            $('#response').html("<div class='alert alert-danger'>Veuillez vous connecter pour modifier votre demande d'adhésion.</div>");
        });

    });
    // when 'all lignes frais' button was clicked by adherent
    $(document).on('click', '.all-ligne-frais-button-user', function(){
        showLignesFraisFirstPageUser(adherent_id);
        addBordereauControlButton(adherent_id);
    });

     // when a 'search lignes frais' button was clicked by adherent
     $(document).on('submit', '#search-ligne-frais-form-user', function(){
        clearResponse();
 
        // get search keywords
        var keywords = $(this).find(":input[name='keywords']").val();
        
        // chage page title
        changePageTitle("Chercher lignes frais: " + keywords);
 
        // get data from the api based on search keywords
        $.getJSON("http://localhost/M2L/api/ligne_frais/search_ligne_frais_user.php?s=" + keywords + "&id=" + adherent_id, function(data){
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
    // when 'create ligne frais' button was clicked by adherent
    $(document).on('click', '.create-ligne-frais-button-user', function(){
        changePageTitle("Créer la ligne frais"); 
        clearResponse();
        var html = createLigneFraisFormUser(adherent_id);
        $.getJSON("http://localhost/M2L/api/motif/read.php", function(data){
            
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
        xhttp.open("POST", "http://localhost/M2L/api/ligne_frais/upload_files.php", true);
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
            url: "http://localhost/M2L/api/ligne_frais/create_ligne_frais.php",
            type : "POST",
            contentType : 'application/json',
            data : form_data,
            success : function(result) {
                // ligne frais was created, go back to list
                showLignesFraisFirstPageUser(adherent_id);
                addBordereauControlButton(adherent_id)
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
        $.getJSON("http://localhost/M2L/api/ligne_frais/read_one_ligne_frais.php?id=" + id, function(data){
            // show HTML template
            showOneLigneFraisTemplateUser(data);
            // chage page title
            changePageTitle("Info ligne frais");
            // prevent whole page reload
            return false;
        });
    });

    // when a 'update lignefrais' button was clicked by adherent
    $(document).on('click', '.update-ligne-frais-button-user', function(){
        //get id from button with data-id='val.id'
        var id = $(this).attr('data-id');
        // read one record based on given id
        $.getJSON("http://localhost/M2L/api/ligne_frais/read_one_ligne_frais.php?id=" + id, function(data){
            updateOneLigneFraisUser(data);
        });

        //change title
        changePageTitle("Mis à jour la ligne frais");

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
        xhttp1.open("POST", "http://localhost/M2L/api/ligne_frais/delete_files.php", true);
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
        xhttp.open("POST", "http://localhost/M2L/api/ligne_frais/upload_files.php", true);
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
                showAllLignesFraisButtonUser();
            },
        
            // show error message to ligne-frais
            error: function(xhr, resp, text){
               
                $('#response').html("<div class='alert alert-danger'>Impossible de mettre à jour la ligne frais.</div>");
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
                    // delete files of a ligne frais in folder files\ligne_frais
                    deleteFilesById(ligne_id);
    
                    // send delete request to api / remote server
                    $.ajax({
                        url: "http://localhost/M2L/api/ligne_frais/delete_ligne_frais.php",
                        type : "POST",
                        dataType : 'json',
                        data : JSON.stringify({ id: ligne_id }),
                        success : function(result) {
                            // re-load list
                            showLignesFraisFirstPageUser(adherent_id);
                            addBordereauControlButton(adherent_id);
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

    // when click to retrieve bordereau in pdf and send to server 
    $(document).on('click', '#send_getPDF', function(){
          // bootbox for good looking 'confirm pop up'
        bootbox.confirm({
        
            message: "<h4>Vous êtes sur d'envoyer votre bordereau ?</h4>",
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
                    // check if bordereau already exists in DB by using 'read one record based on given id'
                    $.getJSON("http://localhost/M2L/api/bordereau/read_by_id_user.php?id=" + adherent_id, function(data){
                        //if not yet created in DB then create:
                        if(!data.id){
                            //define name of bordereau to inject in database
                            var today = new Date();
                            var this_year = today.getFullYear();
                            var src = `user_id_${adherent_id}_${this_year}.jpg`;
                            // make change in table bordereau in database
                            $.ajax({
                                url: "http://localhost/M2L/api/bordereau/create_bordereau.php",
                                type : "POST",
                                dataType : 'json',
                                data : JSON.stringify({ id_user: adherent_id, src_bordereau: src }),
                                success : function(result) {
                                    // re-load list
                                    showLignesFraisFirstPageUser(adherent_id);
                                    addBordereauControlButton(adherent_id);
                                    alert("Vous pouvez modifier et renvoyer votre bordereau jusqu'à la validation du bordereau.");
                                },
                                error: function(xhr, resp, text) {
                                    $('#response').html("<div class='alert alert-danger'>Impossible de sauvegarder votre bordereau dans la base de données. Veuillez contacter l'administrateur.</div>");
                                }
                            });

                        }else{
                            // re-load list
                            showLignesFraisFirstPageUser(adherent_id);
                            addBordereauControlButton(adherent_id);
                        }
                    });  
                    
                }
            }
        });

    });

    // when a 'show bordereau' button was clicked
    $(document).on('click', '.show-bordereau-button-user', function(){
        clearResponse();
        changePageTitle('Votre bordereau validé');
        showBordereauValide(adherent_id);
    });

    // when click getPDF button
    $(document).on('click', '#getPDF', function(){
        //save validated bordereau on user's computer 
        var nomFichier = "bordereau_validé.pdf";
        getPDF(nomFichier);        
    });

    // when a 'show cerfa' button was clicked
    $(document).on('click', '.show-cerfa-button-user', function(){
        clearResponse();
        changePageTitle('Votre CERFA');
        showCERFAValide(adherent_id);
    });

    // ========== ADMIN FUNCTIONS FOR BORDEREAU===============
    // when 'gerer la ligne frais' button was clicked  by adherent
   $(document).on('click', '#gerer-bordereau', function(){
        // show list of motifs
        showBordereauxFirstPage(); 
        clearResponse();

        // when a 'page' button was clicked
        $(document).on('click', '.pagination li', function(){
            // get json url
            var json_url=$(this).find('a').attr('data-page');

            // show list
            showBordereaux(json_url);
            clearResponse();
        });

    });

    // when a 'lire' bordereau button was clicked
    $(document).on('click', '.read-one-bordereau-button', function(){
        // get demandeur id
        var id = $(this).attr('data-id');
        // read record based on given ID
        $.getJSON("http://localhost/M2L/api/bordereau/read_one_bordereau.php?id=" + id, function(data){
            // show HTML template
            showOneBordereauTemplate(data);
            // chage page title
            changePageTitle("Info du bordereau");
            // prevent whole page reload
            return false;
        });
    });

    // when a 'update bordereau' button was clicked
    $(document).on('click', '.update-bordereau-button', function(){
        //get bordereau id from button with data-id='val.id' in form showBordereaux()
        var id = $(this).attr('data-id');
        // read one record based on given bordereau id
        $.getJSON("http://localhost/M2L/api/bordereau/read_one_bordereau.php?id=" + id, function(data){
            updateOneBordereau(data);
        });

        //change title
        changePageTitle("Mis à jour le bordereau");

        // prevent whole page reload
        return false;

    });

    //when click show div to add cerfa in form update bordereau
    $(document).on('click', '#ajout-cerfa', function(){
        $('.div-cerfa').show('slow');
    });

    // on submit update bordereau form
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
        xhttp1.open("POST", "http://localhost/M2L/api/bordereau/delete_files.php", true);
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
        //second: uploading new files by XHTTP
        var formData1 = new FormData();
        //add id_user in formData to post
        formData1.append("id_user",$('#id_user').val());
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
        xhttp.open("POST", "http://localhost/M2L/api/bordereau/upload_files.php", true);
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
        // third:post JSON string above to file controller
        $.ajax({
            url: "api/bordereau/modify_bordereau.php",
            type : "POST",
            contentType : 'application/json',
            data : form_data,
            success : function(result) {
        
                // tell it was updated
                $('#response').html("<div class='alert alert-success'>Le bordereau a été mis à jour.</div>");

                //remove title
                $('#page-title').text('');

                // replace content div
                showAllBordereauxButton();
            },
        
            // show error message to bordereau
            error: function(xhr, resp, text){
            
                $('#response').html("<div class='alert alert-danger'>Impossible de mettre à jour le bordereau.</div>");
                showAllBordereauxButton();
            }
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
        $.getJSON("http://localhost/M2L/api/bordereau/search_bordereau.php?s=" + keywords, function(data){
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
        
            message: "<h4>Vous êtes sur de supprimer ce bordereau?</h4>",
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

                    // send delete request to api / remote server
                    $.ajax({
                        url: "http://localhost/M2L/api/bordereau/delete_bordereau.php",
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

    // when 'valider bordereau' button was clicked to convert bordereau into adhérent
    $(document).on('click', '.valider-bordereau-button', function(){
        var bordereau_id = $(this).attr('data-id');
        // bootbox for good looking 'confirm pop up'
        bootbox.confirm({
        
            message: "<h4>Vous êtes sur de valider le bordereau et ses lignes frais ?</h4>",
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
                    
                    // send request to api to change status of bordereau: become etre_validé
                    $.ajax({
                        url: "http://localhost/M2L/api/bordereau/change_status.php",
                        type : "POST",
                        dataType : 'json',
                        data : JSON.stringify({ id: bordereau_id, valide: 1}),
                        success : function(result) {
                            // re-load list of bordereaux
                            showBordereauxFirstPage();
                        },
                        error: function(xhr, resp, text) {
                            $('#response').html("<div class='alert alert-danger'>Impossible de valider le bordereau. Veuillez contacter l'administrateur.</div>");
                        }
                    });
                    // read one record based on given bordereau id
                    $.getJSON("http://localhost/M2L/api/bordereau/read_one_bordereau.php?id=" + bordereau_id, function(data){
                        //retrieve all lignes frais by id user
                        $.getJSON("http://localhost/M2L/api/ligne_frais/read_by_id_user.php?id=" + data.id_user, function(da){
                            
                            // loop through returned list of data
                            $.each(da.records, function(key, val) {
                                if(val.etre_valide !== '1'){
                                    $.post("http://localhost/M2L/api/ligne_frais/change_status.php", JSON.stringify({ id: val.id, valide: 1 })).done(function(result) {
                                        
                                    })
                                    // on error/fail, tell the user
                                    .fail(function(resultat){
                                        $('#response').html("<div class='alert alert-danger'>Impossible de valider certaine ligne frais.</div>");
                                    });
                                }
                                
                            });
                            $('#response').html(`<div class='alert alert-success'>La(les) ligne(s) frais concernée(s) et le bordereau ont été déjà validée(s).</div>`);
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
        
            message: "<h4>Vous êtes sur d'invalider le bordereau ?</h4>",
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
                        url: "http://localhost/M2L/api/bordereau/change_status.php",
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
    //when click create bordereau button
    $(document).on('click', '.create-bordereau-button', function(){
        changePageTitle("Créer le bordereau pour l'utilisateur"); 
        clearResponse();
        createBordereau();
    });
    // when 'Voir ses lignes frais' button was clicked 
    $(document).on('click', '.all-ligne-frais-button-of-user', function(){
        adherent_id = $('#create-bordereau-form').find(":input[name='id_user']").val();
        if(!adherent_id){
           //message tell user to input Id_user
            $('#response').html("<div class='alert alert-danger'>Veuillez choisir id d'utilisateur!</div>");
        
        }else{
            
            $.getJSON("http://localhost/M2L/api/user/search_user.php?s=adherent", function(da){
                $.each(da.records, function(key, val){
                    if(val.id != adherent_id){
                        $('#response').html(`<div class='alert alert-danger'>L'utilisateur ${adherent_id} n'est pas un adhérent!</div>`);
                    }else{
                        showLignesFraisFirstPageUser(adherent_id);
                        addBordereauControlButton(adherent_id);
                    }
                    
                });
            });
        } 
        // prevent whole page reload
        return false;
        
    });
    // on submitting form create bordereau
    $(document).on('submit', '#create-bordereau-form', function(){
         // get input data 
         adherent_id = $(this).find(":input[name='id_user']").val();
         // get data from the api based on search keywords = adherent_id
        $.getJSON("http://localhost/M2L/api/bordereau/search_bordereau.php?s=" + adherent_id, function(data){
            if(data.message){
                $.getJSON("http://localhost/M2L/api/user/search_user.php?s=adherent", function(da){
                    $.each(da.records, function(key, val){
                        if(val.id != adherent_id){
                            $('#response').html(`<div class='alert alert-danger'>L'utilisateur ${adherent_id} n'est pas un adhérent!</div>`);
                        }else{
                            clearResponse();
                            changePageTitle(`Bordereau de l'utilisateur ${adherent_id}`);
                            showBordereau(adherent_id);
                        }
                        
                    });
                });
            }else{
                // template in bordereaux.js
                showBordereauxTemplate(data, adherent_id);
                $('#response').html(`<div class='alert alert-danger'>Le bordereau de l'utilisateur ${adherent_id} existe déjà.</div>`)
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
      
          message: "<h4>Vous êtes sur de sauvegarder le CERFA et le télécharger ?</h4>",
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
                // check if cerfa already exists in DB by using 'read one record based on given id'
                $.getJSON("http://localhost/M2L/api/bordereau/read_by_id_user.php?id=" + adherent_id, function(data){
                    //if not yet created in DB then create:
                    if(!data.cerfa){
                    //define name of bordereau to inject in database
                    var today = new Date();
                    var this_year = today.getFullYear();
                    var src_cerfa = `user_id_${adherent_id}_${this_year}.pdf`;
                    // make change in table bordereau in database
                    $.ajax({
                        url: "http://localhost/M2L/api/bordereau/add_cerfa.php",
                        type : "POST",
                        dataType : 'json',
                        data : JSON.stringify({ id_user: adherent_id, src_cerfa: src_cerfa }),
                        success : function(result) {
                            // re-load list of bordereaux
                            showBordereauxFirstPage();
                            $('#response').html(`<div class='alert alert-success'>${result.message}</div>`);  
                        },
                        error: function(xhr, resp, text) {
                            $('#response').html("<div class='alert alert-danger'>Impossible de sauvegarder le CERFA dans la base de données. Veuillez contacter l'administrateur.</div>");
                        }
                    });

                    }else{
                        // re-load list
                        showBordereauxFirstPage();
                        $('#response').html(`<div class='alert alert-success'>Le nouveau CERFA a été bien enregistré dans le système</div>`);
                        
                    }
                });  
                  
              }
          }
      });

  });
 
    //========================TRESORIER FUNCTIONS ======================
    $(document).on('click', '#consulter-bordereau', function(){
        // show list of motifs
        showBordereauxFirstPageTresorier(); 
        clearResponse();

        // when a 'page' button was clicked
        $(document).on('click', '.pagination li', function(){
            // get json url
            var json_url=$(this).find('a').attr('data-page');

            // show list of motifs
            showBordereauxTresorier(json_url);
            clearResponse();
        });
    });

    // when a 'lire' bordereau button was clicked by tresorier
    $(document).on('click', '.read-one-bordereau-button-tresorier', function(){
        // get demandeur id
        var id = $(this).attr('data-id');
        // read record based on given ID
        $.getJSON("http://localhost/M2L/api/bordereau/read_one_bordereau.php?id=" + id, function(data){
            // show HTML template
            showOneBordereauTemplateTresorier(data);
            // chage page title
            changePageTitle("Info du bordereau");
            // prevent whole page reload
            return false;
        });
    });
    
    // when 'all bordereaux' button was clicked by tresorier or retourner à la liste
    $(document).on('click', '.all-bordereaux-button-tresorier', function(){
        //show list all bordereaux
        showBordereauxFirstPageTresorier();
        clearResponse();
    });

    //onclick : show CERFA form button by tresorier in case edit or create new CERFA
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
      
          message: "<h4>Vous êtes sur de sauvegarder le CERFA, le télécharger et l'envoyer à l'adhérent ?</h4>",
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
                //send email to inform adherent about the cerfa using ajax
                //set response added to inform email sent
                var re = '';
                $.getJSON("http://localhost/M2L/api/user/read_one_user.php?id=" + adherent_id, function(d){

                    $.ajax({
                        url: "forms/send_cerfa.php",
                        type : "POST",
                        dataType : 'json',
                        data : { email: d.email },
                        success : function(result) {
                            re += result;
                            $('#response').html(`<div class='alert alert-success'>${re}</div>`);
                        },
                        error: function(xhr, resp, text) {
                            re += `Pas possible d'envoyer CERFA à l'adhérent.`;
                            $('#response').html(`<div class='alert alert-danger'>${re}</div>`);
                        }
                    });
                });

                // check if cerfa already exists in DB by using 'read one record based on given id'
                $.getJSON("http://localhost/M2L/api/bordereau/read_by_id_user.php?id=" + adherent_id, function(data){
                    //if not yet created in DB then create:
                    if(!data.cerfa){
                    //define name of bordereau to inject in database
                    var today = new Date();
                    var this_year = today.getFullYear();
                    var src_cerfa = `user_id_${adherent_id}_${this_year}.pdf`;
                    // make change in table bordereau in database
                    $.ajax({
                        url: "http://localhost/M2L/api/bordereau/add_cerfa.php",
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
                        // re-load list
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
        
            message: "<h4>Vous êtes sur d'invalider ce bordereau ?</h4>",
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
                        url: "http://localhost/M2L/api/bordereau/change_status.php",
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
        adherent_id = $(this).attr('data-id');
        // bootbox for good looking 'confirm pop up'
        bootbox.confirm({
        
            message: "<h4>Vous êtes sur d'accéder à ce bordereau pour le valider ?</h4>",
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
                    //display form bordereau including party input tresorier info
                    showBordereauTresorier(adherent_id);
                }
            }
        });
    });

   // when click by tresorier to save down le bordereau in pdf and validate then send it to server 
   $(document).on('click', '#send_getPDF_tresorier', function(){
         // bootbox for good looking 'confirm pop up'
       bootbox.confirm({
       
           message: "<h4>Vous êtes sur de valider ce bordereau et toutes ses lignes frais ?</h4>",
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

                   //retrieve all lignes frais by id user
                   $.getJSON("http://localhost/M2L/api/ligne_frais/read_by_id_user.php?id=" + adherent_id, function(da){
                            
                        // loop through returned list of data
                        $.each(da.records, function(key, val) {
                            if(val.etre_valide !== '1'){
                                $.post("http://localhost/M2L/api/ligne_frais/change_status.php", JSON.stringify({ id: val.id, valide: 1 })).done(function(result) {
                                    
                                })
                                // on error/fail, tell the user
                                .fail(function(resultat){
                                    $('#response').html("<div class='alert alert-danger'>Impossible de valider certaine ligne frais.</div>");
                                });
                            }
                            
                        });
                        $.getJSON("http://localhost/M2L/api/bordereau/read_by_id_user.php?id=" + adherent_id, function(data){
                            // send request to api to change status of bordereau: become etre_validé
                            $.ajax({
                                url: "http://localhost/M2L/api/bordereau/change_status.php",
                                type : "POST",
                                dataType : 'json',
                                data : JSON.stringify({ id: data.id, valide: 1}),
                                success : function(result) {
                                    clearResponse();
                                    //return to list of all bordereaux
                                    showBordereauxFirstPageTresorier();
                                    $('#response').html(`<div class='alert alert-success'>Le bordereau et ses lignes frais ont été déjà bien validés !</div>`);
                                       
                                },
                                error: function(xhr, resp, text) {
                                    $('#response').html("<div class='alert alert-danger'>Impossible de valider le bordereau. Veuillez contacter l'administrateur.</div>");
                                }
                            });

                        });
                    });  
                   
               }
           }
       });

   });
   //============= PARTIE MDP OUBLIE==============

   // on clicking on button 'mdp oublié'
   $(document).on('click', '#button_mdp_oublie', function(e){
        $('#email_of_user').removeAttr('hidden');
        //$('#mdp_oublie_form').append(`<button type="submit" class="btn btn-danger w-100" id="sendLink"> Envoyez-moi le lien</button>`);
        $('#button_mdp_oublie').remove();
        $('#addButton').append(`<button type="submit" class="btn btn-danger w-100" id="sendLink"> Envoyez-moi le lien</button>`);
    });

    // on clicking on button 'mdp oublié'
   $(document).on('click', '#sendLink', function(e){
    // to do something here!!!!!!
   });
//================ PAS ENCORE BIEN FONCTIONNE================
   // on clicking on button 'mdp oublié'
   /*$(document).on('submit', '#mdp_oublie_form', function(e){
        //stop form from functioning as usual
        e.preventDefault();
        //search to see if the email exists in DB
        var email = $('#email_of_user').val();
        $.getJSON("http://localhost/M2L/api/user/search_user.php?s="+email, function(da){
            var send=false;
            $.each(da.records, function(key, val){
                if(val.email === email){
                    send=true;    
                    alert(send);
                } 
            });
            if(send==true){
                alert(send);
                /*$('#mdp_oublie_form').attr('action', 'forms/contact_user.php');
                $('#mdp_oublie_form').attr('method', 'post');
                let thisForm = this;
                let action = thisForm.getAttribute('action');
                let formData = new FormData(thisForm);
                //formData.set('email', email);
                //display or hide <div> under the form to inform user of result
                thisForm.querySelector('.loading').classList.add('d-block');
                thisForm.querySelector('.error-message').classList.remove('d-block');
                thisForm.querySelector('.sent-message').classList.remove('d-block');
                //send mail by function created in page.js
                php_email_form_submit(thisForm, action, formData);*/
            /*}else{
                alert(`L'email n'est pas encore déclaré dans la base de données`);
            }
        });
        
        return false;

    });*/

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
            url: "http://localhost/M2L/api/user/update_pw.php",
            type : "POST",
            dataType : 'json',
            data : JSON.stringify({ email: email, mdp: mdp}),
            success : function(result){
                
                window.location.href = "http://localhost/M2L/index.html";
                alert('Votre nouveau mot de passe a été bien sauvegardé! Veuillez vous connecter pour accéder à votre compte!');
            },
            error: function(xhr, resp, text){
                // on error, tell the user login has failed & empty the input boxes
                $('#response').html(`<div class='alert alert-danger'>Echec de la mise à jour du mot de passe. Veuillez vérifier vos saisies!</div>`);
            
                }
            });
        }else{
            $('#response').html(`<div class='alert alert-danger'>Echec de la mise à jour du mot de passe. Veuillez vérifier vos saisies!</div>`);
        }
   });



});