-- Tworzenie bazy danych
CREATE DATABASE ecommerce;
USE ecommerce;

-- Category
CREATE TABLE Category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Product
CREATE TABLE Product (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    visible BOOLEAN DEFAULT TRUE NOT NULL,
    FOREIGN KEY (category_id) REFERENCES Category(category_id) ON UPDATE CASCADE
);

-- Photo
CREATE TABLE Photo (
    photo_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    filename VARCHAR(32) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES Product(product_id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Variant
CREATE TABLE Variant (
    variant_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Product-Variant (relacja wiele-do-wielu między Product i Variant)
CREATE TABLE Product_Variant (
    product_variant_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    variant_id INT NOT NULL,
    quantity INT UNSIGNED NOT NULL DEFAULT 1,
    width INT UNSIGNED NOT NULL,
    height INT UNSIGNED NOT NULL,
    FOREIGN KEY (product_id) REFERENCES Product(product_id) ON UPDATE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES Variant(variant_id) ON UPDATE CASCADE
);

-- Permission
CREATE TABLE Permission (
    permission_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- User
CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255),
    address VARCHAR(255),
    city VARCHAR(100),
    post_code VARCHAR(20),
    country VARCHAR(100),
    permission_id INT,
    FOREIGN KEY (permission_id) REFERENCES Permission(permission_id) ON UPDATE CASCADE
);

-- Order
CREATE TABLE `Order` (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_paid BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Order-Detail (relacja między Order i Product-Variant)
CREATE TABLE Order_Detail (
    order_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_variant_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (order_id) REFERENCES `Order`(order_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (product_variant_id) REFERENCES Product_Variant(product_variant_id) ON UPDATE CASCADE
);



INSERT INTO Category (name) VALUES
('tops'),
('bottoms'),
('footwear'),
('accessories');

INSERT INTO Product (category_id, name, description, price, visible) VALUES
(1, 'LOOP SPORTS ICON T-Shirt', 'Cotton T-shirt with round neck', 49.99, TRUE),
(1, 'PLANET T-Shirt', 'Stylish blue denim jacket', 159.90, TRUE),
(2, 'HALF-CUT WORN Denim', 'Dark blue slim fit jeans', 199.00, TRUE),
(2, 'CARGO FLARED Pants', 'Casual cotton shorts', 129.00, TRUE);

INSERT INTO Photo (product_id, filename) VALUES
("1", "tshirt-loopsports.png"),
("1", "tshirt-loopsports-2.png"),
("1", "tshirt-loopsports-3.png"),
("1", "tshirt-loopsports-4.png"),
("2", "tshirt-planetearth.png"),
("2", "tshirt-planetearth-2.png"),
("3", "pants-halfcutworn.png"),
("3", "pants-halfcutworn-2.png"),
("4", "pants-cargoflared.png"),
("4", "pants-cargoflared-2.png");

INSERT INTO Variant (name) VALUES
('S'),
('M'),
('L'),
('XL'),
('One Size');

INSERT INTO Product_Variant (product_id, variant_id, quantity, width, height) VALUES
(1, 1, 50, 40, 50),
(1, 2, 80, 50, 60),
(1, 3, 60, 60, 70),
(2, 2, 40, 50, 60),
(3, 3, 100, 44, 100),
(4, 2, 70, 40, 98);


INSERT INTO Permission (name) VALUES
('Admin'),
('Customer'),
('Guest');


INSERT INTO User (firstname, lastname, phone_number, email, password, address, city, post_code, country, permission_id) VALUES
('Alice', 'Nowak', '+48123456789', 'alice@example.com', 'hashed_pw_1', 'Main St 12', 'Warsaw', '00-001', 'Poland', 2),
('Bob', 'Kowalski', '+48500900900', 'bob@example.com', 'hashed_pw_2', 'River 7', 'Krakow', '30-002', 'Poland', 2),
('Charlie', 'Smith', NULL, 'charlie@example.com', NULL, NULL, NULL, NULL, NULL, 3),
('Diana', 'Zielińska', '+48987654321', 'diana@example.com', 'hashed_pw_4', 'Forest 5', 'Gdansk', '80-100', 'Poland', 1);


INSERT INTO `Order` (user_id, date, is_paid) VALUES
(1, '2025-10-01 14:23:00', TRUE),
(2, '2025-10-05 09:12:00', FALSE),
(1, '2025-10-10 19:45:00', TRUE),
(4, '2025-10-15 11:30:00', TRUE);


INSERT INTO Order_Detail (order_id, product_variant_id, quantity) VALUES
(1, 1, 2), 
(1, 2, 1), 
(2, 3, 1), 
(3, 4, 2),
(4, 5, 1);
