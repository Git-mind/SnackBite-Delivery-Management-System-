-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 12, 2020 at 02:17 AM
-- Server version: 5.7.19
-- PHP Version: 7.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `order`
--
CREATE DATABASE IF NOT EXISTS `snackbite` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `snackbite`;

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE IF NOT EXISTS `customer` (
  `customer_id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(100) NOT NULL,
  `phone_number` int(8) NOT NULL,
  `credit_card` int(16) NOT NULL,
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`customer_name`, `phone_number`, `credit_card`) VALUES
('Testing Guy', 12345678, 1111222233334444);


-- --------------------------------------------------------

--
-- Table structure for table `driver`
--

CREATE TABLE IF NOT EXISTS `driver` (
  `driver_id` int(11) NOT NULL AUTO_INCREMENT,
  `driver_name` varchar(100) NOT NULL,
  `phone_number` int(8) NOT NULL,
  PRIMARY KEY (`driver_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `driver`
--



-- --------------------------------------------------------

--
-- Table structure for table `activity`
--

CREATE TABLE IF NOT EXISTS `activity` (
  `activity_id` int(11) NOT NULL AUTO_INCREMENT,
  `activity_name` varchar(100) NOT NULL,
  `customer_id` int(11) NOT NULL,
  PRIMARY KEY (`activity_id`),
  FOREIGN KEY (`customer_id`) REFERENCES customer(`customer_id`) 
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `activity`
--

INSERT INTO `activity` (`activity_name`, `customer_id`) VALUES
('testing 1', 1),
('testing 2', 1);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity`
--


-- --------------------------------------------------------

--
-- Table structure for table `error`
--

CREATE TABLE IF NOT EXISTS `error` (
  `error_id` int(11) NOT NULL AUTO_INCREMENT,
  `error_name` varchar(100) NOT NULL,
  `customer_id` int(11) NOT NULL,
  PRIMARY KEY (`error_id`),
  FOREIGN KEY (`customer_id`) REFERENCES customer(`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `error`
--

INSERT INTO `error` (`error_name`, `customer_id`) VALUES
('error order test', 1),
('error delivery test', 1);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `error`
--

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE IF NOT EXISTS `order` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` VARCHAR(100) NOT NULL,
  `driver_id` int(11) NOT NULL,
  `date_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `pickup_location` varchar(100) NOT NULL,
  `destination` varchar(100) NOT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'NEW',
  `price` float(2) NOT NULL,
  `no_of_food_items` int(11) NOT NULL,
  PRIMARY KEY (`order_id`),
  FOREIGN KEY (`customer_id`) REFERENCES customer(`customer_id`),
  FOREIGN KEY (`driver_id`) REFERENCES driver(`driver_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`customer_id`, `driver_id`, `date_time`, `pickup_location`, `destination`,
`status`, `price`, `no_of_food_items`) VALUES
(1, 1, '2020-06-12 02:14:55', 'SMU', 'Home', 'NEW', 3.14, 3);


--
-- Constraints for table `order`
--

