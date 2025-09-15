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

document.addEventListener('DOMContentLoaded', () => {
  // Registro de horas
  document.querySelector('.form-horas').addEventListener('submit', async e => {
    e.preventDefault();
    const data = {
      fecha: document.querySelector('#fecha').value,
      horaInicio: document.querySelector('#horaInicio').value,
      horaFin: document.querySelector('#horaFin').value,
      descripcion: document.querySelector('#descripcion').value
    };

    const res = await fetch('../api/registro_horas.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (res.ok && result.status === 'ok') {
      alert(`Horas registradas correctamente (${result.horas} hs)`);
    } else {
      alert(result.error || 'Error al registrar horas');
    }
  });

  // Registro de pago
  document.querySelector('.form-pago').addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('fecha', document.querySelector('#pago input[name="fecha"]').value);
    formData.append('monto', document.querySelector('#pago input[name="monto"]').value);
    formData.append('archivo', document.querySelector('#pago input[name="archivo"]').files[0]);

    const res = await fetch('../api/registro_pago.php', {
      method: 'POST',
      body: formData
    });

    const result = await res.json();
    if (res.ok && result.status === 'ok') {
      alert('Pago registrado correctamente');
    } else {
      alert(result.error || 'Error al registrar pago');
    }
  });
});
