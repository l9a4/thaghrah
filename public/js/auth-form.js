document.addEventListener('DOMContentLoaded',()=>{
  const form=document.querySelector('.auth-form');
  if(!form) return;
  const errorEl=document.getElementById('authError');
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const data=new FormData(form);
<<<<<<< HEAD
    const token=document.cookie.match('(?:^|; )XSRF-TOKEN=([^;]*)');
    try{
      const res=await fetch(form.action,{method:'POST',headers:{'Content-Type':'application/json','CSRF-Token':token?decodeURIComponent(token[1]):''},body:JSON.stringify(Object.fromEntries(data)),credentials:'include'});
=======
    try{
      const res=await fetch(form.action,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(data)),credentials:'include'});
>>>>>>> 0b138ea488091ac33686512198db1e2647a9691e
      const result=await res.json();
      if(res.ok&&result.success){
        location.href='/';
      }else{
        if(errorEl){errorEl.textContent=result.message||'حدث خطأ';errorEl.hidden=false;}
      }
    }catch(err){
      if(errorEl){errorEl.textContent='فشل الاتصال بالخادم';errorEl.hidden=false;}
    }
  });
});
