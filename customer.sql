CREATE DATABASE IF NOT EXISTS `customer`; 
USE `customer`;


DROP TABLE IF EXISTS `CUSTOMER`;
CREATE TABLE IF NOT EXISTS `customer` (
    `customer_id` VARCHAR(100) NOT NULL,
    `customer_name` VARCHAR(100) NOT NULL,
    `phone_number` INT NOT NULL,
    `credit_card`  VARCHAR(100) NOT NULL,
    `tele_id`  VARCHAR(100) NOT NULL,
    CONSTRAINT customer_id_pk PRIMARY KEY (`customer_id`)
)  ENGINE=INNODB;

INSERT INTO Customer VALUES
(1,'John','555','4242 4242 4242 4242','@Aravind1997555');


