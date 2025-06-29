const nav = document.querySelector('.navbar');
const back = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if(nav) nav.classList.toggle('scrolled', y > 50);
  if(back) back.style.display = y > 200 ? 'block' : 'none';
});
if(back){
  back.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
