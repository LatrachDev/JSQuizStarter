// toggle
const menu = document.getElementById("menu-toggle");
const nav = document.getElementById("nav-menu");
const closeBtn = document.getElementById("close-menu");

menu.addEventListener("click", () => {
  nav.classList.add("active");
});

closeBtn.addEventListener("click", () => {
  nav.classList.remove("active");
});
