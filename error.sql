CREATE DATABASE IF NOT EXISTS `error`; 
USE `error`;


DROP TABLE IF EXISTS `error`;
CREATE TABLE IF NOT EXISTS `error` (
  `error_id` int(11) NOT NULL AUTO_INCREMENT,
  `error_date_time` timestamp NOT NULL,
  `error_type` varchar(100) NOT NULL,
  `activity_name` varchar(100) NOT NULL,
  `info` VARCHAR(1000) NOT NULL,
  PRIMARY KEY (`error_id`)
  -- FOREIGN KEY (`customer_id`) REFERENCES customer(`customer_id`) 
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--  
-- Dumping data for table `activity`
--

INSERT INTO `error` (`error_date_time`, `error_type`,`activity_name`, `info`) VALUES
(`error_date_time`,`error_type`,'testing 1', "failure");