/*
  # Fix user signup trigger

  This migration fixes the user signup process by ensuring the trigger
  function and policies are properly configured.

  1. Updates the handle_new_user function
  2. Recreates the trigger on auth.users
  3. Adds service role policy for profile creation
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

-- Drop existing service role policy if it exists
DROP POLICY IF EXISTS "Enable insert for service role" ON public.profiles;

-- Create policy to allow service role to insert profiles
CREATE POLICY "Enable insert for service role" ON public.profiles
  FOR INSERT
  TO service_role
  WITH CHECK (true);