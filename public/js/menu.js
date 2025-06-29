const menuBtn = document.getElementById('hamburger');
const links = document.getElementById('navLinks');
if(menuBtn && links){
  menuBtn.addEventListener('click', e => {
    e.stopPropagation();
    const open = links.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', e => {
    if(links.classList.contains('open') && !links.contains(e.target) && e.target !== menuBtn){
      links.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

