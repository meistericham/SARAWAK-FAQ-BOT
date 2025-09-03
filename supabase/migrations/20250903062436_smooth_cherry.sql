/*
  # Add Admin User

  1. New Data
    - Insert admin user profile for hisyamudin@sarawaktourism.com
    - Set role as ADMIN
    - Use the existing auth user ID if available

  2. Security
    - Admin user will have full system access
    - Profile linked to existing auth.users entry
*/

-- Insert admin profile
-- Note: This assumes the user already exists in auth.users
-- If not, they'll need to sign up first, then we'll update their role

INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
SELECT 
  id,
  'hisyamudin@sarawaktourism.com',
  'Hisyamudin (Admin)',
  'ADMIN',
  now(),
  now()
FROM auth.users 
WHERE email = 'hisyamudin@sarawaktourism.com'
ON CONFLICT (email) 
DO UPDATE SET 
  role = 'ADMIN',
  full_name = 'Hisyamudin (Admin)',
  updated_at = now();

-- If the user doesn't exist in auth.users yet, create a placeholder profile
-- This will be updated when they first sign up
INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'hisyamudin@sarawaktourism.com',
  'Hisyamudin (Admin)',
  'ADMIN',
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'hisyamudin@sarawaktourism.com'
)
ON CONFLICT (email) DO NOTHING;