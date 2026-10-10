const registration = document.querySelector('#registration');
const notice = document.querySelector('#notice');
registration.addEventListener('submit', (event) => {
  event.preventDefault();
  notice.showModal();
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
