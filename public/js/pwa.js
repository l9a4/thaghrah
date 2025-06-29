if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}

let deferred;
const installBtn = document.getElementById('installBtn');
if (installBtn) {
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferred = e;
    installBtn.hidden = false;
  });

  installBtn.addEventListener('click', async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    deferred = null;
    installBtn.hidden = true;
  });
}
