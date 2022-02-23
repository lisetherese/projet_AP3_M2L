<?php
// 'demandeur' object
class Demandeur{
 
    // database connection and table name
    private $conn;
    private $table_name = "demandeur";
 
    // object properties
    public $id;
    public $nom;
    public $prenom;
    public $rue;
    public $ville;
    public $cp;
    public $num_licence;
    public $date_naissance;
    public $etre_adherent;
    public $id_user;
    public $id_ligue;
 
    // constructor
    public function __construct($db){
        $this->conn = $db;
    }

    function readOne(){
    
        // query to read single record
        $query = "SELECT * FROM demandeur WHERE id_demandeur = :id LIMIT 0,1";
    
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
        $this->id = $row['id_demandeur'];
        $this->nom = $row['nom'];
        $this->prenom = $row['prenom'];
        $this->rue= $row['rue'];
        $this->ville = $row['ville'];
        $this->cp = $row['cp'];
        $this->num_licence = $row['num_licence'];
        $this->date_naissance = $row['date_naissance'];
        $this->etre_adherent = $row['etre_adherent'];
        $this->id_user = $row['id_utilisateur'];
        $this->id_ligue = $row['id_ligue'];

        return true;

        }
       
    }   
//read demandeur by user id
function readByIdUser(){
    
    // query to read single record
    $query = "SELECT * FROM demandeur WHERE id_utilisateur = :id LIMIT 0,1";

    // prepare query statement
    $stmt = $this->conn->prepare( $query );

    // execute query
    $stmt->execute(array(':id'=>$this->id_user));

    // get retrieved row
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if(!$row)
        {
            return false; 
        }else{

    // set values to object properties
    $this->id = $row['id_demandeur'];
    $this->nom = $row['nom'];
    $this->prenom = $row['prenom'];
    $this->rue= $row['rue'];
    $this->ville = $row['ville'];
    $this->cp = $row['cp'];
    $this->num_licence = $row['num_licence'];
    $this->date_naissance = $row['date_naissance'];
    $this->etre_adherent = $row['etre_adherent'];
    $this->id_user = $row['id_utilisateur'];
    $this->id_ligue = $row['id_ligue'];

    return true;

        }
   
}   
// create new user record
function create(){
 
    // insert query
    $query = "INSERT INTO " . $this->table_name . "
            SET
                nom = :nom,
                prenom = :prenom,
                rue = :rue,
                ville = :ville,
                cp = :cp,
                num_licence = :num_licence,
                date_naissance = :date_naissance,
                id_utilisateur = :id_user,
                id_ligue = :id_ligue";
 
    // prepare the query
    $stmt = $this->conn->prepare($query);
 
    // sanitize
    $this->nom=htmlspecialchars(strip_tags($this->nom));
    $this->prenom=htmlspecialchars(strip_tags($this->prenom));
    $this->rue=htmlspecialchars(strip_tags($this->rue));
    $this->ville=htmlspecialchars(strip_tags($this->ville));
    $this->cp=htmlspecialchars(strip_tags($this->cp));
    $this->num_licence=htmlspecialchars(strip_tags($this->num_licence));
    $this->date_naissance=htmlspecialchars(strip_tags($this->date_naissance));
    $this->id_user=htmlspecialchars(strip_tags($this->id_user));
    $this->id_ligue=htmlspecialchars(strip_tags($this->id_ligue));
 
    // bind the values
    $stmt->bindParam(':nom', $this->nom);
    $stmt->bindParam(':prenom', $this->prenom);
    $stmt->bindParam(':rue', $this->rue);
    $stmt->bindParam(':ville', $this->ville);
    $stmt->bindParam(':cp', $this->cp);
    $stmt->bindParam(':num_licence', $this->num_licence);
    $stmt->bindParam(':date_naissance', $this->date_naissance);
    $stmt->bindParam(':id_user', $this->id_user);
    $stmt->bindParam(':id_ligue', $this->id_ligue);
 
    // execute the query, also check if query was successful
    if($stmt->execute()){
        return true;
    }
 
    return false;
}
//turn to adherent
public function becomeAdherent(){
    $query = "UPDATE " . $this->table_name . "
            SET
                etre_adherent = :etre_ad
            WHERE id_demandeur = :id";
 
    // prepare the query
    $stmt = $this->conn->prepare($query);
    // sanitize
    $this->id=htmlspecialchars(strip_tags($this->id));
    // bind value
    $stmt->bindParam(':etre_ad', $this->etre_adherent);
    // unique ID of record to be edited
    $stmt->bindParam(':id', $this->id);
    
    // execute the query
    if($stmt->execute()){
        return true;
    }
 
    return false;
}
 
// update a demandeur record
public function update(){
 
    $query = "UPDATE " . $this->table_name . "
            SET
                nom = :nom,
                prenom = :prenom,
                rue = :rue,
                ville = :ville,
                cp = :cp,
                num_licence = :num_licence,
                date_naissance = :date_naissance,
                id_utilisateur = :id_user,
                id_ligue = :id_ligue
            WHERE id_demandeur = :id";
 
    // prepare the query
    $stmt = $this->conn->prepare($query);
 
    // sanitize
    $this->nom=htmlspecialchars(strip_tags($this->nom));
    $this->prenom=htmlspecialchars(strip_tags($this->prenom));
    $this->rue=htmlspecialchars(strip_tags($this->rue));
    $this->ville=htmlspecialchars(strip_tags($this->ville));
    $this->cp=htmlspecialchars(strip_tags($this->cp));
    $this->num_licence=htmlspecialchars(strip_tags($this->num_licence));
    $this->date_naissance=htmlspecialchars(strip_tags($this->date_naissance));
    $this->id_user=htmlspecialchars(strip_tags($this->id_user));
    $this->id_ligue=htmlspecialchars(strip_tags($this->id_ligue));
 
    // bind the values
    $stmt->bindParam(':nom', $this->nom);
    $stmt->bindParam(':prenom', $this->prenom);
    $stmt->bindParam(':rue', $this->rue);
    $stmt->bindParam(':ville', $this->ville);
    $stmt->bindParam(':cp', $this->cp);
    $stmt->bindParam(':num_licence', $this->num_licence);
    $stmt->bindParam(':date_naissance', $this->date_naissance);
    $stmt->bindParam(':id_user', $this->id_user);
    $stmt->bindParam(':id_ligue', $this->id_ligue);
    // unique ID of record to be edited
    $stmt->bindParam(':id', $this->id);
 
    // execute the query
    if($stmt->execute()){
        return true;
    }
 
    return false;
}
// delete demandeur
function delete(){
    
    // delete query
    $query = "DELETE FROM " . $this->table_name . " WHERE id_demandeur = ?";

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

// search ligue
function search($keywords){
    
    // select all query using LIKE which match case-insensitive by default, do LIKE BINARY for case-sensitive 
    $query = "SELECT * FROM
                " . $this->table_name . " 
            WHERE
                nom LIKE ? OR prenom LIKE ? OR num_licence LIKE ?
            ORDER BY
                nom ASC";

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

// read resultat with pagination
public function readPaging($from_record_num, $records_per_page){
    
    // select query
    $query = "SELECT * FROM demandeur ORDER BY nom ASC LIMIT ?,?";
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

 // used for paging
 public function count(){
    $query = "SELECT COUNT(*) as total_rows FROM " . $this->table_name . "";

    $stmt = $this->conn->prepare( $query );
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    return $row['total_rows'];
}
    
}
?>