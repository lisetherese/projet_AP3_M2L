<?php
class Database{
  
    // specify your own database credentials
    private $host = "127.0.0.1";
    private $db_name = "projet_db";
    private $username = "root";
    private $password = "";
    private $port = "3306";
    public $conn;
  
    // get the database connection
    public function getConnection(){
  
        $this->conn = null;
  
        try{
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name. ";port=".$this->port, $this->username, $this->password);
            $this->conn->exec("set names utf8");
        }catch(PDOException $exception){
            echo "Echec de connexion: " . $exception->getMessage();
        }
  
        return $this->conn;
    }
}
?>