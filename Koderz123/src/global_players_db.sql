-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 02, 2025 at 08:03 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `galactic_tower_defense_td`
--

-- --------------------------------------------------------

--
-- Table structure for table `global_players_db`
--

CREATE TABLE `global_players_db` (
  `playerID` int(11) NOT NULL,
  `playerName` varchar(50) NOT NULL,
  `playerPassword` varchar(255) NOT NULL,
  `playerAccountLvl` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `global_players_db`
--

INSERT INTO `global_players_db` (`playerID`, `playerName`, `playerPassword`, `playerAccountLvl`) VALUES
(1, 'Leonard Hoffstader', 'NegelectedChild123', 1),
(2, 'Sheldon Cooper', 'SpockIsLord11', 1),
(3, 'Penny Teller', 'WalkOfShame00', 1),
(4, 'Howard Walowitz', 'MamasBoy778', 1),
(5, 'Nigel Uno', 'Numba1', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `global_players_db`
--
ALTER TABLE `global_players_db`
  ADD PRIMARY KEY (`playerID`),
  ADD UNIQUE KEY `playerName` (`playerName`),
  ADD UNIQUE KEY `playerID` (`playerID`,`playerName`);
COMMIT;


-- --------------------------------------------------------

-- Table structure for table `highscores`
--

CREATE TABLE `highscores` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `playerID` INT NOT NULL,
  `score` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`playerID`) REFERENCES `global_players_db`(`playerID`) ON DELETE CASCADE
);
ALTER TABLE highscores ADD COLUMN mode VARCHAR(20) NOT NULL DEFAULT 'relaxed';

CREATE TABLE saved_games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  playerID INT NOT NULL,
  money INT NOT NULL,
  wave INT NOT NULL,
  health INT NOT NULL,
  towers TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (playerID) REFERENCES global_players_db(playerID) ON DELETE CASCADE
);



/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
