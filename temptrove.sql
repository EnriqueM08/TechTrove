-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3307
-- Generation Time: Mar 06, 2023 at 01:43 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `temptrove`
--

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `cID` int(11) NOT NULL,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `mailingAddress` varchar(200) DEFAULT NULL,
  `mailingCity` varchar(100) DEFAULT NULL,
  `mailingState` varchar(100) DEFAULT NULL,
  `mailingZipCode` int(5) DEFAULT NULL,
  `billingAddress` varchar(200) DEFAULT NULL,
  `phoneNumber` varchar(15) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`cID`, `firstName`, `lastName`, `mailingAddress`, `mailingCity`, `mailingState`, `mailingZipCode`, `billingAddress`, `phoneNumber`, `email`) VALUES
(1, 'John', 'Doe', '123 Mailing St', 'City', 'State', 12345, '1234 Billing Dr', '0123456789', 'john.doe@email.com'),
(2, 'Jane', 'Doe', '456 Little House St', 'TEST CITY', 'TEST STATE', 67890, 'TEST BILLING RD', '9876543210', 'jane.doe@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `orderNum` int(11) NOT NULL,
  `orderDateTime` datetime NOT NULL,
  `cID` int(11) NOT NULL,
  `pID` int(11) NOT NULL,
  `subtotal` double(10,2) NOT NULL,
  `taxes` double(5,2) NOT NULL,
  `shippingCost` double(5,2) NOT NULL,
  `total` double(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `pID` int(11) NOT NULL,
  `pName` varchar(50) NOT NULL,
  `pDescription` varchar(2000) DEFAULT NULL,
  `pPrice` decimal(10,2) NOT NULL,
  `pImagePath` varchar(1024) DEFAULT NULL,
  `pInventory` int(11) NOT NULL,
  `pCategory` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`pID`, `pName`, `pDescription`, `pPrice`, `pImagePath`, `pInventory`, `pCategory`) VALUES
(1, 'iPhone 14', 'Vibrant 6.1-inch Super Retina XDR display with OLED technology. Action mode for smooth, steady, handheld videos.\r\nHigh resolution and color accuracy make everything look sharp and true to life.\r\nNew Main camera and improved image processing to capture your shots in all kinds of light - especially low light.\r\n4K Cinematic mode at 24 fps automatically shifts focus to the most important subject in a scene.\r\nA15 Bionic, with a 5‑core GPU for lightning-fast performance. Superfast 5G.', '799.99', 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-3.jpg\r\n', 400, 'mobile'),
(2, 'Galaxy S22', '8K SUPER STEADY VIDEO: Shoot videos that rival how epic your life is with stunning 8K recording, the highest recording resolution available on a smartphone; Video captured is effortlessly smooth, thanks to Auto Focus Video Stabilization on Galaxy S22.Form_factor : Smartphone\r\nNIGHTOGRAPHY plus PORTRAIT MODE: Capture the night with crystal clear, bright pics and videos, no matter the lighting with Night Mode; Portrait Mode auto-detects and adjusts to what you want front and center, making all your photos worthy of a frame\r\n50MP PHOTO RESOLUTION plus BRIGHT DISPLAY: From elaborate landscapes to intricate creations, capture vivid detail with 50MP resolution; Your favorite content will look even more epic on our brightest display ever with Vision Booster\r\nADAPTIVE COLOR CONTRAST: Streaming on the go, working from your patio, or binge-watching late into the night. The Galaxy S22 adaptive screen automatically optimizes color and brightness, outdoors and indoors\r\nLONG-LASTING BATTERY plus FAST CHARGING: Power every scroll, click, tap, and stream all day long with an intelligent battery that works with you, not against you; Dive back into action at a moment’s notice with 25W Super-Fast Charging\r\nPREMIUM DESIGN & CRAFTMANSHIP: With a classy, eye-catching glass-metal-glass design, we’re setting a standard for smartphones; With our strongest aluminum frame and the latest Gorilla Glass, this phone is lightweight and durable to help endure scratches and dings\r\nLIVE SHARING w/ GOOGLE DUO: Watch viral YouTube videos and content together with your friends, from anywhere', '699.99', 'https://m.media-amazon.com/images/I/81Ulnpn3ZpL._AC_UF894,1000_QL80_.jpg\r\n', 200, 'mobile');

-- --------------------------------------------------------

--
-- Table structure for table `saleandrev`
--

CREATE TABLE `saleandrev` (
  `numOfSales` bigint(20) NOT NULL,
  `revenue` decimal(20,2) NOT NULL,
  `discounts` decimal(20,2) NOT NULL,
  `taxes` decimal(20,2) NOT NULL,
  `shippingFees` decimal(20,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`cID`),
  ADD UNIQUE KEY `cID` (`cID`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`orderNum`),
  ADD KEY `cID` (`cID`),
  ADD KEY `pID` (`pID`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`pID`),
  ADD UNIQUE KEY `pID` (`pID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `cID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`cID`) REFERENCES `customers` (`cID`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`pID`) REFERENCES `products` (`pID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
