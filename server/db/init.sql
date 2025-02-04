


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

CREATE TABLE tokens (
	id SERIAL PRIMARY KEY,
	access VARCHAR(255) NOT NULL,
	refresh VARCHAR(255) NOT NULL
);

CREATE TABLE organizer_legal_info (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) UNIQUE NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    tax_id VARCHAR(50) UNIQUE NOT NULL,
    legal_address VARCHAR(255) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    contact_type VARCHAR(50) CHECK (contact_type IN ('phone', 'email', 'fax')) NOT NULL,
    contact_value VARCHAR(255) NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT false,
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


