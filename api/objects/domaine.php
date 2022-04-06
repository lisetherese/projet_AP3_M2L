<?php
class Domaine{
  
    // database connection and table name
    private $conn;
    private $table_name = "domaine";
  
    // object properties
    public $id;
    public $libelle;
   
  
    public function __construct($db){
        $this->conn = $db;
    }

    // used by select drop-down list
    public function read(){
    
        //select all data
        $query = "SELECT * FROM domaine ORDER BY libelle ASC";
        $stmt = $this->conn->prepare( $query );
        $stmt->execute();
    
        return $stmt;
    }
     // used when filling up the update domaine form
     function readOne(){
    
        // query to read single record
        $query = "SELECT * FROM domaine WHERE id_domaine = :id LIMIT 0,1";

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
       $this->id = $row['id_domaine'];
       $this->libelle = $row['libelle'];
       return true;
       }
      
   }

   // create new ligue record
   function create(){
    
        // insert query
        $query = "INSERT INTO domaine
                SET
                    libelle = :libelle";

        // prepare the query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->libelle=htmlspecialchars(strip_tags($this->libelle));

        // bind the values
        $stmt->bindParam(':libelle', $this->libelle);
        
        // execute the query, also check if query was successful
        if($stmt->execute()){
            return true;
        }

        return false;
    }
    // update a ligue record
    public function update(){
    
        // query
        $query = "UPDATE domaine
                SET
                    libelle = :libelle
                  
                WHERE id_domaine = :id";
    
        // prepare the query
        $stmt = $this->conn->prepare($query);
    
        // sanitize
        $this->libelle=htmlspecialchars(strip_tags($this->libelle));
       
        // bind the values from the form
        $stmt->bindParam(':libelle', $this->libelle);
       
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
        $query = "DELETE FROM domaine WHERE id_domaine = ?";

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
                    libelle LIKE ?
                ORDER BY
                    libelle ASC";
    
        // prepare query statement
        $stmt = $this->conn->prepare($query);
    
        // sanitize
        $keywords=htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%"; // search for all data contains keywords in ANY POSITION! */
    
        // bind
        $stmt->bindParam(1, $keywords);
    
        // execute query
        $stmt->execute();
    
        return  $stmt;
    }


}
?>