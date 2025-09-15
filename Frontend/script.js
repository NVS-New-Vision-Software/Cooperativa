const items = document.querySelectorAll(".lateral li");
const secciones = document.querySelectorAll(".seccion");

items.forEach(item => {
  item.addEventListener("click", () => {
    // Oculta todas las secciones
    secciones.forEach(sec => sec.classList.remove("activa"));

    // Muestra la sección correspondiente
    const target = document.getElementById(item.dataset.target);
    target.classList.add("activa");
  });
});

document.querySelector('.logout-button').addEventListener('click', () => {
  window.location.href = '../api/logout.php';
});
