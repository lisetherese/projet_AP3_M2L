<?php
// 'ligne_frais' object
class LigneFrais{
 
    // database connection and table name
    private $conn;
    private $table_name = "ligne_frais";
 
    // object properties
    public $id;
    public $date_ligne_frais;
    public $trajet;
    public $km;
    public $km_valide;
    public $cout_peage;
    public $peage_valide;
    public $peage_justificatif;
    public $cout_repas;
    public $repas_valide;
    public $repas_justificatif;
    public $cout_hebergement;
    public $hebergement_valide;
    public $justificatif;
    public $etre_valide;
    public $id_user;
    public $id_motif;
 
    // constructor
    public function __construct($db){
        $this->conn = $db;
    }

    function readOne(){
    
        // query to read single record
        $query = "SELECT * FROM ligne_frais WHERE id_ligne_frais = :id LIMIT 0,1";
    
        // prepare query statement
        $stmt = $this->conn->prepare( $query );
    
        // execute query
        $stmt->execute(array(':id'=>$this->id));
    
        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if(!$row)
        {
            return false; 
        }else{
        // set values to object properties
        $this->id = $row['id_ligne_frais'];
        $this->date_ligne_frais = $row['date_ligne_frais'];
        $this->trajet = $row['trajet'];
        $this->km= $row['km'];
        $this->km_valide = $row['km_valide'];
        $this->cout_peage = $row['cout_peage'];
        $this->peage_valide = $row['peage_valide'];
        $this->peage_justificatif = $row['peage_justificatif'];
        $this->cout_repas = $row['cout_repas'];
        $this->repas_valide = $row['repas_valide'];
        $this->repas_justificatif = $row['repas_justificatif'];
        $this->cout_hebergement = $row['cout_hebergement'];
        $this->hebergement_valide = $row['hebergement_valide'];
        $this->justificatif = $row['justificatif'];
        $this->etre_valide = $row['etre_valide'];
        $this->id_user = $row['id_utilisateur'];
        $this->id_motif = $row['id_motif'];
        return true;
    }

       
    }   
//read ligne_frais by user id
function readByIdUser($from_record_num, $records_per_page){
    
    // query to read single record
    $query = "SELECT * FROM ligne_frais WHERE id_utilisateur = :id_user ORDER BY date_ligne_frais ASC LIMIT :from_num,:per_page";

    // prepare query statement
    $stmt = $this->conn->prepare( $query );

    // bind variable values
    $stmt->bindParam(':id_user', $this->id_user);
    $stmt->bindParam(':from_num', $from_record_num, PDO::PARAM_INT);
    $stmt->bindParam(':per_page', $records_per_page, PDO::PARAM_INT);

    // execute query
    $stmt->execute();

   // return values from database
   return $stmt;
   
}  

 // used for paging view of user
 public function countUser(){
    $query = "SELECT COUNT(*) as total_rows FROM " . $this->table_name . " WHERE id_utilisateur = :id_user";

    $stmt = $this->conn->prepare( $query );
    // bind variable values
    $stmt->bindParam(':id_user', $this->id_user);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    return $row['total_rows'];
} 
// create new user record
function create(){
    // if some elements need to be set:
    $peage_cout=!empty($this->cout_peage) ? "cout_peage = :cout_peage, " : "";
    $peage_valide=!empty($this->peage_valide) ? "peage_valide = :peage_valide, " : "";
    $peage_justificatif=!empty($this->peage_justificatif) ? "peage_justificatif = :peage_justificatif, " : "";
    $repas_cout=!empty($this->cout_repas) ? "cout_repas = :cout_repas, " : "";
    $repas_valide=!empty($this->repas_valide) ? "repas_valide = :repas_valide," : "";
    $repas_justificatif=!empty($this->repas_justificatif) ? "repas_justificatif = :repas_justificatif, " : "";
    $hebergement_cout=!empty($this->cout_hebergement) ? "cout_hebergement = :cout_hebergement, " : ""; 
    $hebergement_valide=!empty($this->hebergement_valide) ? "hebergement_valide = :hebergement_valide," : "";
    $hebergement_justificatif=!empty($this->justificatif) ? "justificatif = :justificatif, " : "";  
    // insert query
    $query = "INSERT INTO " . $this->table_name . "
            SET
                date_ligne_frais = :date_ligne_frais,
                trajet = :trajet,
                km = :km,
                km_valide = :km_valide,
                {$peage_cout}
                {$peage_valide}
                {$peage_justificatif}
                {$repas_cout}
                {$repas_valide}
                {$repas_justificatif}
                {$hebergement_cout}
                {$hebergement_valide}
                {$hebergement_justificatif}
                id_utilisateur = :id_user,
                id_motif = :id_motif";
 
    // prepare the query
    $stmt = $this->conn->prepare($query);
 
    // sanitize
    $this->date_ligne_frais=htmlspecialchars(strip_tags($this->date_ligne_frais));
    $this->trajet=htmlspecialchars(strip_tags($this->trajet));
    $this->km=htmlspecialchars(strip_tags($this->km));
    $this->id_user=htmlspecialchars(strip_tags($this->id_user));
    $this->id_motif=htmlspecialchars(strip_tags($this->id_motif));
 
    // bind the values
    $stmt->bindParam(':date_ligne_frais', $this->date_ligne_frais);
    $stmt->bindParam(':trajet', $this->trajet);
    $stmt->bindParam(':km', $this->km);
    $stmt->bindParam(':km_valide', $this->km_valide);
    $stmt->bindParam(':id_user', $this->id_user);
    $stmt->bindParam(':id_motif', $this->id_motif);

    //if elements are not empty:
    if(!empty($this->cout_peage)){
        $this->cout_peage=htmlspecialchars(strip_tags($this->cout_peage));
        $stmt->bindParam(':cout_peage', $this->cout_peage);
    }
    if(!empty($this->peage_valide)){
        $stmt->bindParam(':peage_valide', $this->peage_valide);
    }
    if(!empty($this->peage_justificatif)){;
        $stmt->bindParam(':peage_justificatif', $this->peage_justificatif);
    }
    if(!empty($this->cout_repas)){
        $this->cout_repas=htmlspecialchars(strip_tags($this->cout_repas));
        $stmt->bindParam(':cout_repas', $this->cout_repas);
    }
    if(!empty($this->repas_valide)){
        $stmt->bindParam(':repas_valide', $this->repas_valide);
    }
    if(!empty($this->repas_justificatif)){
        $stmt->bindParam(':repas_justificatif', $this->repas_justificatif);
    }
    if(!empty($this->cout_hebergement)){
        $this->cout_hebergement=htmlspecialchars(strip_tags($this->cout_hebergement));
        $stmt->bindParam(':cout_hebergement', $this->cout_hebergement);
    }
    if(!empty($this->hebergement_valide)){
        $stmt->bindParam(':hebergement_valide', $this->hebergement_valide);
    }
    if(!empty($this->justificatif)){
        $stmt->bindParam(':justificatif', $this->justificatif);
    }
    // execute the query, also check if query was successful
    if($stmt->execute()){
        return true;
    }
 
    return false;
}
//turn to adherent
public function validerLigneFrais(){
    $query = "UPDATE " . $this->table_name . "
            SET
                etre_valide = :etre_valide
            WHERE id_ligne_frais = :id";
 
    // prepare the query
    $stmt = $this->conn->prepare($query);
    // sanitize
    $this->id=htmlspecialchars(strip_tags($this->id));
    // bind value
    $stmt->bindParam(':etre_valide', $this->etre_valide);
    // unique ID of record to be edited
    $stmt->bindParam(':id', $this->id);
    
    // execute the query
    if($stmt->execute()){
        return true;
    }
 
    return false;
}
 
// update a ligne_frais record
public function update(){
     // if some elements need to be set:
        $peage_justificatif= ($this->peage_justificatif !== 'no_modif') ? "peage_justificatif = :peage_justificatif, " : "";
        $repas_justificatif= ($this->repas_justificatif !== 'no_modif') ? "repas_justificatif = :repas_justificatif, " : "";
        $hebergement_justificatif= ($this->justificatif !== 'no_modif') ? "justificatif = :justificatif, " : "";  
 
    $query = "UPDATE " . $this->table_name . "
            SET
                date_ligne_frais = :date_ligne_frais,
                trajet = :trajet,
                km = :km,
                km_valide = :km_valide,
                cout_peage = :cout_peage,
                peage_valide = :peage_valide,
                {$peage_justificatif}
                cout_repas = :cout_repas,
                repas_valide = :repas_valide,
                {$repas_justificatif}
                cout_hebergement = :cout_hebergement,
                hebergement_valide = :hebergement_valide,
                {$hebergement_justificatif}
                id_utilisateur = :id_user,
                id_motif = :id_motif
            WHERE id_ligne_frais = :id";
 
    // prepare the query
    $stmt = $this->conn->prepare($query);
 
    // sanitize
    $this->id=htmlspecialchars(strip_tags($this->id));
    $this->date_ligne_frais=htmlspecialchars(strip_tags($this->date_ligne_frais));
    $this->trajet=htmlspecialchars(strip_tags($this->trajet));
    $this->km=htmlspecialchars(strip_tags($this->km));
    $this->km_valide=htmlspecialchars(strip_tags($this->km_valide));
    $this->id_user=htmlspecialchars(strip_tags($this->id_user));
    $this->id_motif=htmlspecialchars(strip_tags($this->id_motif));
 
    // bind the values
    $stmt->bindParam(':id', $this->id);
    $stmt->bindParam(':date_ligne_frais', $this->date_ligne_frais);
    $stmt->bindParam(':trajet', $this->trajet);
    $stmt->bindParam(':km', $this->km);
    $stmt->bindParam(':km_valide', $this->km_valide);
    $stmt->bindParam(':id_user', $this->id_user);
    $stmt->bindParam(':id_motif', $this->id_motif);
    $stmt->bindParam(':cout_peage', $this->cout_peage);
    $stmt->bindParam(':peage_valide', $this->peage_valide);
    $stmt->bindParam(':cout_repas', $this->cout_repas);
    $stmt->bindParam(':repas_valide', $this->repas_valide);
    $stmt->bindParam(':cout_hebergement', $this->cout_hebergement);
    $stmt->bindParam(':hebergement_valide', $this->hebergement_valide);
    if($this->peage_justificatif !== 'no_modif'){
        $stmt->bindParam(':peage_justificatif', $this->peage_justificatif);
    }
    if($this->repas_justificatif !== 'no_modif'){
        $stmt->bindParam(':repas_justificatif', $this->repas_justificatif);
    }
    if($this->justificatif !== 'no_modif'){
        $stmt->bindParam(':justificatif', $this->justificatif);
    }

    // execute the query, also check if query was successful
    if($stmt->execute()){
        return true;
    }
 
    return false;
}
// delete ligne_frais
function delete(){
    
    // delete query
    $query = "DELETE FROM " . $this->table_name . " WHERE id_ligne_frais = ?";

    // prepare query
    $stmt = $this->conn->prepare($query);

    // sanitize
    $this->id=htmlspecialchars(strip_tags($this->id));

    // bind id of record to delete
    $stmt->bindParam(1, $this->id);

    // execute query
    if($stmt->execute()){
        return true;
    }

    return false;
}

// search ligne frais
function search($keywords){
    
    // select all query using LIKE which match case-insensitive by default, do LIKE BINARY for case-sensitive 
    $query = "SELECT * FROM
                " . $this->table_name . " 
            WHERE
                date_ligne_frais LIKE ? OR trajet LIKE ? OR id_utilisateur LIKE ?
            ORDER BY
                date_ligne_frais ASC";

    // prepare query statement
    $stmt = $this->conn->prepare($query);

    // sanitize
    $keywords=htmlspecialchars(strip_tags($keywords));
    $keywords = "%{$keywords}%"; // search for all data contains keywords in ANY POSITION! */

    // bind
    $stmt->bindParam(1, $keywords);
    $stmt->bindParam(2, $keywords);
    $stmt->bindParam(3, $keywords);
    

    // execute query
    $stmt->execute();

    return  $stmt;
}
//search ligne frais by adherent
function searchByUser($keywords,$user_id){
    
    // select all query using LIKE which match case-insensitive by default, do LIKE BINARY for case-sensitive 
    $query = "SELECT * FROM
                " . $this->table_name . " 
            WHERE
                id_utilisateur = ? 
            AND
                (date_ligne_frais LIKE ? OR trajet LIKE ?) 
            ORDER BY
                date_ligne_frais ASC";

    // prepare query statement
    $stmt = $this->conn->prepare($query);

    // sanitize
    $user_id=htmlspecialchars(strip_tags($user_id));
    $keywords=htmlspecialchars(strip_tags($keywords));
    $keywords = "%{$keywords}%"; // search for all data contains keywords in ANY POSITION! */

    // bind
    $stmt->bindParam(1, $user_id);
    $stmt->bindParam(2, $keywords);
    $stmt->bindParam(3, $keywords);

    // execute query
    $stmt->execute();

    return  $stmt;
}

// read resultat with pagination for admin or tresorier
public function readPaging($from_record_num, $records_per_page){
    
    // select query
    $query = "SELECT * FROM ligne_frais ORDER BY date_ligne_frais ASC LIMIT ?,?";
    // prepare query statement
    $stmt = $this->conn->prepare( $query );
        
    // bind variable values
    $stmt->bindParam(1, $from_record_num, PDO::PARAM_INT);
    $stmt->bindParam(2, $records_per_page, PDO::PARAM_INT);

    // execute query
    $stmt->execute();

    // return values from database
    return $stmt;
}

 // used for paging all lignes frais
 public function count(){
    $query = "SELECT COUNT(*) as total_rows FROM " . $this->table_name . "";

    $stmt = $this->conn->prepare( $query );
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    return $row['total_rows'];
}

}
?>