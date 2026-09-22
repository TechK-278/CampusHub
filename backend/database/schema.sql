-- ============================================================
-- CampusHub — Practical 8: MySQL Schema
-- Requirement 1 & 2: CREATE DATABASE & CREATE TABLE
-- ============================================================

-- 1. Create Database if not exists
CREATE DATABASE IF NOT EXISTS campushub;
USE campushub;

-- 2. Create Students Table
CREATE TABLE IF NOT EXISTS students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  roll_number VARCHAR(20) NOT NULL UNIQUE,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  mobile VARCHAR(15) NOT NULL,
  department VARCHAR(100) NOT NULL,
  semester INT NOT NULL,
  division VARCHAR(10) NOT NULL DEFAULT 'A',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
