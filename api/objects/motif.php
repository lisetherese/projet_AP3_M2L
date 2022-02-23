<?php
// object
class Motif {
 
    // database connection and table name
    private $conn;
    private $table_name = "motif";
 
    // object properties
    public $id;
    public $libelle;
   
 
    // constructor
    public function __construct($db){
        $this->conn = $db;
    }
    //method using SQL requests to retrieve data, if data is only 1, set them as values of object's property 
    function read(){
    
        // select all query
        $query = "SELECT * FROM motif ORDER BY libelle ASC";
    
        // prepare query statement
        $stmt = $this->conn->prepare($query);
    
        // execute query
        $stmt->execute();

        
        return $stmt;
    }
    
    function readOne(){
    
        // query to read single record
        $query = "SELECT * FROM motif WHERE id_motif = :id LIMIT 0,1";
    
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
        $this->id = $row['id_motif'];
        $this->libelle = $row['libelle'];
        return true;
        }
       
    }    
// create new motif record
function create(){
 
    // insert query
    $query = "INSERT INTO motif
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
 
 
// update a motif record
public function update(){
 
    // query
    $query = "UPDATE motif
            SET
                libelle = :libelle 
            WHERE id_motif = :id";
 
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
// delete motif
function delete(){
    
    // delete query
    $query = "DELETE FROM motif WHERE id_motif = ?";

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
// search motif
function search($keywords){
    
    // select all query using LIKE which match case-insensitive by default, do LIKE BINARY for case-sensitive 
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

// read resultat with pagination
public function readPaging($from_record_num, $records_per_page){
    
    // select query
    $query = "SELECT * FROM motif ORDER BY libelle ASC LIMIT ?,?";
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