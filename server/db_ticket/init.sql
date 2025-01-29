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


CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    schedule_dt TIMESTAMP NOT NULL,
    stadium_id INTEGER REFERENCES stadiums(id) NOT NULL,
    info TEXT,
    team_home_id INTEGER REFERENCES teams(id) NOT NULL,
    team_away_id INTEGER REFERENCES teams(id) NOT NULL,
    photo_url VARCHAR(255),
    organizer_id INTEGER NOT NULL, -- REFERENCES users(id)
    organizer_legal_info_id INTEGER NOT NULL, -- REFERENCES organizer_legal_info(id)
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
    user_id INTEGER NOT NULL, -- REFERENCES users(id)
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
    user_id INTEGER NOT NULL, -- REFERENCES users(id)
    status VARCHAR(50) CHECK (status IN ('pending', 'confirmed', 'cancelled')) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_dttm TIMESTAMP DEFAULT NOW(),
    updated_dttm TIMESTAMP DEFAULT NOW()
);