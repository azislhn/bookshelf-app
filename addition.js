const expand = document.querySelector('.expand');
const collapse = document.querySelector('.collapse');
const form = document.getElementById('inputBook');

expand.addEventListener('click', () => {
  form.classList.add('show');
  expand.classList.add('hidden');
  collapse.classList.remove('hidden');
})

collapse.addEventListener('click', () => {
  form.classList.remove('show');
  expand.classList.remove('hidden');
  collapse.classList.add('hidden');
})