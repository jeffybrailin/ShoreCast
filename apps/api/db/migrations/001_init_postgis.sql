-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Beaches table with geospatial index
CREATE TABLE IF NOT EXISTS beaches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'India',
    location GEOMETRY(Point, 4326) NOT NULL,
    description TEXT,
    suitability_score FLOAT DEFAULT 50.0,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS beaches_location_gist ON beaches USING GIST(location);
CREATE INDEX IF NOT EXISTS beaches_score_idx ON beaches(suitability_score DESC);

-- Weather/marine cache
CREATE TABLE IF NOT EXISTS weather_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beach_id UUID REFERENCES beaches(id) ON DELETE CASCADE,
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    payload JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS weather_cache_beach_time ON weather_cache(beach_id, fetched_at DESC);

-- Safety alerts
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beach_id UUID REFERENCES beaches(id) ON DELETE CASCADE,
    severity TEXT CHECK (severity IN ('LOW','MEDIUM','HIGH','CRITICAL')) DEFAULT 'LOW',
    category TEXT DEFAULT 'MARINE',
    message TEXT NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true
);

-- Agent sessions / scratchpad
CREATE TABLE IF NOT EXISTS agent_sessions (
    session_id TEXT PRIMARY KEY,
    user_id TEXT,
    scratchpad JSONB DEFAULT '{}',
    location_history JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active TIMESTAMPTZ DEFAULT NOW()
);

-- POI cache (Overpass results)
CREATE TABLE IF NOT EXISTS poi_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location GEOMETRY(Point, 4326) NOT NULL,
    amenity_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    cached_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS poi_cache_location_gist ON poi_cache USING GIST(location);

-- Seed Indian coastal beaches
INSERT INTO beaches (name, state, location, description, suitability_score) VALUES
    ('Marina Beach', 'Tamil Nadu', ST_SetSRID(ST_MakePoint(80.2785, 13.0500), 4326), 'Longest urban beach in India.', 72.0),
    ('Juhu Beach', 'Maharashtra', ST_SetSRID(ST_MakePoint(72.8264, 19.1075), 4326), 'Popular suburban beach in Mumbai.', 58.0),
    ('Calangute Beach', 'Goa', ST_SetSRID(ST_MakePoint(73.7553, 15.5440), 4326), 'Queen of Goan beaches.', 80.0),
    ('Radhanagar Beach', 'Andaman & Nicobar', ST_SetSRID(ST_MakePoint(92.9762, 11.9916), 4326), 'Pristine beach, ranked among Asia best.', 91.0),
    ('Puri Beach', 'Odisha', ST_SetSRID(ST_MakePoint(85.8245, 19.7979), 4326), 'Religious and recreational beach.', 65.0),
    ('Kovalam Beach', 'Kerala', ST_SetSRID(ST_MakePoint(76.9827, 8.3988), 4326), 'Crescent-shaped beach with lighthouse.', 83.0),
    ('Rushikonda Beach', 'Andhra Pradesh', ST_SetSRID(ST_MakePoint(83.3800, 17.7760), 4326), 'Blue-flag beach near Vizag.', 87.0),
    ('Varkala Beach', 'Kerala', ST_SetSRID(ST_MakePoint(76.7163, 8.7379), 4326), 'Cliff-top beach with mineral springs.', 76.0),
    ('Diu Beach', 'Diu', ST_SetSRID(ST_MakePoint(70.9878, 20.7142), 4326), 'Calm beaches in union territory.', 78.0),
    ('Tarkarli Beach', 'Maharashtra', ST_SetSRID(ST_MakePoint(73.4698, 16.0167), 4326), 'Crystal clear waters for snorkeling.', 85.0)
ON CONFLICT DO NOTHING;
