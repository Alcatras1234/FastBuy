CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL, -- REFERENCES bookings(id)
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
