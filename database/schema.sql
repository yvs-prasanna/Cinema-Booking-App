-- Cinema Booking Platform Database Schema

-- Users table for customer accounts
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    membership_type VARCHAR(20) DEFAULT 'regular',
    membership_points INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- Cities table
CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Theaters table
CREATE TABLE IF NOT EXISTS theaters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(200) NOT NULL,
    address TEXT NOT NULL,
    city_id INTEGER NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    total_screens INTEGER NOT NULL,
    facilities TEXT, -- JSON string of facilities
    parking_available BOOLEAN DEFAULT 0,
    food_court BOOLEAN DEFAULT 0,
    wheelchair_accessible BOOLEAN DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (city_id) REFERENCES cities(id)
);

-- Screens table
CREATE TABLE IF NOT EXISTS screens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    theater_id INTEGER NOT NULL,
    screen_name VARCHAR(50) NOT NULL,
    screen_type VARCHAR(20) NOT NULL, -- 2D, 3D, IMAX, 4DX
    sound_system VARCHAR(50), -- Dolby Atmos, DTS, etc.
    total_seats INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (theater_id) REFERENCES theaters(id)
);

-- Movies table
CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    synopsis TEXT,
    duration_minutes INTEGER NOT NULL,
    rating VARCHAR(10) NOT NULL, -- U, UA, A, U/A 7+, etc.
    genre TEXT NOT NULL, -- JSON array of genres
    language TEXT NOT NULL, -- JSON array of languages
    formats TEXT NOT NULL, -- JSON array of formats (2D, 3D, IMAX)
    cast TEXT, -- JSON array of cast members
    crew TEXT, -- JSON object with director, producer, etc.
    poster_url TEXT,
    trailer_url TEXT,
    release_date DATE NOT NULL,
    end_date DATE,
    imdb_rating DECIMAL(3,1),
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    theater_id INTEGER, -- NULL for global movies
    FOREIGN KEY (theater_id) REFERENCES theaters(id) on delete cascade
);



-- Shows table
CREATE TABLE IF NOT EXISTS shows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id INTEGER NOT NULL,
    screen_id INTEGER NOT NULL,
    show_date DATE NOT NULL,
    show_time TIME NOT NULL,
    format VARCHAR(10) NOT NULL, -- 2D, 3D, IMAX
    language VARCHAR(50) NOT NULL,
    price_regular DECIMAL(10,2) NOT NULL,
    price_premium DECIMAL(10,2) NOT NULL,
    price_recliner DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies(id),
    FOREIGN KEY (screen_id) REFERENCES screens(id)
);

-- Seat layout table
CREATE TABLE IF NOT EXISTS seat_layout (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    screen_id INTEGER NOT NULL,
    row_name VARCHAR(2) NOT NULL,
    seat_number INTEGER NOT NULL,
    seat_category VARCHAR(20) NOT NULL, -- regular, premium, recliner
    is_active BOOLEAN DEFAULT 1,
    FOREIGN KEY (screen_id) REFERENCES screens(id),
    UNIQUE(screen_id, row_name, seat_number)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_reference VARCHAR(20) UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    show_id INTEGER NOT NULL,
    total_seats INTEGER NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    booking_status VARCHAR(20) DEFAULT 'confirmed', -- pending, confirmed, cancelled
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_email VARCHAR(255) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, refunded
    cancellation_reason TEXT,
    cancelled_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (show_id) REFERENCES shows(id)
);-- Dropping user_mobile as it is not needed

-- Booked seats table
CREATE TABLE IF NOT EXISTS booked_seats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    seat_id INTEGER NOT NULL,
    seat_identifier VARCHAR(10) NOT NULL, -- e.g., "A5", "F10"
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (seat_id) REFERENCES seat_layout(id)
);

-- Seat holds table (temporary seat blocking)
CREATE TABLE IF NOT EXISTS seat_holds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    seat_id INTEGER NOT NULL,
    show_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    hold_expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seat_id) REFERENCES seat_layout(id),
    FOREIGN KEY (show_id) REFERENCES shows(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Food and beverage items
CREATE TABLE IF NOT EXISTS fnb_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL, -- Popcorn, Beverages, Snacks, Combos
    size VARCHAR(20), -- Small, Medium, Large
    price DECIMAL(10,2) NOT NULL,
    is_veg BOOLEAN DEFAULT 1,
    is_available BOOLEAN DEFAULT 1,
    description TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Food orders table
CREATE TABLE IF NOT EXISTS food_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    order_status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, preparing, ready, delivered
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Food order items table
CREATE TABLE IF NOT EXISTS food_order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    food_order_id INTEGER NOT NULL,
    fnb_item_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (food_order_id) REFERENCES food_orders(id),
    FOREIGN KEY (fnb_item_id) REFERENCES fnb_items(id)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    booking_id INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- card, upi, wallet, netbanking
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, success, failed, refunded
    gateway_response TEXT, -- JSON response from payment gateway
    processed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- super_admin, theater_admin, content_admin
    theater_id INTEGER, -- NULL for super_admin
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (theater_id) REFERENCES theaters(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_shows_movie_date ON shows(movie_id, show_date);
CREATE INDEX IF NOT EXISTS idx_shows_screen_date ON shows(screen_id, show_date);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_show ON bookings(show_id);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_seat_holds_expires ON seat_holds(hold_expires_at);
CREATE INDEX IF NOT EXISTS idx_booked_seats_booking ON booked_seats(booking_id);