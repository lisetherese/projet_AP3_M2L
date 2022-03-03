-- MySQL dump 10.13  Distrib 8.0.24, for Win64 (x86_64)
--
-- Host: localhost    Database: projet_db
-- ------------------------------------------------------
-- Server version	8.0.24

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bordereau`
--

DROP TABLE IF EXISTS `bordereau`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bordereau` (
  `id_bordereau` int NOT NULL AUTO_INCREMENT,
  `src_bordereau` varchar(300) DEFAULT NULL,
  `id_utilisateur` int NOT NULL,
  `etre_valide` tinyint(1) DEFAULT NULL,
  `cerfa` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id_bordereau`),
  KEY `id_utilisateur_idx` (`id_utilisateur`),
  CONSTRAINT `id_utilisateur` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bordereau`
--

LOCK TABLES `bordereau` WRITE;
/*!40000 ALTER TABLE `bordereau` DISABLE KEYS */;
INSERT INTO `bordereau` VALUES (6,'user_id_11_2022.jpg',11,1,'user_id_11_2022.pdf'),(7,'user_id_5_2022.jpg',5,1,'user_id_5_2022.pdf');
/*!40000 ALTER TABLE `bordereau` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `demandeur`
--

DROP TABLE IF EXISTS `demandeur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `demandeur` (
  `id_demandeur` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) DEFAULT NULL,
  `prenom` varchar(50) DEFAULT NULL,
  `rue` varchar(100) DEFAULT NULL,
  `cp` int DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `num_licence` int DEFAULT NULL,
  `date_naissance` date DEFAULT NULL,
  `etre_adherent` tinyint(1) DEFAULT NULL,
  `id_utilisateur` int NOT NULL,
  `id_ligue` int NOT NULL,
  PRIMARY KEY (`id_demandeur`),
  UNIQUE KEY `id_utilisateur` (`id_utilisateur`) /*!80000 INVISIBLE */,
  KEY `id_ligue` (`id_ligue`),
  CONSTRAINT `demandeur_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`),
  CONSTRAINT `id_ligue` FOREIGN KEY (`id_ligue`) REFERENCES `ligues` (`id_ligues`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `demandeur`
--

LOCK TABLES `demandeur` WRITE;
/*!40000 ALTER TABLE `demandeur` DISABLE KEYS */;
INSERT INTO `demandeur` VALUES (3,'Vincent','Le','17 rue Jean Laurent',78110,'Le vesinet',1345,'1990-10-02',1,8,3),(6,'Henry','ky','rue de la cime',91130,'ris orangis',543265,'1985-09-12',1,10,1),(25,'Vincent','Lee','rue Marechal Foche',78130,'houilles',456789,'1990-08-09',1,12,1),(34,'Kim','Sarah Phi','rue Jean Laurent',78110,'le Vesinet',45760,'1990-08-09',1,11,3),(35,'phi','Thanh Phong','7 rue du gue',78089,'le Pecq',355767,'1990-06-06',1,5,1),(36,'paris','hilton','89 rue du Pont',75015,'Paris',68799,'1995-06-14',NULL,14,3);
/*!40000 ALTER TABLE `demandeur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `domaine`
--

DROP TABLE IF EXISTS `domaine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `domaine` (
  `id_domaine` int NOT NULL,
  `libelle` varchar(50) NOT NULL,
  PRIMARY KEY (`id_domaine`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domaine`
--

LOCK TABLES `domaine` WRITE;
/*!40000 ALTER TABLE `domaine` DISABLE KEYS */;
/*!40000 ALTER TABLE `domaine` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ligne_frais`
--

DROP TABLE IF EXISTS `ligne_frais`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ligne_frais` (
  `id_ligne_frais` int NOT NULL AUTO_INCREMENT,
  `date_ligne_frais` date NOT NULL,
  `trajet` varchar(100) NOT NULL,
  `km` float NOT NULL,
  `km_valide` float NOT NULL,
  `cout_peage` float DEFAULT NULL,
  `peage_valide` float DEFAULT NULL,
  `peage_justificatif` varchar(200) DEFAULT NULL,
  `cout_repas` float DEFAULT NULL,
  `repas_valide` float DEFAULT NULL,
  `repas_justificatif` varchar(200) DEFAULT NULL,
  `cout_hebergement` float DEFAULT NULL,
  `hebergement_valide` float DEFAULT NULL,
  `justificatif` varchar(50) DEFAULT NULL,
  `id_utilisateur` int NOT NULL,
  `id_motif` int NOT NULL,
  `etre_valide` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id_ligne_frais`),
  KEY `id_utilisateur_idx` (`id_utilisateur`) /*!80000 INVISIBLE */,
  KEY `id_motif_idx` (`id_motif`),
  CONSTRAINT `id_motif` FOREIGN KEY (`id_motif`) REFERENCES `motif` (`id_motif`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ligne_frais`
--

LOCK TABLES `ligne_frais` WRITE;
/*!40000 ALTER TABLE `ligne_frais` DISABLE KEYS */;
INSERT INTO `ligne_frais` VALUES (17,'2022-01-02','paris-evry',30.6,61.2,NULL,NULL,NULL,8.5,8.5,'devisWebmana (19).pdf',NULL,NULL,NULL,11,1,1),(19,'2022-01-31','antony-paris',24.3,48.6,NULL,NULL,NULL,NULL,NULL,NULL,12.8,12.8,'faut-faire-pendant-vacance.jpg',5,1,1),(21,'2021-10-13','paris-london',567,1134,28.8,57.6,'backgV.jpg',NULL,NULL,NULL,15.6,15.6,'forH.jpg',8,4,NULL),(22,'2022-02-03','paris-lyon',546,546,NULL,NULL,NULL,5.5,16.5,'mark_watercolor.jpg',NULL,NULL,NULL,12,2,1),(23,'2022-02-23','evry-fresnes',30,30,NULL,NULL,NULL,5.5,11,'mark_watercolor.jpg',7.5,7.5,'auto_94.jfif',8,1,NULL);
/*!40000 ALTER TABLE `ligne_frais` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ligues`
--

DROP TABLE IF EXISTS `ligues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ligues` (
  `id_ligues` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  `sigle` varchar(50) NOT NULL,
  `president` varchar(100) NOT NULL,
  `reservation_an_hors_amphi` int NOT NULL,
  `reservation_amphi` tinyint(1) NOT NULL,
  `reservation_convivialite` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_ligues`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ligues`
--

LOCK TABLES `ligues` WRITE;
/*!40000 ALTER TABLE `ligues` DISABLE KEYS */;
INSERT INTO `ligues` VALUES (1,'Bordeaux','BPD','Francis Nabil',3,0,0),(2,'Loraine','M2L','Harry Potter',6,1,0),(3,'Saint Germain','PGS','Lorry Nathan',6,0,0),(4,'Normandy','NMD','Jeanne Marie',2,0,1);
/*!40000 ALTER TABLE `ligues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `motif`
--

DROP TABLE IF EXISTS `motif`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `motif` (
  `id_motif` int NOT NULL AUTO_INCREMENT,
  `libelle` varchar(50) NOT NULL,
  PRIMARY KEY (`id_motif`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `motif`
--

LOCK TABLES `motif` WRITE;
/*!40000 ALTER TABLE `motif` DISABLE KEYS */;
INSERT INTO `motif` VALUES (1,'reunion'),(2,'competition regionale'),(3,'competition nationale'),(4,'competition internationale'),(5,'stage');
/*!40000 ALTER TABLE `motif` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation` (
  `id_reservation` int NOT NULL AUTO_INCREMENT,
  `breve_description` varchar(100) NOT NULL,
  `description_complete` varchar(500) NOT NULL,
  `etat_confirmation` varchar(50) NOT NULL,
  `date_heure_debut` datetime NOT NULL,
  `date_heure_update` datetime NOT NULL,
  `date_heure_fin` datetime NOT NULL,
  `id_utilisateur` int NOT NULL,
  `id_tarif_reservation` int NOT NULL,
  `id_salle` int NOT NULL,
  PRIMARY KEY (`id_reservation`),
  KEY `id_utilisateur` (`id_utilisateur`),
  KEY `id_tarif_reservation` (`id_tarif_reservation`),
  KEY `id_salle` (`id_salle`),
  CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`),
  CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`id_tarif_reservation`) REFERENCES `tarif_reservation` (`id_tarif_reservation`),
  CONSTRAINT `reservation_ibfk_3` FOREIGN KEY (`id_salle`) REFERENCES `salle` (`id_salle`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation`
--

LOCK TABLES `reservation` WRITE;
/*!40000 ALTER TABLE `reservation` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salle`
--

DROP TABLE IF EXISTS `salle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salle` (
  `id_salle` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  `capacite` varchar(50) DEFAULT NULL,
  `id_domaine` int NOT NULL,
  PRIMARY KEY (`id_salle`),
  KEY `id_domaine` (`id_domaine`),
  CONSTRAINT `salle_ibfk_1` FOREIGN KEY (`id_domaine`) REFERENCES `domaine` (`id_domaine`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salle`
--

LOCK TABLES `salle` WRITE;
/*!40000 ALTER TABLE `salle` DISABLE KEYS */;
/*!40000 ALTER TABLE `salle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tarif_reservation`
--

DROP TABLE IF EXISTS `tarif_reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tarif_reservation` (
  `id_tarif_reservation` int NOT NULL AUTO_INCREMENT,
  `tarif` double NOT NULL,
  PRIMARY KEY (`id_tarif_reservation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarif_reservation`
--

LOCK TABLES `tarif_reservation` WRITE;
/*!40000 ALTER TABLE `tarif_reservation` DISABLE KEYS */;
/*!40000 ALTER TABLE `tarif_reservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateur` (
  `id_utilisateur` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `mdp` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL,
  `droit_reservation` tinyint(1) NOT NULL,
  `niveau_tarif` int NOT NULL,
  PRIMARY KEY (`id_utilisateur`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateur`
--

LOCK TABLES `utilisateur` WRITE;
/*!40000 ALTER TABLE `utilisateur` DISABLE KEYS */;
INSERT INTO `utilisateur` VALUES (4,'lisetherese@yahoo.com','$2y$10$yhldxgZ6ES/GCTY6gsotg.jL/DLEr4X3pVBXRaYXji4gSQ/39hvY.','admin',1,1),(5,'abc@yahoo.com','$2y$10$PnIKcfp2j4VP4t/boQbldejAHVSTr4nUHhBv2au1Gl4IOz35tf6L2','adherent',0,3),(8,'def@yahoo.com','$2y$10$F4rf1jD3dd7EsdOzuyfs1uEy2EhnN0c0/h.ah.5zI0rHM5od6VBia','adherent',1,1),(9,'hanhtrinhvedathua@gmail.com','$2y$10$WPrEEXmELVfpyBmyhIJJg.C2Bh6voG0bkV3jFI1uZou8JuPZYvxJ2','tresorier',1,1),(10,'hkkjkl@yahoo.com','$2y$10$A.EmPHXMtWUeBE038qfzn.OjIq//ugc2ex/TiaqhD4CyOYvqxq6dS','adherent',0,4),(11,'phi@gmail.com','$2y$10$iJHk0pYXv7zAdYct5ldl3OYuxlTzUYJqYhxFHJUlLmTryrDLlDCtu','adherent',0,1),(12,'phong@yahoo.com','$2y$10$R8WQ50NZTp2DnC2UuB7TkOVFMFoRYzX1017qytdgQxfo/IFSxbJre','adherent',0,1),(13,'beo@gmail.com','$2y$10$bfLLjY0qU/adT55Jlc2zte/WEOuFlh72zBpNeM7tXlakUeBN5SS2y','user',0,4),(14,'paris@yahoo.com','$2y$10$bmqiBnt/pxmd01p1iLLN0u/4lt.WSlCvgOUsghLle4RV1RpnHxbYS','user',0,4);
/*!40000 ALTER TABLE `utilisateur` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-03-03 16:14:28
