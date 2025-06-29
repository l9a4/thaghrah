document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('submit-form');
  const programSelect = document.getElementById('program-select');
  const msg = document.getElementById('submitMsg');
  const desc = form ? form.querySelector('textarea[name="description"]') : null;
  const counter = document.getElementById('descCount');

  const getCookie = name => {
    const m = document.cookie.match('(?:^|; )' + name + '=([^;]*)');
    return m ? decodeURIComponent(m[1]) : '';
  };

  fetch('/api/programs')
    .then(r => r.json())
    .then(({ programs }) => {
      programs.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p._id;
        opt.textContent = p.name;
        programSelect.appendChild(opt);
      });
    })
    .catch(() => {
      if (msg) {
        msg.textContent = 'تعذر تحميل البرامج';
        msg.hidden = false;
      }
    });

  if (form) {
    if (desc && counter) {
      const update = () => {
        counter.textContent = desc.value.length + '/1000';
      };
      desc.addEventListener('input', update);
      update();
    }
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (msg) msg.hidden = true;
      const data = new FormData(form);
      try {
        const res = await fetch('/api/reports', {
          method: 'POST',
          body: data,
          headers: { 'CSRF-Token': getCookie('XSRF-TOKEN') }
        });
        const result = await res.json();
        if (res.ok && result.success) {
          if (msg) {
            msg.textContent = 'تم الإرسال بنجاح';
            msg.className = 'success';
            msg.hidden = false;
          }
          form.reset();
        } else {
          if (msg) {
            msg.textContent = result.message || 'حدث خطأ';
            msg.className = 'error';
            msg.hidden = false;
          }
        }
      } catch {
        if (msg) {
          msg.textContent = 'فشل الاتصال بالخادم';
          msg.className = 'error';
          msg.hidden = false;
        }
      }
    });
  }
});
