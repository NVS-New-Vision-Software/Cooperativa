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
          <td>${registro.HoraInicio}</td>
          <td>${registro.HoraFin}</td>
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
          <td><a href="/Cooperativa/Backoffice/comprobantes/${pago.Comprobante}" target="_blank">Ver PDF</a></td>
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

 // 📋 Cargar postulaciones
  async function cargarPostulaciones() {
    try {
      const res = await fetch('../api/get_postulaciones.php', {
        method: 'GET',
        credentials: 'include'
      });

      const result = await res.json();
      const tbody = document.querySelector('#postulacion .tablas tbody');
      if (!tbody) {
        console.warn("No se encontró la tabla de postulaciones");
        return;
      }

      tbody.innerHTML = '';

      result.forEach(postulacion => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-id', String(postulacion.IdPostulacion));

        tr.innerHTML = `
          <td>${postulacion.IdPostulacion}</td>
          <td>${postulacion.Pnom}</td>
          <td>${postulacion.Pape}</td>
          <td>${postulacion.Email}</td>
          <td>${postulacion.estado}</td>
          <td>${postulacion.FchaSolicitud}</td>
          <td>
            <button class="btn-aprobar-postulacion">Aprobar</button>
            <button class="btn-rechazar-postulacion">Rechazar</button>
          </td>
        `;

        tbody.appendChild(tr);
      });
    } catch (error) {
      console.error("Error al cargar postulaciones:", error);
      alert("No se pudieron cargar las postulaciones");
    }
  }

  // ✅ Aprobar o rechazar postulaciones
  document.addEventListener('click', e => {
    const btn = e.target;
    if (!btn.classList.contains('btn-aprobar-postulacion') && !btn.classList.contains('btn-rechazar-postulacion')) return;

    const tr = btn.closest('tr');
    const idPostulacion = tr.getAttribute('data-id');

    if (btn.classList.contains('btn-aprobar-postulacion')) {
      const confirmar = confirm("¿Aprobar esta postulación?");
      if (!confirmar) return;
      actualizarEstadoPostulacion(idPostulacion, 'aprobada');
    }

    if (btn.classList.contains('btn-rechazar-postulacion')) {
      const confirmar = confirm("¿Rechazar esta postulación?");
      if (!confirmar) return;
      actualizarEstadoPostulacion(idPostulacion, 'rechazada');
    }
  });
  

  // 🔄 Actualizar estado y eliminar fila
  async function actualizarEstadoPostulacion(id, estado) {
    try {
      const res = await fetch('../api/update_postulacion.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, estado }),
        credentials: 'include'
      });

      const result = await res.json();
      if (res.ok && result.status === 'ok') {
        alert(`Postulación ${estado} correctamente`);

        const fila = document.querySelector(`tr[data-id="${String(id)}"]`);
        if (fila) {
          fila.style.transition = 'opacity 0.4s ease';
          fila.style.opacity = '0';
          setTimeout(() => fila.remove(), 400);
        }
      } else {
        alert(result.error || 'Error al actualizar la postulación');
      }
    } catch (error) {
      console.error("Error al actualizar postulación:", error);
      alert("No se pudo conectar con el servidor");
    }
  }

  // 🔄 Cargar tabla al iniciar
  cargarPostulaciones();
});

// =========================================================
  // === NUEVA LÓGICA: GESTIÓN DE USUARIOS ===
  // =========================================================
    
  // --- FUNCIÓN 1: CARGAR TABLA INICIAL (get_usuarios.php) ---
  async function cargarTablaUsuarios() {
      const tableBody = document.getElementById('usuariosTableBody');
      if (!tableBody) return;

      try {
          // LLAMADA A LA API get_usuarios.php
          const response = await fetch('../api/get_usuarios.php');
          const data = await response.json();

          if (data.status !== 'ok') {
              alert(`Error al cargar usuarios: ${data.error}`);
              tableBody.innerHTML = `<tr><td colspan="9" style="text-align: center;">Error al cargar usuarios: ${data.error}</td></tr>`;
              return;
          }

          tableBody.innerHTML = ''; // Limpiar contenido anterior
          
          data.usuarios.forEach(usuario => {
              const row = crearFilaUsuario(usuario);
              tableBody.appendChild(row);
          });

      } catch (error) {
          console.error('Error de conexión al cargar la tabla:', error);
          alert('No se pudo conectar con el servidor para obtener datos de usuarios.');
          tableBody.innerHTML = `<tr><td colspan="9" style="text-align: center;">Error de conexión con el servidor.</td></tr>`;
      }
  }

  // --- FUNCIÓN AUXILIAR: CREAR FILA HTML y botones de acción ---
  // Dentro de script.js, en la función crearFilaUsuario(u)
function crearFilaUsuario(u) {
    const row = document.createElement('tr');
    row.dataset.idUsuario = u.IdUsuario;
    row.dataset.idSocio = u.IdSocio;
    
    // Si la vivienda no se trae de la base de datos (como en tu última consulta)
    const viviendaDisplay = u.NroVivienda === 'No asignada' ? 'N/A' : u.NroVivienda; 
    
    // Generar el SELECT con las opciones de rol
    const rolSelect = `
        <select class="select-rol" data-usuario-id="${u.IdUsuario}">
            <option value="socio" ${u.Rol === 'socio' ? 'selected' : ''}>Socio</option>
            <option value="admin" ${u.Rol === 'admin' ? 'selected' : ''}>Admin</option>
        </select>
    `;

    // Botones de acción (Mantenemos la lógica de visibilidad basada en IdSocio, si aplica)
    const accionesHTML = `
        ${u.IdSocio !== 'N/A' ? 
            `<button class="btn-ver-socio" data-socio-id="${u.IdSocio}">Ver Socio</button>
             <button class="btn-historial" data-socio-id="${u.IdSocio}">Ver Historial</button>`
            : ''
        }
        <button class="btn-eliminar" data-usuario-id="${u.IdUsuario}">Eliminar</button>
    `;

    row.innerHTML = `
        <td>${u.IdUsuario}</td>
        <td>${u.IdSocio}</td>
        <td>${u.NombreUsuario}</td>
        <td>${u.ApellidoUsuario}</td>
        <td>${u.Email}</td>
        <td data-current-rol="${u.Rol}">${rolSelect}</td> <td>${viviendaDisplay}</td>
        <td>${u.FchaIngreso.substring(0, 10)}</td>
        <td>
            ${accionesHTML}
        </td>
    `;
    return row;
}

// === FUNCIÓN 2: GESTIONAR CAMBIO DE ROL MEDIANTE SELECT ===
  document.addEventListener('change', async e => {
      const selectRol = e.target;
      if (!selectRol.classList.contains('select-rol')) return;

      const idUsuario = selectRol.dataset.usuarioId;
      const nuevoRol = selectRol.value;
      const fila = selectRol.closest('tr');
      const tdRol = selectRol.closest('td');
      const rolAnterior = tdRol.dataset.currentRol;
      
      // 1. Solicitud de confirmación
      const confirmar = confirm(`¿Estás seguro de que quieres cambiar el rol del usuario ID ${idUsuario} de "${rolAnterior.toUpperCase()}" a "${nuevoRol.toUpperCase()}"?`);

      if (!confirmar) {
          // Si el usuario cancela, revertir el select a su valor original
          selectRol.value = rolAnterior; 
          return;
      }

      try {
          // 2. Enviar la solicitud a la API (Asumimos que creaste update_rol.php)
          const res = await fetch('../api/update_rol.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ idUsuario: idUsuario, nuevoRol: nuevoRol }),
              credentials: 'include'
          });

          const result = await res.json();

          if (res.ok && result.status === 'ok') {
              alert(`Rol del usuario ID ${idUsuario} actualizado a: ${nuevoRol.toUpperCase()}`);
              
              // Actualizar el atributo de datos en el TD para reflejar el nuevo rol
              tdRol.dataset.currentRol = nuevoRol; 
              
          } else {
              alert(result.error || 'Error al actualizar el rol.');
              // Si falla en el backend, revertir el select
              selectRol.value = rolAnterior;
          }
      } catch (error) {
          console.error("Error al cambiar rol:", error);
          alert("No se pudo conectar con el servidor para cambiar el rol.");
          // Si hay error de conexión, revertir el select
          selectRol.value = rolAnterior;
      }
  });

  // === FUNCIÓN 3: ELIMINAR USUARIO ===
  document.addEventListener('click', async e => {
      const btn = e.target;
      if (!btn.classList.contains('btn-eliminar')) return;

      const idUsuario = btn.dataset.usuarioId;
      const fila = btn.closest('tr');

      // 1. Solicitud de confirmación
      const confirmar = confirm(`⚠️ ¡ATENCIÓN! ¿Estás seguro de que quieres ELIMINAR permanentemente al usuario ID ${idUsuario}? Esta acción es irreversible y podría causar errores si existen registros relacionados (horas, pagos, etc.).`);

      if (!confirmar) return;

      try {
          // 2. Enviar la solicitud a la nueva API delete_usuario.php
          const res = await fetch('../api/delete_usuario.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ idUsuario: idUsuario }),
              credentials: 'include'
          });

          const result = await res.json();

          if (res.ok && result.status === 'ok') {
              alert(`✅ Usuario ID ${idUsuario} eliminado correctamente.`);
              
              // 3. Animación y remoción de la fila de la tabla
              if (fila) {
                  fila.style.transition = 'opacity 0.4s ease';
                  fila.style.opacity = '0';
                  setTimeout(() => fila.remove(), 400);
              }
          } else {
              alert(result.error || 'Error al eliminar el usuario.');
          }
      } catch (error) {
          console.error("Error al eliminar usuario:", error);
          alert("❌ No se pudo conectar con el servidor para eliminar el usuario.");
      }
  });

  // === FUNCIÓN 4: GESTIONAR DETALLES E HISTORIAL DE SOCIO ===
  document.addEventListener('click', async e => {
      const btn = e.target;
      
      // Solo actuar si es uno de los botones de socio/historial
      if (!btn.classList.contains('btn-ver-socio') && !btn.classList.contains('btn-historial')) return;

      const idSocio = btn.dataset.socioId;
      const accion = btn.classList.contains('btn-ver-socio') ? 'detalles' : 'historial';
      
      const detallesContainer = document.getElementById('socioDetailsContainer'); // Asegúrate de que este ID exista en tu HTML

      if (!detallesContainer) {
          alert('Error: Contenedor de detalles de socio no encontrado (#socioDetailsContainer).');
          return;
      }
      
      // Mostrar un mensaje de carga
      detallesContainer.innerHTML = `<p>Cargando ${accion} del Socio ID ${idSocio}...</p>`;
      
      try {
          // 1. Llamar a la nueva API
          const res = await fetch('../api/get_socio_details.php?idSocio=' + idSocio, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include'
          });

          const result = await res.json();

          if (res.ok && result.status === 'ok') {
              
              if (accion === 'detalles') {
                  // Mostrar solo los detalles personales
                  mostrarDetallesSocio(result.socio, result.vivienda, detallesContainer);
              } else if (accion === 'historial') {
                  // Mostrar el historial de horas y pagos
                  mostrarHistorialSocio(result.horas, result.pagos, detallesContainer, result.socio);
              }

              // Muestra la sección o modal donde se carga la información (si está oculta)
              // Ejemplo: document.getElementById('seccion-socio').classList.add('activa');

          } else {
              detallesContainer.innerHTML = `<p class="error">Error al cargar datos: ${result.error || 'Respuesta inválida del servidor.'}</p>`;
          }
      } catch (error) {
          console.error(`Error al cargar ${accion}:`, error);
          detallesContainer.innerHTML = `<p class="error">Error de conexión con el servidor.</p>`;
      }
  });

  // --- Funciones auxiliares para mostrar la información ---
  
  function mostrarDetallesSocio(socio, vivienda, container) {
      let html = `<h2>Detalles del Socio: ${socio.PrimNom} ${socio.PrimApe}</h2>`;
      html += `<p><strong>ID Socio:</strong> ${socio.IdSocio}</p>`;
      html += `<p><strong>Fecha de Nacimiento:</strong> ${socio.FchaNac}</p>`;
      html += `<p><strong>Fecha de Ingreso:</strong> ${socio.FchaIngreso}</p>`;
      html += `<p><strong>Vivienda Asignada:</strong> ${vivienda.NroVivienda || 'N/A'}</p>`;
      container.innerHTML = html;
  }

  function mostrarHistorialSocio(horas, pagos, container, socio) {
      let html = `<h2>Historial de ${socio.PrimNom} ${socio.PrimApe}</h2>`;
      
      // Historial de Horas
      html += '<h3>Horas de Trabajo Registradas:</h3>';
      if (horas.length > 0) {
          html += '<table class="tabla-historial">';
          html += '<thead><tr><th>ID Horas</th><th>Fecha</th><th>Inicio</th><th>Fin</th><th>Descripción</th><th>Estado</th></tr></thead>';
          html += '<tbody>';
          horas.forEach(h => {
              html += `<tr><td>${h.IdHoras}</td><td>${h.FchaHoras}</td><td>${h.HoraInicio}</td><td>${h.HoraFin}</td><td>${h.Descripción}</td><td>${h.EstadoHoras}</td></tr>`;
          });
          html += '</tbody></table>';
      } else {
          html += '<p>No hay horas de trabajo registradas.</p>';
      }

      // Historial de Pagos
      html += '<h3>Historial de Pagos:</h3>';
      if (pagos.length > 0) {
          html += '<table class="tabla-historial">';
          html += '<thead><tr><th>ID Pago</th><th>Fecha</th><th>Monto</th><th>Comprobante</th><th>Estado</th></tr></thead>';
          html += '<tbody>';
          pagos.forEach(p => {
              html += `<tr><td>${p.IdPago}</td><td>${p.FchaPago}</td><td>${p.Monto}</td><td><a href="../comprobantes/${p.Comprobante}" target="_blank">${p.Comprobante ? 'Ver' : 'N/A'}</a></td><td>${p.EstadoPago}</td></tr>`;
          });
          html += '</tbody></table>';
      } else {
          html += '<p>No hay pagos registrados.</p>';
      }

      container.innerHTML = html;
  }
  
  // --- LLAMADA INICIAL: Cargar la tabla de gestión de usuarios ---
  cargarTablaUsuarios();