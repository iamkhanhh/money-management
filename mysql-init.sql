/*
MySQL Backup
Database: money_management
Backup Time: 2024-05-13 15:20:41
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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `exchange` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `payment_method` varchar(255) NOT NULL,
  `user_id` int NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `amount_of_money` int NOT NULL,
  `exchange_date` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userName` varchar(255) NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
BEGIN;
LOCK TABLES `money_management`.`budget` WRITE;
DELETE FROM `money_management`.`budget`;
INSERT INTO `money_management`.`budget` (`id`,`user_id`,`budget_month`,`budget_year`,`createdAt`,`updatedAt`,`amount_of_money`,`category_name`,`amount_used`) VALUES (1, 1, 5, 2024, '2024-05-01 14:29:40.917524', '2024-05-01 14:29:40.917524', 2000000, 'food', 843000),(2, 1, 5, 2024, '2024-05-01 14:29:40.917524', '2024-05-01 14:29:40.917524', 2000000, 'education', 740000),(3, 1, 5, 2024, '2024-05-01 14:29:40.917524', '2024-05-01 14:29:40.917524', 2000000, 'entertainment', 720000),(4, 1, 5, 2024, '2024-05-01 14:29:40.917524', '2024-05-01 14:29:40.917524', 2000000, 'clothes', 650000),(5, 1, 5, 2024, '2024-05-01 14:29:40.917524', '2024-05-01 14:29:40.917524', 2000000, 'invest', 830000),(6, 1, 5, 2024, '2024-05-01 14:29:40.917524', '2024-05-01 14:29:40.917524', 2000000, 'other', 860000),(7, 1, 4, 2024, '2024-05-01 15:32:37.077299', '2024-05-01 15:32:37.077299', 2000000, 'food', 640000),(8, 1, 4, 2024, '2024-05-01 15:32:37.077299', '2024-05-01 15:32:37.077299', 2000000, 'education', 840000),(9, 1, 4, 2024, '2024-05-01 15:32:37.077299', '2024-05-01 15:32:37.077299', 2000000, 'entertainment', 900000),(10, 1, 4, 2024, '2024-05-01 15:32:37.077299', '2024-05-01 15:32:37.077299', 2000000, 'clothes', 950000),(11, 1, 4, 2024, '2024-05-01 15:32:37.077299', '2024-05-01 15:32:37.077299', 2000000, 'invest', 770000),(12, 1, 4, 2024, '2024-05-01 15:32:37.077299', '2024-05-01 15:32:37.077299', 2000000, 'other', 462000);
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `money_management`.`exchange` WRITE;
DELETE FROM `money_management`.`exchange`;
INSERT INTO `money_management`.`exchange` (`id`,`name`,`payment_method`,`user_id`,`category_name`,`createdAt`,`updatedAt`,`amount_of_money`,`exchange_date`) VALUES (1, 'Transaction 1', 'Cash', 1, 'food', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 100000, '2024-05-05'),(2, 'Transaction 2', 'Debit card', 1, 'education', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 150000, '2024-05-06'),(3, 'Transaction 3', 'Credit card', 1, 'invest', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 200000, '2024-05-07'),(4, 'Transaction 4', 'e-Wallet', 1, 'entertainment', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 120000, '2024-05-08'),(5, 'Transaction 5', 'Cash', 1, 'other', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 180000, '2024-05-09'),(6, 'Transaction 6', 'Debit card', 1, 'food', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 90000, '2024-05-10'),(7, 'Transaction 7', 'Credit card', 1, 'education', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 140000, '2024-05-11'),(8, 'Transaction 8', 'e-Wallet', 1, 'invest', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 160000, '2024-05-12'),(9, 'Transaction 9', 'Cash', 1, 'entertainment', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 110000, '2024-05-13'),(10, 'Transaction 10', 'Debit card', 1, 'other', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 170000, '2024-05-14'),(11, 'Transaction 11', 'Credit card', 1, 'food', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 190000, '2024-05-15'),(12, 'Transaction 12', 'e-Wallet', 1, 'education', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 200000, '2024-05-16'),(13, 'Transaction 13', 'Cash', 1, 'invest', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 210000, '2024-05-17'),(14, 'Transaction 14', 'Debit card', 1, 'entertainment', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 220000, '2024-05-18'),(15, 'Transaction 15', 'Credit card', 1, 'other', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 230000, '2024-05-19'),(16, 'Transaction 16', 'e-Wallet', 1, 'food', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 240000, '2024-05-20'),(17, 'Transaction 17', 'Cash', 1, 'education', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 250000, '2024-05-21'),(18, 'Transaction 18', 'Debit card', 1, 'invest', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 260000, '2024-05-22'),(19, 'Transaction 19', 'Credit card', 1, 'entertainment', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 270000, '2024-05-23'),(20, 'Transaction 20', 'e-Wallet', 1, 'other', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 280000, '2024-05-24'),(21, 'Transaction 21', 'e-Wallet', 1, 'clothes', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 200000, '2024-05-24'),(22, 'Transaction 22', 'e-Wallet', 1, 'clothes', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 150000, '2024-05-29'),(23, 'Transaction 23', 'e-Wallet', 1, 'clothes', '2024-05-01 14:29:40.900638', '2024-05-01 14:29:40.900638', 300000, '2024-05-30'),(24, 'Transaction 1', 'Cash', 1, 'food', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 120000, '2024-04-05'),(25, 'Transaction 2', 'Debit card', 1, 'education', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 100000, '2024-04-06'),(26, 'Transaction 3', 'Credit card', 1, 'invest', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 150000, '2024-04-07'),(27, 'Transaction 4', 'e-Wallet', 1, 'entertainment', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 300000, '2024-04-08'),(28, 'Transaction 5', 'Cash', 1, 'other', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 99000, '2024-04-09'),(29, 'Transaction 6', 'Debit card', 1, 'food', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 90000, '2024-04-10'),(30, 'Transaction 7', 'Credit card', 1, 'education', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 140000, '2024-04-11'),(31, 'Transaction 8', 'e-Wallet', 1, 'invest', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 150000, '2024-04-12'),(32, 'Transaction 9', 'Cash', 1, 'entertainment', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 110000, '2024-04-13'),(33, 'Transaction 10', 'Debit card', 1, 'other', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 170000, '2024-04-14'),(34, 'Transaction 11', 'Credit card', 1, 'food', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 190000, '2024-04-15'),(35, 'Transaction 12', 'e-Wallet', 1, 'education', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 200000, '2024-04-16'),(36, 'Transaction 13', 'Cash', 1, 'invest', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 210000, '2024-04-17'),(37, 'Transaction 14', 'Debit card', 1, 'entertainment', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 220000, '2024-04-18'),(38, 'Transaction 15', 'Credit card', 1, 'other', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 80000, '2024-04-19'),(39, 'Transaction 16', 'e-Wallet', 1, 'food', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 240000, '2024-04-20'),(40, 'Transaction 17', 'Cash', 1, 'education', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 400000, '2024-04-21'),(41, 'Transaction 18', 'Debit card', 1, 'invest', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 260000, '2024-04-22'),(42, 'Transaction 19', 'Credit card', 1, 'entertainment', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 270000, '2024-04-23'),(43, 'Transaction 20', 'e-Wallet', 1, 'other', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 113000, '2024-04-24'),(44, 'Transaction 21', 'e-Wallet', 1, 'clothes', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 150000, '2024-04-24'),(45, 'Transaction 22', 'e-Wallet', 1, 'clothes', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 500000, '2024-04-29'),(46, 'Transaction 23', 'e-Wallet', 1, 'clothes', '2024-05-01 15:25:19.424513', '2024-05-01 15:25:19.424513', 300000, '2024-04-30');
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `money_management`.`income` WRITE;
DELETE FROM `money_management`.`income`;
INSERT INTO `money_management`.`income` (`id`,`user_id`,`income_month`,`income_year`,`createdAt`,`updatedAt`,`total_money_income`,`total_money_used`) VALUES (1, 1, 5, 2024, '2024-05-01 14:29:40.923666', '2024-05-01 14:29:40.923666', 15000000, 4643000),(2, 1, 4, 2024, '2024-05-01 15:35:12.852376', '2024-05-01 15:35:12.852376', 13000000, 4562000);
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `money_management`.`users` WRITE;
DELETE FROM `money_management`.`users`;
INSERT INTO `money_management`.`users` (`id`,`userName`,`password`,`email`,`gender`,`profession`,`fullName`,`isDeleted`,`role`,`createdAt`,`updatedAt`,`date_of_birth`) VALUES (1, 'iamkhanhh', '$2b$12$Px.CVrYoU59VUO1DokbrAe4uns5Ky4fK8sXGwCEgnQn32ZeevMUcy', 'khanh9102004@gmail.com', 'male', 'IT', 'Nguyễn Quốc Khánh ', 0, 'admin', '2024-04-23 13:59:43.005819', '2024-05-07 00:02:06.000000', '2004-10-09'),(2, 'iamkhanhhhhh', '$2b$12$DKt4DPhqWzwS2WDUkuwb8eIbP9Zhhfj4n.CinWlEIg8cPA13MJRwG', 'khanh9102004@gmail.com', 'male', 'Student', 'Nguyễn Quốc Khánh', 0, 'user', '2024-04-23 14:07:51.291646', '2024-05-07 01:11:57.000000', '1111-11-10'),(4, 'doctor123', '$2b$12$sDo1/8pGZ4y20N1MMv3rlOquwmggzmeANpolJFnInhf5s6z2khSS2', 'test123@gmail.com', 'female', 'Doctor', 'testDoctor', 0, 'user', '2024-05-12 23:44:59.110229', '2024-05-12 23:44:59.110229', '2023-05-18');
UNLOCK TABLES;
COMMIT;
