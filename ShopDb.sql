create database Shop;
use Shop;

CREATE TABLE Products (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT
);

-- INSERT INTO Products (id, name, price, description) VALUES
-- ('1712427721577', 'Iphone 12 Pro Max', 210000, 'This is new mobile'),
-- ('1712429416384', 'Iphone 11 Pro Max', 180000, 'This is new mobile'),
-- ('1714416450413', 'Vivo S1', 30000, 'This is new mobile'),
-- ('1714568589888', 'Iphone 13 Pro Max', 250000, 'This is new mobile');

select * from Products;