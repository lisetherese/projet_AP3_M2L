<?php
// 'bordereau' object
class Bordereau{
 
    // database connection and table name
    private $conn;
    private $table_name = "bordereau";
 
    // object properties
    public $id;
    public $src_bordereau;
    public $etre_valide;
    public $id_user;
    public $cerfa;
 
    // constructor
    public function __construct($db){
        $this->conn = $db;
    }

    function readOne(){
    
        // query to read single record
        $query = "SELECT * FROM bordereau WHERE id_bordereau = :id LIMIT 0,1";
    
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
        $this->id = $row['id_bordereau'];
        $this->src_bordereau = $row['src_bordereau'];
        $this->etre_valide = $row['etre_valide'];
        $this->id_user = $row['id_utilisateur'];
        $this->cerfa = $row['cerfa'];

        return true;
        }
        
    }   
//read bordereau by user id
function readByIdUser(){
    
    // query to read single record
    $query = "SELECT * FROM bordereau WHERE id_utilisateur = :id_user LIMIT 0,1";

    // prepare query statement
    $stmt = $this->conn->prepare( $query );

    // bind variable values
    $stmt->bindParam(':id_user', $this->id_user);

    // execute query
    $stmt->execute();

   // get retrieved row
   $row = $stmt->fetch(PDO::FETCH_ASSOC);

   if(!$row)
    {
        return false; 
    }else{
    
        // set values to object properties
        $this->id = $row['id_bordereau'];
        $this->src_bordereau = $row['src_bordereau'];
        $this->etre_valide = $row['etre_valide'];
        $this->id_user = $row['id_utilisateur'];
        $this->cerfa = $row['cerfa'];

        return true;
   
    }
}   
// create new user record
function create(){
    // insert query
    $query = "INSERT INTO " . $this->table_name . "
            SET
                src_bordereau = :src_bordereau,
                id_utilisateur = :id_user";
 
    // prepare the query
    $stmt = $this->conn->prepare($query);
 
    // bind the values
    $stmt->bindParam(':src_bordereau', $this->src_bordereau);
    $stmt->bindParam(':id_user', $this->id_user);

    // execute the query, also check if query was successful
    if($stmt->execute()){
        return true;
    }
 
    return false;
}
//turn to adherent
public function validerBordereau(){
    $query = "UPDATE " . $this->table_name . "
            SET
                etre_valide = :etre_valide
            WHERE id_bordereau = :id";
 
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
 
// update a bordereau record by admin
public function update(){
    // if some elements need to be set:
    $src_bordereau= ($this->src_bordereau !== 'no_modif') ? "src_bordereau = :src_bordereau, " : "";
    $cerfa= ($this->cerfa !== 'no_modif') ? "cerfa = :cerfa, " : "";
 
    $query = "UPDATE " . $this->table_name . "
            SET
                {$src_bordereau}
                {$cerfa}
                id_utilisateur = :id_user
            WHERE id_bordereau = :id";
 
    // prepare the query
    $stmt = $this->conn->prepare($query);
    // sanitize
    $this->id=htmlspecialchars(strip_tags($this->id));
    // bind the values
    $stmt->bindParam(':id', $this->id);
    $stmt->bindParam(':id_user', $this->id_user);
    if($this->src_bordereau !== 'no_modif'){
        $stmt->bindParam(':src_bordereau', $this->src_bordereau);
    }
    if($this->cerfa !== 'no_modif'){
        $stmt->bindParam(':cerfa', $this->cerfa);
    }
    
    // execute the query, also check if query was successful
    if($stmt->execute()){
        return true;
    }
 
    return false;
}
//update a bordereau record by adding cerfa by tresorier
public function updateCerfa(){
    $query = "UPDATE " . $this->table_name . "
        SET
            cerfa = :src_cerfa 
            
        WHERE id_utilisateur = :id_user";

    // prepare the query
    $stmt = $this->conn->prepare($query);
    // sanitize
    $this->id_user=htmlspecialchars(strip_tags($this->id_user));
    $this->cerfa=htmlspecialchars(strip_tags($this->cerfa));
    // bind the values
    $stmt->bindParam(':id_user', $this->id_user);
    $stmt->bindParam(':src_cerfa', $this->cerfa);

    // execute the query, also check if query was successful
    if($stmt->execute()){
        return true;
    }
 
    return false;
}

// delete bordereau
function delete(){
    
    // delete query
    $query = "DELETE FROM " . $this->table_name . " WHERE id_bordereau = ?";

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

// search bordereau
function search($keywords){
    
    // select all query using LIKE which match case-insensitive by default, do LIKE BINARY for case-sensitive 
    $query = "SELECT * FROM
                " . $this->table_name . " 
            WHERE
                id_utilisateur LIKE ?
            ORDER BY
                id_bordereau ASC";

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
/*
//search bordereau by adherent
function searchByUser($keywords,$user_id){
    
    // select all query using LIKE which match case-insensitive by default, do LIKE BINARY for case-sensitive 
    $query = "SELECT * FROM
                " . $this->table_name . " 
            WHERE
                id_utilisateur = ? 
            AND
                src_bordereau LIKE ? OR trajet LIKE ? 
            ORDER BY
                src_bordereau ASC";

    // prepare query statement
    $stmt = $this->conn->prepare($query);

    // sanitize
    $user_id=htmlspecialchars(strip_tags($user_id));
    $keywords=htmlspecialchars(strip_tags($keywords));
    $keywords = "%{$keywords}%"; // search for all data contains keywords in ANY POSITION! 

    // bind
    $stmt->bindParam(1, $user_id);
    $stmt->bindParam(2, $keywords);
    $stmt->bindParam(3, $keywords);

    // execute query
    $stmt->execute();

    return  $stmt;
}
*/
// read resultat with pagination
public function readPaging($from_record_num, $records_per_page){
    
    // select query
    $query = "SELECT * FROM bordereau ORDER BY id_bordereau ASC LIMIT ?,?";
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