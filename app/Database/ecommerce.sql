-- Database
DROP DATABASE IF EXISTS ecommerce;
CREATE DATABASE ecommerce;
USE ecommerce;

-- Article
CREATE TABLE `Article` (
    article_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(64) NOT NULL,
    public BIT(1) DEFAULT 1 NOT NULL,
    content TEXT NOT NULL
);

-- Category
CREATE TABLE `Category` (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Product
CREATE TABLE `Product` (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    visible BIT(1) DEFAULT 1 NOT NULL,
    FOREIGN KEY (category_id) REFERENCES `Category`(category_id) ON UPDATE CASCADE
);

-- Photo
CREATE TABLE `Photo` (
    photo_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    filename VARCHAR(32) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES `Product`(product_id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Variant
CREATE TABLE `Variant` (
    variant_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Product-Variant (relacja wiele-do-wielu między Product i Variant)
CREATE TABLE `Product_Variant` (
    product_variant_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    variant_id INT NOT NULL,
    quantity INT UNSIGNED NOT NULL DEFAULT 1,
    width INT UNSIGNED NOT NULL,
    height INT UNSIGNED NOT NULL,
    FOREIGN KEY (product_id) REFERENCES `Product`(product_id) ON UPDATE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES `Variant`(variant_id) ON UPDATE CASCADE
);

-- User
CREATE TABLE `User` (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(32) NOT NULL,
    lastname VARCHAR(32) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password VARCHAR(255),
    address VARCHAR(64) NOT NULL,
    building VARCHAR(6) NOT NULL,
    city VARCHAR(32) NOT NULL,
    post_code VARCHAR(20) NOT NULL,
    country VARCHAR(64) NOT NULL,
    type ENUM('GUEST', 'CUSTOMER', 'ADMIN') NOT NULL DEFAULT 'GUEST'
);

-- Order
CREATE TABLE `Order` (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    address VARCHAR(64) NOT NULL,
    building VARCHAR(6) NOT NULL,
    city VARCHAR(32) NOT NULL,
    post_code VARCHAR(20) NOT NULL,
    country VARCHAR(64) NOT NULL,
    shipping_price DECIMAL(10,2) NOT NULL,
    payu_order_id VARCHAR(64) DEFAULT NULL,
    payment_method ENUM('CASH', 'PAYU') NOT NULL DEFAULT 'CASH',
    status ENUM('PENDING', 'PAID', 'SHIPPED', "COMPLETED", 'CANCELED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    FOREIGN KEY (user_id) REFERENCES `User`(user_id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Order-Detail (relacja między Order i Product-Variant)
CREATE TABLE `Order_Detail` (
    order_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_variant_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (order_id) REFERENCES `Order`(order_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (product_variant_id) REFERENCES `Product_Variant`(product_variant_id) ON UPDATE CASCADE
);



INSERT INTO `Category` (name) VALUES
('tops'),
('bottoms'),
('footwear'),
('accessories');

INSERT INTO `Product` (category_id, name, description, price, visible) VALUES
(1, 'LOOP SPORTS ICON T-Shirt', 'Cotton T-shirt with round neck', 49.99, 1),
(1, 'PLANET T-Shirt', 'Stylish blue denim jacket', 159.90, 1),
(2, 'HALF-CUT WORN Denim', 'Dark blue slim fit jeans', 199.00, 1),
(2, 'CARGO FLARED Pants', 'Casual cotton shorts', 129.00, 1);

INSERT INTO `Photo` (product_id, filename) VALUES
("1", "tshirt-loopsports.png"),
("1", "tshirt-loopsports-2.png"),
("2", "tshirt-planetearth.png"),
("2", "tshirt-planetearth-2.png"),
("3", "pants-halfcutworn.png"),
("3", "pants-halfcutworn-2.png"),
("4", "pants-cargoflared.png"),
("4", "pants-cargoflared-2.png");

INSERT INTO `Variant` (name) VALUES
('S'),
('M'),
('L'),
('XL'),
('One Size');

INSERT INTO `Product_Variant` (product_id, variant_id, quantity, width, height) VALUES
(1, 1, 50, 40, 50),
(1, 2, 80, 50, 60),
(1, 3, 60, 60, 70),
(2, 2, 40, 50, 60),
(3, 3, 0, 44, 100),
(4, 2, 70, 40, 98);

-- Password test1234 for both
INSERT INTO `User` (firstname, lastname, phone_number, email, password, address, building, city, post_code, country, type) VALUES
('Alice', 'Nowak', '+48123456789', 'alice@example.com', '$2y$10$PiWxhyQyGIC.H5rlPvbMDezj4CLlrwndFpwwuQt4U35rbeAE1dTty', 'Main St', '12', 'Warsaw', '00-001', 'Polska', 'CUSTOMER'),
('Diana', 'Zielińska', '+48987654321', 'diana@example.com', '$2y$10$PiWxhyQyGIC.H5rlPvbMDezj4CLlrwndFpwwuQt4U35rbeAE1dTty', 'Forest', '5', 'Gdansk', '80-100', 'Polska', 'ADMIN');

INSERT INTO `Order` (user_id, date, address, building, city, post_code, country, shipping_price) VALUES
(1, '2025-10-01 14:23:00', 'Main St', '12', 'Warsaw', '00-001', 'Polska', 22.0),
(1, '2025-10-10 19:45:00', 'Main St', '12', 'Warsaw', '00-001', 'Polska', 22.0),
(2, '2025-10-15 11:30:00', 'Forest', '5', 'Gdansk', '80-100', 'Polska', 22.0);

INSERT INTO `Order_Detail` (order_id, product_variant_id, quantity) VALUES
(1, 1, 2), 
(1, 2, 1), 
(2, 3, 1), 
(2, 4, 2);

INSERT INTO `Article` (title, public, content) VALUES
("How to read sizes?", 1,
'<h1>How to Read Sizes in Our Store</h1><p>Every product in our store — whether it’s a T-shirt, a pair of pants, or footwear — is described using two simple measurements:<strong>Width</strong> and <strong>Height</strong>.  These values help you understand how the product fits and feels. Below you’ll find clear explanations for each type of item.</p><h2>Size System — Width and Height</h2><h3>1. T-Shirts</h3><p><strong>Width:</strong> measured flat across the chest area from one side seam to the other.This shows how wide the T-shirt is when laid flat. To estimate body circumference, multiply width × 2.  </p><p><strong>Height:</strong> measured vertically from the top of the shoulder (next to the collar down to the bottom edge of the shirt.</p><p><em>Example:</em> T-shirt (M): width 50 cm, height 72 cm.</p><h3>2. Pants</h3><p><strong>Width:</strong> measured flat across the waistband — from one side to the other.To estimate waist circumference, multiply width × 2.  Some models may also list width at the hips or thighs, as noted in the product description.</p><p><strong>Height:</strong> the full length of the pants.  For jeans and trousers, it’s usually the outer leg length (from the top of the waistband to the bottom of the leg).Sometimes we also list inner leg length (inseam) for clarity.</p><p><em>Example:</em> Pants (M): width 40 cm, height 102 cm.</p><h3>3. Footwear</h3><p><strong>Width:</strong> indicates how wide the shoe is across the ball of the foot — the broadest part. Narrower width means a snug fit, while larger width means a roomier fit.</p><p><strong>Height:</strong> the total height of the shoe from the sole to the top edge. For sneakers or low shoes, it’s from the ground to the ankle; for boots, it shows how tall the upper part is.</p><p><em>Example:</em> Sneakers (size 42): width 10.2 cm, height 9 cm. Boots (size 42): width 10.5 cm, height 28 cm.</p><h3>How to Measure Yourself</h3><ol><li>Lay a similar product flat and measure its width and height as described above.</li><li>Compare your results with our product size chart.</li><li>If you prefer a looser fit, add 2–6 cm of allowance to the width.</li></ol><h3>Quick Summary</h3><ul><li><strong>Width</strong> = flat measurement across the product (×2 ≈ body circumference).</li><li><strong>Height</strong> = total vertical length of the product.</li><li>Always check whether the listed height or width refers to outer or inner measurements (especially for pants and footwear).</li></ul>'),

("Shipping policy", 1,
'<h1>Shipping Information</h1><p>We want to make sure your order reaches you quickly and safely. Below you’ll find all the important details about our shipping process, delivery times, and costs.</p><h2>Processing Time</h2><p>Orders are processed within <strong>1–2 business days</strong> after payment confirmation. During peak seasons or sales, processing time may be extended by a few additional days.</p><h2>Shipping Methods and Delivery Times</h2><ul><li><strong>Standard Shipping:</strong> 3–7 business days</li><li><strong>Express Shipping:</strong> 1–3 business days</li><li><strong>International Shipping:</strong> 7–15 business days (depending on destination)</li></ul><h2>Shipping Costs</h2><p>Shipping fees are calculated automatically at checkout based on your location and chosen shipping method.  Orders above a certain value may qualify for <strong>free standard shipping</strong>.</p><h2>Important Notes</h2><ul><li>Please ensure your delivery address is correct before completing your order.</li><li>We are not responsible for delays caused by customs or courier services.</li><li>International customers are responsible for any applicable customs duties or taxes.</li></ul>'),

("FAQ", 1,
'<h1>Frequently Asked Questions</h1><p>Below are answers to the most common questions about shopping in our store.</p><h2>1. How can I track my order?</h2><p>Once your order is shipped, we’ll send you an email with a tracking number and a link to monitor your delivery in real time.</p><h2>2. Can I change or cancel my order?</h2><p>You can modify or cancel your order within 2 hours after placing it.Please contact our support team as soon as possible if you need to make changes.</p><h2>3. What payment methods do you accept?</h2><p>We accept all major credit/debit cards and other methods available on PayU.Payment is fully secure and processed via encrypted checkout.</p><h2>4. Do you ship internationally?</h2><p>Yes, we ship worldwide. Delivery times and fees vary depending on your location.</p><h2>5. How do I find my correct size?</h2><p>Each product page includes a detailed size guide.  We recommend checking it carefully before ordering to ensure the best fit.</p><h2>Still have questions?</h2><p>Reach out to us anytime via the <a href="/contact">Contact Form</a> or email us at <strong>support@yourstore.com</strong>.</p>'),

("Returns & Exchanges", 1,
'<h1>Returns and Exchanges</h1><p>We want you to love your purchase! If you are not fully satisfied, you can return or exchange your item within the period described below.</p><h2>Return Policy</h2><ul><li>Items can be returned within <strong>30 days</strong> of delivery.</li><li>Products must be <strong>unused, unwashed, and in original packaging</strong>.</li><li>Returns must include the original receipt or order confirmation.</li></ul><h2>How to Return an Item</h2><ol><li>Contact our support team at <strong>support@yourstore.com</strong> to request a return authorization.</li><li>Pack the item securely and include your order number.</li><li>Ship the parcel to the address provided in the return instructions.</li></ol><h2>Refunds</h2><p>Once your return is received and inspected, we will notify you via email.  Approved refunds are issued within <strong>5–10 business days</strong> using your original payment method.</p><h2>Exchanges</h2><p>If you wish to exchange an item for another size or color, please mention it in your return request.  Exchanges are processed free of charge for domestic orders.</p><h2>Non-Returnable Items</h2><p>Gift cards, underwear, and final sale items cannot be returned or exchanged.</p>'),

("Terms & Conditions", 1,
'<h1>Terms and Conditions</h1><p>Please read these Terms and Conditions carefully before using our website or making a purchase.  By accessing or using our services, you agree to these terms.</p><h2>1. General</h2><p>These Terms apply to all purchases made through our website. We reserve the right to modify these Terms at any time, with changes taking effect upon publication.</p><h2>2. Orders</h2><p>All orders are subject to availability and confirmation of payment.  We reserve the right to cancel any order in case of stock issues or suspected fraud.</p><h2>3. Prices and Payments</h2><p>All prices are shown in your local currency and include applicable taxes (unless stated otherwise).  Payment must be completed at checkout through the approved payment methods.</p><h2>4. Shipping and Delivery</h2><p>Delivery times are estimates only. We are not responsible for delays caused by couriers, customs, or unforeseen events.</p><h2>5. Returns</h2><p>Returns are accepted according to our <a href="/returns">Returns Policy</a>.  Items must be returned in their original condition within the specified time period.</p><h2>6. Privacy and Data Protection</h2><p>Your personal information is processed securely and used only for order fulfillment and customer support.  For more details, please see our <a href="/privacy">Privacy Policy</a>.</p><h2>7. Contact</h2><p>For any questions regarding these Terms, please contact us at <strong>support@yourstore.com</strong>.</p>');