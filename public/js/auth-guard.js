import { auth } from './firebase-init.js';
import { onAuthStateChanged, getIdTokenResult } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';

export function guard(requiredRole) {
  onAuthStateChanged(auth, async user => {
    if (!user) {
      location.href = '/pages/login.html';
      return;
    }
    const token = await getIdTokenResult(user, true);
    const role = token.claims.role;
    if (requiredRole && role !== requiredRole && role !== 'admin') {
      location.href = '/';
    }
  });
}
