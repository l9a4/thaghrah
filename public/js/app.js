// public/js/app.js

document.addEventListener('DOMContentLoaded', () => {
  const modal      = document.getElementById('authModal');
  const heading    = document.getElementById('auth-heading');
  const form       = document.getElementById('authForm');
  const emailInput = document.getElementById('authEmail');
  const passInput  = document.getElementById('authPass');
  
  // زرّ الفتح (Login / Register)
  document.querySelectorAll('.btn-auth').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.textContent.includes('تسجيل دخول') ? 'login' : 'register';
      openAuth(mode);
    });
  });

  // زرّ الإغلاق (×)
  document.querySelector('.modal-close').addEventListener('click', closeAuth);

  // إعداد الفرم قبل الإرسال
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const mode = heading.textContent === 'تسجيل دخول' ? 'login' : 'register';

    try {
      const res = await fetch(`/auth/${mode}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.value.trim(), password: passInput.value })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        closeAuth();
        window.location.href = '/pages/hacker-dashboard.html';
      } else {
        alert(data.message || 'فشل العملية');
      }
    } catch {
      alert('حدث خطأ، حاول مرة أخرى');
    }
  });
});

// فتح المودال مع تعديل العنوان وزر الإرسال
function openAuth(mode) {
  const modal = document.getElementById('authModal');
  document.getElementById('auth-heading').textContent =
    mode === 'login' ? 'تسجيل دخول' : 'إنشاء حساب';
  document.querySelector('#authForm button').textContent =
    mode === 'login' ? 'دخول' : 'تسجيل';
  // نظف الحقول
  document.getElementById('authEmail').value = '';
  document.getElementById('authPass').value = '';
  modal.hidden = false;
}

// إغلاق المودال
function closeAuth() {
  document.getElementById('authModal').hidden = true;
}
