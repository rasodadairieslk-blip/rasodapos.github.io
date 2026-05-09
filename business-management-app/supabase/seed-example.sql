-- Example seed data for Supabase

-- 1) Create outlets
insert into outlets (id, name, timezone) values
  ('11111111-1111-1111-1111-111111111111', 'Milky Hug Outlet A', 'Asia/Colombo'),
  ('22222222-2222-2222-2222-222222222222', 'Milky Hug Outlet B', 'Asia/Colombo');

-- 2) Create profiles for existing auth users
-- Replace USER_ID_1 and USER_ID_2 with real auth.users ids
insert into profiles (id, email, full_name, role, outlet_id) values
  ('USER_ID_1', 'admin@milkyhug.com', 'Outlet A Admin', 'admin', '11111111-1111-1111-1111-111111111111'),
  ('USER_ID_2', 'staff@milkyhug.com', 'Outlet A Staff', 'user', '11111111-1111-1111-1111-111111111111');

-- 3) Insert a transaction for an outlet
insert into transactions (outlet_id, user_id, customer_name, subtotal, tax, discount, total, receipt_number, status, data)
values
  ('11111111-1111-1111-1111-111111111111', 'USER_ID_2', 'Mr. Silva', 1200, 120, 0, 1320, 'REC-1001', 'paid', '{"items": [{"name": "Milk", "qty": 3}]}');
