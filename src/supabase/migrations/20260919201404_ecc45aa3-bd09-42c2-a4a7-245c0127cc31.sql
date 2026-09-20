CREATE TABLE public.reservation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id text NOT NULL,
  customer_name text NOT NULL CHECK (char_length(customer_name) BETWEEN 2 AND 120),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 6 AND 40),
  email text NOT NULL CHECK (char_length(email) BETWEEN 5 AND 254),
  preferred_time text NOT NULL CHECK (preferred_time IN ('dopoledne','odpoledne','kdykoliv')),
  gift_voucher boolean NOT NULL DEFAULT false,
  gift_voucher_number text,
  therapist text CHECK (therapist IS NULL OR therapist IN ('Lucka','Jitka','Barča','bez preference')),
  amount_czk integer NOT NULL CHECK (amount_czk BETWEEN 100 AND 100000),
  status text NOT NULL DEFAULT 'pending_payment' CHECK (status IN ('pending_payment','paid','confirmed','cancelled')),
  payment_session_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.reservation_requests TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reservation_requests TO service_role;
ALTER TABLE public.reservation_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors can create reservation requests" ON public.reservation_requests FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending_payment' AND payment_session_id IS NULL);

CREATE TABLE public.voucher_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_kind text NOT NULL CHECK (voucher_kind IN ('procedure','amount')),
  service_id text,
  amount_czk integer NOT NULL CHECK (amount_czk BETWEEN 500 AND 100000),
  customer_name text NOT NULL CHECK (char_length(customer_name) BETWEEN 2 AND 120),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 6 AND 40),
  email text NOT NULL CHECK (char_length(email) BETWEEN 5 AND 254),
  delivery_type text NOT NULL CHECK (delivery_type IN ('email','pickup')),
  status text NOT NULL DEFAULT 'pending_payment' CHECK (status IN ('pending_payment','paid','fulfilled','cancelled')),
  payment_session_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((voucher_kind = 'procedure' AND service_id IS NOT NULL) OR (voucher_kind = 'amount' AND service_id IS NULL))
);
GRANT INSERT ON public.voucher_orders TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.voucher_orders TO service_role;
ALTER TABLE public.voucher_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors can create voucher orders" ON public.voucher_orders FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending_payment' AND payment_session_id IS NULL);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER reservation_requests_updated_at BEFORE UPDATE ON public.reservation_requests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER voucher_orders_updated_at BEFORE UPDATE ON public.voucher_orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();