
function showUsersTemplate(data, keywords){
    var read_users_html=`
        <!-- search users form -->
        <form id='search-user-form' action='#' method='post'>
        <div class='input-group float-left w-40-pct mb-4'>
 
            <input type='text' value='` + keywords + `' name='keywords' class='form-control user-search-keywords' placeholder='Chercher utilisateur par email ou role ou ID...' />
 
            <span class='input-group-btn'>
                <button type='submit' class='btn btn-default' type='button'>
                    <span><i class="bi bi-search"></i></span>
                </button>
            </span>
 
        </div>
        </form>

        <!-- when clicked, it will load all users list-->
        <div id='all-users' class='btn btn-primary float-right m-b-15px all-users-button'>
            <span><i class="bi bi-card-list"></i></span> Tous Utilisateurs
        </div>

        <!-- when clicked, it will load the create user form -->
        <div id='create-user' class='btn btn-primary float-right m-b-15px create-user-button mr-2'>
            <span><i class="bi bi-plus-lg"></i></span> Créer Utilisateur
        </div>
        <!-- start table display users-->
        <table class='table table-bordered table-hover'>
        
            <!-- creating our table heading -->
            <tr>
                <th class='w-5-pct'>Id</th>
                <th class='w-25-pct'>Email</th>
                <th class='w-10-pct'>Role</th>
                <th class='w-15-pct'>Droit de réservation</th>
                <th class='w-10-pct'>Niveau tarif</th>
                <th class='w-35-pct text-align-center'>Action</th>
            </tr>`;
        
            // loop through returned list of data
            $.each(data.records, function(key, val) {
                var droit = val.droit_reservation == '0' ? "Non" : "Oui"
                // creating new table row per record
                read_users_html+=`
                    <tr>
            
                        <td>` + val.id + `</td>
                        <td>` + val.email + `</td>
                        <td>` + val.role + `</td>
                        <td>` + droit + `</td>
                        <td>` + val.niveau_tarif + `</td>
            
                        <!-- 'action' buttons -->
                        <td>
                            <!-- read user button -->
                            <button class='btn btn-primary m-r-10px read-one-user-button' data-id='` + val.id + `'>
                                <span><i class="bi bi-eye"></i></span> Lire
                            </button>
            
                            <!-- edit button -->
                            <button class='btn btn-info m-r-10px update-user-button' data-id='` + val.id + `'>
                                <span><i class="bi bi-pencil-square"></i></span> Modifier
                            </button>
            
                            <!-- delete button -->
                            <button class='btn btn-danger delete-user-button' data-id='` + val.id + `'>
                                <span><i class="bi bi-x-lg"></i></span> Supprimer
                            </button>
                        </td>
            
                    </tr>`;
            });
        
        // end table
        read_users_html+=`</table>`;
        // pagination
        if(data.paging){
            read_users_html+="<nav aria-label='search users pages'><ul class='pagination users float-left margin-zero padding-bottom-2em'>";
        
                // first page
                if(data.paging.first!=""){
                    read_users_html+="<li class='page-item'><a class='page-link' data-page='" + data.paging.first + "'>Première Page</a></li>";
                }
        
                // loop through pages
                $.each(data.paging.pages, function(key, val){
                    var active_page=val.current_page=="yes" ? "active" : "";
                    read_users_html+="<li class='page-item " + active_page + "'><a class='page-link' data-page='" + val.url + "'>" + val.page + "</a></li>";
                });
        
                // last page
                if(data.paging.last!=""){
                    read_users_html+="<li class='page-item'><a class='page-link' data-page='" + data.paging.last + "'>Dernière Page</a></li>";
                }
            read_users_html+="</ul></nav>";
        }

        // inject this piece of html to our page
        $("#content").html(read_users_html);

        

}

function showUsersFirstPage(){
    var json_url="http://localhost/M2L/api/user/read_paging_users.php";
    showUsers(json_url);
}

// function to show list of users
function showUsers(json_url){

    // get list of users from the API
    $.getJSON(json_url, function(data){
        // check if list of users is empty or not
        if (data.message){$('#response').html("<div class='alert alert-danger'>${data.message}.</div>");}else{
        // html for listing users
        showUsersTemplate(data, "");
        }
        
    }); 
    
}

function createUser(){
    
    var html = `
        <form id='create-user-form'>
        <div class='table-responsive text-nowrap'>
        <table class='table table-hover table-bordered'>
            <tr>
                <td class='w-30-pct'>Role</td>
                <td class='w-70-pct'>
                    <select class="form-control" name="role" id="role">
                        <option value="admin">Administrateur</option>
                        <option value="user">Utilisateur</option>
                        <option value="tresorier">Tresorier</option>
                        <option value="adherent">Adherent</option>
                    </select>
                </td>
            </tr>

            <tr>
                <td>Niveau de Tarif</td>
                <td><input type="number" class="form-control" name="niveau_tarif" id="niveau_tarif" min="1" max="4" required/></td>
            </tr>

            <tr>
                <td>Droit de Reservation</td>
                <td>
                    <div class="form-check form-check-inline">
                        <input type="radio" class="form-check-input" name="droit_reservation" id="droit_reservation1" value="0" checked/>
                        <label class="form-check-label" for="droit_reservation1">Non</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input type="radio" class="form-check-input" name="droit_reservation" id="droit_reservation2" value="1"/>
                        <label class="form-check-label" for="droit_reservation2">Oui</label>
                    </div>
                </td>
            </tr>

            <tr>
                <td>Email</td>
                <td><input type="email" class="form-control" name="email" id="email" required /></td>
            </tr>

            <tr>
                <td>Mot de passe</td>
                <td>
                <div class="input-group">
                    <input type="password" class="form-control" name="mdp" id="password" required />
                    <div class="input-group-append"><i class="bi bi-eye-slash input-group-text" id="togglePassword"></i></div>
                </div>
                </td>
            </tr>

            <tr>
                <td><div class='btn btn-info all-users-button'><span><i class="bi bi-arrow-left-short"></i></span> Retourner</div></td>
                <td><button type='submit' class='btn btn-primary'><span><i class="bi bi-plus"></i></span> Créer</button></td>
            </tr>
            </table>
            </div>
        </form>
        `;

    $('#content').html(html);
}

function updateOneUser(data){
    const roles = {'admin': 'Administrateur', 'user':'Utilisateur', 'adherent': 'Adherent', 'tresorier': 'Tresorier'};

    var label = data.droit_reservation == '1' ? "Oui" : "Non";

    var label1 = (label == "Oui") ? "Non" : "Oui";

    var result1 = data.droit_reservation == '1' ? "0" : "1";

    var html = `
    <form id='update-user-form'>
    <div class='table-responsive text-nowrap'>
    <table class='table table-hover table-bordered'>
        <tr>
            <td class='w-30-pct'>Role</td>
            <td class='w-70-pct'>
                <select class="form-control" name="role" id="role">`;
              
            Object.keys(roles).forEach(function eachKey(key){
                // pre-select option of role is the same
                if(data.role == key){ html+=`<option value='` + key + `' selected>` + roles[key] + `</option>`; }
    
                else{ html+=`<option value='` + key + `'>` + roles[key] + `</option>`; }
            });

            html+=            
                `    
                </select>
            </td>
        </tr>

        
        <tr>
            <td></td>
            <td><input type="text" class="form-control" name="id" id="user_id" value="${data.id}" hidden/></td>
        </tr>

        <tr>
            <td>Niveau de Tarif</td>
            <td><input type="number" class="form-control" name="niveau_tarif" id="niveau_tarif" min="1" max="4" value="${data.niveau_tarif}" required/></td>
        </tr>

        <tr>
            <td>Droit de Reservation</td>
            <td>
                <div class="form-check form-check-inline">
                    <input type="radio" class="form-check-input" name="droit_reservation" id="droit_reservation1" value="${data.droit_reservation}" checked/>
                    <label class="form-check-label" for="droit_reservation1">${label}</label>
                </div>
                <div class="form-check form-check-inline">
                    <input type="radio" class="form-check-input" name="droit_reservation" id="droit_reservation2" value="${result1}"/>
                    <label class="form-check-label" for="droit_reservation2">${label1}</label>
                </div>
            </td>
        </tr>

        <tr>
            <td>Email</td>
            <td><input type="email" class="form-control" name="email" id="email" value="${data.email}" required/></td>
        </tr>

        <tr>
            <td><div class='btn btn-info all-users-button'><span><i class="bi bi-arrow-left-short"></i></span> Retourner</div></td>
            <td><button type='submit' class='btn btn-primary'><span><i class="bi bi-save"></i></span> Sauvegarder</button></td>
        </tr>
        </table>
        </div>
    </form>
    `;

    $('#content').html(html);

}

function showSignUpForm(){
    var html = `
            <form id='sign_up_form'>
                <div class="form-group">
                    <input type="text" class="form-control" name="role" id="role" value="user" hidden />
                </div>
 
                <div class="form-group">
                    <input type="text" class="form-control" name="niveau_tarif" id="niveau_tarif" value="4" hidden />
                </div>

                <div class="form-group">
                    <input type="text" class="form-control" name="droit_reservation" id="droit_reservation" value="0" hidden />
                </div>
 
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" class="form-control" name="email" id="email" required />
                </div>
 
                <div class="form-group">
                    <label for="password">Mot de passe</label>
                    <div class="input-group">
                        <input type="password" class="form-control" name="mdp" id="password" required />
                        <div class="input-group-append"><i class="bi bi-eye-slash input-group-text" id="togglePassword"></i></div>
                    </div>
                </div>
 
                <button type='submit' class='btn btn-primary'>S'inscrire</button>
            </form>
            `;
        $('#content').html(html);
}

function showAllUsersButton(){
    $('#content').html(`<!-- when clicked, it will show the users list -->
                <div id='all-users' class='btn btn-primary float-right m-b-15px all-users-button'>
                    <span><i class="bi bi-card-list"></i></span> Tous Utilisateurs
                </div>`);
}

function showOneUserTemplate(data){
    var droit = data.droit_reservation == '0' ? "Non" : "Oui"
    var read_one_user_html=`
                        <!-- when clicked, it will show the users list -->
                        <div id='all-users' class='btn btn-primary float-right m-b-15px all-users-button'>
                            <span><i class="bi bi-card-list"></i></span> Tous Utilisateurs
                        </div>
                        <div class='table-responsive text-nowrap'>
                        <table class='table table-hover table-bordered'>
                            <tr>
                                <td class='w-30-pct'>Id Utilisateur</td>
                                <td class='w-70-pct'>` + data.id + `</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>` + data.email + `</td>
                            </tr>
                            <tr>
                                <td>Role</td>
                                <td>` + data.role + `</td>
                            </tr>
                            <tr>
                                <td>Droit de Reservation</td>
                                <td>` + droit + `</td>
                            </tr>
                            <tr>
                                <td>Niveau Tarif</td>
                                <td>` + data.niveau_tarif + `</td>
                            </tr>
                        </table>
                        </div>`;
            // inject html to 'page-content' of our app
            $("#content").html(read_one_user_html);
 
}

function showLogInForm(){
    // login page html
    var html = `
           
    <form id='login_form'>
        <div class='form-group'>
            <label for='email'>L'adresse email</label>
            <input type='email' class='form-control' id='email' name='email' placeholder='saisissez votre email'>
        </div>

        <div class="form-group">
            <label for="password">Mot de passe</label>
            <div class="input-group">
                <input type="password" class="form-control" name="mdp" id="password" required />
                <div class="input-group-append"><i class="bi bi-eye-slash input-group-text" id="togglePassword"></i></div>
            </div>
        </div>

        <button type='submit' class='btn btn-primary'>Se connecter</button>
    </form>
    `;

    $('#content').html(html);
}

function showUpdateAccountHTML(result){
    var html = `<form id='update_account_form'>
                        <div class="form-group">
                            <input type="text" class="form-control" name="role" id="role" value="` + result.data.role + `" hidden />
                        </div>
        
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" class="form-control" name="email" id="email" required value="` + result.data.email + `" />
                        </div>
            
                        <div class="form-group">
                            <label for="password">Mot de passe</label>
                            <div class="input-group">
                                <input type="password" class="form-control" name="mdp" id="password" placeholder="Laissez vide en cas PAS de modification" />
                                <div class="input-group-append"><i class="bi bi-eye-slash input-group-text" id="togglePassword"></i></div>
                            </div>
                        </div>`;

        
        var button = `  <button type='submit' class='btn btn-primary'>
                            <span><i class="bi bi-save"></i></span> Sauvegarder
                        </button>
                    </form>`;

        var ajout = `<div class="form-group">
                        <input type="text" class="form-control" name="niveau_tarif" id="niveau_tarif" value="${result.data.niveau_tarif}" hidden />
                    </div>

                    <div class="form-group">
                        <input type="text" class="form-control" name="droit_reservation" id="droit_reservation" value="${result.data.droit_reservation}" hidden />
                    </div>`;
        
        var label = result.data.droit_reservation == '1' ? "Oui" : "Non";

        var label1 = (label == "Oui") ? "Non" : "Oui";

        var result1 = result.data.droit_reservation == '1' ? "0" : "1";

        var add = ` <p>Droit de réservation</p>
                    <div class="form-check-inline">
                        <input type="radio" class="form-check-input" name="droit_reservation" id="droit_reservation1" value="` + result.data.droit_reservation + `" checked />
                        <label class="form-check-label" for="droit_reservation1">` + label + `</label>
                    </div>
                   
                    <div class="form-check-inline">
                        <input type="radio" class="form-check-input" name="droit_reservation" id="droit_reservation2" value="${result1}" />
                        <label class="form-check-label" for="droit_reservation2">` + label1 + `</label>
                    </div>
                    
                    <div class="form-group">
                        <label for="niveau_tarif">Niveau Tarif</label>
                        <input type="number" class="form-control" name="niveau_tarif" id="niveau_tarif" required value="` + result.data.niveau_tarif + `" min="1" max="4"/>
                    </div>`;

        if (result.data.role !== "admin"){
            
            $('#content').html(html + ajout + button);
        }
        else{
            
            $('#content').html(html + add + button);
        }
}

function demanderAdhesionFormulaire(result){
    var html = `<form enctype="multipart/form-data" id='demander-adhesion-form' action="forms/contact.php" method="post" class="php-email-form">
                        <div class="form-group">
                            <input type="text" class="form-control" name="id_user" id="id_user" value="` + result.data.id + `" hidden />
                        </div>
                        <div class="form-group">
                            <input type="text" class="form-control" name="email" id="email" value="` + result.data.email + `" hidden />
                        </div>
                        <div class="form-group">
                            <label for="text">Nom</label>
                            <input type="text" class="form-control" name="nom" id="nom" required />
                        </div>
            
                        <div class="form-group">
                            <label for="prenom">Prénom</label>
                            <input type="text" class="form-control" name="prenom" id="prenom" required />
                        </div>

                        <div class="form-group">
                            <label for="date">Date de naissance</label>
                            <input type="date" class="form-control" name="date_naissance" id="date_naissance" required />
                        </div>

                        <div class="form-group">
                            <label for="rue">Adresse</label>
                            <input type="text" class="form-control" name="rue" id="rue" required />
                        </div>

                        <div class="form-group">
                            <label for="ville">Ville</label>
                            <input type="text" class="form-control" name="ville" id="ville" required />
                        </div>

                        <div class="form-group">
                            <label for="cp">Code postal</label>
                            <input type="number" class="form-control" name="cp" id="cp" required />
                        </div>
                        
                        <div class="form-group">
                            <label for="licence">Numéro de licence</label>
                            <input type="number" class="form-control" name="num_licence" id="num_licence" required />
                        </div>

                        <div class="form-group">
                            <label for="ligue">Nom de votre ligue</label>
                            <select name='ligue' id="id_ligue" class='form-control'>`;

        $.getJSON("http://localhost/M2L/api/ligue/read.php", function(resultat){
            $.each(resultat.records, function(key, val){
                html+=`<option data-id='` + val.id + `' value='` + val.nom + `'>` + val.nom + `</option>`;

            });
                html+=`</select>
                        </div>
                        <div class="form-group">
                            <label for="justificatif">Justificatif en pdf ou image</label>
                            <input type="hidden" name="MAX_FILE_SIZE" value="2400000" />
                            <input type="file" name="justificatif" class="form-control" accept="image/*,application/pdf" id="justificatif" required />
                        </div>

                        <div class="my-3">
                            <div class="loading">En cours...</div>
                            <div class="error-message"></div>
                            <div class="sent-message">Votre dossier a été envoyé. Votre demande peut être modifié jusqu'à la validation de votre demande. Vous allez bientôt être informé par mail. Merci! </div>
                        </div>
        
                        <button type='submit' class='btn btn-primary'>
                            <span><i class="bi bi-envelope-check"></i></span> Envoyer la demande
                        </button>
                    </form>

                    `;
            $('#content').html(html);
        });
}

function displayAdhesionFormulaire(result){
   
    var html = `<form enctype="multipart/form-data" id='adhesion-form-modified' action="forms/contact.php" method="post" class="php-email-form">
                        <div class="form-group">
                            <input type="text" class="form-control" name="id_user" id="id_user" value="` + result.data.id + `" hidden />
                        </div>
                        <div class="form-group">
                            <input type="text" class="form-control" name="email" id="email" value="` + result.data.email + `" hidden />
                        </div>`;
    $.getJSON("http://localhost/M2L/api/demandeur/read_by_id.php?id=" + result.data.id, function(resultat){
        html+=
                        `
                        <div class="form-group">
                            <input type="text" class="form-control" name="id" id="id" value="` + resultat.id + `" hidden />
                        </div>
                        <div class="form-group">
                            <label for="text">Nom</label>
                            <input type="text" class="form-control" name="nom" id="nom" value="` + resultat.nom + `" required />
                        </div>
            
                        <div class="form-group">
                            <label for="prenom">Prénom</label>
                            <input type="text" class="form-control" name="prenom" id="prenom" value="` + resultat.prenom + `" required />
                        </div>

                        <div class="form-group">
                            <label for="date">Date de naissance</label>
                            <input type="date" class="form-control" name="date_naissance" id="date_naissance" value="` + resultat.date_naissance + `" required />
                        </div>

                        <div class="form-group">
                            <label for="rue">Adresse</label>
                            <input type="text" class="form-control" name="rue" id="rue" value="` + resultat.rue + `" required />
                        </div>

                        <div class="form-group">
                            <label for="ville">Ville</label>
                            <input type="text" class="form-control" name="ville" id="ville" value="` + resultat.ville + `" required />
                        </div>

                        <div class="form-group">
                            <label for="cp">Code postal</label>
                            <input type="number" class="form-control" name="cp" id="cp" value="` + resultat.cp + `" required />
                        </div>
                        
                        <div class="form-group">
                            <label for="licence">Numéro de licence</label>
                            <input type="number" class="form-control" name="num_licence" id="num_licence" value="` + resultat.num_licence + `" required />
                        </div>

                        <div class="form-group">
                            <label for="ligue">Nom de votre ligue</label>
                            <select name='ligue' id="id_ligue" class='form-control'>`;

        $.getJSON("http://localhost/M2L/api/ligue/read.php", function(resu){
            $.each(resu.records, function(key, val){
                // pre-select option is category id is the same
                if(val.id==resultat.id_ligue){ html+=`<option data-id='` + val.id + `' value='` + val.nom + `' selected>` + val.nom + `</option>`; }
     
                else{ html+=`<option data-id='` + val.id + `' value='` + val.nom + `'>` + val.nom + `</option>`; }

            });
        
                html+=`</select>
                        </div>
                        <div class="form-group">
                            <label for="justificatif">Justificatif en pdf ou image</label>
                            <input type="hidden" name="MAX_FILE_SIZE" value="2400000" />
                            <input type="file" name="justificatif" class="form-control" accept="image/*,application/pdf" id="justificatif" required />
                        </div>

                        <div class="my-3">
                            <div class="loading">En cours...</div>
                            <div class="error-message"></div>
                            <div class="sent-message">Votre dossier a été envoyé. Votre demande peut être modifié jusqu'à la validation de votre demande. Vous allez bientôt être informé par mail. Merci! </div>
                        </div>
        
                        <button type='submit' class='btn btn-primary'>
                            <span><i class="bi bi-envelope-check"></i></span> Renvoyer la demande
                        </button>
                    </form>

                    `;
            $('#content').html(html);
        });
    });

}


                    
