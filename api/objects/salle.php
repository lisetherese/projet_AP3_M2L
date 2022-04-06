<?php
class Salle{
  
    // database connection and table name
    private $conn;
    private $table_name = "salle";
  
    // object properties
    public $id;
    public $nom;
    public $capacite;
    public $id_domaine;
  
    public function __construct($db){
        $this->conn = $db;
    }

    // used by select drop-down list
    public function read(){
    
        //select all data
        $query = "SELECT * FROM salle ORDER BY nom ASC";
        $stmt = $this->conn->prepare( $query );
        $stmt->execute();
    
        return $stmt;
    }
    // used when filling up the update salle form
    function readOne(){
    
        // query to read single record
        $query = "SELECT * FROM salle WHERE id_salle = :id LIMIT 0,1";

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
       $this->id = $row['id_salle'];
       $this->nom = $row['nom'];
       $this->capacite = $row['capacite'];
       $this->id_demaine = $row['id_domaine'];
       return true;
       }
      
   }    
   // create new ligue record
    function create(){
    
        // insert query
        $query = "INSERT INTO salle
                SET
                    nom = :nom,
                    capacite = :capacite,
                    id_domaine = :id_domaine";
    
        // prepare the query
        $stmt = $this->conn->prepare($query);
    
        // sanitize
        $this->nom=htmlspecialchars(strip_tags($this->nom));
        $this->capacite=htmlspecialchars(strip_tags($this->capacite));
        $this->id_domaine=htmlspecialchars(strip_tags($this->id_domaine));
    
        // bind the values
        $stmt->bindParam(':nom', $this->nom);
        $stmt->bindParam(':capacite', $this->capacite);
        $stmt->bindParam(':id_domaine', $this->id_domaine);
        
        // execute the query, also check if query was successful
        if($stmt->execute()){
            return true;
        }
    
        return false;
    }
    
    
    // update a ligue record
    public function update(){
    
        // query
        $query = "UPDATE salle
                SET
                    nom = :nom,
                    capacite = :capacite,
                    id_domaine = :id_domaine,
                WHERE id_salle = :id";
    
        // prepare the query
        $stmt = $this->conn->prepare($query);
    
        // sanitize
        $this->nom=htmlspecialchars(strip_tags($this->nom));
        $this->capacite=htmlspecialchars(strip_tags($this->capacite));
        $this->id_domaine=htmlspecialchars(strip_tags($this->id_domaine));
       
    
        // bind the values from the form
        $stmt->bindParam(':nom', $this->nom);
        $stmt->bindParam(':capacite', $this->capacite);
        $stmt->bindParam(':id_domaine', $this->id_domaine);
       
        // unique ID of record to be edited
        $stmt->bindParam(':id', $this->id);
    
        // execute the query
        if($stmt->execute()){
            return true;
        }
    
        return false;
    }
    // delete ligue
    function delete(){
        
        // delete query
        $query = "DELETE FROM salle WHERE id_salle = ?";

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
    // search reservations
    function search($keywords){
    
        // select all query
        $query = "SELECT * FROM
                    " . $this->table_name . " 
                WHERE
                    nom LIKE ? OR capacite LIKE ?
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
    
        // execute query
        $stmt->execute();
    
        return  $stmt;
    }

    // read salles with pagination
    public function readPaging($from_record_num, $records_per_page){
    
        // select query
        $query = "SELECT * FROM salle ORDER BY nom ASC LIMIT ?,?";
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

    // used for paging reservations
    public function count(){
        $query = "SELECT COUNT(*) as total_rows FROM " . $this->table_name . "";
    
        $stmt = $this->conn->prepare( $query );
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
        return $row['total_rows'];
    }
}
?>