<?php
class Tarif_reservation{
  
    // database connection and table name
    private $conn;
    private $table_name = "tarif_reservation";
  
    // object properties
    public $id;
    public $tarif;
   
  
    public function __construct($db){
        $this->conn = $db;
    }

    // used by select drop-down list
    public function read(){
    
        //select all data
        $query = "SELECT * FROM tarif_reservation ORDER BY id_tarif_reservation ASC";
        $stmt = $this->conn->prepare( $query );
        $stmt->execute();
    
        return $stmt;
    }
     // used when filling up the update tarif_reservation form
     function readOne(){
    
        // query to read single record
        $query = "SELECT * FROM tarif_reservation WHERE id_tarif_reservation = :id LIMIT 0,1";

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
       $this->id = $row['id_tarif_reservation'];
       $this->tarif = $row['tarif'];
       return true;
       }
      
   }

   // create new ligue record
   function create(){
    
        // insert query
        $query = "INSERT INTO tarif_reservation
                SET
                    tarif = :tarif";

        // prepare the query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->tarif=htmlspecialchars(strip_tags($this->tarif));

        // bind the values
        $stmt->bindParam(':tarif', $this->tarif);
        
        // execute the query, also check if query was successful
        if($stmt->execute()){
            return true;
        }

        return false;
    }
    // update a ligue record
    public function update(){
    
        // query
        $query = "UPDATE tarif_reservation
                SET
                    tarif = :tarif
                  
                WHERE id_tarif_reservation = :id";
    
        // prepare the query
        $stmt = $this->conn->prepare($query);
    
        // sanitize
        $this->tarif=htmlspecialchars(strip_tags($this->tarif));
       
        // bind the values from the form
        $stmt->bindParam(':tarif', $this->tarif);
       
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
        $query = "DELETE FROM tarif_reservation WHERE id_tarif_reservation = ?";

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
                    tarif LIKE ?
                ORDER BY
                    tarif ASC";
    
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