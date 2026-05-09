-- outlets table
create table if not exists outlets (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  timezone text default 'Asia/Colombo',
  created_at timestamptz default now()
);

-- profiles table
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role text default 'user',
  outlet_id uuid references outlets(id) on delete set null,
  created_at timestamptz default now()
);

-- transactions table
create table if not exists transactions (
  id uuid primary key default uuid_generate_v4(),
  outlet_id uuid not null references outlets(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_name text,
  subtotal numeric not null default 0,
  tax numeric not null default 0,
  discount numeric not null default 0,
  total numeric not null default 0,
  receipt_number text,
  status text default 'paid',
  data jsonb,
  created_at timestamptz default now()
);

-- enable row level security
alter table profiles enable row level security;
alter table transactions enable row level security;

-- profiles RLS
create policy "Profiles can view their own profile" on profiles
  for select using (auth.uid() = id);

create policy "Admins can manage all profiles" on profiles
  for all using (auth.role() = 'authenticated' and exists (
    select 1 from profiles as p where p.id = auth.uid() and p.role = 'admin'
  ));

-- transactions RLS
create policy "Allow outlet users to select transactions" on transactions
  for select using (
    exists (
      select 1 from profiles p where p.id = auth.uid() and p.outlet_id = transactions.outlet_id
    )
  );

create policy "Allow outlet users to insert transactions" on transactions
  for insert with check (
    exists (
      select 1 from profiles p where p.id = auth.uid() and p.outlet_id = transactions.outlet_id
    )
  );

create policy "Allow outlet users to update transactions" on transactions
  for update using (
    exists (
      select 1 from profiles p where p.id = auth.uid() and p.outlet_id = transactions.outlet_id
    )
  ) with check (
    exists (
      select 1 from profiles p where p.id = auth.uid() and p.outlet_id = transactions.outlet_id
    )
  );

create policy "Admins can manage transactions" on transactions
  for all using (
    exists (
      select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'
    )
  );
