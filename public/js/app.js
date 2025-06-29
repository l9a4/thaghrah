// public/js/app.js
document.addEventListener('DOMContentLoaded', () => {
  const modal       = document.getElementById('authModal');
  const btnsOpen    = document.querySelectorAll('.btn-auth');
  const btnClose    = document.getElementById('authClose');
  const heading     = document.getElementById('auth-heading');
  const form        = document.getElementById('authForm');
  const emailInput  = document.getElementById('authEmail');
  const passInput   = document.getElementById('authPass');
  const submitBtn   = document.getElementById('authSubmit');
  const switchLink  = document.getElementById('authSwitch');

  let mode = 'login';  // الوضع الحالي: 'login' أو 'register'

  // دالة فتح المودال
  function openAuth(selectedMode) {
    mode = selectedMode;
    modal.hidden = false;
    heading.textContent    = mode === 'login' ? 'تسجيل دخول' : 'إنشاء حساب';
    submitBtn.textContent  = mode === 'login' ? 'دخول'       : 'تسجيل';
    emailInput.value = '';
    passInput.value  = '';
  }

  // دالة إغلاق المودال
  function closeAuth() {
    modal.hidden = true;
  }

  // تبديل الوضع (Login ↔ Register)
  function toggleMode() {
    openAuth(mode === 'login' ? 'register' : 'login');
  }

  // ربط أزرار الفتح
  btnsOpen.forEach(btn => {
    btn.addEventListener('click', () => openAuth(btn.dataset.mode));
  });

  // ربط زرّ الإغلاق
  btnClose.addEventListener('click', closeAuth);

  // ربط رابط التبديل داخل المودال
  switchLink.addEventListener('click', e => {
    e.preventDefault();
    toggleMode();
  });

  // معالجة الإرسال
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const endpoint = `/auth/${mode}`;
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.value.trim(),
          password: passInput.value
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        closeAuth();
        // توجه بعد النجاح
        window.location.href = '/pages/hacker-dashboard.html';
      } else {
        alert(data.message || 'فشل العملية');
      }
    } catch {
      alert('خطأ في الاتصال بالسيرفر');
    }
  });
});


