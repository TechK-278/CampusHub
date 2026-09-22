-- ============================================================
-- CampusHub — Practical 8: User-Defined Function (Stored Function)
-- Requirement 9: MySQL Stored Function
-- Function: calculate_grade(score) -> Academic Grade String
-- ============================================================

USE campushub;

DROP FUNCTION IF EXISTS calculate_grade;

DELIMITER $$
CREATE FUNCTION calculate_grade(score INT)
RETURNS VARCHAR(15)
DETERMINISTIC
BEGIN
  DECLARE grade_letter VARCHAR(15);
  IF score >= 85 THEN
    SET grade_letter = 'AA (10)';
  ELSEIF score >= 75 THEN
    SET grade_letter = 'AB (9)';
  ELSEIF score >= 65 THEN
    SET grade_letter = 'BB (8)';
  ELSEIF score >= 55 THEN
    SET grade_letter = 'BC (7)';
  ELSEIF score >= 45 THEN
    SET grade_letter = 'CC (6)';
  ELSEIF score >= 35 THEN
    SET grade_letter = 'CD (5)';
  ELSE
    SET grade_letter = 'FF (Fail)';
  END IF;
  RETURN grade_letter;
END$$
DELIMITER ;
