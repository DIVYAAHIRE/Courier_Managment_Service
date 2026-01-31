-- Fix for "invalid input syntax for type bigint" error

-- 1. Modify 'cash_entry' table
-- Change 'pickup_boy' from BIGINT to TEXT so it can store names like "Rajesh"
ALTER TABLE public.cash_entry 
ALTER COLUMN pickup_boy TYPE text;

-- 2. Modify 'acc_entry' table
-- Change 'pickup_boy' from BIGINT to TEXT
ALTER TABLE public.acc_entry 
ALTER COLUMN pickup_boy TYPE text;

-- Optional: If 'volumetric_weight' was also causing issues (if it was text), ensure it's correct.
-- But the error specifically mentioned "Rajesh" (pickup_boy).
