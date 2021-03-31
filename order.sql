CREATE DATABASE IF NOT EXISTS `order`;
USE `order`;

DROP TABLE IF EXISTS `ORDER`;
CREATE TABLE IF NOT EXISTS `order` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` VARCHAR(100) NOT NULL,
  `customer_name` VARCHAR(100) NOT NULL,
  `c_phone_number` int NOT NULL,
  `driver_id` int(11),
  `driver_name` VARCHAR(100),
  `d_phone_number` int,
  `date_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `pickup_location` varchar(100) NOT NULL,
  `destination` varchar(100) NOT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'NEW',
  `price` float(2) NOT NULL,
  CONSTRAINT order_id_pk PRIMARY KEY (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

INSERT INTO `order` (`customer_id`, `c_phone_number`, `customer_name`, `pickup_location`, `destination`, `driver_id`, `driver_name`, `status`
`price`) VALUES
(1, '555', 'Testing_guy', 'SMU', 'Home', '1','Driver guy' ,'completed', 3.14);
