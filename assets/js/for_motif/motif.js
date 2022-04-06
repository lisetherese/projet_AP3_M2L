
function showMotifsTemplate(data, keywords){
    var read_Motifs_html=`
        <!-- search Motifs form -->
        <form id='search-motif-form' action='#' method='post'>
        <div class='input-group float-left w-40-pct mb-4'>
 
            <input type='text' value='` + keywords + `' name='keywords' class='form-control motif-search-keywords' placeholder='Chercher les motifs par libelle' />
 
            <span class='input-group-btn'>
                <button type='submit' class='btn btn-default' type='button'>
                    <span><i class="bi bi-search"></i></span>
                </button>
            </span>
 
        </div>
        </form>

        <!-- when clicked, it will load all Motifs list-->
        <div id='all-Motifs' class='btn btn-primary float-right m-b-15px all-motifs-button'>
            <span><i class="bi bi-card-list"></i></span> Tous Motifs
        </div>

        <!-- when clicked, it will load the create Motif form -->
        <div id='create-motif' class='btn btn-primary float-right m-b-15px create-motif-button mr-2'>
            <span><i class="bi bi-plus-lg"></i></span> Créer Motif
        </div>
        <!-- start table display Motifs-->
        <table class='table table-bordered table-hover'>
        
            <!-- creating our table heading -->
            <tr>
                <th class='w-5-pct'>Id</th>
                <th class='w-50-pct'>Libelle</th>
                <th class='w-45-pct text-align-center'>Action</th>
            </tr>`;
        
            // loop through returned list of data
            $.each(data.records, function(key, val) {
               
                // creating new table row per record
                read_Motifs_html+=`
                    <tr>
            
                        <td>` + val.id + `</td>
                        <td>` + val.libelle + `</td>
                       
            
                        <!-- 'action' buttons -->
                        <td>
            
                            <!-- edit button -->
                            <button class='btn btn-info m-r-10px update-motif-button' data-id='` + val.id + `'>
                                <span><i class="bi bi-pencil-square"></i></span> Modifier
                            </button>
            
                            <!-- delete button -->
                            <button class='btn btn-danger delete-motif-button' data-id='` + val.id + `'>
                                <span><i class="bi bi-x-lg"></i></span> Supprimer
                            </button>
                        </td>
            
                    </tr>`;
            });
        
        // end table
        read_Motifs_html+=`</table>`;
        // pagination
        if(data.paging){
            read_Motifs_html+="<nav aria-label='search motifs pages'><ul class='pagination motifs float-left margin-zero padding-bottom-2em'>";
        
                // first page
                if(data.paging.first!=""){
                    read_Motifs_html+="<li class='page-item'><a class='page-link' data-page='" + data.paging.first + "'>Première Page</a></li>";
                }
        
                // loop through pages
                $.each(data.paging.pages, function(key, val){
                    var active_page=val.current_page=="yes" ? "active" : "";
                    read_Motifs_html+="<li class='page-item " + active_page + "'><a class='page-link' data-page='" + val.url + "'>" + val.page + "</a></li>";
                });
        
                // last page
                if(data.paging.last!=""){
                    read_Motifs_html+="<li class='page-item'><a class='page-link' data-page='" + data.paging.last + "'>Dernière Page</a></li>";
                }
            read_Motifs_html+="</ul></nav>";
        }

        // inject this piece of html to our page
        $("#content").html(read_Motifs_html);

       
}

function showMotifsFirstPage(){
    var json_url="api/motif/read_paging_motifs.php";
    showMotifs(json_url);
}

// function to show list of Motifs
function showMotifs(json_url){

    // get list of Motifs from the API
    $.getJSON(json_url, function(data){
        // check if list of Motifs is empty or not
        if (data.message){$('#response').html("<div class='alert alert-danger'>${data.message}.</div>");}else{
        // html for listing Motifs
        showMotifsTemplate(data, "");
        }
        
    }); 
    
}

function createMotif(){
    
    var html = `
        <form id='create-motif-form'>
        <div class='table-responsive text-nowrap'>
        <table class='table table-hover table-bordered'>
            <tr>
                <td class='w-30-pct'>Libelle</td>
                <td class='w-70-pct'><input type="text" class="form-control" name="libelle" id="libelle" required/></td>
            </tr>

            <tr>
                <td><div class='btn btn-info all-motifs-button'><span><i class="bi bi-arrow-left-short"></i></span> Retourner</div></td>
                <td><button type='submit' class='btn btn-primary'><span><i class="bi bi-plus"></i></span> Créer</button></td>
            </tr>
            </table>
            </div>
        </form>
        `;

    $('#content').html(html);
}

function updateOneMotif(data){

    var html = `
    <form id='update-motif-form'>
    <div class='table-responsive text-nowrap'>
    <table class='table table-hover table-bordered'>
        <tr>
            <td class='w-30-pct'>Libelle</td>
            <td class='w-70-pct'><input type="text" class="form-control" name="libelle" id="libelle" value="${data.libelle}" required/></td>
        </tr>
        
        <tr>
            <td></td>
            <td><input type="text" class="form-control" name="id" id="motif_id" value="${data.id}" hidden/></td>
        </tr>

        <tr>
            <td><div class='btn btn-info all-motifs-button'><span><i class="bi bi-arrow-left-short"></i></span> Retourner</div></td>
            <td><button type='submit' class='btn btn-primary'><span><i class="bi bi-save"></i></span> Sauvegarder</button></td>
        </tr>
        </table>
        </div>
    </form>
    `;

    $('#content').html(html);

}

function showAllMotifsButton(){
    $('#content').html(`<!-- when clicked, it will show the Motifs list -->
                <div id='all-motifs' class='btn btn-primary float-right m-b-15px all-motifs-button'>
                    <span><i class="bi bi-card-list"></i></span> Tous Motifs
                </div>`);
}



