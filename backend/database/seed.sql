-- ============================================================
-- CampusHub — Practical 8: Fictional Academic Seed Data
-- ============================================================

USE campushub;

INSERT INTO students (roll_number, first_name, last_name, email, mobile, department, semester, division)
VALUES
('CS2026001', 'Aarav', 'Mehta', 'aarav.mehta@university.edu', '9876543210', 'Computer Science & Engineering', 5, 'A'),
('CS2026002', 'Diya', 'Shah', 'diya.shah@university.edu', '9823456781', 'Computer Science & Engineering', 5, 'A'),
('IT2026015', 'Rohan', 'Patel', 'rohan.patel@university.edu', '9712345678', 'Information Technology', 5, 'B'),
('EC2026030', 'Ananya', 'Sharma', 'ananya.sharma@university.edu', '9834567890', 'Electronics & Communication', 5, 'A'),
('ME2026042', 'Kabir', 'Joshi', 'kabir.joshi@university.edu', '9890123456', 'Mechanical Engineering', 5, 'B')
ON DUPLICATE KEY UPDATE first_name=VALUES(first_name);
