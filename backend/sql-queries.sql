CREATE DATABASE wedding_planner_db;
USE wedding_planner_db;

-- Users and Authentication
CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    profile_picture VARCHAR(255),
    role_id INT NOT NULL,
    gender VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    reset_token VARCHAR(255),
    reset_token_expiry DATETIME,
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- Couples Profile
CREATE TABLE couples (
    couple_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    partner_name VARCHAR(200),
    start_date DATE,
    end_date DATE,
    location VARCHAR(255),
    guest_count INT,
    total_budget DECIMAL(10, 2),
    theme VARCHAR(100),
    color_scheme VARCHAR(100),
    services JSON,
    additional_notes Text,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Vendors Profile
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    services JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE vendors (
    vendor_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    business_name VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    description TEXT,
    website VARCHAR(255),
    location VARCHAR(255),
    rating DECIMAL(3, 2) DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    services JSON,
    -- description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    duration_hours INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE vendor_availability (
    availability_id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id) ON DELETE CASCADE,
    UNIQUE KEY (vendor_id, start_date, end_date)
);

-- Wedding Planners
CREATE TABLE planners (
    planner_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    business_name VARCHAR(255) NOT NULL,
    category_id INT NULL,
    description TEXT NULL,
    website VARCHAR(255),
    location VARCHAR(255),
    rating DECIMAL(3, 2) DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    services JSON,
    base_price DECIMAL(10, 2) NOT NULL,
    duration_hours INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE planner_availability (
    availability_id INT AUTO_INCREMENT PRIMARY KEY,
    planner_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (planner_id) REFERENCES planners(planner_id) ON DELETE CASCADE,
    UNIQUE KEY (planner_id, start_date, end_date)
);

-- Bookings and Scheduling
CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    couple_id INT NOT NULL,
    vendor_id VARCHAR(255) NULL,
    planner_id VARCHAR(255) NULL,
    -- service_id INT NOT NULL,
    booking_date DATE NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    total_price DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (couple_id) REFERENCES couples(couple_id) ON DELETE CASCADE
);

-- Payments
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method varchar(255) NOT NULL,
    transaction_id VARCHAR(255) NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    card_details VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    -- FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);

CREATE TABLE rsvps (
    rsvp_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone_number VARCHAR(20),
    address TEXT,
    relationship VARCHAR(100),
    plus_ones INT DEFAULT 0,
    -- status ENUM('pending', 'attending', 'not_attending') DEFAULT 'pending',
    status VARCHAR(20) DEFAULT 'no',
    dietary_restrictions TEXT,
    additional_notes TEXT,
    responded_at TIMESTAMP NULL,
    couple_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Reviews and Ratings
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    planner_id INT,
    vendor_id INT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    comment TEXT,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    -- FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);

-- Contact Us
CREATE TABLE contact_us (
    contact_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    wedding_date DATE,
    service VARCHAR(255),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes for performance optimization
CREATE INDEX idx_users_email ON users(email);
-- CREATE INDEX idx_vendors_category ON vendors(category_id);
-- CREATE INDEX idx_vendor_availability ON vendor_availability(vendor_id, date, is_available);
-- CREATE INDEX idx_bookings_couple ON bookings(couple_id);
-- CREATE INDEX idx_bookings_vendor ON bookings(vendor_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_payments_booking ON payments(booking_id);
-- CREATE INDEX idx_messages_conversation ON messages(conversation_id);
-- CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
-- CREATE INDEX idx_guests_list ON guests(list_id);
-- CREATE INDEX idx_rsvps_guest ON rsvps(guest_id, status);
-- CREATE INDEX idx_recommendations_couple ON vendor_recommendations(couple_id);


--  ALTER TABLE vendors ADD COLUMN services JSON;
-- ALTER TABLE planners ADD COLUMN services JSON;

INSERT INTO roles (role_name, description) VALUES ('Couple', 'Couple');
INSERT INTO roles (role_name, description) VALUES ('Vendor', 'Vendor');
INSERT INTO roles (role_name, description) VALUES ('Planner', 'Planner');


INSERT INTO categories (category_name, description) VALUES ('Photography & Videography', 'Photography & Videography');
INSERT INTO categories (category_name, description) VALUES ('Venue & Accommodation', 'Venue & Accommodation');
INSERT INTO categories (category_name, description) VALUES ('Catering & Beverages', 'Catering & Beverages');
INSERT INTO categories (category_name, description) VALUES ('Decor & Design', 'Decor & Design');
INSERT INTO categories (category_name, description) VALUES ('Entertainment & Music', 'Entertainment & Music');
INSERT INTO categories (category_name, description) VALUES ('Bridal & Groom Wear', 'Bridal & Groom Wear');
INSERT INTO categories (category_name, description) VALUES ('Beauty & Wellness', 'Beauty & Wellness');
INSERT INTO categories (category_name, description) VALUES ('Transportation & Logistics', 'Transportation & Logistics');
INSERT INTO categories (category_name, description) VALUES ('Wedding Planners & Coordinators', 'Wedding Planners & Coordinators');

UPDATE categories 
SET services = '["Pre-wedding photoshoots (engagement, bridal shower, etc.)", "Candid and traditional wedding photography", "Drone photography/videography", "Same-day edit videos", "Live streaming of the ceremony", "Photo booth rentals with props", "Album and video editing services", "Destination wedding photography/videography"]' 
WHERE category_id = 1;

UPDATE categories 
SET services = '["Venue selection and booking assistance", "On-site coordination and management", "Accommodation arrangements for guests (hotels, resorts, etc.)", "Venue decoration and setup", "Outdoor and indoor venue styling", "Seating arrangements and layout planning", "Venue lighting setup"]' 
WHERE category_id = 2;

UPDATE categories
SET services = '["Custom menu planning with chefs", "Tasting sessions before the event", "Full-service catering (buffet, plated dinner, etc.)", "Beverage services (alcoholic and non-alcoholic)", "Bar setup and mixology services", "Dessert tables and specialty cakes", "Late-night snacks service", "Food trucks or live food stations"]' 
WHERE category_id = 3;

UPDATE categories
SET services = '["Themed wedding design and concept creation", "Floral arrangements (bouquets, centerpieces, installations)", "Draping, lighting, and stage decor", "Customized signage and wedding branding", "Tableware and linen rentals", "Backdrop design for ceremonies and photo booths", "Vintage or modern decor rentals", "DIY decor guidance"]' 
WHERE category_id = 4;


UPDATE categories
SET services = '["Live bands, DJs, and solo performers", "Traditional or cultural dance troupes", "Fire dancers or acrobats for grand entrances", "Photo and video montages for special moments", "Interactive entertainment (photo booths, games, etc.)", "Karaoke setup", "Master of Ceremonies (MC) services", "Audio-visual equipment rental"]' 
WHERE category_id = 5;

UPDATE categories
SET services = '["Personal shopping for wedding attire", "Custom tailoring and alterations", "Accessory selection (jewelry, shoes, etc.)", "Outfit styling and consultation", "Traditional and fusion outfit coordination", "Groom’s party attire planning", "Rental services for designer outfits", "Dress preservation services post-wedding"]' 
WHERE category_id = 6;

UPDATE categories
SET services = '["Professional makeup artists for bride and bridal party", "Hair styling services (trial sessions included)", "Skincare and wellness packages pre-wedding", "Spa and massage services for relaxation", "Nail art and manicure/pedicure", "Temporary tattoos or henna artists", "Fitness coaching for pre-wedding body goals", "Personal grooming services for the groom"]' 
WHERE category_id = 7;


UPDATE categories
SET services = '["Luxury car rentals (vintage cars, limousines, etc.)", "Shuttle services for guests", "Helicopter or yacht arrangements for destination weddings", "On-site transportation coordination", "Route planning and traffic management", "Parking arrangements", "Luggage handling for guests", "Emergency transport services for unexpected situations"]' 
WHERE category_id = 8;

UPDATE categories
SET services = '["Full-service wedding planning from concept to execution", "Destination wedding planning", "Day-of event coordination", "Budget management and vendor negotiation", "Guest list management and RSVPs", "Timeline creation and adherence", "Conflict resolution and problem-solving on the day", "Post-wedding cleanup and coordination"]' 
WHERE category_id = 9;


