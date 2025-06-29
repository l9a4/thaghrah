// فتح المودال، تنقل بين login/register، تنفيذ POST إلى /auth
window.openAuth = mode => {
  const modal = document.getElementById('authModal');
  modal.hidden = false;
  document.getElementById('auth-heading').textContent = mode === 'login' ? 'تسجيل دخول' : 'إنشاء حساب';
  document.getElementById('authForm').onsubmit = async e => {
    e.preventDefault();
    const email = document.getElementById('authEmail').value;
    const pass  = document.getElementById('authPass').value;
    try {
      await fetch(`/auth/${mode}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      location.reload();
    } catch {
      alert('حدث خطأ، حاول مرة أخرى');
    }
  };
};
window.closeAuth = () => document.getElementById('authModal').hidden = true;
window.switchAuth = mode => {
  document.getElementById('auth-heading').textContent = mode === 'login' ? 'تسجيل دخول' : 'إنشاء حساب';
  document.querySelector('#authForm button').textContent = mode === 'login' ? 'دخول' : 'تسجيل';
};
