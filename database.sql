CREATE DATABASE medai;
SHOW DATABASES;
USE medai;

SHOW TABLES;
DESC users;
SELECT * FROM users;
DELETE FROM users;
SELECT * FROM users;
TRUNCATE TABLE users;
SELECT COUNT(*) FROM diseases;
SELECT * FROM diseases LIMIT 5;
DELETE FROM diseases;
TRUNCATE TABLE diseases;
DELETE FROM prediction_history;
DELETE FROM prediction_history
WHERE id > 0;
DELETE FROM diseases
WHERE id > 0;
SHOW CREATE TABLE prediction_history;
SELECT
    disease_name,
    estimated_recovery_time,
    emergency_warning
FROM diseases
WHERE disease_name = 'Fungal infection';
SELECT * FROM prediction_history;
SELECT
    ph.id,
    u.full_name,
    d.disease_name,
    ph.prediction_date
FROM prediction_history ph
JOIN users u ON ph.user_id = u.id
JOIN diseases d ON ph.disease_id = d.id;

SELECT id, full_name, email FROM users;

SELECT id, full_name, gender
FROM users
WHERE gender IS NULL;
UPDATE users
SET gender = 'Male'
WHERE id = 2;
SELECT * FROM prediction_history;
