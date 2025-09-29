document.addEventListener('DOMContentLoaded', () => {
  console.log("Backoffice cargado");

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
        if (item.dataset.target === "postulacion") cargarPostulaciones();
        if (item.dataset.target === "horas") cargarHoras(); // ← corregido
        if (item.dataset.target === "pago") cargarPagos();  // ← corregido
      } else {
        console.warn(`No se encontró la sección: ${item.dataset.target}`);
      }
    });
  });

  // 📥 Cargar postulaciones
  async function cargarPostulaciones() {
    const res = await fetch('../api/get_postulaciones.php');
    const text = await res.text();
    let postulaciones;
    try { postulaciones = JSON.parse(text); } catch (e) { console.error("Respuesta inválida:", text); return; }

    const tbody = document.querySelector('#postulacion tbody');
    if (!tbody) return console.error("No se encontró tbody en #postulacion");
    tbody.innerHTML = '';

    if (postulaciones.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7">No hay postulaciones registradas.</td></tr>';
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
          <button class="btn-aprobar" data-id="${p.IdPostulacion}" data-tipo="postulacion"${p.estado !== 'pendiente' ? ' disabled' : ''}>Aprobar</button>
          <button class="btn-rechazar" data-id="${p.IdPostulacion}" data-tipo="postulacion"${p.estado !== 'pendiente' ? ' disabled' : ''}>Rechazar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // 📥 Cargar horas
  async function cargarHoras() {
    const res = await fetch('../api/get_horas.php');
    const text = await res.text();
    let horas;
    try { horas = JSON.parse(text); } catch (e) { console.error("Respuesta inválida:", text); return; }

    const tbody = document.querySelector('#horas table tbody');
    if (!tbody) return console.error("No se encontró tbody en #horas");
    tbody.innerHTML = '';

    if (horas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8">No hay registros de horas.</td></tr>';
      return;
    }

    horas.forEach(h => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${h.IdHoras}</td>
        <td>${h.Email}</td>
        <td>${h.FchaHoras}</td>
        <td>${h.HoraInicio}</td>
        <td>${h.HoraFin}</td>
        <td>${h.Descripción}</td>
        <td>${h.EstadoHoras}</td>
        <td>
          <button class="btn-aprobar" data-id="${h.IdHoras}" data-tipo="horas"${h.EstadoHoras !== 'pendiente' ? ' disabled' : ''}>Aprobar</button>
          <button class="btn-rechazar" data-id="${h.IdHoras}" data-tipo="horas"${h.EstadoHoras !== 'pendiente' ? ' disabled' : ''}>Rechazar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // 📥 Cargar pagos
  async function cargarPagos() {
    const res = await fetch('../api/get_pagos.php');
    const text = await res.text();
    let pagos;
    try { pagos = JSON.parse(text); } catch (e) { console.error("Respuesta inválida:", text); return; }

    const tbody = document.querySelector('#pago table tbody');
    if (!tbody) return console.error("No se encontró tbody en #pago");
    tbody.innerHTML = '';

    if (pagos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7">No hay pagos registrados.</td></tr>';
      return;
    }

    pagos.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.IdPago}</td>
        <td>${p.Email}</td>
        <td>${p.FchaPago}</td>
        <td>${p.Monto}</td>
        <td><a href="../comprobantes/${p.Comprobante}" target="_blank">Ver PDF</a></td>
        <td>${p.EstadoPago}</td>
        <td>
          <button class="btn-aprobar" data-id="${p.IdPago}" data-tipo="pago"${p.EstadoPago !== 'pendiente' ? ' disabled' : ''}>Aprobar</button>
          <button class="btn-rechazar" data-id="${p.IdPago}" data-tipo="pago"${p.EstadoPago !== 'pendiente' ? ' disabled' : ''}>Rechazar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // 🔄 Actualizar estado de cualquier registro
  document.addEventListener('click', async e => {
    if (e.target.classList.contains('btn-aprobar') || e.target.classList.contains('btn-rechazar')) {
      const id = e.target.dataset.id;
      const tipo = e.target.dataset.tipo;
      const estado = e.target.classList.contains('btn-aprobar') ? 'aprobado' : 'rechazado';

      let endpoint = '';
      if (tipo === 'postulacion') endpoint = '../api/update_postulacion.php';
      else if (tipo === 'horas') endpoint = '../api/update_horas.php';
      else if (tipo === 'pago') endpoint = '../api/update_pago.php';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, estado })
      });

      const text = await res.text();
      let result;
      try { result = JSON.parse(text); } catch (e) { console.error("Respuesta inválida:", text); return; }

      if (res.ok && result.status === 'ok') {
        alert(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} ${estado} correctamente`);
        if (tipo === 'postulacion') cargarPostulaciones();
        if (tipo === 'horas') cargarHoras();
        if (tipo === 'pago') cargarPagos();
      } else {
        alert(result.error || 'Error al actualizar');
      }
    }
  });
});
