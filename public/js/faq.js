document.querySelectorAll('.faq-item > button').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !expanded);
    const answer = btn.nextElementSibling;
    if(answer) answer.hidden = expanded;
  });
});
