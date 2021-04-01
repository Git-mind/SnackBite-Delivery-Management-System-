CREATE DATABASE IF NOT EXISTS `driver`; 
USE `driver`;

DROP TABLE IF EXISTS `DRIVER`;
CREATE TABLE IF NOT EXISTS `driver` (
  `driver_id` int(11) NOT NULL AUTO_INCREMENT,
  `driver_name` varchar(100) NOT NULL,
  `phone_number` int NOT NULL,
  PRIMARY KEY (`driver_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

INSERT INTO driver VALUES
(1,'Driver guy','32165487');