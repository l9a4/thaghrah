const form = document.getElementById('submit-form');
if(form){
  const save = () => {
    const data = {};
    new FormData(form).forEach((v,k)=>{ if(k!=='files') data[k]=v; });
    localStorage.setItem('report-draft', JSON.stringify(data));
  };
  const load = () => {
    const saved = localStorage.getItem('report-draft');
    if(saved){
      try{
        const data = JSON.parse(saved);
        Object.entries(data).forEach(([k,v])=>{
          const el = form.querySelector(`[name="${k}"]`);
          if(el) el.value = v;
        });
      }catch{}
    }
  };
  form.addEventListener('input', save);
  form.addEventListener('submit', () => localStorage.removeItem('report-draft'));
  window.addEventListener('load', load);
}
