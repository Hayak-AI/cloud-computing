-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 28, 2024 at 06:10 AM
-- Server version: 5.7.39
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_hayak`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `comment_id` int(11) NOT NULL,
  `post_id` int(11) DEFAULT NULL,
  `report_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `content` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `contact_name` varchar(255) DEFAULT NULL,
  `contact_phone` varchar(255) DEFAULT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `message` varchar(100) DEFAULT NULL,
  `notify` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `emergencies`
--

CREATE TABLE `emergencies` (
  `emergency_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  `emergency_status` enum('ongoing','resolved') DEFAULT 'ongoing',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `emergencies`
--

INSERT INTO `emergencies` (`emergency_id`, `user_id`, `location_id`, `emergency_status`, `created_at`, `updated_at`) VALUES
(1, 1, 3, 'ongoing', '2024-11-21 09:54:54', '2024-11-21 09:54:54'),
(2, 1, 4, 'ongoing', '2024-11-21 11:40:06', '2024-11-21 11:40:06');

-- --------------------------------------------------------

--
-- Table structure for table `maps`
--

CREATE TABLE `maps` (
  `id` int(11) NOT NULL,
  `location_name` varchar(255) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `maps`
--

INSERT INTO `maps` (`id`, `location_name`, `latitude`, `longitude`, `created_at`) VALUES
(1, 'Port Elviemouth', 17.7693, -158.9773, '2024-11-21 09:46:16'),
(2, 'Port Elviemouth', 17.7693, -158.9773, '2024-11-21 09:50:48'),
(3, 'Port Elviemouth', 17.7693, -158.9773, '2024-11-21 09:54:54'),
(4, 'Port Elviemouth', 17.7693, -158.9773, '2024-11-21 11:40:06'),
(14, 'Veumfurt', -63.7609, -5.5605, '2024-11-22 16:44:01'),
(15, 'East Billshire', -41.2979, -131.6394, '2024-11-22 16:51:10'),
(16, 'Hahnbury', -37.0947, 1.013, '2024-11-22 16:53:43'),
(17, 'Example Location', 12.345678, 98.765432, '2024-11-23 11:11:59'),
(18, 'Example Location', 12.345678, 98.765432, '2024-11-23 11:13:40'),
(19, 'Example Location', 12.345678, 98.765432, '2024-11-23 11:22:21'),
(20, 'Example Location', 12.345678, 98.765432, '2024-11-23 11:30:26'),
(21, 'Updated Location', 12.345678, 98.765432, '2024-11-23 16:30:58');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `contact_id` int(11) DEFAULT NULL,
  `emergency_id` int(11) DEFAULT NULL,
  `sent_at` timestamp NULL DEFAULT NULL,
  `email_status` enum('sent','pending','failed') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `post_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `content` text,
  `category` enum('general','alert','information') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `location_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`post_id`, `user_id`, `title`, `content`, `category`, `created_at`, `updated_at`, `location_id`) VALUES
(4, 6, 'Example Post Title', 'This is the content of the example post.', 'general', '2024-11-23 11:30:26', '2024-11-23 11:30:26', 20),
(7, 6, 'Copet', 'Tolong aaaaa TOLONGG', 'general', '2024-11-23 17:40:56', '2024-11-23 17:40:56', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `preferences`
--

CREATE TABLE `preferences` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `voice_detection` tinyint(1) DEFAULT '0',
  `dark_mode` tinyint(1) DEFAULT '0',
  `location_tracking` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `preferences`
--

INSERT INTO `preferences` (`id`, `user_id`, `voice_detection`, `dark_mode`, `location_tracking`, `created_at`, `updated_at`) VALUES
(1, 1, 0, 0, 0, '2024-11-19 08:25:03', '2024-11-19 08:25:03'),
(2, 1, 1, 0, 1, '2024-11-21 09:06:20', '2024-11-21 09:06:20'),
(3, 1, 1, 0, 1, '2024-11-21 11:35:20', '2024-11-21 11:35:20');

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  `report_description` text,
  `evidence_url` varchar(255) DEFAULT NULL,
  `verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `reports`
--

INSERT INTO `reports` (`id`, `user_id`, `location_id`, `report_description`, `evidence_url`, `verified`, `created_at`) VALUES
(3, 1, 3, 'Pengguna dengan ID 2 sedang dalam bahaya', NULL, 0, '2024-11-21 09:54:54'),
(4, 1, 4, 'Pengguna dengan ID 2 sedang dalam bahaya', NULL, 0, '2024-11-21 11:40:06'),
(12, 1, 14, NULL, 'http://placeimg.com/640/480', 0, '2024-11-22 16:44:01'),
(14, 1, 16, 'Sering Terjadi Begal cuy', 'http://placeimg.com/640/480', 0, '2024-11-22 16:53:43');

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `token_id` int(11) NOT NULL,
  `token` text,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tokens`
--

INSERT INTO `tokens` (`token_id`, `token`, `created_at`) VALUES
(1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJlbWFpbCI6Imlyd2luX2FiamFyaUBjb2JhLmNvbSIsIm5hbWUiOiJpcndpbiJ9LCJpYXQiOjE3MzIwMDc0ODN9.htCyleaDF7H-bFc3dCxA8lK40ryQ1V9ehN5uFxjpb0I', '2024-11-19 09:11:23'),
(2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJlbWFpbCI6Imlyd2luX2FiamFyaUBjb2JhLmNvbSIsIm5hbWUiOiJpcndpbiJ9LCJpYXQiOjE3MzIxNzcxMTN9.tLUBuj3FQhIRZn_n3ukZuxlzDW3k1VXbQ-9wr1C6wuk', '2024-11-21 08:18:33'),
(3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJlbWFpbCI6Imlyd2luX2FiamFyaUBjb2JhLmNvbSIsIm5hbWUiOiJSb2JlcnRvIFJvbGZzb24ifSwiaWF0IjoxNzMyMTc5MDkyfQ.5hmKe9Rbn-8-ysXy_4fp5d8W1ChqZyLp289R73iIEo8', '2024-11-21 08:51:32'),
(4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJlbWFpbCI6Imlyd2luX2FiamFyaUBjb2JhLmNvbSIsIm5hbWUiOiJSb2JlcnRvIFJvbGZzb24ifSwiaWF0IjoxNzMyMTg4MTQ2LCJleHAiOjE3MzQ3ODAxNDZ9.hj3fTCnTTtCCECHh_N6zfTdXQyhQAEMJVNHgN7LRyrE', '2024-11-21 11:22:26'),
(5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJlbWFpbCI6Imlyd2luX2FiamFyaUBjb2JhLmNvbSIsIm5hbWUiOiJKb3NoIFNjaGFkZW4ifSwiaWF0IjoxNzMyMjkyNDE5LCJleHAiOjE3MzQ4ODQ0MTl9.CiRiG4BI_HmRPjid8YYmsrmQvCmSePmCT-9-IfaFLTk', '2024-11-22 16:20:19'),
(6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyLCJlbWFpbCI6InJpYWE0NTY2OEBnbWFpbC5jb20iLCJuYW1lIjoiUmlhIn0sImlhdCI6MTczMjI5ODMwNCwiZXhwIjoxNzM0ODkwMzA0fQ.HyC8UAPs8YogI2_eKK8AJ8gRDH1kprbVVuWkWQu3e3o', '2024-11-22 17:58:24'),
(7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyLCJlbWFpbCI6InJpYWE0NTY2OEBnbWFpbC5jb20iLCJuYW1lIjoiUmlhIn0sImlhdCI6MTczMjM0NDI4MiwiZXhwIjoxNzM0OTM2MjgyfQ.eRDTwSMbKbotB7ng3RiEUoleVTPLpNvz-JTqpLuQXJM', '2024-11-23 06:44:42'),
(8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyLCJlbWFpbCI6InJpYWE0NTY2OEBnbWFpbC5jb20iLCJuYW1lIjoiUmlhIn0sImlhdCI6MTczMjM0NTk2NywiZXhwIjoxNzM0OTM3OTY3fQ.pHPIywH6OwlGyC3Df2HOKbWoVsOeouggWJFaQSI9bh4', '2024-11-23 07:12:47'),
(9, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyLCJlbWFpbCI6InJpYWE0NTY2OEBnbWFpbC5jb20iLCJuYW1lIjoiUmlhIn0sImlhdCI6MTczMjM0NTk3MywiZXhwIjoxNzM0OTM3OTczfQ.B__lnyPDdhQ_gvkxkwvM8RbeBx_XuEnX-6QCmmZWMrs', '2024-11-23 07:12:53'),
(10, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyLCJlbWFpbCI6InJpYWE0NTY2OEBnbWFpbC5jb20iLCJuYW1lIjoiUmlhIn0sImlhdCI6MTczMjM0NTk5OSwiZXhwIjoxNzM0OTM3OTk5fQ.vhPLAF7pAIVg1VuWmW43SeVyV8Mo7p6TtHBgP2H1trk', '2024-11-23 07:13:19'),
(11, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozLCJlbWFpbCI6InJpYWE0NTY2OEBnbWFpbC5jb20iLCJuYW1lIjoiUmlhIn0sImlhdCI6MTczMjM0NjUzNiwiZXhwIjoxNzM0OTM4NTM2fQ.lCrC7w0fU9OIOMEBcT4kEqigpB9F84lomIn1NW6I3AI', '2024-11-23 07:22:16'),
(12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozLCJlbWFpbCI6InJpYWE0NTY2OEBnbWFpbC5jb20iLCJuYW1lIjoiUmlhIn0sImlhdCI6MTczMjM0OTI2MywiZXhwIjoxNzM0OTQxMjYzfQ.jz2tDwoiUjymLHFCFbCAbmcgjDVPfWrIuwR_mxoj-Ww', '2024-11-23 08:07:43'),
(13, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo0LCJlbWFpbCI6InJpYWE0NTY2OEBnbWFpbC5jb20iLCJuYW1lIjoiUmlhIn0sImlhdCI6MTczMjM0OTM1NywiZXhwIjoxNzM0OTQxMzU3fQ.yMfZTMfedx3CgXw7xYKv4ebIJ3jtbAsM-SfQuxnueEY', '2024-11-23 08:09:17'),
(14, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo2LCJlbWFpbCI6InJpYWE0NTY2OEBnbWFpbC5jb20iLCJuYW1lIjoiUmlhIn0sImlhdCI6MTczMjM1OTU2NCwiZXhwIjoxNzM0OTUxNTY0fQ.IjLVLN0193eOT_cEZgWavPIjNW_b8sX5yyZ5A6aXFbE', '2024-11-23 10:59:24'),
(15, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo2LCJlbWFpbCI6InJpYWE0NTY2OEBnbWFpbC5jb20iLCJuYW1lIjoiUmlhIn0sImlhdCI6MTczMjM2MDM1MSwiZXhwIjoxNzM0OTUyMzUxfQ.t5Cy5cWnzgrD_4emsN8S-FhD2U857vzGu97o9USg3nE', '2024-11-23 11:12:31'),
(16, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo2LCJlbWFpbCI6InJpYWE0NTY2OEBnbWFpbC5jb20iLCJuYW1lIjoiUmlhIn0sImlhdCI6MTczMjM3Njg4OSwiZXhwIjoxNzM0OTY4ODg5fQ.Xim1jgiTU7g6z_TSi9_CEqQFyTuchBr7Ndm6IO_SBp8', '2024-11-23 15:48:09');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `profile_photo` text,
  `phone_number` varchar(100) DEFAULT NULL,
  `password_hash` varchar(100) DEFAULT NULL,
  `provider` enum('local','google') DEFAULT 'local',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `profile_photo`, `phone_number`, `password_hash`, `provider`, `created_at`, `updated_at`) VALUES
(1, 'Josh Schaden', 'irwin_abjari@coba.com', 'http://placeimg.com/640/480', '295-612-2901', '$2b$10$d52MqtWyyLjgDWJoq1jl3e2ANTCoQ2Z84DW8W7NSN.GgxBi3dUy4u', 'local', '2024-11-19 08:25:03', '2024-11-19 08:25:03'),
(6, 'Ria', 'riaa45668@gmail.com', NULL, NULL, '$2b$10$dt3SJ9xPbhEWhXQXc4HO5OUnCmujrmL2PCI25wb.BCPfhX0UDtypW', 'local', '2024-11-23 10:50:46', '2024-11-23 10:50:46');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `report_id` (`report_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `emergencies`
--
ALTER TABLE `emergencies`
  ADD PRIMARY KEY (`emergency_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `location_id` (`location_id`);

--
-- Indexes for table `maps`
--
ALTER TABLE `maps`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `contact_id` (`contact_id`),
  ADD KEY `emergency_id` (`emergency_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`post_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `location_id` (`location_id`);

--
-- Indexes for table `preferences`
--
ALTER TABLE `preferences`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `location_id` (`location_id`);

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`token_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `emergencies`
--
ALTER TABLE `emergencies`
  MODIFY `emergency_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `maps`
--
ALTER TABLE `maps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `post_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `preferences`
--
ALTER TABLE `preferences`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `token_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`),
  ADD CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `contacts`
--
ALTER TABLE `contacts`
  ADD CONSTRAINT `contacts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `emergencies`
--
ALTER TABLE `emergencies`
  ADD CONSTRAINT `emergencies_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `emergencies_ibfk_2` FOREIGN KEY (`location_id`) REFERENCES `maps` (`id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `notifications_ibfk_3` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`),
  ADD CONSTRAINT `notifications_ibfk_4` FOREIGN KEY (`emergency_id`) REFERENCES `emergencies` (`emergency_id`);

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `posts_ibfk_2` FOREIGN KEY (`location_id`) REFERENCES `maps` (`id`);

--
-- Constraints for table `preferences`
--
ALTER TABLE `preferences`
  ADD CONSTRAINT `preferences_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`location_id`) REFERENCES `maps` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
