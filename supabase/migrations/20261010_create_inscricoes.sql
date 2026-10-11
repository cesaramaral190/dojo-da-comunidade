create table if not exists public.inscricoes (
  id bigint generated always as identity primary key,
  nome varchar(150) not null check (char_length(trim(nome)) between 2 and 150),
  idade smallint not null check (idade between 1 and 120),
  sexo text not null check (sexo in ('feminino', 'masculino', 'nao-informar')),
  telefone varchar(24) not null check (char_length(trim(telefone)) between 8 and 24),
  email varchar(254) not null check (char_length(trim(email)) between 5 and 254),
  mensagem varchar(2000),
  criado_em timestamptz not null default now()
);

alter table public.inscricoes enable row level security;
revoke all on table public.inscricoes from anon, authenticated;
grant insert on table public.inscricoes to anon;
grant select on table public.inscricoes to authenticated;
grant usage, select on sequence public.inscricoes_id_seq to anon;

drop policy if exists "cadastro_publico_de_inscricao" on public.inscricoes;
create policy "cadastro_publico_de_inscricao"
on public.inscricoes for insert to anon with check (true);

drop policy if exists "leitura_exclusiva_do_administrador" on public.inscricoes;
create policy "leitura_exclusiva_do_administrador"
on public.inscricoes for select to authenticated
using (auth.email() = 'cesar.amaral@ufms.br');
