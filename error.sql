CREATE DATABASE IF NOT EXISTS `error`; 
USE `error`;


DROP TABLE IF EXISTS `error`;
CREATE TABLE IF NOT EXISTS `error` (
  `error_id` int(11) NOT NULL AUTO_INCREMENT,
  `errorDateTime` varchar(100) NOT NULL,
  `errorType` varchar(100) NOT NULL,
  `activity_name` varchar(100) NOT NULL,
  `info` VARCHAR(1000) NOT NULL,
  PRIMARY KEY (`error_id`)
  -- FOREIGN KEY (`customer_id`) REFERENCES customer(`customer_id`) 
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--  
-- Dumping data for table `activity`
--

INSERT INTO `error` (`errorDateTime`, `errorType`,`activity_name`, `info`) VALUES
(`errorDateTime`,`errorType`,'testing 1', "failure");