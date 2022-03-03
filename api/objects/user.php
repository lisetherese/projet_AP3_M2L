<?php
// 'user' object
class User{
 
    // database connection and table name
    private $conn;
    private $table_name = "utilisateur";
 
    // object properties
    public $id;
    public $email;
    public $mdp;
    public $role;
    public $droit_reservation;
    public $niveau_tarif;
 
    // constructor
    public function __construct($db){
        $this->conn = $db;
    }
    //method using SQL requests to retrieve data, if data is only 1, set them as values of object's property 
    function read(){
    
        // select all query
        $query = "SELECT * FROM utilisateur ORDER BY email ASC";
    
        // prepare query statement
        $stmt = $this->conn->prepare($query);
    
        // execute query
        $stmt->execute();

        
        return $stmt;
    }
    
    function readOne(){
    
        // query to read single record
        $query = "SELECT * FROM utilisateur WHERE id_utilisateur = :id LIMIT 0,1";
    
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
        $this->id = $row['id_utilisateur'];
        $this->email = $row['email'];
        $this->role = $row['role'];
        $this->droit_reservation= $row['droit_reservation'];
        $this->niveau_tarif = $row['niveau_tarif'];

        return true;
        }
       
    }    
// create new user record
function create(){
 
    // insert query
    $query = "INSERT INTO utilisateur
            SET
                email = :email,
                mdp = :mdp,
                role = :role,
                droit_reservation = :droit,
                niveau_tarif = :niveau";
 
    // prepare the query
    $stmt = $this->conn->prepare($query);
 
    // sanitize
    $this->email=htmlspecialchars(strip_tags($this->email));
    $this->mdp=htmlspecialchars(strip_tags($this->mdp));
 
    // bind the values
    $stmt->bindParam(':email', $this->email);
    $stmt->bindParam(':role', $this->role);
    $stmt->bindParam(':droit', $this->droit_reservation);
    $stmt->bindParam(':niveau', $this->niveau_tarif);
 
    // hash the password before saving to database
    $password_hash = password_hash($this->mdp, PASSWORD_BCRYPT);
    $stmt->bindParam(':mdp', $password_hash);
    
    // execute the query, also check if query was successful
    if($stmt->execute()){
        return true;
    }
 
    return false;
}
// to simply check if email already exist in database
function checkEmailExists(){
    // query to check if email exists
    $query = "SELECT id_utilisateur
            FROM utilisateur
            WHERE email = ?
            LIMIT 0,1";
 
    // prepare the query
    $stmt = $this->conn->prepare( $query );
 
    // sanitize
    $this->email=htmlspecialchars(strip_tags($this->email));
 
    // bind given email value
    $stmt->bindParam(1, $this->email);
 
    // execute the query
    //$stmt->execute(array('?'=>$this->email));
    $stmt->execute();
 
    // get number of rows
    $num = $stmt->rowCount();
 
    // if email exists, assign values to object properties for easy access and use for php sessions
    if($num>0){
        return true;
    }
 
    // return false if email does not exist in the database
    return false;
}

 
// check if given email exist in the database
function emailExists(){
 
    // query to check if email exists
    $query = "SELECT id_utilisateur, mdp, role, droit_reservation, niveau_tarif
            FROM utilisateur
            WHERE email = ?
            LIMIT 0,1";
 
    // prepare the query
    $stmt = $this->conn->prepare( $query );
 
    // sanitize
    $this->email=htmlspecialchars(strip_tags($this->email));
 
    // bind given email value
    $stmt->bindParam(1, $this->email);
 
    // execute the query
    //$stmt->execute(array('?'=>$this->email));
    $stmt->execute();
 
    // get number of rows
    $num = $stmt->rowCount();
 
    // if email exists, assign values to object properties for easy access and use for php sessions
    if($num>0){
 
        // get record details / values
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
 
        // assign values to object properties
        $this->id = $row['id_utilisateur'];
        $this->role = $row['role'];
        $this->mdp = $row['mdp'];
        $this->droit_reservation = $row['droit_reservation'];
        $this->niveau_tarif = $row['niveau_tarif'];
 
        // return true because email exists in the database
        return true;
    }
 
    // return false if email does not exist in the database
    return false;
}
// update user's passeword
public function pwUpdated(){
    // can update pw of user by email because email is set to be unique in DB
    $query = "UPDATE utilisateur
            SET
            mdp = :mdp
            WHERE email = :email";
 
    // prepare the query
    $stmt = $this->conn->prepare($query);
    // sanitize and bind email value
    $this->email=htmlspecialchars(strip_tags($this->email));
    $stmt->bindParam(':email', $this->email);
 
    // bind the value of pw
    $this->mdp=htmlspecialchars(strip_tags($this->mdp));
    $password_hash = password_hash($this->mdp, PASSWORD_BCRYPT);
    $stmt->bindParam(':mdp', $password_hash);

    // execute the query
    if($stmt->execute()){
        return true;
    }
 
    return false;
}

// update a user record
public function update(){
 
    // if password needs to be updated
    $password_set=!empty($this->mdp) ? ", mdp = :mdp" : "";
 
    // if no posted password, do not update the password
    $query = "UPDATE utilisateur
            SET
                role = :role,
                droit_reservation = :droit,
                niveau_tarif = :niveau,
                email = :email
                {$password_set}
            WHERE id_utilisateur = :id";
 
    // prepare the query
    $stmt = $this->conn->prepare($query);
 
    // sanitize
    //$this->firstname=htmlspecialchars(strip_tags($this->role));
    $this->email=htmlspecialchars(strip_tags($this->email));
 
    // bind the values from the form
    $stmt->bindParam(':role', $this->role);
    $stmt->bindParam(':droit', $this->droit_reservation);
    $stmt->bindParam(':niveau', $this->niveau_tarif);
    $stmt->bindParam(':email', $this->email);
 
    // hash the password before saving to database
    if(!empty($this->mdp)){
        $this->mdp=htmlspecialchars(strip_tags($this->mdp));
        $password_hash = password_hash($this->mdp, PASSWORD_BCRYPT);
        $stmt->bindParam(':mdp', $password_hash);
    }
 
    // unique ID of record to be edited
    $stmt->bindParam(':id', $this->id);
 
    // execute the query
    if($stmt->execute()){
        return true;
    }
 
    return false;
}

function updateRoleAdherent(){
    $query = "UPDATE utilisateur
            SET
                role = :role
            WHERE id_utilisateur = :id";
     // prepare the query
     $stmt = $this->conn->prepare($query);
     $this->id=htmlspecialchars(strip_tags($this->id));
     $role = 'adherent';
     $stmt->bindParam(':role', $role);
     $stmt->bindParam(':id', $this->id);
     // execute the query
    if($stmt->execute()){
        return true;
    }
 
    return false;
}
// delete user
function delete(){
    
    // delete query
    $query = "DELETE FROM utilisateur WHERE id_utilisateur = ?";

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
// search user
function search($keywords){
    
    // select all query
    $query = "SELECT * FROM
                " . $this->table_name . " 
            WHERE
                email LIKE ? OR role LIKE ? OR id_utilisateur LIKE ?
            ORDER BY
                email ASC";

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
// search user
function search_email(){
    
    // select all query
    $query = "SELECT * FROM
                " . $this->table_name . " 
            WHERE
                email = ? 
            ";

    // prepare query statement
    $stmt = $this->conn->prepare($query);

    // sanitize
    $email=htmlspecialchars(strip_tags($this->email));

    // bind
    $stmt->bindParam(1, $email);
   
    $stmt->execute();
 
    // get number of rows
    $num = $stmt->rowCount();
 
    // if email exists, assign values to object properties for easy access and use for php sessions
    if($num>0){
        return true;
    }
 
    // return false if email does not exist in the database
    return false;
}

// read users with pagination
public function readPaging($from_record_num, $records_per_page){
    
    // select query
    $query = "SELECT * FROM utilisateur ORDER BY email ASC LIMIT ?,?";
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

 // used for paging users
 public function count(){
    $query = "SELECT COUNT(*) as total_rows FROM " . $this->table_name . "";

    $stmt = $this->conn->prepare( $query );
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    return $row['total_rows'];
}

}
?>