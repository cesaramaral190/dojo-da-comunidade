const registration = document.querySelector('#registration');
const notice = document.querySelector('#notice');
const noticeTitle = document.querySelector('#notice-title');
const noticeMessage = document.querySelector('#notice-message');
const submitButton = registration.querySelector('button[type="submit"]');
const submitButtonContent = submitButton.innerHTML;
const { supabaseUrl, supabasePublishableKey } = window.DOJO_CONFIG;

registration.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!registration.reportValidity()) return;

  const data = new FormData(registration);
  const payload = {
    nome: data.get('nome').trim(),
    idade: Number(data.get('idade')),
    sexo: data.get('sexo'),
    telefone: data.get('telefone').trim(),
    email: data.get('email').trim(),
    mensagem: data.get('mensagem').trim() || null
  };

  submitButton.disabled = true;
  submitButton.textContent = 'ENVIANDO...';

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/inscricoes`, {
      method: 'POST',
      headers: {
        apikey: supabasePublishableKey,
        Authorization: `Bearer ${supabasePublishableKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`Falha ao enviar: ${response.status}`);
    registration.reset();
    noticeTitle.textContent = 'Inscrição recebida!';
    noticeMessage.textContent = 'Obrigado por fazer parte do Dojo da Comunidade. Entraremos em contato pelos dados informados.';
  } catch (error) {
    console.error(error);
    noticeTitle.textContent = 'Não foi possível enviar';
    noticeMessage.textContent = 'Confira sua conexão e tente novamente. Seus dados ainda não foram enviados.';
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = submitButtonContent;
    notice.showModal();
  }
});
document.querySelector('#close-notice').addEventListener('click', () => notice.close());
const navigation = [...document.querySelectorAll('.site-header nav a')];
const observedSections = [...document.querySelectorAll('main > section, footer')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const link of navigation) {
        const active = link.hash === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }
  }, { rootMargin: '-5% 0px -65% 0px', threshold: 0 });
  observedSections.forEach(section => observer.observe(section));
}

const classMapElement = document.querySelector('#class-map');
if (classMapElement && window.L) {
  const classLocation = [-21.1959644, -50.4320514];
  const classMap = L.map(classMapElement, { scrollWheelZoom: false }).setView(classLocation, 16);
  const openFreeMapLayer = window.MaplibreGLLeaflet?.maplibreGL || L.maplibreGL;
  if (openFreeMapLayer) {
    openFreeMapLayer({ style: 'https://tiles.openfreemap.org/styles/liberty' }).addTo(classMap);
  }
  classMap.attributionControl.addAttribution('<a href="https://openfreemap.org/">OpenFreeMap</a> · dados do <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>');
  L.marker(classLocation)
    .addTo(classMap)
    .bindPopup('<strong>Dojo da Comunidade</strong><br>Comando de Policiamento do Interior 10')
    .openPopup();
}
