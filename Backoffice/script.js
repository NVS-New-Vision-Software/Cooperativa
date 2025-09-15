  // 🧭 Navegación entre secciones
  const items = document.querySelectorAll(".lateral li");
  const secciones = document.querySelectorAll(".seccion");

  items.forEach(item => {
    item.addEventListener("click", () => {
      secciones.forEach(sec => sec.classList.remove("activa"));
      const target = document.getElementById(item.dataset.target);
      if (target) {
        target.classList.add("activa");
        console.log(`Sección activada: ${item.dataset.target}`);
      } else {
        console.warn(`No se encontró la sección: ${item.dataset.target}`);
      }

      if (item.dataset.target === "postulacion") {
        cargarPostulaciones();
      }
    });
  });

  // 📥 Cargar postulaciones desde el backend
  async function cargarPostulaciones() {
    try {
      const res = await fetch('../api/get_postulaciones.php');
      const text = await res.text();

      let postulaciones;
      try {
        postulaciones = JSON.parse(text);
      } catch (e) {
        console.error("Respuesta inválida del servidor:", text);
        return;
      }

      const tbody = document.querySelector('#postulacion tbody');
      if (!tbody) {
        console.warn("No se encontró el tbody de postulaciones");
        return;
      }

      tbody.innerHTML = '';

      if (postulaciones.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="7">No hay postulaciones registradas.</td>`;
        tbody.appendChild(tr);
        return;
      }

      postulaciones.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${p.IdPostulacion}</td>
          <td>${p.Email}</td>
          <td>${p.FchaSolicitud?.split(' ')[0] || '-'}</td>
          <td>${p.Pnom}</td>
          <td>${p.Pape}</td>
          <td>${p.estado}</td>
          <td>
            <button class="btn-aprobar"${p.estado !== 'pendiente' ? ' disabled' : ''}>Aprobar</button>
            <button class="btn-rechazar"${p.estado !== 'pendiente' ? ' disabled' : ''}>Rechazar</button>
          </td>
        `;
        tbody.appendChild(tr);

        // Acción aprobar
        tr.querySelector('.btn-aprobar').addEventListener('click', () => {
          if (confirm(`¿Aprobar la postulación de ${p.Email}? Esto creará un usuario y eliminará la postulación.`)) {
            actualizarEstadoPostulacion(p.IdPostulacion, 'aprobada');
          }
        });

        // Acción rechazar
        tr.querySelector('.btn-rechazar').addEventListener('click', () => {
          if (confirm(`¿Rechazar la postulación de ${p.Email}? Esta acción eliminará la postulación.`)) {
            actualizarEstadoPostulacion(p.IdPostulacion, 'rechazada');
          }
        });
      });
    } catch (error) {
      console.error("Error al cargar postulaciones:", error);
    }
  }

  // 🔄 Actualizar estado de postulación en el backend
  async function actualizarEstadoPostulacion(id, estado) {
    try {
      const res = await fetch('../api/update_postulacion.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, estado })
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Respuesta inválida del servidor:", text);
        return;
      }

      if (res.ok && data.status === "ok") {
        alert(`Postulación ${estado} correctamente.`);
        cargarPostulaciones();
      } else {
        alert(data.error || 'Error al actualizar postulación.');
      }
    } catch (error) {
      console.error("Error en la actualización:", error);
    }
  };

  document.addEventListener('click', async e => {
  if (e.target.classList.contains('btn-aprobar') || e.target.classList.contains('btn-rechazar')) {
    const id = e.target.dataset.id;
    const tipo = e.target.dataset.tipo;
    const estado = e.target.classList.contains('btn-aprobar') ? 'aprobado' : 'rechazado';

    const endpoint = tipo === 'horas' ? '../api/update_horas.php' : '../api/update_pago.php';

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, estado })
    });

    const result = await res.json();
    if (res.ok && result.status === 'ok') {
      alert(`${tipo === 'horas' ? 'Horas' : 'Pago'} ${estado} correctamente`);
      // Podés recargar la tabla si querés
    } else {
      alert(result.error || 'Error al actualizar');
    }
  }
});

