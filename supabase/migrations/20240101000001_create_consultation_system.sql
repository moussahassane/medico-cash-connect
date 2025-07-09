
-- Create doctors table
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  speciality TEXT NOT NULL,
  license_number TEXT UNIQUE NOT NULL,
  phone TEXT,
  is_online BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create consultations table
CREATE TABLE public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_phone TEXT NOT NULL,
  patient_email TEXT,
  doctor_id UUID REFERENCES public.doctors(id),
  type TEXT NOT NULL CHECK (type IN ('standard', 'urgent')),
  amount INTEGER NOT NULL,
  payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'paid', 'failed', 'free')),
  payment_provider TEXT,
  payment_phone TEXT,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'completed', 'cancelled')),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create consultation messages table
CREATE TABLE public.consultation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('patient', 'doctor')),
  message_text TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for doctors
CREATE POLICY "Doctors can view their own profile" ON public.doctors
  FOR SELECT USING (email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Public can view verified online doctors" ON public.doctors
  FOR SELECT USING (is_verified = true AND is_online = true);

-- RLS Policies for consultations
CREATE POLICY "Patients can view their consultations" ON public.consultations
  FOR SELECT USING (patient_phone = current_setting('request.jwt.claims', true)::json->>'phone' OR patient_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Doctors can view their consultations" ON public.consultations
  FOR SELECT USING (doctor_id IN (SELECT id FROM public.doctors WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));

-- RLS Policies for messages
CREATE POLICY "Consultation participants can view messages" ON public.consultation_messages
  FOR SELECT USING (
    consultation_id IN (
      SELECT id FROM public.consultations 
      WHERE patient_phone = current_setting('request.jwt.claims', true)::json->>'phone' 
         OR patient_email = current_setting('request.jwt.claims', true)::json->>'email'
         OR doctor_id IN (SELECT id FROM public.doctors WHERE email = current_setting('request.jwt.claims', true)::json->>'email')
    )
  );

-- Insert sample doctor for testing
INSERT INTO public.doctors (email, full_name, speciality, license_number, phone, is_online, is_verified)
VALUES ('docteur@visionSante.com', 'Dr. Martin Kouadio', 'Médecin généraliste', 'MED001', '+22780000000', true, true);
