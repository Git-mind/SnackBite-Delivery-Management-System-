CREATE DATABASE IF NOT EXISTS `driver`; 
USE `driver`;

/*Added by chin ning*/
DROP TABLE IF EXISTS `DRIVER`;
CREATE TABLE IF NOT EXISTS `driver` (
  `driver_id` VARCHAR(100) NOT NULL,
  `driver_name` varchar(100) NOT NULL,
  `phone_number` INT NOT NULL,
   CONSTRAINT driver_id_pk PRIMARY KEY (`driver_id`)
) ENGINE=InnoDB;

INSERT INTO Driver VALUES
(1,'bob','893323');