-- Cars table
CREATE TABLE cars (
  id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  owner_id BIGINT,
  make VARCHAR(100),
  model VARCHAR(100),
  year INT,
  plate_number VARCHAR(100),
  seats INT,
  car_type VARCHAR(50),
  transmission VARCHAR(50),
  fuel_type VARCHAR(50),
  price_per_day DECIMAL(10,2),
  description TEXT,
  status VARCHAR(50),
  location_id BIGINT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cars_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_cars_location FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Car images
CREATE TABLE car_images (
  id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  car_id BIGINT NOT NULL,
  url VARCHAR(1000),
  is_primary BOOLEAN DEFAULT FALSE,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_car_images_car FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bookings
CREATE TABLE bookings (
  id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  car_id BIGINT NOT NULL,
  pickup_location_id BIGINT,
  dropoff_location_id BIGINT,
  start_datetime DATETIME NOT NULL,
  end_datetime DATETIME NOT NULL,
  total_price DECIMAL(12,2),
  status VARCHAR(50),
  cancellation_reason VARCHAR(500),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_bookings_car FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
  CONSTRAINT fk_bookings_pickup_loc FOREIGN KEY (pickup_location_id) REFERENCES locations(id) ON DELETE SET NULL,
  CONSTRAINT fk_bookings_dropoff_loc FOREIGN KEY (dropoff_location_id) REFERENCES locations(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_booking_car_start_end ON bookings(car_id, start_datetime, end_datetime);

-- Reviews
CREATE TABLE reviews (
  id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  car_id BIGINT,
  rating INT,
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_reviews_car FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_review_car ON reviews(car_id);

-- Availability
CREATE TABLE availability (
  id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  car_id BIGINT,
  start_datetime DATETIME NOT NULL,
  end_datetime DATETIME NOT NULL,
  available_flag BOOLEAN DEFAULT TRUE,
  CONSTRAINT fk_avail_car FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_avail_car_start_end ON availability(car_id, start_datetime, end_datetime);
