const { supabaseUrl, supabasePublishableKey, adminUsername, adminEmail } = window.DOJO_CONFIG;
const loginPanel = document.querySelector('#login-panel');
const dashboard = document.querySelector('#dashboard');
const loginForm = document.querySelector('#login-form');
const authStatus = document.querySelector('#auth-status');
const dashboardStatus = document.querySelector('#dashboard-status');
const logoutButton = document.querySelector('#logout');
const registrationsBody = document.querySelector('#registrations');
const emptyState = document.querySelector('#empty-state');
const searchInput = document.querySelector('#search');
let registrations = [];

async function authRequest(path, body) {
  const response = await fetch(`${supabaseUrl}/auth/v1/${path}`, {
    method: 'POST',
    headers: { apikey: supabasePublishableKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.msg || result.message || 'Não foi possível autenticar.');
  return result;
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const username = formData.get('username').trim().toLocaleLowerCase('pt-BR');
  const password = formData.get('password');
  const button = loginForm.querySelector('button[type="submit"]');
  button.disabled = true;
  authStatus.className = 'status';
  authStatus.textContent = 'Entrando...';
  try {
    if (username !== adminUsername) throw new Error('Credenciais inválidas.');
    const session = await authRequest('token?grant_type=password', { email: adminEmail, password });
    sessionStorage.setItem('dojo_admin_token', session.access_token);
    loginForm.reset();
    await openDashboard();
  } catch (error) {
    authStatus.className = 'status error';
    authStatus.textContent = 'Usuário ou senha incorretos.';
  } finally {
    button.disabled = false;
  }
});

async function loadRegistrations() {
  const token = sessionStorage.getItem('dojo_admin_token');
  dashboardStatus.className = 'status';
  dashboardStatus.textContent = 'Carregando inscrições...';
  const response = await fetch(`${supabaseUrl}/rest/v1/inscricoes?select=id,nome,idade,sexo,telefone,email,mensagem,criado_em&order=criado_em.desc`, {
    headers: { apikey: supabasePublishableKey, Authorization: `Bearer ${token}` }
  });
  if (response.status === 401 || response.status === 403) {
    sessionStorage.removeItem('dojo_admin_token');
    showLogin('Sua sessão expirou. Entre novamente.');
    return;
  }
  if (!response.ok) throw new Error('Não foi possível carregar as inscrições.');
  registrations = await response.json();
  dashboardStatus.textContent = '';
  updateMetrics();
  renderRegistrations(registrations);
}

function updateMetrics() {
  const today = new Date().toDateString();
  document.querySelector('#total-count').textContent = registrations.length;
  document.querySelector('#today-count').textContent = registrations.filter(item => new Date(item.criado_em).toDateString() === today).length;
}

function makeCell(value, className = '') {
  const cell = document.createElement('td');
  cell.textContent = value ?? '—';
  if (className) cell.className = className;
  return cell;
}

function renderRegistrations(items) {
  registrationsBody.replaceChildren();
  emptyState.classList.toggle('hidden', items.length !== 0);
  for (const item of items) {
    const row = document.createElement('tr');
    row.append(makeCell(new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(item.criado_em))));
    row.append(makeCell(item.nome));
    row.append(makeCell(item.idade));
    row.append(makeCell({ feminino: 'Feminino', masculino: 'Masculino', 'nao-informar': 'Não informado' }[item.sexo]));
    const contact = document.createElement('td');
    contact.className = 'contact';
    const phone = document.createElement('a');
    phone.href = `tel:${item.telefone}`;
    phone.textContent = item.telefone;
    const email = document.createElement('a');
    email.href = `mailto:${item.email}`;
    email.textContent = item.email;
    contact.append(phone, email);
    row.append(contact, makeCell(item.mensagem, 'message'));
    registrationsBody.append(row);
  }
}

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLocaleLowerCase('pt-BR');
  const filtered = registrations.filter(item => [item.nome, item.telefone, item.email].some(value => value.toLocaleLowerCase('pt-BR').includes(query)));
  renderRegistrations(filtered);
});

async function openDashboard() {
  loginPanel.classList.add('hidden');
  dashboard.classList.remove('hidden');
  logoutButton.classList.remove('hidden');
  try { await loadRegistrations(); } catch (error) {
    dashboardStatus.className = 'status error';
    dashboardStatus.textContent = error.message;
  }
}

function showLogin(message = '') {
  dashboard.classList.add('hidden');
  logoutButton.classList.add('hidden');
  loginPanel.classList.remove('hidden');
  authStatus.textContent = message;
}

document.querySelector('#refresh').addEventListener('click', loadRegistrations);
logoutButton.addEventListener('click', () => {
  sessionStorage.removeItem('dojo_admin_token');
  showLogin('Sessão encerrada.');
});

if (sessionStorage.getItem('dojo_admin_token')) openDashboard();
