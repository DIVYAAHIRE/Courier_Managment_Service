-- FIX: Drop the foreign key constraint first so we can change the type
-- Error was: "foreign key constraint fk_cash_pickup_boy cannot be implemented"

-- 1. Drop constraints (if they exist)
ALTER TABLE public.cash_entry DROP CONSTRAINT IF EXISTS fk_cash_pickup_boy;
ALTER TABLE public.acc_entry DROP CONSTRAINT IF EXISTS fk_acc_pickup_boy;  -- Guessing this name, but good to try

-- 2. NOW change the column type to TEXT
ALTER TABLE public.cash_entry ALTER COLUMN pickup_boy TYPE text;
ALTER TABLE public.acc_entry ALTER COLUMN pickup_boy TYPE text;
