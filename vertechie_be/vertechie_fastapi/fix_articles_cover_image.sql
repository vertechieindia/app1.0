-- Fix: allow long cover_image/thumbnail (e.g. base64) - run with: psql -U <user> -d <dbname> -f fix_articles_cover_image.sql
ALTER TABLE articles ALTER COLUMN cover_image TYPE TEXT;
ALTER TABLE articles ALTER COLUMN thumbnail TYPE TEXT;
