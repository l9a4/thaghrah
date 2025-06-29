const toggle = document.getElementById('themeToggle');
const apply = mode => {
  document.body.classList.toggle('light', mode === 'light');
  localStorage.setItem('theme', mode);
};
const stored = localStorage.getItem('theme');
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
apply(stored || (prefersLight ? 'light' : 'dark'));
if (toggle) {
  toggle.addEventListener('click', () => {
    const newMode = document.body.classList.contains('light') ? 'dark' : 'light';
    apply(newMode);
  });
}
