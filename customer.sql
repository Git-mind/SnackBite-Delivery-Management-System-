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
('E1tQQB7gjvWd5PyqfE1Qljb6l5H3','G.Aravind','83422229','4242424242424242','@Aravind1997555');
('FP2Ksh8SRMd0JNf7qZBiXjHC8wx1','Chin Ning','83422229','4000056655665556','@CNSHUM98');
('E1tQQB7gjvWd5PyqfE1Qljb6l5H3','Xian Wei','83422229','5555555555554444','@Xianweii');
