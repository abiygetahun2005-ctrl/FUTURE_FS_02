/*
  # CRM Lead Management Schema

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `name` (text) - Lead's full name
      - `email` (text) - Lead's email address
      - `phone` (text, optional) - Lead's phone number
      - `company` (text, optional) - Lead's company name
      - `source` (text) - Where the lead came from (website, referral, etc.)
      - `status` (text) - Current status (new, contacted, converted, lost)
      - `created_at` (timestamptz) - When the lead was created
      - `updated_at` (timestamptz) - When the lead was last updated
      - `user_id` (uuid) - Reference to auth.users (owner of the lead)
    
    - `lead_notes`
      - `id` (uuid, primary key)
      - `lead_id` (uuid) - Foreign key to leads table
      - `note` (text) - Note content
      - `follow_up_date` (timestamptz, optional) - Scheduled follow-up date
      - `created_at` (timestamptz) - When the note was created
      - `user_id` (uuid) - Reference to auth.users (who created the note)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own leads and notes
*/

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  source text NOT NULL DEFAULT 'website',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Create lead_notes table
CREATE TABLE IF NOT EXISTS lead_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  note text NOT NULL,
  follow_up_date timestamptz,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_notes_lead_id ON lead_notes(lead_id);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;

-- Policies for leads table
CREATE POLICY "Users can view their own leads"
  ON leads FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own leads"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own leads"
  ON leads FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for lead_notes table
CREATE POLICY "Users can view notes for their leads"
  ON lead_notes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_notes.lead_id
      AND leads.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create notes for their leads"
  ON lead_notes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_notes.lead_id
      AND leads.user_id = auth.uid()
    )
    AND auth.uid() = user_id
  );

CREATE POLICY "Users can update their own notes"
  ON lead_notes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON lead_notes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);