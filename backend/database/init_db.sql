-- Create database
CREATE DATABASE dunes2k;

-- Create initial teams (Desert Basketball Association)
INSERT INTO teams (name, city, primary_color, secondary_color, wins, losses) VALUES
('Sun Devils', 'Phoenix', '#FF6B35', '#2C3E50', 0, 0),
('Desert Hawks', 'Tucson', '#E67E22', '#34495E', 0, 0),
('Sandstorm', 'El Paso', '#D4A76A', '#8B5A2B', 0, 0),
('Oasis Kings', 'Palm Springs', '#2ECC71', '#F39C12', 0, 0),
('Cactus Jacks', 'Las Vegas', '#27AE60', '#C0392B', 0, 0),
('Dune Riders', 'Albuquerque', '#E67E22', '#16A085', 0, 0),
('Mirage', 'Santa Fe', '#9B59B6', '#F1C40F', 0, 0),
('Heat Wave', 'Yuma', '#E74C3C', '#F39C12', 0, 0);
