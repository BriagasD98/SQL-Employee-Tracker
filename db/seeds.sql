-- department seeds
INSERT INTO department (name)
VALUES 
    ("Sales"),
    ("Accounting"),
    ("Engineering"),
    ("Legal");

-- role seeds
INSERT INTO role (title, salary, department_id)
VALUES 
    ("Sales Manager", 80000, 1),
    ("Sales Associate", 60000, 1),
    ("Chief Accountant", 85000, 2),
    ("Accountant", 65000, 2),
    ("Senior Engineer", 105000, 3),
    ("Engineer", 85000, 3),
    ("Attorney", 120000, 4),
    ("Paralegal", 70000, 4);

-- employee seeds
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ("Jim", "Halpert", 1, null),
    ("Pam", "Beasley", 2, 1),
    ("Oscar", "Martinez", 3, null),
    ("Kevin", "Malone", 4, 3),
    ("Jeff", "Simmons", 5, null),
    ("Paul", "Rykers", 6, 5),
    ("Saul", "Goodman", 7, null),
    ("Judith", "Green", 8, 7);