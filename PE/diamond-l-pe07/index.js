//mobile menu
const burgerIcon = document.querySelector("#burger");
const navMenuBar = document.querySelector("#nav-links");

burgerIcon.addEventListener('click', () => {
    navMenuBar.classList.toggle('is-active');
})