(document.addEventListener('DOMContentLoaded',()=>{
  const els=document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){
    els.forEach(el=>el.classList.add('visible'));
    return;
  }
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  },{threshold:0.1});
  els.forEach(el=>obs.observe(el));
}));
