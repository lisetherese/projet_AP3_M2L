//function to show form CERFA validated
function showCERFAValide(adherent_id){
    //function to retrieve date
    var today = new Date();
    var this_year = today.getFullYear();
    var content = `
            <div class="object-pdf">
                <object data="http://localhost/M2L/assets/files/cerfa/user_id_${adherent_id}_${this_year}.pdf" type="application/pdf" width="100%" height="1000px"></object>
                <p>Si le fichier n'apparaît pas, veuillez <a href="assets/files/cerfa/user_id_${adherent_id}_${this_year}.pdf" target="_blank">cliquer ici</a></p>
                <p>En cas d'avoir besoin de modification, veuillez nous contacter dans les plus brefs délais. Merci!</p>
            </div>
            <div class="d-flex justify-content-center controls" style="margin-top: 10px;margin-bottom: 10px;">
            <a class="btn btn-primary" href="http://localhost/M2L/assets/files/cerfa/user_id_${adherent_id}_${this_year}.pdf" download="cerfa_${this_year}"> Télécharger en PDF</a>
            </div>
            <div class="d-flex justify-content-center controls" style="margin-bottom: 50px;">
                <div class='btn btn-info all-ligne-frais-button-user'><span><i class="bi bi-arrow-left-short"></i></span> Retourner</div>
            </div>
    `;
    $('#content').html(content);
}

//function to show cerfa form on creating or modifying
function showCERFAForm(adherent_id){
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
                    total_par_ligne = cout_trajet + val.peage_valide + val.repas_valide + val.hebergement_valide;
                    //calul montant total all lignes
                    montant = montant+total_par_ligne;
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
                        <button id="send_getPDF_cerfa" class="btn btn-primary">Sauvegarder et Télécharger en PDF</button>
                    </div>
                    <div class="d-flex justify-content-center controls" style="margin-bottom: 50px;">
                        <div class='btn btn-info all-bordereaux-button'><span><i class="bi bi-arrow-left-short"></i></span> Retourner</div>
                    </div>
                    `;
                $('#content').html(html);
            });
        });
    });
}
