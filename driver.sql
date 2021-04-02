CREATE DATABASE IF NOT EXISTS `driver`; 
USE `driver`;

/*Added by chin ning*/
DROP TABLE IF EXISTS `DRIVER`;
CREATE TABLE IF NOT EXISTS `driver` (
  `driver_id` VARCHAR(100) NOT NULL,
  `driver_name` varchar(100) NOT NULL,
  `phone_number` INT NOT NULL,
  `tele_id`  VARCHAR(100) NOT NULL,
   CONSTRAINT driver_id_pk PRIMARY KEY (`driver_id`)
) ENGINE=InnoDB;

INSERT INTO Driver VALUES
('E1tQQB7gjvWd5PyqfE1Qljb6l5H3','Aravind','83422229', '@Aravind1997555'),
('FP2Ksh8SRMd0JNf7qZBiXjHC8wx1','Ching Ning','83422229', '@CNSHUM98'),
('Hipu2wWW7ASrVEAJEo2o29tRugE3','Javier','83422229', '@javieryw')
;
