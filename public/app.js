async function checkLogin() {
  const res = await fetch('/api/check-auth');
  const { loggedIn, role } = await res.json();

  if(loggedIn){
    if(role === 'hacker')
      document.querySelector('#hacker-dashboard-link').style.display = 'block';
    if(role === 'company')
      document.querySelector('#company-dashboard-link').style.display = 'block';
  }
}
checkLogin();

// Language switch (AR/EN/FR)
const langBtns = document.querySelectorAll('.lang-switcher button');
langBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    langBtns.forEach(b => b.classList.toggle('active', b===btn));
    document.querySelectorAll('[data-lang]').forEach(el => {
      el.classList.toggle('hidden', el.dataset.lang !== lang);
    });
  });
});
// Dark/Light Mode toggle
const toggle = document.createElement('button');
toggle.textContent = '🌓';
toggle.onclick = () => {
  document.body.classList.toggle('light-mode');
  localStorage.theme = document.body.classList.contains('light-mode')?'light':'dark';
};
document.querySelector('.navbar').appendChild(toggle);
if(localStorage.theme==='light') document.body.classList.add('light-mode');
