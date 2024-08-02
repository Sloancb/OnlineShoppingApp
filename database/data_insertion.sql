INSERT INTO public."Admins" (id, code) VALUES (1, '12345Admin!');

INSERT INTO public."Products" (name, category, brand, size, description, price, image_url, image_alt) 
VALUES 
    ('T-Shirt', 'Clothing', 'Nike', 'M', 'Classic cotton t-shirt', 19.99, 'cookie.png', ''),
    ('Jeans', 'Clothing', 'Levi''s', '32x34', 'Straight-leg denim jeans', 49.95, 'eggcracker.jpg', ''),
    ('Laptop', 'Electronics', 'Apple', '13-inch', 'Powerful and lightweight laptop', 1299.00, 'default.png', ''),
    ('Coffee Maker', 'Appliances', 'Breville', 'N/A', 'Programmable espresso machine', 249.99, 'default.png', '');

-- Insert initial data into Warehouses table
INSERT INTO public."Warehouses" (id, address, capacity) VALUES 
(1, '123 Street Ave!', 100),
(2, '234 Street Ave!', 200),
(3, '345 Street Ave!', 300),
(4, '456 Street Ave!', 400),
(5, '567 Street Ave!', 500),
(6, '678 Street Ave!', 600),
(7, '789 Street Ave!', 700);