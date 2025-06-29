const toggleBtn = document.getElementById('themeToggle');
const stored = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', stored);
if (toggleBtn) {
  toggleBtn.textContent = stored === 'dark' ? '☀️' : '🌙';
  toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    toggleBtn.textContent = next === 'dark' ? '☀️' : '🌙';
  });
}
