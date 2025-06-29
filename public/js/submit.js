document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('submit-form');
  const programSelect = document.getElementById('program-select');
  const msg = document.getElementById('submitMsg');

  fetch('/api/programs')
    .then(r => r.json())
    .then(({ programs }) => {
      programs.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
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
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (msg) msg.hidden = true;
      const data = new FormData(form);
      try {
        const res = await fetch('/api/submit', {
          method: 'POST',
          body: data,
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
