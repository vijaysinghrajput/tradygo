-- Simple vendor seeding script
INSERT INTO vendors (id, name, legal_name, email, phone, gst_number, pan_number, status, created_at, updated_at) VALUES 
('3f1a2b3c-4d5e-46f7-89a0-12b34c56d701', 'Acme Retail', 'Acme Retail Private Limited', 'contact@acmeretail.com', '9876543210', '29ABCDE1234F1Z5', 'ABCDE1234F', 'ACTIVE', NOW(), NOW()),
('3f1a2b3c-4d5e-46f7-89a0-12b34c56d702', 'Bharat Electronics', 'Bharat Electronics Corporation', 'info@bharatelectronics.in', '9876543211', '27FGHIJ5678G2A6', 'FGHIJ5678G', 'ACTIVE', NOW(), NOW()),
('3f1a2b3c-4d5e-46f7-89a0-12b34c56d703', 'GreenLeaf Organics', 'GreenLeaf Organics LLP', 'hello@greenleaforganics.com', '9876543212', '19KLMNO9012H3B7', 'KLMNO9012H', 'PENDING', NOW(), NOW()),
('3f1a2b3c-4d5e-46f7-89a0-12b34c56d704', 'TrendyKart', 'TrendyKart Fashion Private Limited', 'support@trendykart.com', '9876543213', '36PQRST3456I4C8', 'PQRST3456I', 'ACTIVE', NOW(), NOW()),
('3f1a2b3c-4d5e-46f7-89a0-12b34c56d705', 'TechBazaar', 'TechBazaar Solutions India Private Limited', 'admin@techbazaar.in', '9876543214', '07UVWXY7890J5D9', 'UVWXY7890J', 'SUSPENDED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Check results
SELECT COUNT(*) as total_vendors FROM vendors;
SELECT name, status FROM vendors ORDER BY name;