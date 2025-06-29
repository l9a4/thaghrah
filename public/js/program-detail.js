document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return;
  const res = await fetch(`/api/programs/${id}`);
  const { program } = await res.json();
  if (!program) return;
  document.getElementById('name').textContent = program.name;
  document.getElementById('description').textContent = program.description;
  document.getElementById('rules').textContent = program.rules;
  const list = document.getElementById('payouts');
  (program.payouts || []).forEach(p => {
    const li = document.createElement('li');
    li.textContent = `${p.severity}: ${p.reward}`;
    list.appendChild(li);
  });
});
