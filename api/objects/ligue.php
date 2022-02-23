<?php
// object
class Ligue {
 
    // database connection and table name
    private $conn;
    private $table_name = "ligues";
 
    // object properties
    public $id;
    public $nom;
    public $sigle;
    public $president;
    public $reser_hors;
    public $reser_am;
    public $reser_con;
 
    // constructor
    public function __construct($db){
        $this->conn = $db;
    }
    //method using SQL requests to retrieve data, if data is only 1, set them as values of object's property 
    function read(){
    
        // select all query
        $query = "SELECT * FROM ligues ORDER BY nom ASC";
    
        // prepare query statement
        $stmt = $this->conn->prepare($query);
    
        // execute query
        $stmt->execute();

        
        return $stmt;
    }
    
    function readOne(){
    
        // query to read single record
        $query = "SELECT * FROM ligues WHERE id_ligues = :id LIMIT 0,1";
    
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
        $this->id = $row['id_ligues'];
        $this->nom = $row['nom'];
        $this->sigle = $row['sigle'];
        $this->president = $row['president'];
        $this->reser_hors= $row['reservation_an_hors_amphi'];
        $this->reser_am = $row['reservation_amphi'];
        $this->reser_con = $row['reservation_convivialite'];
        return true;
        }
       
    }    
// create new ligue record
function create(){
 
    // insert query
    $query = "INSERT INTO ligues
            SET
                nom = :nom,
                sigle = :sigle,
                president = :president,
                reservation_an_hors_amphi = :reser_hors,
                reservation_amphi = :reser_am,
                reservation_convivialite = :reser_con";
 
    // prepare the query
    $stmt = $this->conn->prepare($query);
 
    // sanitize
    $this->nom=htmlspecialchars(strip_tags($this->nom));
    $this->sigle=htmlspecialchars(strip_tags($this->sigle));
    $this->president=htmlspecialchars(strip_tags($this->president));
    $this->reser_hors=htmlspecialchars(strip_tags($this->reser_hors));
    $this->reser_am=htmlspecialchars(strip_tags($this->reser_am));
    $this->reser_con=htmlspecialchars(strip_tags($this->reser_con));
 
    // bind the values
    $stmt->bindParam(':nom', $this->nom);
    $stmt->bindParam(':sigle', $this->sigle);
    $stmt->bindParam(':president', $this->president);
    $stmt->bindParam(':reser_hors', $this->reser_hors);
    $stmt->bindParam(':reser_am', $this->reser_am);
    $stmt->bindParam(':reser_con', $this->reser_con);
    
    // execute the query, also check if query was successful
    if($stmt->execute()){
        return true;
    }
 
    return false;
}
 
 
// update a ligue record
public function update(){
 
    // query
    $query = "UPDATE ligues
            SET
                nom = :nom,
                sigle = :sigle,
                president = :president,
                reservation_an_hors_amphi = :reser_hors,
                reservation_amphi = :reser_am,
                reservation_convivialite = :reser_con
            WHERE id_ligues = :id";
 
    // prepare the query
    $stmt = $this->conn->prepare($query);
 
    // sanitize
    $this->nom=htmlspecialchars(strip_tags($this->nom));
    $this->sigle=htmlspecialchars(strip_tags($this->sigle));
    $this->president=htmlspecialchars(strip_tags($this->president));
    $this->reser_hors=htmlspecialchars(strip_tags($this->reser_hors));
    $this->reser_am=htmlspecialchars(strip_tags($this->reser_am));
    $this->reser_con=htmlspecialchars(strip_tags($this->reser_con));
 
    // bind the values from the form
    $stmt->bindParam(':nom', $this->nom);
    $stmt->bindParam(':sigle', $this->sigle);
    $stmt->bindParam(':president', $this->president);
    $stmt->bindParam(':reser_hors', $this->reser_hors);
    $stmt->bindParam(':reser_am', $this->reser_am);
    $stmt->bindParam(':reser_con', $this->reser_con);
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
    $query = "DELETE FROM ligues WHERE id_ligues = ?";

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
                nom LIKE ? OR sigle LIKE ? OR president LIKE ?
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
    $query = "SELECT * FROM ligues ORDER BY nom ASC LIMIT ?,?";
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