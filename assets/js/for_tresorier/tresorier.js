//display form bordereau constituted by all lignes frais of one user so that tresorier can input info in 'partie conservée pour l'association'
function showBordereauTresorier(adherent_id){
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
                //add libelle of motif to 'td' tag above using function defined below to retrieve data by getJSON
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
                <p style="margin:15px 0px;">N° d'ordre du Reçu :<span id="num_ordre" style="margin-left: 170px;"></span></p>
                <p style="margin:15px 0px;">Remis le :<input style="width:200px;text-align: center;border: none; border-bottom: dotted black 1px;margin-left: 150px;background-color:#FF8BD8;" type="text" value="${today}"/></p>
                <p style="margin-top:15px;margin-bottom: 35px;">Signature du Trésorier : <input style="width:300px;text-align: center;border: none; border-bottom: dotted black 1px;margin-left: 50px;background-color:#FF8BD8;" type="text" value="[Saisir votre nom complet ici]"/></p>
                    
                </div>
            </div>

            <!--button to save file bordereau validé in serveur and download to tresorier computer-->
            <div class="d-flex justify-content-center controls" style="margin-top: 10px;margin-bottom: 10px;">
                <button type="submit" id="send_getPDF_tresorier" class="btn btn-primary">Valider et Télécharger en PDF</button>
            </div>

            <!--return to list of all bordereaux-->
            <div class="d-flex justify-content-center controls" style="margin-bottom: 50px;">
                <div class='btn btn-info all-bordereaux-button-tresorier'><span><i class="bi bi-arrow-left-short"></i></span> Retourner</div>
            </div>`;

            $('#content').html(html);
            //retrieve id of bordereau to input in No d'ordre du reçu
            $.getJSON("api/bordereau/read_by_id_user.php?id=" + adherent_id, function(resu){
                $('#num_ordre').html(`${resu.id}`);
            });
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


//function display all bordereaux for tresorier
function showBordereauxTemplateTresorier(data, keywords){
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
        <div id='all-bordereaux-tresorier' class='btn btn-primary float-right m-b-15px all-bordereaux-button-tresorier'>
            <span><i class="bi bi-card-list"></i></span> Tous Bordereaux
        </div>

        <!-- start table display bordereaux-->
        <table class='table table-bordered table-hover'>
        
            <!-- creating our table heading -->
            <tr>
                <th class='w-5-pct'>Id</th>
                <th class='w-20-pct'>Source de bordereau</th>
                <th class='w-10-pct'>Id utilisateur</th>
                <th class='w-10-pct'>Etre validé</th>
                <th class='w-20-pct'>Fichier CERFA</th>
                <th class='w-35-pct text-align-center'>Action</th>
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
                            <button class='btn btn-primary m-r-10px read-one-bordereau-button-tresorier' data-id='` + val.id + `'>
                                <span><i class="bi bi-eye"></i></span> Lire
                            </button>
                            
                           `;
                if(val.etre_valide == null || val.etre_valide == 0 ){
                     read_bordereaux_html+=`
                        <!-- valider bordereau button -->
                        <button class='btn btn-dark valider-bordereau-button-tresorier' data-id='` + val.id_user + `'>
                            <span><i class="bi bi-check"></i></span> Valider
                        </button>
                        `;
                }else{

                    if(val.cerfa == null || val.cerfa == ''){
                        read_bordereaux_html+=
                            `
                            <!-- invalider bordereau button -->
                            <button class='btn btn-warning invalider-bordereau-button-tresorier' data-id='` + val.id + `'>
                                <span><i class="bi bi-arrow-clockwise"></i></span> Invalider
                            </button>
                            <!-- create cerfa button -->
                            <button class='btn btn-success show-cerfa-form-button-tresorier' data-id='` + val.id_user + `'>
                                <span><i class="bi bi-file-check"></i></span> Créer CERFA
                            </button>
                            `;
                    }else{
                        read_bordereaux_html+=
                            `
                            <!-- modify cerfa button -->
                            <button class='btn btn-success show-cerfa-form-button-tresorier' data-id='` + val.id_user + `'>
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
            read_bordereaux_html+="<nav aria-label='search bordereaux pages'><ul class='pagination bordereaux float-left margin-zero padding-bottom-2em'>";
        
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

//add url in function getJSON below
function showBordereauxFirstPageTresorier(){
    var json_url="api/bordereau/read_paging_bordereau.php";
    showBordereauxTresorier(json_url);
}

// function to show list of Demandeurs
function showBordereauxTresorier(json_url){

    // get list of Demandeurs from the API
    $.getJSON(json_url, function(data){
        
        // check if list of bordereaux is empty or not
        if (data.message){
            $('#response').html("<div class='alert alert-danger'>Aucun bordereau trouvé.</div>");
        }else{
            // html for listing Demandeurs
            showBordereauxTemplateTresorier(data, "");
            changePageTitle('Liste des bordereaux');
        }
    }); 
    
}

// display info of bordereau sous forme de tableau
function showOneBordereauTemplateTresorier(data){
    var valide = (data.etre_valide == 0 || data.etre_valide == null) ? "Non" : "Oui";
    var cerfa = (!data.cerfa) ? "Pas encore créé" : data.cerfa;
    var read_one_bordereau_html=`
                    <!-- when clicked, it will show the bordereau list -->
                    <div id='all-bordereaux' class='btn btn-primary float-right m-b-15px all-bordereaux-button-tresorier'>
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
                                    <div class='btn btn-info all-bordereaux-button-tresorier'><span><i class="bi bi-arrow-left-short"></i></span> Retourner</div>
                                </td>
                            `;
 
        if(data.etre_valide == null || data.etre_valide == 0){
            read_one_bordereau_html+=`
                                <td>
                                    <div><button class='btn btn-dark valider-bordereau-button-tresorier' data-id='` + data.id_user + `'>
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
                                    <div><button class='btn btn-warning invalider-bordereau-button-tresorier' data-id='` + data.id + `'>
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
//display button "Tous Bordereaux"
function showAllBordereauxButtonTresorier(){
    $('#content').html(`<!-- when clicked, it will show the bordereaux list -->
                <div id='all-bordereaux' class='btn btn-primary float-right m-b-15px all-bordereaux-button-tresorier'>
                    <span><i class="bi bi-card-list"></i></span> Tous Bordereaux
                </div>`);
}

//function to show cerfa form on both creating and modifying
function showCERFAFormTresorier(adherent_id){
    //function to retrieve date
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var this_year = today.getFullYear();
    today = dd + '/' + mm + '/' + this_year;
    //to get id of bordereau to put on page automatically
    $.getJSON("api/bordereau/read_by_id_user.php?id=" + adherent_id, function(data){
        var html = `
        <div id="pdf" class="pdf" style="background-color:white;color:black;text-align: left;margin:20px 20px;font-family: 'Times New Roman', Times, serif;">
        <div class="container">
            <div class="row">
                <div class="col-2 md-auto" style="margin-bottom: 10px;">
                    <img src="assets/img/cerfa_logo.PNG" alt="cerfa logo" style="width:100%;"> 
                </div> 
                <div class="col-8 md-auto text-center" style="margin-bottom: 20px;margin-top: 30px;">
                    <h4><strong>Reçu dons aux oeuvres</strong></h4>
                    <p>(Articles 200 et 238 bis du Code général des impôts)</p>
                </div>
                <div class="col-2 md-auto text-center" style="margin-bottom: 15px;margin-top: 30px;">
                    <p>Numéro d'ordre du reçu</p>
                    <h4 style="border: 1px solid black; padding: 2px 15px;"><strong>${this_year}-${data.id}</strong></h4>
                </div>
            </div>
        </div>
        <div class="my-auto" style="text-align: center;margin-bottom: 10px;width: 100%;border: black 1px solid;background-color: darkgray;">
            <h4 style="font-size: 16pt;font-weight: bold;">Bénéficiaire des versements</h4>
        </div>
        <div id="div1" class="px-3" style="width: 100%;border: black 1px solid;padding-top: 5px;margin-bottom: 5px;">
            <h5 style="font-size: 14pt;font-weight: bold;">Nom ou dénomination:</h5>
            <h5 class="text-center"><input style="width:500px;text-align: center;border: none; border-bottom: dotted black 1px;" type="text" value="Salles d'Armes de Villers lès Nancy"/></h5>
            <h5 style="font-size: 14pt;font-weight: bold;">Adresse:</h5>
            <h5 class="text-center"><input style="width:500px;text-align: center;border: none; border-bottom: dotted black 1px;" type="text" value="1, rue Rodin - 654800 Villers-lès-Nancy"/></h5>
            <h5 style="font-size: 14pt;font-weight: bold;">Objet:</h5>
            <h5 class="text-center"><input style="width:500px;text-align: center;border: none; border-bottom: dotted black 1px;" type="text" value="Club d'Escrime"/></h5>
            <h5 style="font-size: 14pt;font-weight: bold;">Cochez la case concernée(1) :</h5>
            <p><span class="fill-square bg-dark px-2 mr-1" style="border: black solid 1px; cursor: pointer;"></span>Oeuvre ou organisme d'intérêt général.</p>
            <p><span class="fill-square px-2 mr-1" style="border: black solid 1px;cursor: pointer;"></span>Fondation d'entreprise.</p>
            <p><span class="fill-square px-2 mr-1" style="border: black solid 1px;cursor: pointer;"></span>Association ou fondation reconnue d'utilité publique par décret en date du <input style="width:200px;border: none; border-bottom: dotted black 1px;text-align: center;" type="text"/> publié au Journal Officiel du <input style="width:200px;border: none; border-bottom: dotted black 1px;text-align: center;" type="text"/></p>
            <p><span class="fill-square px-2 mr-1" style="border: black solid 1px; cursor: pointer;"></span>Musée de France</p>
            <p><span class="fill-square px-2 mr-1" style="border: black solid 1px; cursor: pointer;"></span>Association culturelle ou de bienfaisance autorisée à recevoir des dons et legs par décision en date du délivrée par le préfet de <input style="width:350px;border: none; border-bottom: dotted black 1px;text-align: center;" type="text"/></p>
            <p><span class="fill-square px-2 mr-1" style="border: black solid 1px;cursor: pointer;"></span>Etablissement d'enseignment supérieur ou artistique privé, à but non lucratif, agréé par décision en date du <input style="width:200px;border: none; border-bottom: dotted black 1px;text-align: center;" type="text"/></p>
            <p><span class="fill-square px-2 mr-1" style="border: black solid 1px;cursor: pointer;"></span>Association fournissant gratuitement une aide alimentaire ou des soins médicaux à des personnes en difficulté ou favorisant leur logement.</p>
            <p><span class="fill-square px-2 mr-1" style="border: black solid 1px;cursor: pointer;"></span>Organisme ayant pour objet exclusif de participer financièrement à la création d'enptreprises.</p>
            <p><span class="fill-square px-2 mr-1" style="border: black solid 1px;cursor: pointer;"></span>Association située dans le département de la Moselle, du Bas-Rhin ou du Haut-Rhin dont la mission a été reconnue d'utilité publique par arrêté préfectoral en date du <input style="width:200px;border: none; border-bottom: dotted black 1px;text-align: center;" type="text"/></p>
            <p><span class="fill-square px-2 mr-1" style="border: black solid 1px;cursor: pointer;"></span>Etablissement public des cultes reconnu d'Alsace-Moselle.</p>
            <p><span class="fill-square px-2 mr-1" style="border: black solid 1px;cursor: pointer;"></span>Société ou organisme agréé de recherche scientifique ou technique (2)</p>
            <p><span class="fill-square px-2 mr-1" style="border: black solid 1px;cursor: pointer;"></span>Organisme ayant pour activité principale l'organisation de festivals (2)</p>
        </div>
        <div class="my-auto" style="text-align: center;margin-bottom: 10px;width: 100%;border: black 1px solid;background-color: darkgray;">
            <h4 style="font-size: 16pt;font-weight: bold;">Donateur</h4>
        </div>
        `;
        //to get all info of demandeur
        $.getJSON("api/demandeur/read_by_id.php?id=" + adherent_id, function(da){
            html +=`
                <div class="px-3" style="width: 100%;border: black 1px solid;padding-top: 5px;margin-bottom: 10px;">
                <h5 style="font-size: 14pt;"><span style="font-weight: bold;margin-right: 15px;">Nom:</span><input style="width:400px;border: none; border-bottom: dotted black 1px;text-align: center;" type="text" value="${da.nom} ${da.prenom}"/></h5>
                <h5 style="font-size: 14pt;"><span style="font-weight: bold;margin-right: 15px;">Adresse:</span><input style="width:400px;border: none; border-bottom: dotted black 1px;text-align: center;" type="text" value="${da.rue}, ${da.cp} - ${da.ville}"/></h5>
                <p>Code postal  <input style="width:60px;border: none; border-bottom: dotted black 1px;text-align: center;" type="text" value="${da.cp}"/> Commune   <input style="width:200px;border: none; border-bottom: dotted black 1px;text-align: center;" type="text" value="${da.ville}"/></p> 
            </div>`;
             // get data from the api based on data searched by id user to get amount total of all lignes frais
            $.getJSON("api/ligne_frais/read_by_id_user.php?id=" + adherent_id, function(d){
                var cout_trajet;
                var total_par_ligne;
                var montant=0;
                $.each(d.records, function(key, val){
                    //calcul cout trajet and round up to 2 decimal places
                    cout_trajet = Math.round(val.km_valide*0.28* 100)/ 100;
                    //turn values into numbers, avoid 'null' values
                    val.peage_valide = (val.peage_valide == '0' || val.peage_valide == null) ? 0 : val.peage_valide;
                    val.repas_valide = (val.repas_valide == '0' || val.repas_valide == null) ? 0 : val.repas_valide;
                    val.hebergement_valide = (val.hebergement_valide == '0' || val.hebergement_valide == null) ? 0 : val.hebergement_valide;
                    //calcul montant total par ligne
                    total_par_ligne = Math.round((cout_trajet + val.peage_valide + val.repas_valide + val.hebergement_valide)*100)/100;
                    //calul montant total all lignes
                    montant = Math.round((montant+total_par_ligne)*100)/100;
                });
                //add to html
                html+=
                    `
                    <div id="div2" class="px-3" style="width: 100%;border: black 1px solid;padding-top: 5px;margin-bottom: 10px;">
                        <p style="margin-bottom: 15px;">Le bénéficiaire reconnaît avoir reçu au titre des versements ouvrant droit à réduction d'impôt, la somme de:<input style="font-weight: bold;font-size: large; width:150px; border: none; border-bottom: dotted black 1px; text-align: center;" value="${montant} &euro;"/></p>
                        <p style="margin-bottom: 15px;overflow: hidden;display: block;">Somme en toutes lettres: <input style="width:100%;border: none; border-bottom: dotted black 1px;text-align: center;" type="text"/></p>
                        <p style="margin-bottom: 15px;">Date du paiement: <input style="width:400px;border: none; border-bottom: dotted black 1px;text-align: center;" type="text" value="${today}"/></p>
                        <p style="margin-bottom: 15px;">Mode de versement:</p>
                        <p><span class="fill-square bg-dark px-2 mr-1" style="border: black solid 1px; cursor: pointer;"></span>Numéraire</p>
                        <p><span class="fill-square px-2 mr-1" style="border: black solid 1px;cursor: pointer;"></span>Chèque ou virement</p>
                        <p><span class="fill-square px-2 mr-1" style="border: black solid 1px;cursor: pointer;"></span>Autres (3)</p>
                        <div class="row">
                            <div class="col-9"></div>
                            <div class="col-3 text-center">
                                <p>Date et signature</p>
                                <input style="width:200px;text-align: center;border: none; border-bottom: dotted black 1px;" type="text" value="${today}"/>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-9"></div>
                            <div class="col-3 text-center"><input style="width: 100%; height: 80px; border: 1px solid black; margin-bottom: 15px;text-align: center;"/></div>
                        </div>
                    </div>
                    
                    <div class="px-3" style="font-size: 10pt;">
                        <p style="margin-bottom: 3px;">(1)   ou n'indiquez que les renseignements concernant l'organisme</p>
                        <p style="margin-bottom: 3px;">(2)   dons effectués pas les entreprises</p>
                        <p style="margin-bottom: 3px;">(3)   notamment: abandon de revenus ou de produits; frais engagés par les bénévoles, dont ils ne demandent pas le remboursement</p>
                    </div>
                </div>
                    <div class="d-flex justify-content-center controls" style="margin-top: 10px;margin-bottom: 10px;">
                        <button id="send_getPDF_cerfa_tresorier" class="btn btn-primary">Sauvegarder et Télécharger en PDF</button>
                    </div>
                    <div class="d-flex justify-content-center controls" style="margin-bottom: 50px;">
                        <div class='btn btn-info all-bordereaux-button-tresorier'><span><i class="bi bi-arrow-left-short"></i></span> Retourner</div>
                    </div>
                    `;
                $('#content').html(html);
            });
        });
    });
}


