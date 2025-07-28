-- Admin and Media Management Schema
-- Run this in Supabase SQL Editor

-- 1. Create admin roles table
create table admin_roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  permissions jsonb not null default '[]',
  created_at timestamp with time zone default now()
);

-- 2. Create admin_users table (extends profiles)
create table admin_users (
  id uuid primary key references profiles(id) on delete cascade,
  role_id uuid not null references admin_roles(id),
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- 3. Create media table for file uploads
create table media (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_path text not null,
  file_size integer not null,
  mime_type text not null,
  uploaded_by uuid not null references profiles(id),
  alt_text text,
  created_at timestamp with time zone default now()
);

-- 4. Create product_images table for multiple product images
create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  media_id uuid not null references media(id) on delete cascade,
  is_primary boolean default false,
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

-- 5. Insert default admin roles
insert into admin_roles (name, permissions) values
('super_admin', '["manage_users", "manage_products", "manage_artisans", "manage_media", "manage_content", "view_analytics"]'),
('content_manager', '["manage_products", "manage_media", "manage_content"]'),
('product_manager', '["manage_products", "manage_media"]');

-- 6. Create RLS policies for admin access
alter table admin_users enable row level security;
alter table media enable row level security;
alter table product_images enable row level security;

-- Admin users can only be accessed by themselves or super admins
create policy "Admin users can view own profile" on admin_users
  for select using (auth.uid() = id);

create policy "Super admins can manage all admin users" on admin_users
  for all using (
    exists (
      select 1 from admin_users au
      join admin_roles ar on au.role_id = ar.id
      where au.id = auth.uid() and ar.name = 'super_admin'
    )
  );

-- Media access policies
create policy "Users can view media" on media
  for select using (true);

create policy "Admin users can upload media" on media
  for insert with check (
    exists (
      select 1 from admin_users where id = auth.uid()
    )
  );

create policy "Admin users can manage their own media" on media
  for all using (
    uploaded_by = auth.uid() or
    exists (
      select 1 from admin_users au
      join admin_roles ar on au.role_id = ar.id
      where au.id = auth.uid() and ar.name in ('super_admin', 'content_manager')
    )
  );

-- Product images policies
create policy "Anyone can view product images" on product_images
  for select using (true);

create policy "Admin users can manage product images" on product_images
  for all using (
    exists (
      select 1 from admin_users where id = auth.uid()
    )
  );

-- 7. Create storage buckets for media
-- Note: This needs to be done in Supabase Dashboard > Storage
-- Bucket names: 'product-images', 'profile-avatars', 'article-images'

-- 8. Add indexes for better performance
create index idx_admin_users_role on admin_users(role_id);
create index idx_media_uploaded_by on media(uploaded_by);
create index idx_product_images_product on product_images(product_id);
create index idx_product_images_primary on product_images(product_id, is_primary) where is_primary = true; 