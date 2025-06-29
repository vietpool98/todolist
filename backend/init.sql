-- Création de la base (à adapter si la base existe déjà)
CREATE DATABASE IF NOT EXISTS todolist_db;
USE todolist_db;

-- Table des listes
CREATE TABLE IF NOT EXISTS lists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Table des tâches
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority ENUM('basse', 'moyenne', 'haute') NOT NULL DEFAULT 'moyenne',
  date DATE,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  list_id INT NOT NULL,
  FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE
);

-- Optionnel : insérer quelques listes et tâches d'exemple

INSERT INTO lists (name) VALUES ('Travail'), ('Personnel');

