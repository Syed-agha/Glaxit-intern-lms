CREATE DATABASE glaxit_lms;
USE glaxit_lms;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  google_id VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  email VARCHAR(255),
  role ENUM('admin', 'intern') DEFAULT 'intern',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (google_id, name, email, role)
VALUES ('dev-admin-1', 'Dev Admin', 'admin@example.com', 'admin');
select* from users;

CREATE TABLE interns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  department VARCHAR(255),
  start_date DATE,
  end_date DATE,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO interns (name, email, department, start_date, end_date)
VALUES ('Test Intern', 'intern1@example.com', 'Engineering', '2025-07-01', '2025-12-31');
select* from interns;

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  deadline DATE,
  file_path VARCHAR(255), -- Optional attachment by admin
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE intern_tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  intern_id INT,
  task_id INT,
  submission_path VARCHAR(255),
  status ENUM('assigned', 'submitted', 'reviewed', 'overdue', 'incomplete') DEFAULT 'assigned',
  feedback TEXT,
  submitted_at TIMESTAMP NULL,
  FOREIGN KEY (intern_id) REFERENCES interns(id),
  FOREIGN KEY (task_id) REFERENCES tasks(id)
);

CREATE TABLE progress (
  intern_id INT PRIMARY KEY,
  timeliness_score FLOAT DEFAULT 0,
  quality_score FLOAT DEFAULT 0,
  completion_rate FLOAT DEFAULT 0,
  level ENUM('Beginner', 'Intermediate', 'Advanced', 'Pro') DEFAULT 'Beginner',
  FOREIGN KEY (intern_id) REFERENCES interns(id)
);

CREATE TABLE badges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  intern_id INT,
  badge_type ENUM(
    'Timely Completion', 
    'High Quality', 
    'Consistent Performer', 
    'Fastest Responder'
  ),
  awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (intern_id) REFERENCES interns(id)
);

CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  intern_id INT,
  type ENUM('task', 'badge', 'reminder', 'feedback') NOT NULL,
  message TEXT NOT NULL,
  seen BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (intern_id) REFERENCES interns(id)
);
