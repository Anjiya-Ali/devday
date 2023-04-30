-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 30, 2023 at 02:21 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `systems`
--

-- --------------------------------------------------------

--
-- Table structure for table `managers`
--

CREATE TABLE `managers` (
  `UserId` int(11) NOT NULL,
  `ProjectId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `managers`
--

INSERT INTO `managers` (`UserId`, `ProjectId`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6);

-- --------------------------------------------------------

--
-- Table structure for table `organization`
--

CREATE TABLE `organization` (
  `Id` int(11) NOT NULL,
  `Name` varchar(30) NOT NULL,
  `Country` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `organization`
--

INSERT INTO `organization` (`Id`, `Name`, `Country`) VALUES
(1, 'Securiti', 'Pakistan'),
(2, 'Systems', 'Pakistan'),
(3, 'Gaditek', 'Pakistan'),
(4, 'Motive', 'UK'),
(5, 'Tesla', 'USA');

-- --------------------------------------------------------

--
-- Table structure for table `organizationprojects`
--

CREATE TABLE `organizationprojects` (
  `OrganizationId` int(11) NOT NULL,
  `ProjectId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `organizationprojects`
--

INSERT INTO `organizationprojects` (`OrganizationId`, `ProjectId`) VALUES
(2, 1),
(2, 2),
(1, 3),
(3, 4),
(4, 5),
(5, 6);

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `Id` int(11) NOT NULL,
  `Name` varchar(30) NOT NULL,
  `Key` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`Id`, `Name`, `Key`) VALUES
(1, 'Backend', '12345'),
(2, 'Backend', '12765'),
(3, 'Frontend', '84329'),
(4, 'Frontend', '37573'),
(5, 'Database', '73628'),
(6, 'Database', '80633');

-- --------------------------------------------------------

--
-- Table structure for table `projectwork`
--

CREATE TABLE `projectwork` (
  `ProjectId` int(11) NOT NULL,
  `WorkitemId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `projectwork`
--

INSERT INTO `projectwork` (`ProjectId`, `WorkitemId`) VALUES
(1, 1),
(3, 3),
(4, 4),
(6, 6);

-- --------------------------------------------------------

--
-- Table structure for table `userprojects`
--

CREATE TABLE `userprojects` (
  `ProjectId` int(11) NOT NULL,
  `UserId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `userprojects`
--

INSERT INTO `userprojects` (`ProjectId`, `UserId`) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `Id` int(11) NOT NULL,
  `FirstName` varchar(30) NOT NULL,
  `LastName` varchar(30) NOT NULL,
  `Email` varchar(30) NOT NULL,
  `Password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`Id`, `FirstName`, `LastName`, `Email`, `Password`) VALUES
(1, 'Insha', 'Samnani', 'insha.samnani2002@gmail.com', 'hello'),
(2, 'Anjiya', 'Ali', 'anjiyaa@gmail.com', 'hello'),
(3, 'Ismail', 'Ansari', 'iaa.nuces@gmail.com', 'hello');

-- --------------------------------------------------------

--
-- Table structure for table `userwork`
--

CREATE TABLE `userwork` (
  `UserId` int(11) NOT NULL,
  `WorkitemId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `userwork`
--

INSERT INTO `userwork` (`UserId`, `WorkitemId`) VALUES
(1, 1),
(1, 3),
(1, 4),
(1, 6);

-- --------------------------------------------------------

--
-- Table structure for table `workitems`
--

CREATE TABLE `workitems` (
  `Id` int(11) NOT NULL,
  `Name` varchar(30) NOT NULL,
  `Nature` varchar(30) NOT NULL,
  `State` varchar(10) NOT NULL,
  `StartDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `workitems`
--

INSERT INTO `workitems` (`Id`, `Name`, `Nature`, `State`, `StartDate`) VALUES
(1, 'User Requirements', 'story', 'Resolved', '2023-04-11'),
(3, 'Stakeholder-Feedback', 'story', 'New', '2023-04-11'),
(4, 'Estimations', 'story', 'New', '2023-11-11'),
(6, 'Scrum-Meeting', 'story', 'New', '0000-00-00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `managers`
--
ALTER TABLE `managers`
  ADD KEY `fk_ma` (`ProjectId`),
  ADD KEY `fk1_ma` (`UserId`);

--
-- Indexes for table `organization`
--
ALTER TABLE `organization`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `organizationprojects`
--
ALTER TABLE `organizationprojects`
  ADD KEY `fk_orpr` (`OrganizationId`),
  ADD KEY `fk1_orpr` (`ProjectId`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `projectwork`
--
ALTER TABLE `projectwork`
  ADD KEY `fk_prwo` (`ProjectId`),
  ADD KEY `fk1_prwo` (`WorkitemId`);

--
-- Indexes for table `userprojects`
--
ALTER TABLE `userprojects`
  ADD KEY `fk_uspr` (`UserId`),
  ADD KEY `fk1_uspr` (`ProjectId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `userwork`
--
ALTER TABLE `userwork`
  ADD KEY `fk_uswo` (`UserId`),
  ADD KEY `fk1_uswo` (`WorkitemId`);

--
-- Indexes for table `workitems`
--
ALTER TABLE `workitems`
  ADD PRIMARY KEY (`Id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `organization`
--
ALTER TABLE `organization`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `workitems`
--
ALTER TABLE `workitems`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `managers`
--
ALTER TABLE `managers`
  ADD CONSTRAINT `fk1_ma` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`),
  ADD CONSTRAINT `fk_ma` FOREIGN KEY (`ProjectId`) REFERENCES `projects` (`Id`);

--
-- Constraints for table `organizationprojects`
--
ALTER TABLE `organizationprojects`
  ADD CONSTRAINT `fk1_orpr` FOREIGN KEY (`ProjectId`) REFERENCES `projects` (`Id`),
  ADD CONSTRAINT `fk_orpr` FOREIGN KEY (`OrganizationId`) REFERENCES `organization` (`Id`);

--
-- Constraints for table `projectwork`
--
ALTER TABLE `projectwork`
  ADD CONSTRAINT `fk1_prwo` FOREIGN KEY (`WorkitemId`) REFERENCES `workitems` (`Id`),
  ADD CONSTRAINT `fk_prwo` FOREIGN KEY (`ProjectId`) REFERENCES `projects` (`Id`);

--
-- Constraints for table `userprojects`
--
ALTER TABLE `userprojects`
  ADD CONSTRAINT `fk1_uspr` FOREIGN KEY (`ProjectId`) REFERENCES `projects` (`Id`),
  ADD CONSTRAINT `fk_uspr` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`);

--
-- Constraints for table `userwork`
--
ALTER TABLE `userwork`
  ADD CONSTRAINT `fk1_uswo` FOREIGN KEY (`WorkitemId`) REFERENCES `workitems` (`Id`),
  ADD CONSTRAINT `fk_uswo` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
