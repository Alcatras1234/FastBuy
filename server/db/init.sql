


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    name VARCHAR(50),
    surname VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    is_verify BOOLEAN,
    password VARCHAR(255),
    role VARCHAR(50) CHECK (role IN ('admin', 'user', 'organizer')),
    status VARCHAR(50) CHECK (status IN ('active', 'inactive', 'suspended')) NOT NULL,
    created_dttm TIMESTAMP DEFAULT NOW(),
    updated_dttm TIMESTAMP DEFAULT NOW()
);


CREATE TABLE organizer_legal_info (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    company_name VARCHAR(100),
    contact_number VARCHAR(50),
    approved BOOLEAN,
    created_dttm TIMESTAMP DEFAULT NOW(),
    updated_dttm TIMESTAMP DEFAULT NOW(),
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


