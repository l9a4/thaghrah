import { auth, db } from './firebase-init.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';
import { getFunctions, httpsCallable } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-functions.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.auth-form');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    try {
      if (form.dataset.mode === 'register') {
        const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
        await setDoc(doc(db, 'users', cred.user.uid), {
          email: data.email,
          role: data.role || 'hacker',
          createdAt: Date.now()
        });
        const functions = getFunctions();
        const setRole = httpsCallable(functions, 'setUserRole');
        await setRole({ role: data.role || 'hacker' });
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
      }
      location.href = '/';
    } catch (err) {
      const el = document.getElementById('authError');
      if (el) {
        el.textContent = err.message;
        el.hidden = false;
      }
    }
  });
});
