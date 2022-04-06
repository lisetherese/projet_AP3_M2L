
function showDemandeursTemplate(data, keywords){
    var read_Demandeurs_html=`
        <!-- search Demandeurs form -->
        <form id='search-demandeur-form' action='#' method='post'>
        <div class='input-group float-left w-40-pct mb-4'>
 
            <input type='text' value='` + keywords + `' name='keywords' class='form-control demandeur-search-keywords' placeholder='Chercher par nom ou prénom ou numéro licence...' />
 
            <span class='input-group-btn'>
                <button type='submit' class='btn btn-default' type='button'>
                    <span><i class="bi bi-search"></i></span>
                </button>
            </span>
 
        </div>
        </form>

        <!-- when clicked, it will load all Demandeurs list-->
        <div id='all-demandeurs' class='btn btn-primary float-right m-b-15px all-demandeurs-button'>
            <span><i class="bi bi-card-list"></i></span> Tous Demandeurs
        </div>

        <!-- when clicked, it will load the create Demandeur form -->
        <div id='create-demandeur' class='btn btn-primary float-right m-b-15px create-demandeur-button mr-2'>
            <span><i class="bi bi-plus-lg"></i></span> Créer Demandeur
        </div>
        <!-- start table display Demandeurs-->
        <table class='table table-bordered table-hover'>
        
            <!-- creating our table heading -->
            <tr>
                <th class='w-5-pct'>Id</th>
                <th class='w-7-pct'>Nom</th>
                <th class='w-7-pct'>Prénom</th>
                <th class='w-16-pct'>Rue</th>
                <th class='w-5-pct'>Code postal</th>
                <th class='w-10-pct'>Ville</th>
                <th class='w-10-pct'>Numéro de licence</th>
                <th class='w-40-pct text-align-center'>Action</th>
            </tr>`;

            // loop through returned list of data
            $.each(data.records, function(key, val) {
                // creating new table row per record
                read_Demandeurs_html+=`
                    <tr>
            
                        <td>` + val.id + `</td>
                        <td>` + val.nom + `</td>
                        <td>` + val.prenom + `</td>
                        <td>` + val.rue + `</td>
                        <td>` + val.cp + `</td>
                        <td>` + val.ville + `</td>
                        <td>` + val.num_licence + `</td>
            
                        <!-- 'action' buttons -->
                        <td>
                            <!-- read Demandeur button -->
                            <button class='btn btn-primary m-r-10px read-one-demandeur-button' data-id='` + val.id + `'>
                                <span><i class="bi bi-eye"></i></span> Lire
                            </button>
            
                            <!-- edit button -->
                            <button class='btn btn-info m-r-10px update-demandeur-button' data-id='` + val.id + `'>
                                <span><i class="bi bi-pencil-square"></i></span> Modifier
                            </button>
            
                            <!-- delete button -->
                            <button class='btn btn-danger delete-demandeur-button' data-id='` + val.id + `'>
                                <span><i class="bi bi-x-lg"></i></span> Supprimer
                            </button>`;
               
                    if(val.etre_adherent == null || val.etre_adherent == "0" ){
                        read_Demandeurs_html+=`
                            <!-- valider adhésion button -->
                            <button class='btn btn-dark valider-demandeur-button' data-id='` + val.id + `'>
                                <span><i class="bi bi-check"></i></span> Valider
                            </button>`;
                    }
               

            });
        
        // end table
        read_Demandeurs_html+=`</td></tr></table>`;
        // pagination
        if(data.paging){
            read_Demandeurs_html+="<nav aria-label='search demandeurs pages'><ul class='pagination demandeurs float-left margin-zero padding-bottom-2em'>";
        
                // first page
                if(data.paging.first!=""){
                    read_Demandeurs_html+="<li class='page-item'><a class='page-link' data-page='" + data.paging.first + "'>Première Page</a></li>";
                }
        
                // loop through pages
                $.each(data.paging.pages, function(key, val){
                    var active_page=val.current_page=="yes" ? "active" : "";
                    read_Demandeurs_html+="<li class='page-item " + active_page + "'><a class='page-link' data-page='" + val.url + "'>" + val.page + "</a></li>";
                });
        
                // last page
                if(data.paging.last!=""){
                    read_Demandeurs_html+="<li class='page-item'><a class='page-link' data-page='" + data.paging.last + "'>Dernière Page</a></li>";
                }
            read_Demandeurs_html+="</ul></nav>";
        }

        // inject this piece of html to our page
        $("#content").html(read_Demandeurs_html);

        

}

function showDemandeursFirstPage(){
    var json_url="api/demandeur/read_paging_demandeurs.php";
    showDemandeurs(json_url);
}

// function to show list of Demandeurs
function showDemandeurs(json_url){

    // get list of Demandeurs from the API
    $.getJSON(json_url, function(data){
        
        // check if list of Demandeurs is empty or not
        if (data.message){
            $('#response').html("<div class='alert alert-danger'>Aucun demandeur trouvé.</div>");
            addDemandeurButton();
        }else{
            
            // html for listing Demandeurs
            showDemandeursTemplate(data, "");
        }
    }); 
    
}

function createDemandeurForm(){
    
    var html = `
        <form id='create-demandeur-form'>
        <div class='table-responsive text-nowrap'>
        <table class='table table-hover table-bordered'>
            <tr>
                <td class='w-30-pct'>Nom</td>
                <td class='w-70-pct'><input type="text" class="form-control" name="nom" id="nom" required/></td>
            </tr>

            <tr>
                <td>Prénom</td>
                <td><input type="text" class="form-control" name="prenom" id="prenom" required/></td>
            </tr>
            <tr>
                <td>Rue</td>
                <td><input type="text" class="form-control" name="rue" id="rue" required/></td>
            </tr>
            <tr>
                <td>Code postal</td>
                <td><input type="number" class="form-control" name="cp" id="cp" required/></td>
            </tr>
            <tr>
                <td>Ville</td>
                <td><input type="text" class="form-control" name="ville" id="ville" required/></td>
            </tr>
            <tr>
                <td>Numéro de licence</td>
                <td><input type="number" class="form-control" name="num_licence" id="num_licence" required/></td>
            </tr>

            <tr>
                <td>Date de naissance</td>
                <td><input type="date" class="form-control" name="date_naissance" id="date_naissance" placeholder="mm/jj/YYYY" required/></td>
            </tr>

            <tr>
                <td>Id utilisateur</td>
                <td><input type="number" class="form-control" name="id_user" id="id_user" required/></td>
            </tr>
            <tr>
                <td>Ligue</td>
                <td>
                    <select name='id_ligue' class='form-control' id="id_ligue">`;

    return html;
}

function updateOneDemandeur(data){

    var html = `
    <form id='update-demandeur-form'>
    <div class='table-responsive text-nowrap'>
    <table class='table table-hover table-bordered'>
        <tr>
            <td class='w-30-pct'>Nom</td>
            <td class='w-70-pct'><input type="text" class="form-control" name="nom" id="nom" value="${data.nom}" required/></td>
        </tr>
        
        <tr>
            <td></td>
            <td><input type="text" class="form-control" name="id" id="demandeur_id" value="${data.id}" hidden/></td>
        </tr>
        <tr>
            <td>Prénom</td>
            <td><input type="text" class="form-control" name="prenom" id="prenom" value="${data.prenom}" required/></td>
        </tr>
        <tr>
            <td>Rue</td>
            <td><input type="text" class="form-control" name="rue" id="rue" value="${data.rue}" required/></td>
        </tr>
        <tr>
            <td>Code postal</td>
            <td><input type="number" class="form-control" name="cp" id="cp" value="${data.cp}" required/></td>
        </tr>

        <tr>
            <td>Ville</td>
            <td><input type="text" class="form-control" name="ville" id="ville" value="${data.ville}" required/></td>
        </tr>
        <tr>
            <td>Numéro de licence</td>
            <td><input type="number" class="form-control" name="num_licence" id="num_licence" value="${data.num_licence}" required/></td>
        </tr>

        <tr>
            <td>Date de naissance</td>
            <td><input type="date" class="form-control" name="date_naissance" id="date_naissance" value="${data.date_naissance}" required/></td>
        </tr>

        <tr>
            <td>Id utilisateur</td>
            <td><input type="number" class="form-control" name="id_user" id="id_user" value="${data.id_user}" required/></td>
        </tr>
        <tr>
            <td>Nom de la ligue</td>
            <td>
                <select name='id_ligue' id="id_ligue" class='form-control'>`;

        $.getJSON("api/ligue/read.php", function(resultat){
            $.each(resultat.records, function(key, val){
                
                // pre-select option is category id is the same
                if(val.id==data.id_ligue){ html+=`<option value='` + val.id + `' selected>` + val.nom + `</option>`; }
     
                else{ html+=`<option value='` + val.id + `'>` + val.nom + `</option>`; }
            });

            html+=`</select>
                    </td>
                </tr>

                <tr>
                    <td><div class='btn btn-info all-demandeurs-button'><span><i class="bi bi-arrow-left-short"></i></span> Retourner</div></td>
                    <td><button type='submit' class='btn btn-primary'><span><i class="bi bi-save"></i></span> Sauvegarder</button></td>
                </tr>
                </table>
                </div>
            </form>
            `;

            $('#content').html(html);
            
        });


}

function showOneDemandeurTemplate(data){
    var adherent = (data.etre_adherent == '0' || data.etre_adherent == null) ? "Non" : "Oui"
    var read_one_demandeur_html=`
                        <!-- when clicked, it will show the Demandeurs list -->
                        <div id='all-demandeurs' class='btn btn-primary float-right m-b-15px all-demandeurs-button'>
                            <span><i class="bi bi-card-list"></i></span> Tous Demandeurs
                        </div>
                        <div class='table-responsive text-nowrap'>
                        <table class='table table-hover table-bordered'>
                            <tr>
                                <td class='w-30-pct'>Id Demandeur</td>
                                <td class='w-70-pct'>` + data.id + `</td>
                            </tr>
                            <tr>
                                <td>Nom</td>
                                <td>` + data.nom + `</td>
                            </tr>
                            <tr>
                                <td>Prénom</td>
                                <td>` + data.prenom + `</td>
                            </tr>
                            <tr>
                                <td>Rue</td>
                                <td>` + data.rue + `</td>
                            </tr>
                            <tr>
                                <td>Code postal</td>
                                <td>` + data.cp + `</td>
                            </tr>
                            <tr>
                                <td>Ville</td>
                                <td>` + data.ville + `</td>
                            </tr>
                            <tr>
                                <td>Numéro de licence</td>
                                <td>` + data.num_licence + `</td>
                            </tr>
                            <tr>
                                <td>Date naissance</td>
                                <td>` + data.date_naissance + `</td>
                            </tr>
                            <tr>
                                <td>Déjà être adhérent</td>
                                <td>` + adherent + `</td>
                            </tr>
                            <tr>
                                <td>Id utilisateur</td>
                                <td>` + data.id_user + `</td>
                            </tr>`;
                            
    $.getJSON("api/user/read_one_user.php?id=" + data.id_user, function(result){
        read_one_demandeur_html+=`<tr>
                                    <td>Email d'utilisateur</td>
                                    <td>` + result.email + `</td>
                                </tr>
                                <tr>
                                    <td>Id ligue</td>
                                    <td>` + data.id_ligue + `</td>
                                </tr>`;
        $.getJSON("api/ligue/read_one_ligue.php?id=" + data.id_ligue, function(resultat){
            read_one_demandeur_html+=`<tr>
                                        <td>Nom de la ligue</td>
                                        <td>` + resultat.nom + `</td>
                                    </tr>
                                    <tr>
                                        <td>Sigle de la ligue</td>
                                        <td>` + resultat.sigle + `</td>
                                    </tr>
                                    <tr>
                                        <td>Président de la ligue</td>
                                        <td>` + resultat.president + `</td>
                                    </tr>
                                    <tr>
                                        <td><div class='btn btn-info all-demandeurs-button'><span><i class="bi bi-arrow-left-short"></i></span> Retourner</div></td>
                                        <td><div>
                                            <button class='btn btn-info m-r-10px update-demandeur-button' data-id='` + data.id + `'>
                                                <span><i class="bi bi-pencil-square"></i></span> Modifier
                                            </button>
                                        `;
                                    
            if(adherent == "Non"){
                read_one_demandeur_html+=`
                                        <button class='btn btn-dark valider-demandeur-button' data-id='` + data.id + `'>
                                                    <span><i class="bi bi-check"></i></span> Valider Adhésion</button></div>
                                        </td>
                                    </tr>
                                </table>
                                </div>`;
            }else{
                read_one_demandeur_html+=`</td>
                                    </tr>
                                </table>
                                </div>
                                `;
            }
                                     
            
                      
            // inject html to 'page-content' of our app
            $("#content").html(read_one_demandeur_html);
        });
    });
   
    
 
}

function showAllDemandeursButton(){
    $('#content').html(`<!-- when clicked, it will show the Demandeurs list -->
                <div id='all-demandeurs' class='btn btn-primary float-right m-b-15px all-demandeurs-button'>
                    <span><i class="bi bi-card-list"></i></span> Tous Demandeurs
                </div>`);
}
function addDemandeurButton(){
    $('#content').html(`<!-- when clicked, it will load the create Demandeur form -->
                        <div id='create-demandeur' class='btn btn-primary float-right m-b-15px create-demandeur-button mr-2'>
                            <span><i class="bi bi-plus-lg"></i></span> Créer Demandeur
                        </div>`);
}
function addAdhesion(demandeur_id, user_id){
    // first: change status of demandeur in table 'demandeur' in DB: etre_adherent = 1 
    $.post("api/demandeur/change_status.php", JSON.stringify({ id:demandeur_id })).done(function(result) {
        // then: change role in table utilisateur: from 'user' to 'adherent'
        $.post("api/user/change_role.php", JSON.stringify({ id:user_id })).done(function(resultat) {

            // if succeed, re-load list of demandeurs
            showDemandeursFirstPage();

            $('#response').html("<div class='alert alert-success'>" + resultat.message + "</div>"); 
                        
        })
        .fail(function(resultat){
            $('#response').html("<div class='alert alert-danger'>" + resultat.message + "</div>");
        });

    })
    // show login page on error system
    .fail(function(result){
        showLoginPage();
        $('#response').html("<div class='alert alert-danger'>" + result.message + "</div>");
    });
}




