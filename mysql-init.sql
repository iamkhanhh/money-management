/*
MySQL Backup
Database: money_management
Backup Time: 2024-05-17 00:17:13
*/

ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'khanh123';
FLUSH PRIVILEGES;

CREATE DATABASE IF NOT EXISTS money_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE money_management;

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS `money_management`.`budget`;
DROP TABLE IF EXISTS `money_management`.`exchange`;
DROP TABLE IF EXISTS `money_management`.`income`;
DROP TABLE IF EXISTS `money_management`.`users`;
CREATE TABLE `budget` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `budget_month` int NOT NULL,
  `budget_year` int NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `amount_of_money` int NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `amount_used` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `exchange` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` nvarchar(255) NOT NULL,
  `payment_method` varchar(255) NOT NULL,
  `user_id` int NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `amount_of_money` int NOT NULL,
  `exchange_date` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `income` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `income_month` int NOT NULL,
  `income_year` int NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `total_money_income` int NOT NULL,
  `total_money_used` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userName` nvarchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `profession` varchar(255) NOT NULL,
  `fullName` nvarchar(255) NOT NULL,
  `isDeleted` tinyint NOT NULL,
  `role` varchar(255) NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `date_of_birth` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
BEGIN;
LOCK TABLES `money_management`.`budget` WRITE;
DELETE FROM `money_management`.`budget`;
INSERT INTO `money_management`.`budget` (`id`,`user_id`,`budget_month`,`budget_year`,`createdAt`,`updatedAt`,`amount_of_money`,`category_name`,`amount_used`) VALUES (1, 1, 5, 2024, '2024-05-01 14:29:40.917524', '2024-05-16 22:54:17.000000', 2566666, 'food', 843000),(2, 1, 5, 2024, '2024-05-01 14:29:40.917524', '2024-05-16 22:54:17.000000', 2916666, 'education', 740000),(3, 1, 5, 2024, '2024-05-01 14:29:40.917524', '2024-05-16 22:54:17.000000', 0, 'entertainment', 720000),(4, 1, 5, 2024, '2024-05-01 14:29:40.917524', '2024-05-16 22:54:17.000000', 1516666, 'clothes', 650000),(5, 1, 5, 2024, '2024-05-01 14:29:40.917524', '2024-05-16 22:54:17.000000', 0, 'invest', 830000),(6, 1, 5, 2024, '2024-05-01 14:29:40.917524', '2024-05-16 22:54:17.000000', 0, 'other', 860000),(7, 1, 4, 2024, '2024-05-01 15:32:37.077299', '2024-05-01 15:32:37.077299', 2000000, 'food', 640000),(8, 1, 4, 2024, '2024-05-01 15:32:37.077299', '2024-05-01 15:32:37.077299', 2000000, 'education', 840000),(9, 1, 4, 2024, '2024-05-01 15:32:37.077299', '2024-05-01 15:32:37.077299', 2000000, 'entertainment', 900000),(10, 1, 4, 2024, '2024-05-01 15:32:37.077299', '2024-05-01 15:32:37.077299', 2000000, 'clothes', 950000),(11, 1, 4, 2024, '2024-05-01 15:32:37.077299', '2024-05-01 15:32:37.077299', 2000000, 'invest', 770000),(12, 1, 4, 2024, '2024-05-01 15:32:37.077299', '2024-05-01 15:32:37.077299', 2000000, 'other', 462000),(19, 6, 5, 2024, '2024-05-16 22:09:53.460958', '2024-05-16 22:09:53.460958', 100000, 'food', 0),(20, 6, 5, 2024, '2024-05-16 22:09:53.467678', '2024-05-16 22:09:53.467678', 200000, 'entertainment', 0),(21, 6, 5, 2024, '2024-05-16 22:09:53.474774', '2024-05-16 22:09:53.474774', 100000, 'education', 0),(22, 6, 5, 2024, '2024-05-16 22:09:53.484646', '2024-05-16 22:12:47.000000', 200000, 'clothes', 300000),(23, 6, 5, 2024, '2024-05-16 22:09:53.491672', '2024-05-16 22:09:53.491672', 100000, 'invest', 0),(24, 6, 5, 2024, '2024-05-16 22:09:53.497816', '2024-05-16 22:09:53.497816', 200000, 'other', 0),(25, 7, 5, 2024, '2024-05-16 22:18:06.007095', '2024-05-16 22:20:06.000000', 6000000, 'food', 0),(26, 7, 5, 2024, '2024-05-16 22:18:06.018294', '2024-05-16 22:20:06.000000', 800000, 'entertainment', 0),(27, 7, 5, 2024, '2024-05-16 22:18:06.025927', '2024-05-16 22:20:06.000000', 3000000, 'education', 0),(28, 7, 5, 2024, '2024-05-16 22:18:06.036912', '2024-05-16 22:20:06.000000', 600000, 'clothes', 0),(29, 7, 5, 2024, '2024-05-16 22:18:06.044856', '2024-05-16 22:24:25.000000', 7700000, 'invest', 99000000),(30, 7, 5, 2024, '2024-05-16 22:18:06.052988', '2024-05-16 22:20:06.000000', 80, 'other', 0),(31, 8, 5, 2024, '2024-05-16 22:31:36.624813', '2024-05-16 22:37:08.000000', 14100000, 'food', 20000000),(32, 8, 5, 2024, '2024-05-16 22:31:36.632109', '2024-05-16 22:32:25.000000', 9400000, 'entertainment', 0),(33, 8, 5, 2024, '2024-05-16 22:31:36.640320', '2024-05-16 22:32:25.000000', 11750000, 'education', 0),(34, 8, 5, 2024, '2024-05-16 22:31:36.647457', '2024-05-16 22:32:25.000000', 4700000, 'clothes', 0),(35, 8, 5, 2024, '2024-05-16 22:31:36.655190', '2024-05-16 22:32:25.000000', 2350000, 'invest', 0),(36, 8, 5, 2024, '2024-05-16 22:31:36.662971', '2024-05-16 22:32:25.000000', 4700000, 'other', 0),(37, 9, 5, 2024, '2024-05-16 22:52:32.611757', '2024-05-16 22:52:32.611757', 500000, 'food', 0),(38, 9, 5, 2024, '2024-05-16 22:52:32.621535', '2024-05-16 22:52:32.621535', 500000, 'entertainment', 0),(39, 9, 5, 2024, '2024-05-16 22:52:32.630644', '2024-05-16 22:52:32.630644', 500000, 'education', 0),(40, 9, 5, 2024, '2024-05-16 22:52:32.640048', '2024-05-16 22:52:32.640048', 500000, 'clothes', 0),(41, 9, 5, 2024, '2024-05-16 22:52:32.649319', '2024-05-16 22:52:32.649319', 500000, 'invest', 0),(42, 9, 5, 2024, '2024-05-16 22:52:32.659994', '2024-05-16 22:52:32.659994', 500000, 'other', 0);
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `money_management`.`exchange` WRITE;
DELETE FROM `money_management`.`exchange`;
INSERT INTO `money_management`.`exchange` (`id`,`name`,`payment_method`,`user_id`,`category_name`,`createdAt`,`updatedAt`,`amount_of_money`,`exchange_date`) VALUES (1, 'Transaction 1', 'Cash', 1, 'food', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 100000, '2024-05-05'),(2, 'Transaction 2', 'Debit card', 1, 'education', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 150000, '2024-05-06'),(3, 'Transaction 3', 'Credit card', 1, 'invest', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 200000, '2024-05-07'),(4, 'Transaction 4', 'e-Wallet', 1, 'entertainment', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 120000, '2024-05-08'),(5, 'Transaction 5', 'Cash', 1, 'other', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 180000, '2024-05-09'),(6, 'Transaction 6', 'Debit card', 1, 'food', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 90000, '2024-05-10'),(7, 'Transaction 7', 'Credit card', 1, 'education', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 140000, '2024-05-11'),(8, 'Transaction 8', 'e-Wallet', 1, 'invest', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 160000, '2024-05-12'),(9, 'Transaction 9', 'Cash', 1, 'entertainment', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 110000, '2024-05-13'),(10, 'Transaction 10', 'Debit card', 1, 'other', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 170000, '2024-05-14'),(11, 'Transaction 11', 'Credit card', 1, 'food', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 190000, '2024-05-15'),(12, 'Transaction 12', 'e-Wallet', 1, 'education', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 200000, '2024-05-16'),(13, 'Transaction 13', 'Cash', 1, 'invest', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 210000, '2024-05-17'),(14, 'Transaction 14', 'Debit card', 1, 'entertainment', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 220000, '2024-05-18'),(15, 'Transaction 15', 'Credit card', 1, 'other', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 230000, '2024-05-19'),(16, 'Transaction 16', 'e-Wallet', 1, 'food', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 240000, '2024-05-20'),(17, 'Transaction 17', 'Cash', 1, 'education', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 250000, '2024-05-21'),(18, 'Transaction 18', 'Debit card', 1, 'invest', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 260000, '2024-05-22'),(19, 'Transaction 19', 'Credit card', 1, 'entertainment', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 270000, '2024-05-23'),(20, 'Transaction 20', 'e-Wallet', 1, 'other', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 280000, '2024-05-24'),(21, 'Transaction 21', 'e-Wallet', 1, 'clothes', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 200000, '2024-05-24'),(22, 'Transaction 22', 'e-Wallet', 1, 'clothes', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 150000, '2024-05-29'),(23, 'Transaction 23', 'e-Wallet', 1, 'clothes', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 300000, '2024-05-30'),(24, 'Transaction 1', 'Cash', 1, 'food', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 120000, '2024-04-05'),(25, 'Transaction 2', 'Debit card', 1, 'education', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 100000, '2024-04-06'),(26, 'Transaction 3', 'Credit card', 1, 'invest', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 150000, '2024-04-07'),(27, 'Transaction 4', 'e-Wallet', 1, 'entertainment', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 300000, '2024-04-08'),(28, 'Transaction 5', 'Cash', 1, 'other', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 99000, '2024-04-09'),(29, 'Transaction 6', 'Debit card', 1, 'food', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 90000, '2024-04-10'),(30, 'Transaction 7', 'Credit card', 1, 'education', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 140000, '2024-04-11'),(31, 'Transaction 8', 'e-Wallet', 1, 'invest', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 150000, '2024-04-12'),(32, 'Transaction 9', 'Cash', 1, 'entertainment', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 110000, '2024-04-13'),(33, 'Transaction 10', 'Debit card', 1, 'other', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 170000, '2024-04-14'),(34, 'Transaction 11', 'Credit card', 1, 'food', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 190000, '2024-04-15'),(35, 'Transaction 12', 'e-Wallet', 1, 'education', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 200000, '2024-04-16'),(36, 'Transaction 13', 'Cash', 1, 'invest', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 210000, '2024-04-17'),(37, 'Transaction 14', 'Debit card', 1, 'entertainment', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 220000, '2024-04-18'),(38, 'Transaction 15', 'Credit card', 1, 'other', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 80000, '2024-04-19'),(39, 'Transaction 16', 'e-Wallet', 1, 'food', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 240000, '2024-04-20'),(40, 'Transaction 17', 'Cash', 1, 'education', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 400000, '2024-04-21'),(41, 'Transaction 18', 'Debit card', 1, 'invest', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 260000, '2024-04-22'),(42, 'Transaction 19', 'Credit card', 1, 'entertainment', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 270000, '2024-04-23'),(43, 'Transaction 20', 'e-Wallet', 1, 'other', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 113000, '2024-04-24'),(44, 'Transaction 21', 'e-Wallet', 1, 'clothes', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 150000, '2024-04-24'),(45, 'Transaction 22', 'e-Wallet', 1, 'clothes', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 500000, '2024-04-29'),(46, 'Transaction 23', 'e-Wallet', 1, 'clothes', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 300000, '2024-04-30'),(47, 'Vegency', 'Credit card', 6, 'Clothes', '2024-05-16 22:12:24.063712', '2024-05-16 22:12:24.063712', 100000, '2024-05-12'),(48, 'NYC', 'Cash', 6, 'Clothes', '2024-05-16 22:12:47.763485', '2024-05-16 22:12:47.763485', 200000, '2024-05-15'),(49, 'mua nha', 'Credit card', 7, 'Invest', '2024-05-16 22:24:25.017100', '2024-05-16 22:24:25.017100', 99000000, '2024-05-02'),(50, 'Đinh Đức Hiếu', 'Credit card', 8, 'Food', '2024-05-16 22:37:08.468675', '2024-05-16 22:37:08.468675', 20000000, '2024-05-16');
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `money_management`.`income` WRITE;
DELETE FROM `money_management`.`income`;
INSERT INTO `money_management`.`income` (`id`,`user_id`,`income_month`,`income_year`,`createdAt`,`updatedAt`,`total_money_income`,`total_money_used`) VALUES (1, 1, 5, 2024, '2024-05-01 14:29:40.923666', '2024-05-16 22:54:17.000000', 10000000, 4643000),(2, 1, 4, 2024, '2024-05-01 15:35:12.852376', '2024-05-01 15:35:12.852376', 13000000, 4562000),(4, 6, 5, 2024, '2024-05-16 22:09:53.442760', '2024-05-16 22:12:47.000000', 1000000, 300000),(5, 7, 5, 2024, '2024-05-16 22:18:05.993546', '2024-05-16 22:24:25.000000', 900000000, 99000000),(6, 8, 5, 2024, '2024-05-16 22:31:36.616336', '2024-05-16 22:37:08.000000', 100000000, 20000000),(7, 9, 5, 2024, '2024-05-16 22:52:32.596407', '2024-05-16 22:52:32.596407', 3000000, 0);
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `money_management`.`users` WRITE;
DELETE FROM `money_management`.`users`;
INSERT INTO `money_management`.`users` (`id`,`userName`,`password`,`email`,`gender`,`profession`,`fullName`,`isDeleted`,`role`,`createdAt`,`updatedAt`,`date_of_birth`) VALUES (1, 'iamkhanhh', '$2b$12$Px.CVrYoU59VUO1DokbrAe4uns5Ky4fK8sXGwCEgnQn32ZeevMUcy', 'khanh9102004@gmail.com', 'male', 'IT', 'Nguyễn Quốc Khánh ', 0, 'admin', '2024-04-23 13:59:43.005819', '2024-05-07 00:02:06.000000', '2004-10-09'),(2, 'iamkhanhhhhh', '$2b$12$DKt4DPhqWzwS2WDUkuwb8eIbP9Zhhfj4n.CinWlEIg8cPA13MJRwG', 'khanh9102004@gmail.com', 'male', 'Student', 'Nguyễn Quốc Khánh', 1, 'user', '2024-04-23 14:07:51.291646', '2024-05-16 23:04:59.000000', '1111-11-10'),(4, 'doctor123', '$2b$12$sDo1/8pGZ4y20N1MMv3rlOquwmggzmeANpolJFnInhf5s6z2khSS2', 'test123@gmail.com', 'female', 'Doctor', 'testDoctor', 0, 'user', '2024-05-12 23:44:59.110229', '2024-05-12 23:44:59.110229', '2023-05-18'),(5, 'Kiendz', '$2b$12$5BcCaggkc1W.9ELfOnvEKuRQ1Wvx6H9D8J7TgYIVupiNOdNHlRnzi', 'kienvanvo7777@gmail.com', 'other', 'IT', 'Kiendz', 0, 'admin', '2024-05-16 21:58:53.200242', '2024-05-16 21:59:02.000000', '2004-06-28'),(6, 'nguyen khanh', '$2b$12$453VLCuIjoLkg/WfVyU8jOfUqT72HPnpwkDNEcl5QpAn4.AOtG4v2', 'ng63viet@gmail.com', 'male', 'Other', 'ng63viet', 0, 'user', '2024-05-16 22:08:05.593206', '2024-05-16 22:08:05.593206', '2002-12-21'),(7, '모모', '$2b$12$O9NLbsvl87F/rFLqYA/gCO.K6NKquI9SfmKFtU211cL1j.IQ5NRqC', 'vuzila18@gmail.com', 'male', 'Student', '황민', 0, 'user', '2024-05-16 22:15:25.432937', '2024-05-16 22:15:25.432937', '2004-11-29'),(8, 'em hieu', '$2b$12$3RufWdrqdCTd8Iwx467VP.ZXH3yNT1lj1Tgs.XFkakAGcge.lfHF2', 'hieuddhe181617@fpt.edu.vn', 'male', 'Student', 'Dinh Duc Hieu', 0, 'user', '2024-05-16 22:22:37.470111', '2024-05-16 22:22:37.470111', '2004-09-21'),(9, 'phi30', '$2b$12$FrtQrjfKHsxZp2uLBXUtp.h6abW6pyiV5ukt2xUrn0hOGGXrK1NHi', 'phi30deptrai@gmail.com', 'male', 'Student', 'Đỗ Hoàng Phi', 0, 'user', '2024-05-16 22:48:47.625250', '2024-05-16 22:48:47.625250', '2004-11-30');
UNLOCK TABLES;
COMMIT;
