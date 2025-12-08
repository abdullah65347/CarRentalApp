-- add any missing columns used by entities
ALTER TABLE users
ADD COLUMN password_hash VARCHAR(255);

-- ensure roles table exists (already created in V1)
INSERT INTO roles (name) VALUES ('ROLE_USER') ON CONFLICT DO NOTHING;
INSERT INTO roles (name) VALUES ('ROLE_ADMIN') ON CONFLICT DO NOTHING;