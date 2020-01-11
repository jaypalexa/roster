document.addEventListener('DOMContentLoaded', () => {
  const $navbarBurger = document.querySelector('.navbar-burger');
  $navbarBurger.addEventListener('click', () => {
    const target = $navbarBurger.dataset.target;
    const $target = document.getElementById(target);
    $navbarBurger.classList.toggle('is-active');
    $target.classList.toggle('is-active');
  });
});
