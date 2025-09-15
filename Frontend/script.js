document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll(".lateral li");
  const secciones = document.querySelectorAll(".seccion");

  items.forEach(item => {
    item.addEventListener("click", () => {
      secciones.forEach(sec => sec.classList.remove("activa"));
      const target = document.getElementById(item.dataset.target);
      if (target) {
        target.classList.add("activa");
        if (item.dataset.target === "horas") cargarHorasUsuario();
        if (item.dataset.target === "pago") cargarPagosUsuario();
      }
    });
  });

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
      alert('Horas registradas correctamente');
      cargarHorasUsuario();
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
      cargarPagosUsuario();
    } else {
      alert(result.error || 'Error al registrar pago');
    }
  });

  // Historial de horas
  async function cargarHorasUsuario() {
    const res = await fetch('../api/get_horas_usuario.php');
    const horas = await res.json();
    const tbody = document.querySelector('#tabla-horas-usuario tbody');
    tbody.innerHTML = '';

    if (horas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">No hay horas registradas.</td></tr>';
      return;
    }

    horas.forEach(h => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${h.FchaHoras}</td>
        <td>${h.HoraInicio}</td>
        <td>${h.HoraFin}</td>
        <td>${h.Descripción}</td>
        <td>${h.EstadoHoras}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Historial de pagos
  async function cargarPagosUsuario() {
    const res = await fetch('../api/get_pagos_usuario.php');
    const pagos = await res.json();
    const tbody = document.querySelector('#tabla-pagos-usuario tbody');
    tbody.innerHTML = '';

    if (pagos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4">No hay pagos registrados.</td></tr>';
      return;
    }

    pagos.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.FchaPago}</td>
        <td>${p.Monto}</td>
        <td><a href="../comprobantes/${p.Comprobante}" target="_blank">Ver PDF</a></td>
        <td>${p.EstadoPago}</td>
      `;
      tbody.appendChild(tr);
    });
  }
});
