/*
  # Fix user signup trigger

  1. Database Functions
    - Create or replace the `handle_new_user` function that automatically creates a profile when a user signs up
    
  2. Triggers
    - Create trigger on auth.users table to call handle_new_user function
    
  3. Security
    - Ensure RLS policies allow the trigger to insert profiles
    
  This migration fixes the "Database error saving new user" issue by ensuring that when a user signs up through Supabase Auth, a corresponding profile record is automatically created.
*/

-- Create or replace the function that handles new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger that calls our function when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Ensure the profiles table has the correct RLS policy for inserts
-- This policy allows the trigger to insert profiles even when called from the auth context
CREATE POLICY IF NOT EXISTS "Enable insert for service role" ON public.profiles
  FOR INSERT
  TO service_role
  WITH CHECK (true);