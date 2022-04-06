function showBordereau(adherent_id){
    //function to retrieve date
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var this_year = today.getFullYear();
    today = dd + '/' + mm + '/' + this_year;
    
    $.getJSON("api/demandeur/read_by_id.php?id=" + adherent_id, function(data){
        
        var html = `
        <div id="pdf" class="pdf" style="background-color:white;color:black;text-align: left;margin:20px 20px;">
            <div style="width:50%;margin-bottom: 40px;">
                <img src="assets/img/head_bordereau.jpg" alt="head of bordereau" style="width:100%;"> 
            </div> 
            <div style="text-align: left; display: inline-block;margin-bottom: 20px;">
                <h4 style="font-size: 14pt;font-weight: bold;">Note de frais des bénévoles</h4>
            </div>
            <div style="width:30%; float:right;background-color: #CCFFCC;margin-right: 10%;text-align: center;margin-bottom: 20px;padding: 10px 0px;">
                <h4 style="font-size: 14pt;font-weight: bold;">Année civile ${this_year}</h4>
            </div>
            <div style="width:100%;margin-bottom: 40px;">
                <p style="font-weight: bold;">Je soussigné(e) </p>
                <p style="background-color: #CCFFCC;text-align: center;margin-right: 10%;padding: 10px 0px;">${data.nom} ${data.prenom}</p>
                <p style="font-weight: bold;">demeurant</p>
                <p style="background-color: #CCFFCC;text-align: center;margin-right: 10%;padding: 10px 0px;">${data.rue}, ${data.cp} - ${data.ville}</p>
                <p style="font-weight: bold;">certifie renoncer au remboursement des frais ci-dessous et les laisser à l'association</p>
                <p style="background-color: #CCFFCC;text-align: center;margin-right: 10%;padding: 10px 0px;">Salle d'Armes de Villers lès Nancy, 1 rue Rodin - 54600 Villers lès Nancy</p>
                <p style="font-weight: bold;">en tant que don.</p>
            </div> 
            <div style="text-align: left; display: inline-block;">
                <p style="font-weight: bold;">Frais de déplacement</p>
            </div>
            <div style="width:60%; float:right;text-align: center;">
                <p>Tarif kilométrique appliqué pour le remboursement : 0,28 €</p>
            </div>         
        
            <table style="width:100%;border-collapse: collapse;border: 1px solid black;text-align: center;color: black;margin-bottom: 30px;">
            <thead>
                <tr>
                    <th width="10%" >Date jj/mm/aaaa</th>
                    <th width="15%" >Motif</th>
                    <th width="15%" >Trajet</th>
                    <th width="10%" >Kms parcourus</th>
                    <th width="10%" >Coût Trajet</th>
                    <th width="10%" >Péages</th>
                    <th width="10%" >Repas</th>
                    <th width="10%" >Hébergement</th>
                    <th width="10%" >Total</th>
                </tr>
                </thead>
                <tbody style="background-color: #CCFFCC;">`;
            // get data from the api based on data searched by id user
        $.getJSON("api/ligne_frais/read_by_id_user.php?id=" + adherent_id, function(da){
            var cout_trajet;
            var total_par_ligne;
            var montant=0;
            $.each(da.records, function(key, val){
                //calcul cout trajet and round up to 2 decimal places
                cout_trajet = Math.round(val.km_valide*0.28* 100)/ 100;
                //turn values into numbers, avoid 'null' values
                val.peage_valide = (val.peage_valide == '0' || val.peage_valide == null) ? 0 : val.peage_valide;
                val.repas_valide = (val.repas_valide == '0' || val.repas_valide == null) ? 0 : val.repas_valide;
                val.hebergement_valide = (val.hebergement_valide == '0' || val.hebergement_valide == null) ? 0 : val.hebergement_valide;
                //calcul montant total par ligne
                total_par_ligne = Math.round((cout_trajet + val.peage_valide + val.repas_valide + val.hebergement_valide)*100)/100;
                //turn values into strings to display on screen, avoid 'null' values
                peage_valide = (val.peage_valide == '0' || val.peage_valide == null) ? "-" : (val.peage_valide + '&euro;');
                repas_valide = (val.repas_valide == '0' || val.repas_valide == null) ? "-" : (val.repas_valide + '&euro;');
                hebergement_valide = (val.hebergement_valide == '0' || val.hebergement_valide == null) ? "-" : (val.hebergement_valide + '&euro;');
                //calul montant total all lignes
                montant = Math.round((montant+total_par_ligne)*100)/100;
                //convert date format in SQL into format required jj/mm/aaaa in JS
                var d = new Date(val.date_ligne_frais);
                var day = String(d.getDate()).padStart(2, '0');
                var month = String(d.getMonth() + 1).padStart(2, '0'); //January is 0!
                var year = d.getFullYear();
                var date = day + '/' + month + '/' + year;

                //add lignes frais into table rows
                html+=
                `
                    <tr style="padding-top: 15px;padding-bottom: 15px;">
                        <td>${date}</td>
                        <td id="libelle${val.id}"></td>
                        <td>${val.trajet}</td>
                        <td>${val.km_valide}</td>
                        <td>${cout_trajet} &euro;</td>
                        <td>${peage_valide}</td>
                        <td>${repas_valide}</td>
                        <td>${hebergement_valide}</td>
                        <td>${total_par_ligne} &euro;</td>
                    </tr>`;
                //add libelle of motif to 'td' tag above
                getLibelle(val.id_motif, function(lib){$('#libelle'+val.id).html(lib);});
                
            });

            html+=
                            `
                            <tr>
                                <td colspan="8" style="background-color: white;">Montant total des frais de déplacement</td>
                                <td>${montant} &euro;</td>
                            </tr>
                            </tbody>
                        </table>
                        <div style="width:100%;">
                            <p style="font-weight: bold;">Je suis le représentant légal des adhérents suivants :</p>
                            <div style="background-color: #CCFFCC;text-align: center;margin-right: 10%;">
                                <p>${data.nom} ${data.prenom}, licence n° ${data.num_licence} </p>
                            </div>
                        
                        </div>
                        <div style="width:100%;margin-top: 20px;margin-bottom: 30px;">
                            <p style="font-weight: bold;">Montant total des dons<span style="margin-left:60px;background-color:#CCFFFF;text-align:center;padding:0px 40px;font-weight: normal;">${montant} &euro;</span></p>
                        </div>
                        <div style="width:100%;text-align: center;font-style:italic;">
                            <p>Pour bénéficier du reçu de dons, cette note de frais doit être accompagnée de toutes les justificatifs correspondants</p>
                        </div>
                        <div style="width:100%;padding: 20px 30px;font-style:italic;margin-left: 30%;margin-top: 10px;margin-bottom: 10px;">
                            <p>A<span style="background-color:#CCFFCC;margin:0px 20px;padding:10px 60px">${data.ville}</span>Le<span style="background-color:#CCFFCC;margin:0px 20px;padding:10px 60px">${today}</span></p>
                        </div>
                        <div style="width:100%;padding: 20px 30px;font-style:italic;margin-left: 25%;margin-top: 10px;margin-bottom: 30px;">
                            <p>Signature du bénévole<span style="background-color:#CCFFCC;margin:0px 30px;padding:30px 150px">[signé]</p>
                        </div>
                        <div style="border: 1px solid black;background-color:#FF8BD8;width: 55%;margin-bottom: 50px;">
                            <p style="text-align: center;font-weight: bold;">Partie réservée à l'association</p>
                            <p style="margin:15px 0px;">N° d'ordre du Reçu :<span id="num_ordre" style="margin-left: 80px;"></span></p>
                            <p style="margin:15px 0px;">Remis le :</p>
                            <p style="margin-top:15px;margin-bottom: 35px;">Signature du Trésorier : </p>
                        </div>
                            
                    </div>
                    <div class="d-flex justify-content-center controls" style="margin-top: 10px;margin-bottom: 10px;">
                        <button type="submit" id="send_getPDF" class="btn btn-primary">Envoyer et Télécharger en PDF</button>
                    </div>
                    <div id="return-button" class="d-flex justify-content-center controls" style="margin-bottom: 50px;">
                        <div class='btn btn-info all-ligne-frais-button-user'><span><i class="bi bi-arrow-left-short"></i></span> Retourner</div>
                    </div>`;
                        
                
                    
                    $('#content').html(html);
        });
                    
                
    });
}

//function to show bordereau and create bordereau for admin
function showBordereauAdmin(adherent_id){
    //function to retrieve date
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var this_year = today.getFullYear();
    today = dd + '/' + mm + '/' + this_year;
    
    $.getJSON("api/demandeur/read_by_id.php?id=" + adherent_id, function(data){
        
        var html = `
        <div id="pdf" class="pdf" style="background-color:white;color:black;text-align: left;margin:20px 20px;">
            <div style="width:50%;margin-bottom: 40px;">
                <img src="assets/img/head_bordereau.jpg" alt="head of bordereau" style="width:100%;"> 
            </div> 
            <div style="text-align: left; display: inline-block;margin-bottom: 20px;">
                <h4 style="font-size: 14pt;font-weight: bold;">Note de frais des bénévoles</h4>
            </div>
            <div style="width:30%; float:right;background-color: #CCFFCC;margin-right: 10%;text-align: center;margin-bottom: 20px;padding: 10px 0px;">
                <h4 style="font-size: 14pt;font-weight: bold;">Année civile ${this_year}</h4>
            </div>
            <div style="width:100%;margin-bottom: 40px;">
                <p style="font-weight: bold;">Je soussigné(e) </p>
                <p style="background-color: #CCFFCC;text-align: center;margin-right: 10%;padding: 10px 0px;">${data.nom} ${data.prenom}</p>
                <p style="font-weight: bold;">demeurant</p>
                <p style="background-color: #CCFFCC;text-align: center;margin-right: 10%;padding: 10px 0px;">${data.rue}, ${data.cp} - ${data.ville}</p>
                <p style="font-weight: bold;">certifie renoncer au remboursement des frais ci-dessous et les laisser à l'association</p>
                <p style="background-color: #CCFFCC;text-align: center;margin-right: 10%;padding: 10px 0px;">Salle d'Armes de Villers lès Nancy, 1 rue Rodin - 54600 Villers lès Nancy</p>
                <p style="font-weight: bold;">en tant que don.</p>
            </div> 
            <div style="text-align: left; display: inline-block;">
                <p style="font-weight: bold;">Frais de déplacement</p>
            </div>
            <div style="width:60%; float:right;text-align: center;">
                <p>Tarif kilométrique appliqué pour le remboursement : 0,28 €</p>
            </div>         
        
            <table style="width:100%;border-collapse: collapse;border: 1px solid black;text-align: center;color: black;margin-bottom: 30px;">
            <thead>
                <tr>
                    <th width="10%" >Date jj/mm/aaaa</th>
                    <th width="15%" >Motif</th>
                    <th width="15%" >Trajet</th>
                    <th width="10%" >Kms parcourus</th>
                    <th width="10%" >Coût Trajet</th>
                    <th width="10%" >Péages</th>
                    <th width="10%" >Repas</th>
                    <th width="10%" >Hébergement</th>
                    <th width="10%" >Total</th>
                </tr>
                </thead>
                <tbody style="background-color: #CCFFCC;">`;
            // get data from the api based on data searched by id user
        $.getJSON("api/ligne_frais/read_by_id_user.php?id=" + adherent_id, function(da){
            var cout_trajet;
            var total_par_ligne;
            var montant=0;
            $.each(da.records, function(key, val){
                //calcul cout trajet and round up to 2 decimal places
                cout_trajet = Math.round(val.km_valide*0.28* 100)/ 100;
                //turn values into numbers, avoid 'null' values
                val.peage_valide = (val.peage_valide == '0' || val.peage_valide == null) ? 0 : val.peage_valide;
                val.repas_valide = (val.repas_valide == '0' || val.repas_valide == null) ? 0 : val.repas_valide;
                val.hebergement_valide = (val.hebergement_valide == '0' || val.hebergement_valide == null) ? 0 : val.hebergement_valide;
                //calcul montant total par ligne
                total_par_ligne = Math.round((cout_trajet + val.peage_valide + val.repas_valide + val.hebergement_valide)*100)/100;
                //turn values into strings to display on screen, avoid 'null' values
                peage_valide = (val.peage_valide == '0' || val.peage_valide == null) ? "-" : (val.peage_valide + '&euro;');
                repas_valide = (val.repas_valide == '0' || val.repas_valide == null) ? "-" : (val.repas_valide + '&euro;');
                hebergement_valide = (val.hebergement_valide == '0' || val.hebergement_valide == null) ? "-" : (val.hebergement_valide + '&euro;');
                //calul montant total all lignes
                montant = Math.round((montant+total_par_ligne)*100)/100;
                //convert date format in SQL into format required jj/mm/aaaa in JS
                var d = new Date(val.date_ligne_frais);
                var day = String(d.getDate()).padStart(2, '0');
                var month = String(d.getMonth() + 1).padStart(2, '0'); //January is 0!
                var year = d.getFullYear();
                var date = day + '/' + month + '/' + year;

                //add lignes frais into table rows
                html+=
                `
                    <tr style="padding-top: 15px;padding-bottom: 15px;">
                        <td>${date}</td>
                        <td id="libelle${val.id}"></td>
                        <td>${val.trajet}</td>
                        <td>${val.km_valide}</td>
                        <td>${cout_trajet} &euro;</td>
                        <td>${peage_valide}</td>
                        <td>${repas_valide}</td>
                        <td>${hebergement_valide}</td>
                        <td>${total_par_ligne} &euro;</td>
                    </tr>`;
                //add libelle of motif to 'td' tag above
                getLibelle(val.id_motif, function(lib){$('#libelle'+ val.id).html(lib);});
                
            });

            html+=
                            `
                            <tr>
                                <td colspan="8" style="background-color: white;">Montant total des frais de déplacement</td>
                                <td>${montant} &euro;</td>
                            </tr>
                            </tbody>
                        </table>
                        <div style="width:100%;">
                            <p style="font-weight: bold;">Je suis le représentant légal des adhérents suivants :</p>
                            <div style="background-color: #CCFFCC;text-align: center;margin-right: 10%;">
                                <p>${data.nom} ${data.prenom}, licence n° ${data.num_licence} </p>
                            </div>
                        
                        </div>
                        <div style="width:100%;margin-top: 20px;margin-bottom: 30px;">
                            <p style="font-weight: bold;">Montant total des dons<span style="margin-left:60px;background-color:#CCFFFF;text-align:center;padding:0px 40px;font-weight: normal;">${montant} &euro;</span></p>
                        </div>
                        <div style="width:100%;text-align: center;font-style:italic;">
                            <p>Pour bénéficier du reçu de dons, cette note de frais doit être accompagnée de toutes les justificatifs correspondants</p>
                        </div>
                        <div style="width:100%;padding: 20px 30px;font-style:italic;margin-left: 30%;margin-top: 10px;margin-bottom: 10px;">
                            <p>A<span style="background-color:#CCFFCC;margin:0px 20px;padding:10px 60px">${data.ville}</span>Le<span style="background-color:#CCFFCC;margin:0px 20px;padding:10px 60px">${today}</span></p>
                        </div>
                        <div style="width:100%;padding: 20px 30px;font-style:italic;margin-left: 25%;margin-top: 10px;margin-bottom: 30px;">
                            <p>Signature du bénévole<span style="background-color:#CCFFCC;margin:0px 30px;padding:30px 150px">[signé]</p>
                        </div>
                        <div style="border: 1px solid black;background-color:#FF8BD8;width: 55%;margin-bottom: 50px;">
                            <p style="text-align: center;font-weight: bold;">Partie réservée à l'association</p>
                            <p style="margin:15px 0px;">N° d'ordre du Reçu :<span id="num_ordre" style="margin-left: 80px;"></span></p>
                            <p style="margin:15px 0px;">Remis le :</p>
                            <p style="margin-top:15px;margin-bottom: 35px;">Signature du Trésorier : </p>
                        </div>
                            
                    </div>
                    <div class="d-flex justify-content-center controls" style="margin-top: 10px;margin-bottom: 10px;">
                        <button type="submit" id="send_getPDF" class="btn btn-primary">Sauvegarder et Télécharger en PDF</button>
                    </div>
                    <div id="return-button" class="d-flex justify-content-center controls" style="margin-bottom: 50px;">
                        <div class='btn btn-info all-bordereaux-button'><span><i class="bi bi-arrow-left-short"></i></span> Retourner</div>
                    </div>`;
                        
                
                    
                    $('#content').html(html);
        });
                    
                
    });
}

//function to retrieve value from getJSON() using callback
function getLibelle(val,callback){
    var libelle;
    $.getJSON("api/motif/read_one_motif.php?id=" + val, function(result){             
        libelle = result.libelle;
        callback(libelle);         
    });
}

//function to show bordereau validé for utilisateurs
function showBordereauValide(adherent_id){
    //function to retrieve date
    var today = new Date();
    var this_year = today.getFullYear();
    var content = `
            <div class="object-pdf">
                <object data="http://localhost/M2L/assets/files/bordereaux/user_id_${adherent_id}_${this_year}.jpg" type="image/gif" width="100%" height="100%"></object>
                <p>Si le fichier n'apparaît pas, veuillez <a href="assets/files/bordereaux/user_id_${adherent_id}_${this_year}.jpg" target="_blank">cliquer ici</a></p>
            </div>
            <div class="d-flex justify-content-center controls" style="margin-top: 10px;margin-bottom: 10px;">
                <button type="submit" id="getPDF" class="btn btn-primary">Télécharger en PDF</button>
            </div>
            <div class="d-flex justify-content-center controls" style="margin-bottom: 50px;">
                <div class='btn btn-info all-ligne-frais-button-user'><span><i class="bi bi-arrow-left-short"></i></span> Retourner</div>
            </div>
    `;
    $('#content').html(content);
}

//function display all bordereaux for admin
function showBordereauxTemplate(data, keywords){
    var read_bordereaux_html=`
        <!-- search bordereaux form -->
        <form id='search-bordereau-form' action='#' method='post'>
        <div class='input-group float-left w-40-pct mb-4'>
 
            <input type='text' value='` + keywords + `' name='keywords' class='form-control bordereau-search-keywords' placeholder='Chercher par id utilisateur...' />
 
            <span class='input-group-btn'>
                <button type='submit' class='btn btn-default' type='button'>
                    <span><i class="bi bi-search"></i></span>
                </button>
            </span>
 
        </div>
        </form>

        <!-- when clicked, it will load all bordereaux list-->
        <div id='all-bordereaux' class='btn btn-primary float-right m-b-15px all-bordereaux-button'>
            <span><i class="bi bi-card-list"></i></span> Tous Bordereaux
        </div>

        <!-- when clicked, it will load the create ligne frais form -->
        <div id='create-bordereau' class='btn btn-primary float-right m-b-15px create-bordereau-button mr-2'>
            <span><i class="bi bi-plus-lg"></i></span> Créer Bordereau
        </div>

        <!-- start table display bordereaux-->
        <table class='table table-bordered table-hover'>
        
            <!-- creating our table heading -->
            <tr>
                <th class='w-5-pct'>Id</th>
                <th class='w-15-pct'>Source de bordereau</th>
                <th class='w-10-pct'>Id utilisateur</th>
                <th class='w-10-pct'>Etre validé</th>
                <th class='w-15-pct'>Fichier CERFA</th>
                <th class='w-45-pct text-align-center'>Action</th>
            </tr>`;

            // loop through returned list of data
            $.each(data.records, function(key, val) {
                //change display variable
                var valide = (val.etre_valide == 0 || val.etre_valide == null) ? "Non" : "Oui" 
                var cerfa = (val.cerfa == '' || val.cerfa == null) ? "Pas encore créé" : val.cerfa 
                // creating new table row per record
                read_bordereaux_html+=`
                    <tr>
            
                        <td>` + val.id + `</td>
                        <td>` + val.src_bordereau + `</td>
                        <td>` + val.id_user + `</td>
                        <td>` + valide + `</td>
                        <td>` + cerfa + `</td>
            
                        <!-- 'action' buttons -->
                        <td>
                            <!-- read bordereau button -->
                            <button class='btn btn-primary m-r-10px read-one-bordereau-button' data-id='` + val.id + `'>
                                <span><i class="bi bi-eye"></i></span> Lire
                            </button>
                            
                           `;
                if(val.etre_valide == null || val.etre_valide == 0 ){
                     read_bordereaux_html+=`
                        <!-- edit button -->
                        <button class='btn btn-info m-r-10px update-bordereau-button' data-id='` + val.id + `'>
                            <span><i class="bi bi-pencil-square"></i></span> Modifier
                        </button>
                        <!-- delete button -->
                            <button class='btn btn-danger delete-bordereau-button' data-id='` + val.id + `'>
                                <span><i class="bi bi-x-lg"></i></span> Supprimer
                            </button>
                        <!-- valider bordereau button -->
                        <button class='btn btn-dark valider-bordereau-button' data-id='` + val.id + `'>
                            <span><i class="bi bi-check"></i></span> Valider
                        </button>
                        `;
                }else{

                    if(val.cerfa == null || val.cerfa == ''){
                        read_bordereaux_html+=
                            `
                            <!-- invalider bordereau button -->
                            <button class='btn btn-warning invalider-bordereau-button' data-id='` + val.id + `'>
                                <span><i class="bi bi-arrow-clockwise"></i></span> Invalider
                            </button>
                            <!-- create cerfa button -->
                            <button class='btn btn-success show-cerfa-form-button' data-id='` + val.id_user + `'>
                                <span><i class="bi bi-file-check"></i></span> Créer CERFA
                            </button>
                            `;
                    }else{
                        read_bordereaux_html+=
                            `
                            <!-- modify cerfa button -->
                            <button class='btn btn-success show-cerfa-form-button' data-id='` + val.id_user + `'>
                                <span><i class="bi bi-pencil-square"></i></span> Modifier CERFA
                            </button>
                            `;
                    }
                        
                }
               

            });
        
        // end table
        read_bordereaux_html+=`</td></tr></table>`;
        // pagination
        if(data.paging){
            read_bordereaux_html+="<nav aria-label='search bordereaux pages'><ul class='pagination bordereau float-left margin-zero padding-bottom-2em'>";
        
                // first page
                if(data.paging.first!=""){
                    read_bordereaux_html+="<li class='page-item'><a class='page-link' data-page='" + data.paging.first + "'>Première Page</a></li>";
                }
        
                // loop through pages
                $.each(data.paging.pages, function(key, val){
                    var active_page=val.current_page=="yes" ? "active" : "";
                    read_bordereaux_html+="<li class='page-item " + active_page + "'><a class='page-link' data-page='" + val.url + "'>" + val.page + "</a></li>";
                });
        
                // last page
                if(data.paging.last!=""){
                    read_bordereaux_html+="<li class='page-item'><a class='page-link' data-page='" + data.paging.last + "'>Dernière Page</a></li>";
                }
            read_bordereaux_html+="</ul></nav>";
        }

        // inject this piece of html to our page
        $("#content").html(read_bordereaux_html);
        
        

}


function showBordereauxFirstPage(){
    var json_url="api/bordereau/read_paging_bordereau.php";
    showBordereaux(json_url);
}

// function to show list of Demandeurs
function showBordereaux(json_url){

    // get list of Demandeurs from the API
    $.getJSON(json_url, function(data){
        
        // check if list of bordereaux is empty or not
        if (data.message){
            $('#response').html("<div class='alert alert-danger'>Aucun bordereau trouvé.</div>");
            addBordereauButton();
        }else{
            // html for listing Demandeurs
            showBordereauxTemplate(data, "");
            changePageTitle('Liste des bordereaux');
        }
    }); 
    
}

function createBordereau(){
    
    var html = `
        <form id='create-bordereau-form'>
        <div class='table-responsive text-nowrap'>
        <table class='table table-hover table-bordered'>
           
            <tr>
                <td class='w-30-pct'>Id utilisateur</td>
                <td class='w-70-pct'><input type="number" class="form-control" name="id_user" id="id_user" step="1" required/></td>
            </tr>

            <tr>
                <td><div class='btn btn-info all-bordereaux-button'><span><i class="bi bi-arrow-left-short"></i></span> Retourner</div></td>
                <td>
                    <div class='btn btn-success all-ligne-frais-button-of-user'><span><i class="bi bi-card-list"></i></span> Voir ses lignes frais</div>
                    <button type='submit' class='btn btn-primary'><span><i class="bi bi-plus"></i></span> Créer Bordereau</button>
                </td>
            </tr>
            </table>
            </div>
        </form>
        `;

    $('#content').html(html);
}

function updateOneBordereau(data){

    var html = `
    <form id='update-bordereau-form' enctype="multipart/form-data">
    <div class='table-responsive text-nowrap'>
    <table class='table table-hover table-bordered'>
        <tr>
            <td class='w-30-pct'>Source de bordereau</td>
            <td class='w-70-pct'>
                <input type="hidden" class="form-control" name="src_bordereau" id="src_bor" value="${data.src_bordereau}"/>
                <input type="hidden" name="MAX_FILE_SIZE" value="2400000" />
                Changez le fichier ancien <a href="assets/files/bordereaux/${data.src_bordereau}" target="_blank">` + data.src_bordereau + `</a> si besoin
                <input type="file" name="src_bordereau" class="form-control" accept="image/*,application/pdf" id="src_b"/>
                <input type="text" class="form-control" name="id" id="bordereau_id" value="${data.id}" hidden/>
            </td>
        </tr>
        <tr>
                <td class='w-30-pct'>Id utilisateur</td>
                <td class='w-70-pct'><input type="number" class="form-control" name="id_user" id="id_user" step="1" value="${data.id_user}" required/>
                    <input type="text" class="form-control" name="id" id="bordereau_id" value="${data.id}" hidden/>
                </td>
        </tr>
        `;
    if(data.cerfa){
        html +=
        `
        <tr class='div-cerfa'>
            <td>Fichier CERFA</td>
            <td>
                <input type="hidden" class="form-control" name="cerfa" id="src_cer" value="${data.cerfa}"/>
                <input type="hidden" name="MAX_FILE_SIZE" value="2400000" />
                Changez le fichier ancien <a href="assets/files/cerfa/${data.cerfa}" target="_blank">` + data.cerfa + `</a> si besoin
                <input type="file" name="cerfa" class="form-control" accept="application/pdf" id="src_c"/>
            </td>
        </tr>`;
    }else{
        html +=
        `
        <tr>
            <td></td>
            <td>
                <button id='ajout-cerfa' type='button' class='btn btn-success'><span><i class="bi bi-plus"></i></span> Ajouter CERFA</button>
            </td>
        </tr>
        <tr class='div-cerfa'>
            <td>fichier CERFA</td>
            <td>
                <input type="hidden" name="MAX_FILE_SIZE" value="2400000" />
                <input type="file" name="cerfa" class="form-control" accept="application/pdf" id="src_c"/>
            </td>
        </tr>
        `;
    }
        
    html +=  
        `
        <tr>
            <td><div class='btn btn-info all-bordereaux-button'><span><i class="bi bi-arrow-left-short"></i></span> Retourner</div></td>
            <td><button type='submit' class='btn btn-primary'><span><i class="bi bi-save"></i></span> Sauvegarder</button></td>
        </tr>
        </table>
        </div>
    </form>
    `;

    $('#content').html(html);
    if(!data.cerfa){$('.div-cerfa').hide();}

}

// display info of bordereau sous forme de tableau
function showOneBordereauTemplate(data){
    var valide = (data.etre_valide == '0' || data.etre_valide == null) ? "Non" : "Oui";
    var cerfa = (!data.cerfa) ? "Pas encore créé" : data.cerfa;
    var read_one_bordereau_html=`
                    <!-- when clicked, it will show the bordereau list -->
                    <div id='all-bordereaux' class='btn btn-primary float-right m-b-15px all-bordereaux-button'>
                        <span><i class="bi bi-card-list"></i></span> Tous bordereaux
                    </div>
                    <div class='table-responsive text-nowrap'>
                        <table class='table table-hover table-bordered'>
                            <tr>
                                <td class='w-30-pct'>Id Bordereau</td>
                                <td class='w-70-pct'>` + data.id + `</td>
                            </tr>
                            <tr>
                                <td>Fichier de bordereau</td>
                                <td><a href="assets/files/bordereaux/${data.src_bordereau}" target="_blank">` + data.src_bordereau + `</a></td>
                            </tr>
                            <tr>
                                <td>Id Utilisateur</td>
                                <td>${data.id_user}</td>
                            </tr>
                            <tr>
                                <td>Déjà validé</td>
                                <td>${valide}</td>
                            </tr>
                            <tr>
                                <td>Fichier CERFA</td>
                                <td><a href="assets/files/cerfa/${cerfa}" target="_blank">` + cerfa + `</a></td>
                            </tr>
                            <tr>
                                <td>
                                    <div class='btn btn-info all-bordereaux-button'><span><i class="bi bi-arrow-left-short"></i></span> Retourner</div>
                                </td>
                            `;
 
        if(data.etre_valide == null || data.etre_valide == "0"){
            read_one_bordereau_html+=`
                                <td>
                                    <div><button class='btn btn-dark valider-bordereau-button' data-id='` + data.id + `'>
                                    <span><i class="bi bi-check"></i></span> Valider Bordereau</button></div>
                                </td>
                            </tr>
                        </table>
                    </div>
                    `;
        }else{
            if(data.cerfa == null || data.cerfa == ''){
                read_one_bordereau_html+=`
                                <td>
                                    <div><button class='btn btn-warning invalider-bordereau-button' data-id='` + data.id + `'>
                                    <span><i class="bi bi-arrow-clockwise"></i></span> Invalider Bordereau</button></div>
                                </td>
                            </tr>
                        </table>
                    </div>
                    `;
            }else{
                read_one_bordereau_html+=`
                                <td></td>
                            </tr>
                        </table>
                    </div>
                    `;
            }
        }

    $('#content').html(read_one_bordereau_html);

}

function showAllBordereauxButton(){
    $('#content').html(`<!-- when clicked, it will show the bordereaux list -->
                <div id='all-bordereaux' class='btn btn-primary float-right m-b-15px all-bordereaux-button'>
                    <span><i class="bi bi-card-list"></i></span> Tous Bordereaux
                </div>`);
}

function deleteFilesByIdBordereau(bordereau_id){
    $.getJSON("api/bordereau/read_one_bordereau.php?id=" + bordereau_id, function(data){
   
        var formData = new FormData();
        
        formData.append("id_user", data.id_user);
        
        var xhttp = new XMLHttpRequest();
        // Set POST method and ajax file path
        xhttp.open("POST", "api/bordereau/delete_files.php", true);
        // call on request changes state
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {

                var response = this.responseText;
                if(response !== ''){
                    alert(response);
                }
            }
        };
        // Send request with data
        xhttp.send(formData);
    });
    
}
