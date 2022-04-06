
function showLiguesTemplate(data, keywords){
    var read_Ligues_html=`
        <!-- search Ligues form -->
        <form id='search-ligue-form' action='#' method='post'>
        <div class='input-group float-left w-40-pct mb-4'>
 
            <input type='text' value='` + keywords + `' name='keywords' class='form-control ligue-search-keywords' placeholder='Chercher les ligues par nom ou sigle ou président...' />
 
            <span class='input-group-btn'>
                <button type='submit' class='btn btn-default' type='button'>
                    <span><i class="bi bi-search"></i></span>
                </button>
            </span>
 
        </div>
        </form>

        <!-- when clicked, it will load all Ligues list-->
        <div id='all-Ligues' class='btn btn-primary float-right m-b-15px all-ligues-button'>
            <span><i class="bi bi-card-list"></i></span> Toutes Ligues
        </div>

        <!-- when clicked, it will load the create Ligue form -->
        <div id='create-ligue' class='btn btn-primary float-right m-b-15px create-ligue-button mr-2'>
            <span><i class="bi bi-plus-lg"></i></span> Créer Ligue
        </div>
        <!-- start table display Ligues-->
        <table class='table table-bordered table-hover'>
        
            <!-- creating our table heading -->
            <tr>
                <th class='w-5-pct'>Id</th>
                <th class='w-10-pct'>Nom</th>
                <th class='w-5-pct'>Sigle</th>
                <th class='w-10-pct'>Président</th>
                <th class='w-15-pct'>Nombre de réservation hors amphi</th>
                <th class='w-10-pct'>Déjà réservé amphi</th>
                <th class='w-10-pct'>Déjà réservé convivialité</th>
                <th class='w-35-pct text-align-center'>Action</th>
            </tr>`;
        
            // loop through returned list of data
            $.each(data.records, function(key, val) {
                var am = val.reser_am == '0' ? "Non" : "Oui";
                var con = val.reser_con == '0' ? "Non" : "Oui";
                // creating new table row per record
                read_Ligues_html+=`
                    <tr>
            
                        <td>` + val.id + `</td>
                        <td>` + val.nom + `</td>
                        <td>` + val.sigle + `</td>
                        <td>` + val.president + `</td>
                        <td>` + val.reser_hors + `</td>
                        <td>` + am + `</td>
                        <td>` + con + `</td>
            
                        <!-- 'action' buttons -->
                        <td>
                            <!-- read Ligue button -->
                            <button class='btn btn-primary m-r-10px read-one-ligue-button' data-id='` + val.id + `'>
                                <span><i class="bi bi-eye"></i></span> Lire
                            </button>
            
                            <!-- edit button -->
                            <button class='btn btn-info m-r-10px update-ligue-button' data-id='` + val.id + `'>
                                <span><i class="bi bi-pencil-square"></i></span> Modifier
                            </button>
            
                            <!-- delete button -->
                            <button class='btn btn-danger delete-ligue-button' data-id='` + val.id + `'>
                                <span><i class="bi bi-x-lg"></i></span> Supprimer
                            </button>
                        </td>
            
                    </tr>`;
            });
        
        // end table
        read_Ligues_html+=`</table>`;
        // pagination
        if(data.paging){
            read_Ligues_html+="<nav aria-label='search ligues pages'><ul class='pagination ligues float-left margin-zero padding-bottom-2em'>";
        
                // first page
                if(data.paging.first!=""){
                    read_Ligues_html+="<li class='page-item'><a class='page-link' data-page='" + data.paging.first + "'>Première Page</a></li>";
                }
        
                // loop through pages
                $.each(data.paging.pages, function(key, val){
                    var active_page=val.current_page=="yes" ? "active" : "";
                    read_Ligues_html+="<li class='page-item " + active_page + "'><a class='page-link' data-page='" + val.url + "'>" + val.page + "</a></li>";
                });
        
                // last page
                if(data.paging.last!=""){
                    read_Ligues_html+="<li class='page-item'><a class='page-link' data-page='" + data.paging.last + "'>Dernière Page</a></li>";
                }
            read_Ligues_html+="</ul></nav>";
        }

        // inject this piece of html to our page
        $("#content").html(read_Ligues_html);

       
}

function showLiguesFirstPage(){
    var json_url="api/ligue/read_paging_ligues.php";
    showLigues(json_url);
}

// function to show list of Ligues
function showLigues(json_url){

    // get list of Ligues from the API
    $.getJSON(json_url, function(data){
        // check if list of Ligues is empty or not
        if (data.message){$('#response').html("<div class='alert alert-danger'>${data.message}.</div>");}else{
        // html for listing Ligues
        showLiguesTemplate(data, "");
        }
        
    }); 
    
}

function createLigue(){
    
    var html = `
        <form id='create-ligue-form'>
        <div class='table-responsive text-nowrap'>
        <table class='table table-hover table-bordered'>
            <tr>
                <td class='w-30-pct'>Nom</td>
                <td class='w-70-pct'><input type="text" class="form-control" name="nom" id="nom" required/></td>
            </tr>

            <tr>
                <td>Sigle</td>
                <td><input type="text" class="form-control" name="sigle" id="sigle" required/></td>
            </tr>
            <tr>
                <td>Président</td>
                <td><input type="text" class="form-control" name="president" id="president" required/></td>
            </tr>
            <tr>
                <td>Nombre de réservation hors amphi</td>
                <td><input type="number" class="form-control" name="reser_hors" id="reser_hors" min="1" max="6" required/></td>
            </tr>

            <tr>
                <td>Déjà réservé amphi</td>
                <td>
                    <div class="form-check form-check-inline">
                        <input type="radio" class="form-check-input" name="reser_am" id="reser_am1" value="0" checked/>
                        <label class="form-check-label" for="reser_am1">Non</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input type="radio" class="form-check-input" name="reser_am" id="reser_am2" value="1"/>
                        <label class="form-check-label" for="reser_am2">Oui</label>
                    </div>
                </td>
            </tr>

            <tr>
                <td>Déjà réservé convivialité</td>
                <td>
                    <div class="form-check form-check-inline">
                        <input type="radio" class="form-check-input" name="reser_con" id="reser_con1" value="0" checked/>
                        <label class="form-check-label" for="droit_reservation1">Non</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input type="radio" class="form-check-input" name="reser_con" id="reser_con2" value="1"/>
                        <label class="form-check-label" for="reser_con2">Oui</label>
                    </div>
                </td>
            </tr>
            <tr>
                <td><div class='btn btn-info all-ligues-button'><span><i class="bi bi-arrow-left-short"></i></span> Retourner</div></td>
                <td><button type='submit' class='btn btn-primary'><span><i class="bi bi-plus"></i></span> Créer</button></td>
            </tr>
            </table>
            </div>
        </form>
        `;

    $('#content').html(html);
}

function updateOneLigue(data){
    var label1 = data.reser_am == '1' ? "Oui" : "Non";

    var label2 = (label1 == "Oui") ? "Non" : "Oui";

    var label3 = data.reser_con == '1' ? "Oui" : "Non";

    var label4 = (label3 == "Oui") ? "Non" : "Oui";

    var result1 = data.reser_am == '1' ? "0" : "1";

    var result2 = data.reser_con == '1' ? "0" : "1";

    var html = `
    <form id='update-ligue-form'>
    <div class='table-responsive text-nowrap'>
    <table class='table table-hover table-bordered'>
        <tr>
            <td class='w-30-pct'>Nom</td>
            <td class='w-70-pct'><input type="text" class="form-control" name="nom" id="nom" value="${data.nom}" required/></td>
        </tr>
        
        <tr>
            <td></td>
            <td><input type="text" class="form-control" name="id" id="ligue_id" value="${data.id}" hidden/></td>
        </tr>
        <tr>
            <td>Sigle</td>
            <td><input type="text" class="form-control" name="sigle" id="sigle" value="${data.sigle}" required/></td>
        </tr>
        <tr>
            <td>Président</td>
            <td><input type="text" class="form-control" name="president" id="president" value="${data.president}" required/></td>
        </tr>
        <tr>
            <td>Nombre de réservation hors amphi</td>
            <td><input type="number" class="form-control" name="reser_hors" id="reser_hors" min="1" max="6" value="${data.reser_hors}" required/></td>
        </tr>

        <tr>
            <td>Déjà réservé amphi</td>
            <td>
                <div class="form-check form-check-inline">
                    <input type="radio" class="form-check-input" name="reser_am" id="reser_am1" value="${data.reser_am}" checked/>
                    <label class="form-check-label" for="reser_am1">${label1}</label>
                </div>
                <div class="form-check form-check-inline">
                    <input type="radio" class="form-check-input" name="reser_am" id="reser_am2" value="${result1}"/>
                    <label class="form-check-label" for="reser_am2">${label2}</label>
                </div>
            </td>
        </tr>

        <tr>
            <td>Déjà réservé convivialité</td>
            <td>
                <div class="form-check form-check-inline">
                    <input type="radio" class="form-check-input" name="reser_con" id="reser_con1" value="${data.reser_con}" checked/>
                    <label class="form-check-label" for="reser_con1">${label3}</label>
                </div>
                <div class="form-check form-check-inline">
                    <input type="radio" class="form-check-input" name="reser_con" id="reser_con2" value="${result2}"/>
                    <label class="form-check-label" for="reser_con2">${label4}</label>
                </div>
            </td>
        </tr>

        <tr>
            <td><div class='btn btn-info all-ligues-button'><span><i class="bi bi-arrow-left-short"></i></span> Retourner</div></td>
            <td><button type='submit' class='btn btn-primary'><span><i class="bi bi-save"></i></span> Sauvegarder</button></td>
        </tr>
        </table>
        </div>
    </form>
    `;

    $('#content').html(html);

}

function showOneLigueTemplate(data){
    var amphi = data.reser_am == '0' ? "Non" : "Oui"
    var convi = data.reser_con == '0' ? "Non" : "Oui"
    var read_one_ligue_html=`
                        <!-- when clicked, it will show the Ligues list -->
                        <div id='all-ligues' class='btn btn-primary float-right m-b-15px all-ligues-button'>
                            <span><i class="bi bi-card-list"></i></span> Toutes Ligues
                        </div>
                        <div class='table-responsive text-nowrap'>
                        <table class='table table-hover table-bordered'>
                            <tr>
                                <td class='w-30-pct'>Id Ligue</td>
                                <td class='w-70-pct'>` + data.id + `</td>
                            </tr>
                            <tr>
                                <td>Nom</td>
                                <td>` + data.nom + `</td>
                            </tr>
                            <tr>
                                <td>Sigle</td>
                                <td>` + data.sigle + `</td>
                            </tr>
                            <tr>
                                <td>President</td>
                                <td>` + data.president + `</td>
                            </tr>
                            <tr>
                                <td>Nombre de reservations hors amphi</td>
                                <td>` + data.reser_hors + `</td>
                            </tr>
                            <tr>
                                <td>Déjà réservé amphi</td>
                                <td>` + amphi + `</td>
                            </tr>
                            <tr>
                                <td>Déjà réservé convivialité</td>
                                <td>` + convi + `</td>
                            </tr>
                        </table>
                        </div>`;
            // inject html to 'page-content' of our app
            $("#content").html(read_one_ligue_html);
 
}

function showAllLiguesButton(){
    $('#content').html(`<!-- when clicked, it will show the Ligues list -->
                <div id='all-ligues' class='btn btn-primary float-right m-b-15px all-ligues-button'>
                    <span><i class="bi bi-card-list"></i></span> Toutes Ligues
                </div>`);
}



