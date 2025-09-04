/*
  # Create FAQs table for tourism assistant

  1. New Tables
    - `faqs`
      - `id` (uuid, primary key)
      - `question` (text, not null)
      - `answer` (text, not null)
      - `category` (text, optional for future categorization)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `created_by` (uuid, foreign key to profiles)
      - `updated_by` (uuid, foreign key to profiles)

  2. Security
    - Enable RLS on `faqs` table
    - Add policies for authenticated users to read FAQs
    - Add policies for admin users to manage FAQs

  3. Indexes
    - Add index on question for search functionality
    - Add index on category for filtering
*/

CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text DEFAULT 'general',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES profiles(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Policies for reading FAQs (all authenticated users)
CREATE POLICY "Authenticated users can read active FAQs"
  ON faqs
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Policies for admin management (admin users only)
CREATE POLICY "Admin users can manage FAQs"
  ON faqs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'ADMIN'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'ADMIN'
    )
  );

-- Service role full access
CREATE POLICY "Service role full access on FAQs"
  ON faqs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_faqs_question ON faqs USING gin(to_tsvector('english', question));
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs (category);
CREATE INDEX IF NOT EXISTS idx_faqs_active ON faqs (is_active);
CREATE INDEX IF NOT EXISTS idx_faqs_created_at ON faqs (created_at DESC);

-- Create trigger for updated_at
CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample FAQs
INSERT INTO faqs (question, answer, category, created_by) VALUES
(
  'Where is Sarawak Cultural Village located?',
  'Sarawak Cultural Village is located at Damai Beach on the Santubong peninsula, about 30-40 minutes drive from Kuching city center. You can take a taxi or join a tour group to get there.',
  'attractions',
  (SELECT id FROM profiles WHERE role = 'ADMIN' LIMIT 1)
),
(
  'What are the must-try foods in Sarawak?',
  'Must-try Sarawak foods include laksa Sarawak (with coconut milk and prawns), kolo mee (dry noodles), ayam pansuh (bamboo chicken), midin (jungle fern), and layer cake. Best found at local kopitiams and food courts.',
  'food',
  (SELECT id FROM profiles WHERE role = 'ADMIN' LIMIT 1)
),
(
  'How do I get to Bako National Park?',
  'Take a bus to Kampung Bako (about 1 hour from Kuching), then take a boat to the park entrance. The boat ride takes about 20 minutes. Boats operate based on tide schedules.',
  'attractions',
  (SELECT id FROM profiles WHERE role = 'ADMIN' LIMIT 1)
),
(
  'What can I see at Mulu National Park?',
  'Mulu National Park features the world''s largest cave chamber (Sarawak Chamber), Deer Cave, and Clear Water Cave. It''s a UNESCO World Heritage site. You can also see millions of bats emerging from caves at sunset.',
  'attractions',
  (SELECT id FROM profiles WHERE role = 'ADMIN' LIMIT 1)
),
(
  'Can I stay in a traditional longhouse?',
  'Yes! Traditional longhouse stays offer authentic cultural experiences with Iban and Bidayuh communities. You can enjoy traditional meals, cultural performances, and learn about indigenous customs. Book through tour operators in Kuching.',
  'accommodation',
  (SELECT id FROM profiles WHERE role = 'ADMIN' LIMIT 1)
),
(
  'What festivals happen in Sarawak?',
  'Major Sarawak festivals include Gawai Dayak (harvest festival in June), Rainforest World Music Festival (July), Chinese New Year, Hari Raya, and various cultural celebrations throughout the year.',
  'culture',
  (SELECT id FROM profiles WHERE role = 'ADMIN' LIMIT 1)
),
(
  'What is the best time to visit Sarawak?',
  'The best time to visit Sarawak is during the dry season from March to October. However, Sarawak has a tropical climate year-round, so you can visit anytime. Avoid the wettest months (November-February) for outdoor activities.',
  'general',
  (SELECT id FROM profiles WHERE role = 'ADMIN' LIMIT 1)
),
(
  'Do I need a visa to visit Sarawak?',
  'Visa requirements depend on your nationality. Many countries get visa-free entry for tourism (14-90 days). Check with Malaysian consulates or immigration websites for specific requirements based on your passport.',
  'general',
  (SELECT id FROM profiles WHERE role = 'ADMIN' LIMIT 1)
);