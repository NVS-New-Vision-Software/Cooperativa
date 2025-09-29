document.addEventListener('DOMContentLoaded', () => {
  console.log("Script cargado");

  // 🧭 Navegación entre secciones
  const items = document.querySelectorAll(".lateral li");
  const secciones = document.querySelectorAll(".seccion");

  items.forEach(item => {
    item.addEventListener("click", () => {
      secciones.forEach(sec => sec.classList.remove("activa"));
      const target = document.getElementById(item.dataset.target);
      if (target) {
        target.classList.add("activa");
      }
    });
  });

  // 🕒 Registro de horas
  const formHoras = document.querySelector('.form-horas');
  if (formHoras) {
    formHoras.addEventListener('submit', async e => {
      e.preventDefault();

      const data = {
        fecha: document.querySelector('#fecha').value,
        horaInicio: document.querySelector('#horaInicio').value,
        horaFin: document.querySelector('#horaFin').value,
        descripcion: document.querySelector('#descripcion').value
      };

      try {
        const res = await fetch('../api/registrar_horas.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'include'
        });

        const text = await res.text();
        console.log("Respuesta del servidor (horas):", text);

        let result;
        try {
          result = JSON.parse(text);
        } catch (e) {
          alert("Respuesta inválida del servidor");
          return;
        }

        if (res.ok && result.status === 'ok') {
          alert('Horas registradas correctamente');
          formHoras.reset();
          cargarHoras(); // recarga la tabla
        } else {
          alert(result.error || 'Error al registrar horas');
        }
      } catch (error) {
        console.error("Error de red (horas):", error);
        alert("No se pudo conectar con el servidor");
      }
    });
  }

  // 📋 Cargar registros de horas
  async function cargarHoras() {
    try {
      const res = await fetch('../api/get_horas.php', {
        method: 'GET',
        credentials: 'include'
      });

      const result = await res.json();
      const tbody = document.querySelector('.tablas tbody');
      tbody.innerHTML = '';

      result.forEach(registro => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-id', String(registro.IdHoras));

        tr.innerHTML = `
          <td>${registro.IdHoras}</td>
          <td>${registro.Email}</td>
          <td>${registro.FchaHoras}</td>
          <td>${formatearHora(registro.HoraInicio)}</td>
          <td>${formatearHora(registro.HoraFin)}</td>
          <td>${registro.Descripción}</td>
          <td>${registro.EstadoHoras}</td>
          <td>
            ${registro.EstadoHoras === 'pendiente' ? `
              <button class="btn-aprobar">Aprobar</button>
              <button class="btn-rechazar">Rechazar</button>
            ` : ''}
          </td>
        `;

        tbody.appendChild(tr);
      });
    } catch (error) {
      console.error("Error al cargar horas:", error);
      alert("No se pudieron cargar los registros");
    }
  }

  // 🕓 Formatear hora para quitar los .000000
  function formatearHora(hora) {
    return hora.split(':').slice(0, 2).join(':');
  }

  // ✅ Aprobar o rechazar horas con confirmación
  document.addEventListener('click', e => {
    const btn = e.target;
    if (!btn.classList.contains('btn-aprobar') && !btn.classList.contains('btn-rechazar')) return;

    const tr = btn.closest('tr');
    const idHoras = tr.getAttribute('data-id');

    if (btn.classList.contains('btn-aprobar')) {
      const confirmar = confirm("¿Estás seguro de que querés aprobar estas horas?");
      if (!confirmar) return;
      actualizarEstado(idHoras, 'aprobado');
    }

    if (btn.classList.contains('btn-rechazar')) {
      const confirmar = confirm("¿Estás seguro de que querés rechazar estas horas?");
      if (!confirmar) return;
      actualizarEstado(idHoras, 'rechazado');
    }
  });

  // 🔄 Actualizar estado en el backend y eliminar fila con animación
  async function actualizarEstado(idHoras, nuevoEstado) {
    try {
      const res = await fetch('../api/update_horas.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: idHoras, estado: nuevoEstado }),
        credentials: 'include'
      });

      const result = await res.json();
      if (res.ok && result.status === 'ok') {
        alert(`Horas ${nuevoEstado} correctamente`);

        const fila = document.querySelector(`tr[data-id="${String(idHoras)}"]`);
        console.log("Buscando fila con ID:", idHoras, "→", fila);

        if (fila) {
          fila.style.transition = 'opacity 0.4s ease';
          fila.style.opacity = '0';
          setTimeout(() => fila.remove(), 400);
        } else {
          console.warn("No se encontró la fila con ID:", idHoras);
        }
      } else {
        alert(result.error || 'Error al actualizar estado');
      }
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("No se pudo conectar con el servidor");
    }
  }

  // 🔄 Cargar tabla al iniciar
  cargarHoras();

 // 🧾 Registro de pago
  const formPago = document.querySelector('.form-pago');
  if (formPago) {
    formPago.addEventListener('submit', async e => {
      e.preventDefault();

      const formData = new FormData(formPago);

      try {
        const res = await fetch('../api/registrar_pago.php', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });

        const text = await res.text();
        console.log("Respuesta del servidor (pago):", text);

        let result;
        try {
          result = JSON.parse(text);
        } catch (e) {
          alert("Respuesta inválida del servidor");
          return;
        }

        if (res.ok && result.status === 'ok') {
          alert('Pago registrado correctamente');
          formPago.reset();
          cargarPagos(); // recarga la tabla
        } else {
          alert(result.error || 'Error al registrar pago');
        }
      } catch (error) {
        console.error("Error de red (pago):", error);
        alert("No se pudo conectar con el servidor");
      }
    });
  }

  // 📋 Cargar pagos pendientes
  async function cargarPagos() {
    try {
      const res = await fetch('../api/get_pagos.php', {
        method: 'GET',
        credentials: 'include'
      });

      const result = await res.json();
      const tbody = document.querySelector('#pago .tablas tbody');
      tbody.innerHTML = '';

      result.forEach(pago => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-id', String(pago.IdPago));

        tr.innerHTML = `
          <td>${pago.IdPago}</td>
          <td>${pago.Email}</td>
          <td>${pago.FchaPago}</td>
          <td>$${parseFloat(pago.Monto).toFixed(2)}</td>
          <td><a href="../comprobantes/${pago.Comprobante}" target="_blank">Ver PDF</a></td>
          <td>${pago.EstadoPago}</td>
          <td>
            ${pago.EstadoPago === 'pendiente' ? `
              <button class="btn-aprobar-pago">Aprobar</button>
              <button class="btn-rechazar-pago">Rechazar</button>
            ` : ''}
          </td>
        `;

        tbody.appendChild(tr);
      });
    } catch (error) {
      console.error("Error al cargar pagos:", error);
      alert("No se pudieron cargar los pagos");
    }
  }

  // ✅ Aprobar o rechazar pagos con confirmación
  document.addEventListener('click', e => {
    const btn = e.target;
    if (!btn.classList.contains('btn-aprobar-pago') && !btn.classList.contains('btn-rechazar-pago')) return;

    const tr = btn.closest('tr');
    const idPago = tr.getAttribute('data-id');

    if (btn.classList.contains('btn-aprobar-pago')) {
      const confirmar = confirm("¿Aprobar este pago?");
      if (!confirmar) return;
      actualizarEstadoPago(idPago, 'aprobado');
    }

    if (btn.classList.contains('btn-rechazar-pago')) {
      const confirmar = confirm("¿Rechazar este pago?");
      if (!confirmar) return;
      actualizarEstadoPago(idPago, 'rechazado');
    }
  });

  // 🔄 Actualizar estado y eliminar fila con animación
  async function actualizarEstadoPago(idPago, nuevoEstado) {
    try {
      const res = await fetch('../api/update_pago.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: idPago, estado: nuevoEstado }),
        credentials: 'include'
      });

      const result = await res.json();
      if (res.ok && result.status === 'ok') {
        alert(`Pago ${nuevoEstado} correctamente`);

        const fila = document.querySelector(`tr[data-id="${String(idPago)}"]`);
        if (fila) {
          fila.style.transition = 'opacity 0.4s ease';
          fila.style.opacity = '0';
          setTimeout(() => fila.remove(), 400);
        }
      } else {
        alert(result.error || 'Error al actualizar estado');
      }
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("No se pudo conectar con el servidor");
    }
  }

  // 🔄 Cargar tabla al iniciar
  cargarPagos();
  
});
