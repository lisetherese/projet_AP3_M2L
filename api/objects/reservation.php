<?php
class Reservation{
  
    // database connection and table name
    private $conn;
    private $table_name = "reservation";
    
    // object properties
    public $id;
    public $breve_description;
    public $description_complete;
    public $etat_confirmation;
    public $date_heure_debut;
    public $date_heure_update; //date de faire le changement
    public $date_heure_fin;
    public $id_utilisateur;
    public $id_tarif_reservation;
    public $id_salle;
  
    public function __construct($db){
        $this->conn = $db;
    }

    // used by select drop-down list
    public function read(){
    
        //select all data
        $query = "SELECT * FROM reservation ORDER BY date_heure_debut ASC";
        $stmt = $this->conn->prepare( $query );
        $stmt->execute();
    
        return $stmt;
    }
    // used when filling up the update Reservation form
    function readOne(){
    
        // query to read single record
        $query = "SELECT * FROM reservation WHERE id_reservation = :id LIMIT 0,1";

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
       $this->id = $row['id_reservation'];
       $this->breve_description = $row['breve_description'];
       $this->description_complete = $row['description_complete'];
       $this->etat_confirmation = $row['etat_confirmation'];
       $this->date_heure_debut = $row['date_heure_debut'];
       $this->date_heure_fin = $row['date_heure_fin'];
       $this->date_heure_update = $row['date_heure_update'];
       $this->id_utilisateur = $row['id_utilisateur'];
       $this->id_tarif_reservation = $row['id_tarif_reservation'];
       $this->id_salle = $row['id_salle'];
       return true;
       }
      
   }    
   // create new ligue record
    function create(){
    
        // insert query
        $query = "INSERT INTO reservation
                SET
                    breve_description = :breve_description,
                    description_complete = :description_complete,
                    etat_confirmation = :etat_confirmation,
                    date_heure_debut = :date_heure_debut,
                    date_heure_fin = :date_heure_fin,
                    date_heure_update = :date_heure_update,
                    id_utilisateur = :id_utilisateur,
                    id_tarif_reservation = :id_tarif_reservation,
                    id_salle = :id_salle";
    
        // prepare the query
        $stmt = $this->conn->prepare($query);
    
        // sanitize
        $this->breve_description=htmlspecialchars(strip_tags($this->breve_description));
        $this->description_complete=htmlspecialchars(strip_tags($this->description_complete));
        $this->etat_confirmation=htmlspecialchars(strip_tags($this->etat_confirmation));
        $this->date_heure_debut=htmlspecialchars(strip_tags($this->date_heure_debut));
        $this->date_heure_update=htmlspecialchars(strip_tags($this->date_heure_update));
        $this->date_heure_fin=htmlspecialchars(strip_tags($this->date_heure_fin));
    
        // bind the values
        $stmt->bindParam(":breve_description", $this->breve_description);
        $stmt->bindParam(":description_complete", $this->description_complete);
        $stmt->bindParam(":etat_confirmation", $this->etat_confirmation);
        $stmt->bindParam(":date_heure_debut", $this->date_heure_debut);
        $stmt->bindParam(":date_heure_update", $this->date_heure_update);
        $stmt->bindParam(":date_heure_fin", $this->date_heure_fin);
        $stmt->bindParam(":id_salle", $this->id_salle);
        $stmt->bindParam(":id_utilisateur", $this->id_utilisateur);
        $stmt->bindParam(":id_tarif_reservation", $this->id_tarif_reservation);
        
        // execute the query, also check if query was successful
        if($stmt->execute()){
            return true;
        }
    
        return false;
    }
    
    
    // update a ligue record
    public function update(){
    
        // query
        $query = "UPDATE reservation
                SET
                    breve_description = :breve_description,
                    description_complete = :description_complete,
                    etat_confirmation = :etat_confirmation,
                    date_heure_debut = :date_heure_debut,
                    date_heure_fin = :date_heure_fin,
                    date_heure_update = :date_heure_update,
                    id_utilisateur = :id_utilisateur,
                    id_tarif_reservation = :id_tarif_reservation,
                    id_salle = :id_salle
                WHERE id_reservation = :id";
    
        // prepare the query
        $stmt = $this->conn->prepare($query);
    
        // sanitize
        $this->breve_description=htmlspecialchars(strip_tags($this->breve_description));
        $this->description_complete=htmlspecialchars(strip_tags($this->description_complete));
        $this->etat_confirmation=htmlspecialchars(strip_tags($this->etat_confirmation));
        $this->date_heure_debut=htmlspecialchars(strip_tags($this->date_heure_debut));
        $this->date_heure_update=htmlspecialchars(strip_tags($this->date_heure_update));
        $this->date_heure_fin=htmlspecialchars(strip_tags($this->date_heure_fin));
       
    
        // bind the values
        $stmt->bindParam(":breve_description", $this->breve_description);
        $stmt->bindParam(":description_complete", $this->description_complete);
        $stmt->bindParam(":etat_confirmation", $this->etat_confirmation);
        $stmt->bindParam(":date_heure_debut", $this->date_heure_debut);
        $stmt->bindParam(":date_heure_update", $this->date_heure_update);
        $stmt->bindParam(":date_heure_fin", $this->date_heure_fin);
        $stmt->bindParam(":id_salle", $this->id_salle);
        $stmt->bindParam(":id_utilisateur", $this->id_utilisateur);
        $stmt->bindParam(":id_tarif_reservation", $this->id_tarif_reservation);
       
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
        $query = "DELETE FROM reservation WHERE id_reservation = ?";

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
                    breve_description LIKE ? OR description_complete LIKE ?
                ORDER BY
                    date_heure_debut ASC";
    
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

    // read Reservations with pagination
    public function readPaging($from_record_num, $records_per_page){
    
        // select query
        $query = "SELECT * FROM reservation ORDER BY date_heure_debut ASC LIMIT ?,?";
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