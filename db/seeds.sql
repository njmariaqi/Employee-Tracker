INSERT INTO departments (name)
VALUES
('architect'),
('accounting'),
('IT');

INSERT INTO roles (title, salary, department_id)
VALUES
('junior designer', 50000, 1),
('senior designer', 80000, 1),
('design director', 100000, 1),
('account manager', 80000, 2),
('accountant', 50000, 2),
('engineer manager', 100000, 3),
('engineer', 80000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('alvin', 'ng', 1, 3),
('maria', 'qi', 2, 3),
('raffael', 'scassara', 3, 3),
('samantha', 'lee', 4, 4),
('alexandra', 'jung', 5, 4),
('doug', 'smith', 6, 6),
('efren', 'torres', 7, 6);