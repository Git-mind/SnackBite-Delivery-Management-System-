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