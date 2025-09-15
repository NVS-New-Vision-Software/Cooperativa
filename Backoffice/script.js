const items = document.querySelectorAll(".lateral li");
const secciones = document.querySelectorAll(".seccion");

// Navegación entre secciones
items.forEach(item => {
  item.addEventListener("click", () => {
    secciones.forEach(sec => sec.classList.remove("activa"));
    const target = document.getElementById(item.dataset.target);
    target.classList.add("activa");

    // Si es la sección de postulaciones, cargar datos
    if (item.dataset.target === "postulacion") {
      cargarPostulaciones();
    }
  });
});

// Cargar postulaciones desde el backend
async function cargarPostulaciones() {
  try {
    const res = await fetch('api/get_postulaciones.php');
    const postulaciones = await res.json();
    const tbody = document.querySelector('#postulacion tbody');
    tbody.innerHTML = '';

    postulaciones.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.IdPostulacion}</td>
        <td>${p.Email}</td>
        <td>${p.FchaSolicitud.split(' ')[0]}</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>${p.estado}</td>
        <td>
          <button class="btn-aprobar"${p.estado !== 'pendiente' ? ' disabled' : ''}>Aprobar</button>
          <button class="btn-rechazar">Rechazar</button>
        </td>
      `;
      tbody.appendChild(tr);

      // Confirmación antes de aprobar
      tr.querySelector('.btn-aprobar').addEventListener('click', () => {
        const confirmar = confirm(`¿Aprobar la postulación de ${p.Email}? Esto creará un usuario y eliminará la postulación.`);
        if (confirmar) {
          actualizarEstadoPostulacion(p.IdPostulacion, 'aprobada');
        }
      });

      // Confirmación antes de rechazar
      tr.querySelector('.btn-rechazar').addEventListener('click', () => {
        const confirmar = confirm(`¿Rechazar la postulación de ${p.Email}? Esta acción eliminará la postulación.`);
        if (confirmar) {
          actualizarEstadoPostulacion(p.IdPostulacion, 'rechazada');
        }
      });
    });
  } catch (error) {
    console.error("Error al cargar postulaciones:", error);
  }
}

// Actualizar estado de postulación en el backend
async function actualizarEstadoPostulacion(id, estado) {
  try {
    const res = await fetch('api/update_postulacion.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, estado })
    });

    const data = await res.json();
    if (res.ok) {
      alert(`Postulación ${estado} correctamente.`);
      cargarPostulaciones(); // Recargar tabla
    } else {
      alert(data.error || 'Error al actualizar postulación.');
    }
  } catch (error) {
    console.error("Error en la actualización:", error);
  }
}
