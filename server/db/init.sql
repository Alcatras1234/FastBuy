CREATE TABLE OTGPassword (
	id SERIAL PRIMARY KEY,
	password VARCHAR(6) NOT NULL,
    expired TIMESTAMP,
    validate BOOLEAN
);

CREATE TABLE validatedemails (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL
);


-- Создаём таблицы, которые не зависят от других
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    name VARCHAR(50),
    surname VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255),
    role VARCHAR(50) CHECK (role IN ('admin', 'user', 'organizer')),
    status VARCHAR(50) CHECK (status IN ('active', 'inactive', 'suspended')) NOT NULL,
    created_dttm TIMESTAMP DEFAULT NOW(),
    updated_dttm TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tokens (
	id SERIAL PRIMARY KEY,
	access VARCHAR(255) NOT NULL,
	refresh VARCHAR(255) NOT NULL
);

CREATE TABLE stadiums (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    created_dttm TIMESTAMP DEFAULT NOW(),
    updated_dttm TIMESTAMP DEFAULT NOW()
);

CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    logo_url VARCHAR(255),
    description TEXT,
    created_dttm TIMESTAMP DEFAULT NOW(),
    updated_dttm TIMESTAMP DEFAULT NOW()
);

-- Создаём таблицы с простыми зависимостями
CREATE TABLE organizer_legal_info (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) UNIQUE NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    legal_entity_type VARCHAR(50) CHECK (legal_entity_type IN ('LLC', 'Corporation', 'Partnership', 'Sole_Proprietorship')) NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    tax_id VARCHAR(50) UNIQUE NOT NULL,
    legal_address VARCHAR(255) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    contact_type VARCHAR(50) CHECK (contact_type IN ('phone', 'email', 'fax')) NOT NULL,
    contact_value VARCHAR(255) NOT NULL,
    is_primary BOOLEAN NOT NULL,
    created_dttm TIMESTAMP DEFAULT NOW(),
    updated_dttm TIMESTAMP DEFAULT NOW()
);

CREATE TABLE organizer_bank_details (
    id SERIAL PRIMARY KEY,
    legal_info_id INTEGER REFERENCES organizer_legal_info(id) NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    routing_number VARCHAR(50) NOT NULL,
    swift_code VARCHAR(50),
    created_dttm TIMESTAMP DEFAULT NOW(),
    updated_dttm TIMESTAMP DEFAULT NOW()
);

CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    schedule_dt TIMESTAMP NOT NULL,
    stadium_id INTEGER REFERENCES stadiums(id) NOT NULL,
    info TEXT,
    team_home_id INTEGER REFERENCES teams(id) NOT NULL,
    team_away_id INTEGER REFERENCES teams(id) NOT NULL,
    photo_url VARCHAR(255),
    organizer_id INTEGER REFERENCES users(id) NOT NULL,
    organizer_legal_info_id INTEGER REFERENCES organizer_legal_info(id) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')) NOT NULL,
    created_dttm TIMESTAMP DEFAULT NOW(),
    updated_dttm TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sectors (
    id SERIAL PRIMARY KEY,
    stadium_id INTEGER REFERENCES stadiums(id),
    name VARCHAR(50) NOT NULL,
    capacity INTEGER NOT NULL,
    created_dttm TIMESTAMP DEFAULT NOW(),
    updated_dttm TIMESTAMP DEFAULT NOW()
);

CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    sector_id INTEGER REFERENCES sectors(id),
    row_number INTEGER NOT NULL,
    seat_number INTEGER NOT NULL,
    created_dttm TIMESTAMP DEFAULT NOW(),
    updated_dttm TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_seat UNIQUE (sector_id, row_number, seat_number)
);

CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(id) NOT NULL,
    seat_id INTEGER REFERENCES seats(id) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('available', 'reserved', 'sold', 'cancelled')) NOT NULL,
    created_dttm TIMESTAMP DEFAULT NOW(),
    updated_dttm TIMESTAMP DEFAULT NOW()
);

-- Создаём таблицы с множественными зависимостями
CREATE TABLE ticket_reservations (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER REFERENCES tickets(id) NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    reservation_type VARCHAR(50) CHECK (reservation_type IN ('pre_order', 'auto_buy')) NOT NULL,
    max_price DECIMAL(10, 2),
    status VARCHAR(50) CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'expired')) NOT NULL,
    priority INTEGER NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_dttm TIMESTAMP DEFAULT NOW(),
    updated_dttm TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_reservation UNIQUE (ticket_id, user_id)
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER REFERENCES tickets(id) NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('pending', 'confirmed', 'cancelled')) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_dttm TIMESTAMP DEFAULT NOW(),
    updated_dttm TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) CHECK (payment_method IN ('credit_card', 'debit_card', 'bank_transfer')) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) NOT NULL,
    transaction_id VARCHAR(100) UNIQUE,
    created_dttm TIMESTAMP DEFAULT NOW(),
    updated_dttm TIMESTAMP DEFAULT NOW()
);

CREATE TABLE refunds (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER REFERENCES payments(id) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    reason TEXT,
    status VARCHAR(50) CHECK (status IN ('pending', 'processed', 'rejected')) NOT NULL,
    created_dttm TIMESTAMP DEFAULT NOW(),
    updated_dttm TIMESTAMP DEFAULT NOW()
);
