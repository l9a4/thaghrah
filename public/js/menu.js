const menuBtn = document.getElementById('hamburger');
const links = document.getElementById('navLinks');
if(menuBtn && links){
  menuBtn.addEventListener('click', e => {
    e.stopPropagation();
    links.classList.toggle('open');
  });
  document.addEventListener('click', e => {
    if(links.classList.contains('open') && !links.contains(e.target)){
      links.classList.remove('open');
    }
  });
}

