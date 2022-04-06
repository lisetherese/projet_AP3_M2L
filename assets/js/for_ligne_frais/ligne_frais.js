

async function showLignesFraisTemplate(data, keywords){
    
    var read_html=`
        <!-- search lignes_frais form -->
        <form id='search-ligne-frais-form' action='#' method='post'>
        <div class='input-group float-left w-40-pct mb-4'>
 
            <input type='text' value='` + keywords + `' name='keywords' class='form-control ligne-frais-search-keywords' placeholder='Chercher par date ou trajet ou id user...' />
 
            <span class='input-group-btn'>
                <button type='submit' class='btn btn-default' type='button'>
                    <span><i class="bi bi-search"></i></span>
                </button>
            </span>
 
        </div>
        </form>

        <!-- when clicked, it will load all lignes_frais list-->
        <div id='all-ligne-frais' class='btn btn-primary float-right m-b-15px all-ligne-frais-button'>
            <span><i class="bi bi-card-list"></i></span> Toutes Lignes Frais
        </div>

        <!-- when clicked, it will load the create ligne frais form -->
        <div id='create-ligne-frais' class='btn btn-primary float-right m-b-15px create-ligne-frais-button mr-2'>
            <span><i class="bi bi-plus-lg"></i></span> Créer Ligne Frais
        </div>
        <!-- start table display lignes_frais-->
        <table class='table table-bordered table-hover'>
        
            <!-- creating our table heading -->
            <tr>
                <th class='w-5-pct'>Id</th>
                <th class='w-10-pct'>Date</th>
                <th class='w-14-pct'>Trajet</th>
                <th class='w-8-pct'>Kilomètre</th>
                <th class='w-8-pct'>Kilomètre validé</th>
                <th class='w-5-pct'>Id utilisateur</th>
                <th class='w-10-pct'>Etre validé</th>
                <th class='w-40-pct text-align-center'>Action</th>
            </tr>`;
        
            $.each(data.records, async function(key, val) {
                
                //change display variable
                var valide = (val.etre_valide == 0 || val.etre_valide == null) ? "Non" : "Oui" ;
                // creating new table row per record
                read_html+= `
                    <tr>
            
                        <td>` + val.id + `</td>
                        <td>` + val.date_ligne_frais + `</td>
                        <td>` + val.trajet + `</td>
                        <td>` + val.km + `</td>
                        <td>` + val.km_valide + `</td>
                        <td>` + val.id_user + `</td>
                        <td>` + valide + `</td>
            
                        <!-- 'action' buttons -->
                        <td>
                            <!-- read ligne frais button -->
                            <button class='btn btn-primary m-r-10px read-one-ligne-frais-button' data-id='` + val.id + `'>
                                <span><i class="bi bi-eye"></i></span> Lire
                            </button>
                            <div class="d-inline  m-r-10px w-25 selectButton" id="${val.id}" data-id="${val.id_user}" data-valide="${valide}">
                                <button class='btn btn-primary'>
                                    <span><i class="bi bi-info-circle"></i></span> Actions
                                </button>
                            </div>
                            
                            `;
                
                
            });    
           
        // end table
        read_html+=`</td></tr></table>`;
        // pagination
        if(data.paging){
            read_html+="<nav aria-label='search ligne frais pages'><ul class='pagination lignes float-left margin-zero padding-bottom-2em'>";
        
                // first page
                if(data.paging.first!=""){
                    read_html+="<li class='page-item'><a class='page-link' data-page='" + data.paging.first + "'>Première Page</a></li>";
                }
        
                // loop through pages
                $.each(data.paging.pages, function(key, val){
                    var active_page=val.current_page=="yes" ? "active" : "";
                    read_html+="<li class='page-item " + active_page + "'><a class='page-link' data-page='" + val.url + "'>" + val.page + "</a></li>";
                });
        
                // last page
                if(data.paging.last!=""){
                    read_html+="<li class='page-item'><a class='page-link' data-page='" + data.paging.last + "'>Dernière Page</a></li>";
                }
            read_html+="</ul></nav>";
        }

        // inject this piece of html to our page
        $("#content").html(read_html);

        

}



function showLignesFraisFirstPage(){
    var json_url="api/ligne_frais/read_paging_lignes.php";
    showLignesFrais(json_url);
}


async function showLignesFrais(json_url){

    const data = await $.getJSON(json_url); 
    if (data.message){
        $('#response').html("<div class='alert alert-danger'>Aucune ligne frais trouvée.</div>");
        addLigneFraisButton();
    }else{
        
        // html for listing lignes_frais
        showLignesFraisTemplate(data, "");
        changePageTitle('Liste des lignes frais');
    }
       
}

function createLigneFraisForm(){
    
    var html = `
        <form id='create-ligne-frais-form' enctype="multipart/form-data">
        <div class='table-responsive text-nowrap'>
        <table class='table table-hover table-bordered'>
            <tr>
                <td class='w-30-pct'>Id utilisateur</td>
                <td class='w-70-pct'><input type="number" class="form-control" name="id_user" id="id_user" required/></td>
            </tr>
            <tr>
                <td>Date</td>
                <td><input type="date" class="form-control" name="date_ligne_frais" id="date_ligne_frais" required/></td>
            </tr>

            <tr>
                <td>Trajet</td>
                <td><input type="text" class="form-control" name="trajet" id="trajet" placeholder="ex: paris-lyon" required/></td>
            </tr>
            <tr>
                <td>Kilomètre</td>
                <td><input type="number" class="form-control" name="km" id="km" placeholder="ex: 14.7" step="0.1" required/></td>
            </tr>
            <tr>
                <td>Type de trajet</td>
                <td>
                    <select class="form-control" name="type_trajet" id="type_trajet" required>
                        <option value="1" selected>Aller simple</option>
                        <option value="2">Aller retour</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td></td>
                <td>
                    <button id='ajout-peage' type='button' class='btn btn-success'><span><i class="bi bi-plus"></i></span> Ajouter Péage</button>
                </td>
            </tr>
          
            <tr class='div-peage'>
                <td>Cout de péage</td>
                <td><input type="number" class="form-control" name="cout_peage" id="cout_peage" placeholder='ex: 5.7' step='0.1'/></td>
            </tr>
            <tr class='div-peage'>
                <td>Multiplication</td>
                <td>
                    <select class="form-control" name="multip_peage" id="multip_peage">
                        <option value="1" selected>Une fois</option>
                        <option value="2">Deux fois</option>
                    </select>
                </td>
            </tr>

            <tr class='div-peage'>
                <td><label for='peage_justificatif'>Péage justificatif</label></td>
                <td>
                    <input type="hidden" name="MAX_FILE_SIZE" value="2400000" />
                    <input type="file" name="peage_justificatif" class="form-control" accept="image/*,application/pdf" id="p_justificatif"/>
                </td>
            </tr>

            <tr>
                <td></td>
                <td>
                    <button id='ajout-repas' type='button' class='btn btn-success'><span><i class="bi bi-plus"></i></span> Ajouter Repas</button>
                </td>
            </tr>
          
            <tr class='div-repas'>
                <td>Cout de repas</td>
                <td><input type="number" class="form-control" name="cout_repas" id="cout_repas" placeholder='ex: 5.7' step='0.1'/></td>
            </tr>
            <tr class='div-repas'>
                <td>Multiplication</td>
                <td><input type="number" class="form-control" name="multip_repas" id="multip_repas" placeholder='ex: 2' step='1'/></td>
            </tr>

            <tr class='div-repas'>
                <td><label for='repas_justificatif'>Repas justificatif</label></td>
                <td>
                    <input type="hidden" name="MAX_FILE_SIZE" value="2400000" />
                    <input type="file" name="repas_justificatif" class="form-control" accept="image/*,application/pdf" id="r_justificatif"/>
                </td>
            </tr>

            <tr>
                <td></td>
                <td>
                    <button id='ajout-heberge' type='button' class='btn btn-success'><span><i class="bi bi-plus"></i></span> Ajouter Hébergement</button>
                </td>
            </tr>
          
            <tr class='div-hebergement'>
                <td>Cout de hébergement</td>
                <td><input type="number" class="form-control" name="cout_hebergement" id="cout_hebergement" placeholder='ex: 5.7' step='0.1'/></td>
            </tr>
            <tr class='div-hebergement'>
                <td>Multiplication</td>
                <td><input type="number" class="form-control" name="multip_heberge" id="multip_heberge" placeholder='ex: 2' step='1'/></td>
            </tr>

            <tr class='div-hebergement'>
                <td><label for='justificatif'>Hébergement justificatif</label></td>
                <td>
                    <input type="hidden" name="MAX_FILE_SIZE" value="2400000" />
                    <input type="file" name="justificatif" class="form-control" accept="image/*,application/pdf" id="h_justificatif"/>
                </td>
            </tr>
            
            <tr>
                <td>Motif</td>
                <td>
                    <select name='id_motif' class='form-control' id="id_motif">`;

    return html;
}


function deleteFilesById(ligne_id){
    // read ligne frais record based on given ID
    $.getJSON("api/ligne_frais/read_one_ligne_frais.php?id=" + ligne_id, function(data){
        var formData = new FormData();
        formData.append("id_user", data.id_user);
        if(data.peage_justificatif){
            formData.append("peage_jus", data.peage_justificatif);
        }
        if(data.repas_justificatif){
            formData.append("repas_jus", data.repas_justificatif);
        }
        if(data.justificatif){
            formData.append("heberge_jus", data.justificatif);
        }
        var xhttp = new XMLHttpRequest();
        // Set POST method and ajax file path
       xhttp.open("POST", "api/ligne_frais/delete_files.php", true);
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

function updateOneLigneFrais(data){
    if((data.km_valide - data.km) >= 1){
        var type_trajet = `value="2" selected`;
        var trajet_libelle = 'Aller retour';
        var autre =  `value="1"`;
        var autre_libelle = 'Aller simple';
    }else{
        var type_trajet = `value="1" selected`;
        var trajet_libelle = 'Aller simple';
        var autre =  `value="2"`;
        var autre_libelle = 'Aller retour';
    }
    
    var html = `
    <form id='update-ligne-frais-form' enctype="multipart/form-data">
    <div class='table-responsive text-nowrap'>
    <table class='table table-hover table-bordered'>
        <tr>
            <td class='w-30-pct'>Date</td>
            <td class='w-70-pct'><input type="date" class="form-control" name="date_ligne_frais" id="date_ligne_frais" value="${data.date_ligne_frais}" required/>
                <input type="text" class="form-control" name="id" id="ligne-frais_id" value="${data.id}" hidden/>
            </td>
        </tr>
        
        <tr>
            <td>Trajet</td>
            <td><input type="text" class="form-control" name="trajet" id="trajet" value="${data.trajet}" required/></td>
        </tr>
        <tr>
            <td>Kilomètre</td>
            <td><input type="number" class="form-control" name="km" id="km" value="${data.km}" step="0.1" required/></td>
        </tr>
        <tr>
            <td>Type de trajet</td>
            <td>
                <select class="form-control" name="type_trajet" id="type_trajet" required>
                    <option ${type_trajet}>${trajet_libelle}</option>
                    <option ${autre}>${autre_libelle}</option>
                </select>
            </td>
        </tr>`;
        if(data.cout_peage){
            if((data.peage_valide - data.cout_peage) >= 1){
                var type_peage = `value="2" selected`;
                var peage_libelle = 'Deux fois';
                var autre_p =  `value="1"`;
                var autre_p_libelle = 'Une fois';
            }else{
                var type_peage = `value="1" selected`;
                var peage_libelle = 'Une fois';
                var autre_p =  `value="2"`;
                var autre_p_libelle = 'Deux fois';
            }

            html += `
            <tr class='div-peage'>
                <td>Cout de péage</td>
                <td><input type="number" class="form-control" name="cout_peage" id="cout_peage" value="${data.cout_peage}" step='0.1'/></td>
            </tr>

            <tr class='div-peage'>
                <td>Multiplication</td>
                <td>
                    <select class="form-control" name="multip_peage" id="multip_peage">
                        <option ${type_peage}>${peage_libelle}</option>
                        <option ${autre_p}>${autre_p_libelle}</option>
                    </select>
                </td>
            </tr>

            <tr class='div-peage'>
                <td><label for='peage_justificatif'>Péage justificatif</label></td>
                <td>
                    <input type="hidden" name="peage_justificatif" id="p_jus" value="${data.peage_justificatif}" />
                    <input type="hidden" name="MAX_FILE_SIZE" value="2400000" />
                    Changez le fichier ancien <a href="assets/files/ligne_frais/user_id_${data.id_user}/${data.peage_justificatif}" target="_blank">` + data.peage_justificatif + `</a> si besoin
                    <input type="file" name="peage_justificatif" class="form-control" accept="image/*,application/pdf" id="p_justificatif"/>
                </td>
            </tr>
            `;
        }else{
            html +=`
            <tr>
                <td></td>
                <td>
                    <button id='ajout-peage' type='button' class='btn btn-success'><span><i class="bi bi-plus"></i></span> Ajouter Péage</button>
                </td>
            </tr>
            <tr class='div-peage'>
                <td>Cout de péage</td>
                <td><input type="number" class="form-control" name="cout_peage" id="cout_peage" placeholder='ex: 5.7' step='0.1'/></td>
            </tr>
            <tr class='div-peage'>
                <td>Multiplication</td>
                <td>
                    <select class="form-control" name="multip_peage" id="multip_peage">
                        <option value="1" selected>Une fois</option>
                        <option value="2">Deux fois</option>
                    </select>
                </td>
            </tr>

            <tr class='div-peage'>
                <td><label for='peage_justificatif'>Péage justificatif</label></td>
                <td>
                    <input type="hidden" name="MAX_FILE_SIZE" value="2400000" />
                    <input type="file" name="peage_justificatif" class="form-control" accept="image/*,application/pdf" id="p_justificatif"/>
                </td>
            </tr>
            `;
        }
        if(data.cout_repas){
            var multip = Math.round(data.repas_valide/data.cout_repas);
            html += `
            <tr class='div-repas'>
                <td>Cout de repas</td>
                <td><input type="number" class="form-control" name="cout_repas" id="cout_repas" value='${data.cout_repas}' step='0.1'/></td>
            </tr>
            <tr class='div-repas'>
                <td>Multiplication</td>
                <td><input type="number" class="form-control" name="multip_repas" id="multip_repas" value='${multip}' step='1'/></td>
            </tr>

            <tr class='div-repas'>
                <td><label for='repas_justificatif'>Repas justificatif</label></td>
                <td>
                    <input type="hidden" name="repas_justificatif" id="r_jus" value="${data.repas_justificatif}" />
                    <input type="hidden" name="MAX_FILE_SIZE" value="2400000" />
                    Changez le fichier ancien <a href="assets/files/ligne_frais/user_id_${data.id_user}/${data.repas_justificatif}" target="_blank">` + data.repas_justificatif + `</a> si besoin
                    <input type="file" name="repas_justificatif" class="form-control" accept="image/*,application/pdf" id="r_justificatif"/>
                </td>
            </tr>
            `;
        }else{
            html +=`
            <tr>
                <td></td>
                <td>
                    <button id='ajout-repas' type='button' class='btn btn-success'><span><i class="bi bi-plus"></i></span> Ajouter Repas</button>
                </td>
            </tr>
            <tr class='div-repas'>
                <td>Cout de repas</td>
                <td><input type="number" class="form-control" name="cout_repas" id="cout_repas" placeholder='ex: 5.7' step='0.1'/></td>
            </tr>
            <tr class='div-repas'>
                <td>Multiplication</td>
                <td><input type="number" class="form-control" name="multip_repas" id="multip_repas" placeholder='ex: 2' step='1'/></td>
            </tr>

            <tr class='div-repas'>
                <td><label for='repas_justificatif'>Repas justificatif</label></td>
                <td>
                    <input type="hidden" name="MAX_FILE_SIZE" value="2400000" />
                    <input type="file" name="repas_justificatif" class="form-control" accept="image/*,application/pdf" id="r_justificatif"/>
                </td>
            </tr>
            `;
        }
        if(data.cout_hebergement){
            var multiple = data.hebergement_valide/data.cout_hebergement;
            html += `
            <tr class='div-hebergement'>
                <td>Cout de hébergement</td>
                <td><input type="number" class="form-control" name="cout_hebergement" id="cout_hebergement" value='${data.cout_hebergement}' step='0.1'/></td>
            </tr>
            <tr class='div-hebergement'>
                <td>Multiplication</td>
                <td><input type="number" class="form-control" name="multip_heberge" id="multip_heberge" value="${multiple}" step='1'/></td>
            </tr>

            <tr class='div-hebergement'>
                <td><label for='justificatif'>Hébergement justificatif</label></td>
                <td>
                    <input type="hidden" name="justificatif" id="h_jus" value="${data.justificatif}" />
                    <input type="hidden" name="MAX_FILE_SIZE" value="2400000" />
                    Changez le fichier ancien <a href="assets/files/ligne_frais/user_id_${data.id_user}/${data.justificatif}" target="_blank">` + data.justificatif + `</a> si besoin
                    <input type="file" name="justificatif" class="form-control" accept="image/*,application/pdf" id="h_justificatif"/>
                </td>
            </tr>
            `;
        }else{
            html +=`
            <tr>
                <td></td>
                <td>
                    <button id='ajout-heberge' type='button' class='btn btn-success'><span><i class="bi bi-plus"></i></span> Ajouter Hébergement</button>
                </td>
            </tr>
            <tr class='div-hebergement'>
                <td>Cout de hébergement</td>
                <td><input type="number" class="form-control" name="cout_hebergement" id="cout_hebergement" placeholder='ex: 5.7' step='0.1'/></td>
            </tr>
            <tr class='div-hebergement'>
                <td>Multiplication</td>
                <td><input type="number" class="form-control" name="multip_heberge" id="multip_heberge" placeholder='ex: 2' step='1'/></td>
            </tr>

            <tr class='div-hebergement'>
                <td><label for='justificatif'>Hébergement justificatif</label></td>
                <td>
                    <input type="hidden" name="MAX_FILE_SIZE" value="2400000" />
                    <input type="file" name="justificatif" class="form-control" accept="image/*,application/pdf" id="h_justificatif"/>
                </td>
            </tr>
            <tr>
            `;
        }

        html+=
        `
        <tr>
            <td>Id utilisateur</td>
            <td><input type="number" class="form-control" name="id_user" id="id_user" value="${data.id_user}" required/></td>
        </tr>
        <tr>
            <td>Motif</td>
            <td>
                <select name='id_motif' id="id_motif" class='form-control'>`;

        $.getJSON("api/motif/read.php", function(resultat){
            $.each(resultat.records, function(key, val){
                
                // pre-select option is category id is the same
                if(val.id==data.id_motif){ html+=`<option value='` + val.id + `' selected>` + val.libelle + `</option>`; }
     
                else{ html+=`<option value='` + val.id + `'>` + val.libelle + `</option>`; }
            });

            html+=`</select>
                    </td>
                </tr>

                <tr>
                    <td><div class='btn btn-info all-ligne-frais-button'><span><i class="bi bi-arrow-left-short"></i></span> Retourner</div></td>
                    <td><button type='submit' class='btn btn-primary'><span><i class="bi bi-save"></i></span> Sauvegarder</button></td>
                </tr>
                </table>
                </div>
            </form>
            `;

            $('#content').html(html);
            if(!data.cout_peage){$('.div-peage').hide();}
            if(!data.cout_repas){$('.div-repas').hide();}
            if(!data.cout_hebergement){$('.div-hebergement').hide();}
        });


}

function showOneLigneFraisTemplate(data){
    var valide = (data.etre_valide == 0 || data.etre_valide == null) ? "Non" : "Oui";
    var id_user = data.id_user;
    var read_one_ligne_frais_html=`
                        <!-- when clicked, it will show the lignes_frais list -->
                        <div id='all-ligne-frais' class='btn btn-primary float-right m-b-15px all-ligne-frais-button'>
                            <span><i class="bi bi-card-list"></i></span> Toutes lignes frais
                        </div>
                        <div class='table-responsive text-nowrap'>
                        <table class='table table-hover table-bordered'>
                            <tr>
                                <td class='w-30-pct'>Id Ligne Frais</td>
                                <td class='w-70-pct'>` + data.id + `</td>
                            </tr>
                            <tr>
                                <td>Date</td>
                                <td>` + data.date_ligne_frais + `</td>
                            </tr>
                            <tr>
                                <td>Trajet</td>
                                <td>` + data.trajet + `</td>
                            </tr>
                            <tr>
                                <td>Kilomètre d'un sens</td>
                                <td>` + data.km + `</td>
                            </tr>
                            <tr>
                                <td>Kilomètre Validé</td>
                                <td>` + data.km_valide + `</td>
                            </tr>`;
    if(data.cout_peage){read_one_ligne_frais_html+=
                            `
                            <tr>
                                <td>Cout péage</td>
                                <td>` + data.cout_peage + `</td>
                            </tr>
                            <tr>
                                <td>Péage Validé</td>
                                <td>` + data.peage_valide + `</td>
                            </tr>
                            <tr>
                                <td>Péage justificatif</td>
                                <td><a href="assets/files/ligne_frais/user_id_${data.id_user}/${data.peage_justificatif}" target="_blank">` + data.peage_justificatif + `</a></td>
                            </tr>`;
    }
    if(data.cout_repas){read_one_ligne_frais_html+=
                            `
                            <tr>
                                <td>Cout repas</td>
                                <td>` + data.cout_repas + `</td>
                            </tr>
                            <tr>
                                <td>Repas Validé</td>
                                <td>` + data.repas_valide + `</td>
                            </tr>
                            <tr>
                                <td>Repas justificatif</td>
                                <td><a href="assets/files/ligne_frais/user_id_${data.id_user}/${data.repas_justificatif}" target="_blank">` + data.repas_justificatif + `</a></td>
                            </tr>`;
    }
    if(data.cout_hebergement){read_one_ligne_frais_html+=
                            `
                            <tr>
                                <td>Cout hébergement</td>
                                <td>` + data.cout_hebergement + `</td>
                            </tr>
                            <tr>
                                <td>Hébergement Validé</td>
                                <td>` + data.hebergement_valide + `</td>
                            </tr>
                            <tr>
                                <td>Hébergement justificatif</td>
                                <td><a href="assets/files/ligne_frais/user_id_${data.id_user}/${data.justificatif}" target="_blank">` + data.justificatif + `</a></td>
                            </tr>`;
    }
        read_one_ligne_frais_html+=
                            `
                            <tr>
                                <td>Id utilisateur</td>
                                <td>` + data.id_user + `</td>
                            </tr>`;
                            
    $.getJSON("api/user/read_one_user.php?id=" + data.id_user, function(result){
        read_one_ligne_frais_html+=`<tr>
                                    <td>Email d'utilisateur</td>
                                    <td>` + result.email + `</td>
                                </tr>
                                <tr>
                                    <td>Id motif</td>
                                    <td>` + data.id_motif + `</td>
                                </tr>`;
        $.getJSON("api/motif/read_one_motif.php?id=" + data.id_motif, function(resultat){
            read_one_ligne_frais_html+=`<tr>
                                        <td>Libelle du motif</td>
                                        <td>` + resultat.libelle + `</td>
                                    </tr>
                                    
                                   `;
                                    
            if(valide == 'Non'){
                read_one_ligne_frais_html+=`
                                    <tr>
                                        <td>
                                            <div class='btn btn-info all-ligne-frais-button'><span><i class="bi bi-arrow-left-short"></i></span> Retourner</div>                                            
                                        </td>
                                        <td><div>
                                                <button class='btn btn-info m-r-10px update-ligne-frais-button' data-id='` + data.id + `'>
                                                    <span><i class="bi bi-pencil-square"></i></span> Modifier
                                                </button>
                                                <button class='btn btn-dark valider-ligne-frais-button' data-id='` + data.id + `'>
                                                    <span><i class="bi bi-check"></i></span> Valider Ligne Frais
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                                </div>`;
                // inject html to 'page-content' of our app
                $("#content").html(read_one_ligne_frais_html);
            }else{
                $.getJSON("api/bordereau/read_by_id_user.php?id=" + id_user, function(da){
                    if( da.message || (da.etre_valide == null || da.etre_valide == 0)){
                        read_one_ligne_frais_html+=`
                                    <tr>
                                        <td>
                                            <div class='btn btn-info all-ligne-frais-button'><span><i class="bi bi-arrow-left-short"></i></span> Retourner</div>
                                        </td>
                                        <td>
                                            <div><button class='btn btn-warning invalider-ligne-frais-button' data-id='` + data.id + `'>
                                            <span><i class="bi bi-arrow-clockwise"></i></span> Invalider Ligne Frais</button></div>
                                        </td>
                                    </tr>
                                </table>
                                </div>
                                `;
                        // inject html to 'page-content' of our app
                        $("#content").html(read_one_ligne_frais_html);
                    }else{
                        read_one_ligne_frais_html+=`
                                    <tr>
                                        <td>
                                            <div class='btn btn-info all-ligne-frais-button'><span><i class="bi bi-arrow-left-short"></i></span> Retourner</div>
                                        </td>
                                        <td> </td>
                                    </tr>
                                </table>
                                </div>
                                `;
                         // inject html to 'page-content' of our app
                         $("#content").html(read_one_ligne_frais_html);
                    }
                
                });
            }
                         
        });
    });
   
 
}

function showAllLignesFraisButton(){
    $('#content').html(`<!-- when clicked, it will show the lignes_frais list -->
                <div id='all-ligne-frais' class='btn btn-primary float-right m-b-15px all-ligne-frais-button'>
                    <span><i class="bi bi-card-list"></i></span> Toutes Lignes Frais
                </div>`);
}
function addLigneFraisButton(){
    $('#content').html(`<!-- when clicked, it will load the create ligne frais form -->
                        <div id='create-ligne-frais' class='btn btn-primary float-right m-b-15px create-ligne-frais-button mr-2'>
                            <span><i class="bi bi-plus-lg"></i></span> Créer Ligne Frais
                        </div>`);
}






