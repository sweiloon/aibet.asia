
// This file is just for documentation purposes to remind us we need to create a user_roles table
// The table will be created via SQL migration in Supabase

/*
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Admin can read all roles
CREATE POLICY "Admins can read all roles" ON public.user_roles
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Users can read their own roles
CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT 
  TO authenticated
  USING (user_id = auth.uid());

-- Only admins can insert new roles
CREATE POLICY "Only admins can insert roles" ON public.user_roles
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can update roles
CREATE POLICY "Only admins can update roles" ON public.user_roles
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can delete roles
CREATE POLICY "Only admins can delete roles" ON public.user_roles
  FOR DELETE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Index for performance
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
*/
