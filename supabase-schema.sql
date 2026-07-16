-- ================================================================
-- REFUGIO DIGITAL — Schema completo
-- Ejecutar en: Supabase → SQL Editor → Run
-- ================================================================

create extension if not exists "uuid-ossp";

-- ── PERFILES ────────────────────────────────────────────────────
create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'reader' check (role in ('admin','reader')),
  created_at timestamptz not null default now()
);

create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, role) values (new.id, 'reader')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

alter table profiles enable row level security;
create policy "Perfil propio" on profiles for select using (auth.uid() = id);
create policy "Admin ve todo" on profiles for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- ── NOTAS ───────────────────────────────────────────────────────
create table if not exists notes (
  id               uuid primary key default uuid_generate_v4(),
  title            text not null,
  slug             text not null unique,
  body             text not null,
  excerpt          text,
  audio_url        text,
  cover_image_url  text,
  published        boolean not null default false,
  published_at     timestamptz,
  author_id        uuid not null references auth.users(id),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists notes_slug_idx      on notes(slug);
create index if not exists notes_published_idx on notes(published, published_at desc);

create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists notes_updated_at on notes;
create trigger notes_updated_at before update on notes
  for each row execute procedure update_updated_at();

alter table notes enable row level security;
create policy "Leer notas publicadas" on notes for select using (published = true);
create policy "Admin gestiona notas"  on notes for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- ── REFLEXIONES ─────────────────────────────────────────────────
create table if not exists daily_reflections (
  id               uuid primary key default uuid_generate_v4(),
  content          text not null,
  source           text,
  reflection_date  date not null unique,
  created_by       uuid not null references auth.users(id),
  created_at       timestamptz not null default now()
);

create index if not exists reflections_date_idx on daily_reflections(reflection_date desc);

alter table daily_reflections enable row level security;
create policy "Leer reflexiones"     on daily_reflections for select using (true);
create policy "Admin gestiona refs"  on daily_reflections for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- ── LIBROS ──────────────────────────────────────────────────────
create table if not exists books (
  id         uuid primary key default uuid_generate_v4(),
  title      text not null,
  author     text not null,
  cover_url  text,
  review     text,
  published  boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table books enable row level security;
create policy "Leer libros publicados" on books for select using (published = true);
create policy "Admin gestiona libros"  on books for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- ── CITAS DE LIBROS ─────────────────────────────────────────────
create table if not exists book_quotes (
  id         uuid primary key default uuid_generate_v4(),
  book_id    uuid not null references books(id) on delete cascade,
  quote_text text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table book_quotes enable row level security;
create policy "Leer citas de libros publicados" on book_quotes for select using (
  exists (select 1 from books b where b.id = book_id and b.published = true)
);
create policy "Admin gestiona citas" on book_quotes for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- ── BENDICIONES ─────────────────────────────────────────────────
create table if not exists blessings (
  id         uuid primary key default uuid_generate_v4(),
  content    text not null check (char_length(content) between 5 and 280),
  approved   boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists blessings_approved_idx on blessings(approved, created_at desc);

alter table blessings enable row level security;
create policy "Leer bendiciones aprobadas" on blessings for select using (approved = true);
create policy "Cualquiera puede bendecir"  on blessings for insert with check (true);
create policy "Admin modera bendiciones"   on blessings for update using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "Admin elimina bendiciones"  on blessings for delete using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- ── ETIQUETAS ───────────────────────────────────────────────────
create table if not exists tags (
  id      uuid primary key default uuid_generate_v4(),
  name    text not null unique,
  slug    text not null unique,
  emotion text
);

alter table tags enable row level security;
create policy "Leer etiquetas"     on tags for select using (true);
create policy "Admin gestiona tags" on tags for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- ── NOTA ↔ ETIQUETA ─────────────────────────────────────────────
create table if not exists note_tags (
  note_id uuid not null references notes(id) on delete cascade,
  tag_id  uuid not null references tags(id)  on delete cascade,
  primary key (note_id, tag_id)
);

alter table note_tags enable row level security;
create policy "Leer note_tags"     on note_tags for select using (true);
create policy "Admin gestiona note_tags" on note_tags for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- ── CONTENIDO POR EMOCIÓN ───────────────────────────────────────
create table if not exists emotion_content (
  id           uuid primary key default uuid_generate_v4(),
  emotion      text not null check (emotion in ('miedo','ansiedad','soledad','enojo','perdon','sin-paz')),
  content_type text not null check (content_type in ('note','reflection','quote')),
  content_id   uuid not null,
  sort_order   integer not null default 0
);

create index if not exists emotion_content_idx on emotion_content(emotion, sort_order);

alter table emotion_content enable row level security;
create policy "Leer emotion_content"     on emotion_content for select using (true);
create policy "Admin gestiona emotions"  on emotion_content for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- ── SEED: Etiquetas base ─────────────────────────────────────────
insert into tags (name, slug, emotion) values
  ('miedo',       'miedo',       'miedo'),
  ('ansiedad',    'ansiedad',    'ansiedad'),
  ('soledad',     'soledad',     'soledad'),
  ('enojo',       'enojo',       'enojo'),
  ('perdón',      'perdon',      'perdon'),
  ('paz',         'paz',         'sin-paz'),
  ('presencia',   'presencia',   null),
  ('amor',        'amor',        null),
  ('culpa',       'culpa',       'perdon'),
  ('confianza',   'confianza',   null),
  ('consciencia', 'consciencia', null),
  ('gratitud',    'gratitud',    null)
on conflict (slug) do nothing;

-- ── Hacer admin al primer usuario ───────────────────────────────
-- EJECUTAR ESTO APARTE después de crear tu cuenta:
--
-- UPDATE profiles SET role = 'admin'
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'TU_EMAIL_AQUI');
