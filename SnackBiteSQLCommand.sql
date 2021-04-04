CREATE DATABASE IF NOT EXISTS `activity`; 
USE `activity`;


DROP TABLE IF EXISTS `activity`;
CREATE TABLE IF NOT EXISTS `activity` (
  `activity_id` int(11) NOT NULL AUTO_INCREMENT,
  `activity_date_time` timestamp NOT NULL,
  `activity_type` varchar(100) NOT NULL,
  `activity_name` varchar(100) NOT NULL,
  `customer_id` VARCHAR(100) NOT NULL,
  `info` VARCHAR(1000) NOT NULL,
  PRIMARY KEY (`activity_id`)
  -- FOREIGN KEY (`customer_id`) REFERENCES customer(`customer_id`) 
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--  
-- Dumping data for table `activity`
--

INSERT INTO `activity` (`activity_date_time`,`activity_type`,`activity_name`, `customer_id`, `info`) VALUES
(`activity_date_time`,`activity_type`,'testing 1', 'Apple Tan', "{'code': 201, 'data': {'created': 'Sun, 21 Mar 2021 10:43:55 GMT', 'customer_id': 'Apple TAN', 'modified': 'Sun, 21 Mar 2021 10:43:55 GMT', 'order_id': 17, 'order_item': [{'book_id': '9213213213213', 'item_id': 31, 'order_id': 17, 'quantity': 1}], 'status': 'NEW'}}");








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
('E1tQQB7gjvWd5PyqfE1Qljb6l5H3','G.Aravind','83422229','4242424242424242','@Aravind1997555'),
('FP2Ksh8SRMd0JNf7qZBiXjHC8wx1','Chin Ning','83422229','4000056655665556','@CNSHUM98');







CREATE DATABASE IF NOT EXISTS `review`;
USE `review`;

DROP TABLE IF EXISTS `REVIEW`;
CREATE TABLE IF NOT EXISTS `REVIEW` (
  `review_id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` VARCHAR(100) NOT NULL,
  `customer_name`VARCHAR(100) NOT NULL,
  `driver_id` int(11) NOT NULL,
  `driver_name` VARCHAR(100) NOT NULL,
  `order_id` int(11) NOT NULL,
  `feedback` VARCHAR(140) NOT NULL,
  CONSTRAINT review_id_pk PRIMARY KEY (`review_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;








CREATE DATABASE IF NOT EXISTS `driver`; 
USE `driver`;


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
('FP2Ksh8SRMd0JNf7qZBiXjHC8wx1','Ching Ning','83422229', '@CNSHUM98')
;







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





CREATE DATABASE IF NOT EXISTS `order`;
USE `order`;

DROP TABLE IF EXISTS `ORDER`;
CREATE TABLE IF NOT EXISTS `order` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` VARCHAR(100) NOT NULL,
  `customer_name` VARCHAR(100) NOT NULL,
  `c_phone_number` int NOT NULL,
  `driver_id` VARCHAR(100),
  `driver_name` VARCHAR(100),
  `d_phone_number` int,
  `date_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `pickup_location` varchar(100) NOT NULL,
  `destination` varchar(100) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'NEW', /*Added by chin ning*/
  `price` float(2) NOT NULL,
  `order_desc` varchar(100) NOT NULL,
  CONSTRAINT order_id_pk PRIMARY KEY (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

INSERT INTO `order` (`customer_id`, `c_phone_number`, `customer_name`, `pickup_location`, `destination`, `driver_id`, `driver_name`, `status`,
`price`) VALUES
(1, '555', 'Testing_guy', 'SMU', 'Home', '1','Driver guy' ,'completed', 3.14);

