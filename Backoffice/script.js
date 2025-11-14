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
// === DECLARACIONES Y VARIABLES GLOBALES ===
// =========================================================
let viviendasDisponibles = []; // Variable global para guardar las viviendas libres
const API_USUARIOS = '../api/get_usuarios.php';
const API_GESTIONAR = '../api/gestionar_vivienda.php';
// NOTA: Asumo que otras APIs (update_rol.php, delete_usuario.php, get_socio_details.php)
// existen en el directorio '../api/'
// NOTA: La variable tablaBody está definida al final de este script.

// =========================================================
// === FUNCIÓN 1: CARGAR TABLA INICIAL (get_usuarios.php) ===
// =========================================================
async function cargarTablaUsuarios() {
    const tableBody = document.getElementById('usuariosTableBody');
    if (!tableBody) return;

    try {
        // LLAMADA A LA API get_usuarios.php
        const response = await fetch(API_USUARIOS);
        const data = await response.json();

        if (data.status !== 'ok') {
            alert(`Error al cargar usuarios: ${data.error}`);
            tableBody.innerHTML = `<tr><td colspan="9" style="text-align: center;">Error al cargar usuarios: ${data.error}</td></tr>`;
            return;
        }

        // 🟢 CLAVE: Llenar la variable global con la lista de disponibles
        viviendasDisponibles = data.viviendas_disponibles || []; 
        
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


// =========================================================
// === FUNCIÓN AUXILIAR: CREAR FILA HTML y botones de acción ===
// =========================================================
function crearFilaUsuario(u) {
    const row = document.createElement('tr');
    row.dataset.idUsuario = u.IdUsuario;
    row.dataset.idSocio = u.IdSocio;
    
    // Asumo que 'viviendasDisponibles' es una variable global Llenada por la función de carga.
    const listaViviendasDisponibles = typeof viviendasDisponibles !== 'undefined' ? viviendasDisponibles : [];

    // --- LÓGICA DE VIVIENDA ---
    let viviendaHTML;
    let accionesViviendaHTML = '';
    
    if (u.NroViviendaAsignada) {
        // Opción 1: Vivienda Asignada (Muestra número y botón Desasignar)
        viviendaHTML = `Vivienda ${u.NroViviendaAsignada}`;
        accionesViviendaHTML = `<button class="btn-desasignar-vivienda" data-socio-id="${u.IdSocio}">Desasignar</button>`;
    } else {
        // Opción 2: Sin Asignar (Muestra SELECT para Asignar)
        const opcionesViviendas = listaViviendasDisponibles.map(v => 
            `<option value="${v.IdVivienda}">Vivienda ${v.NroVivienda}</option>`
        ).join('');
        
        viviendaHTML = `
            <select 
                class="select-vivienda-asignar" 
                data-socio-id="${u.IdSocio}" 
                data-current-vivienda="" 
                ${listaViviendasDisponibles.length === 0 ? 'disabled' : ''}>
                <option value="" disabled selected>Asignar...</option>
                ${opcionesViviendas}
            </select>`;
        accionesViviendaHTML = ''; // La acción está en el select
    }
    
    // Generar el SELECT con las opciones de rol (se mantiene igual)
    const rolSelect = `
        <select class="select-rol" data-usuario-id="${u.IdUsuario}">
            <option value="socio" ${u.Rol === 'socio' ? 'selected' : ''}>Socio</option>
            <option value="admin" ${u.Rol === 'admin' ? 'selected' : ''}>Admin</option>
        </select>
    `;

    // Botones de acción (Añadimos el botón de Desasignar)
    const accionesSocioHTML = `
        ${u.IdSocio !== 'N/A' && u.IdSocio !== null ? // Verifica si hay IdSocio
            `<button class="btn-ver-socio" data-socio-id="${u.IdSocio}">Ver Socio</button>
             <button class="btn-historial" data-socio-id="${u.IdSocio}">Ver Historial</button>`
            : ''
        }
    `;

    // Asegura que FchaIngreso no sea null antes de intentar substring
    const fechaIngresoDisplay = u.FchaIngreso ? u.FchaIngreso.substring(0, 10) : 'N/A';

    row.innerHTML = `
        <td>${u.IdUsuario}</td>
        <td>${u.IdSocio || 'N/A'}</td>
        <td>${u.NombreUsuario}</td>
        <td>${u.ApellidoUsuario}</td>
        <td>${u.Email}</td>
        <td data-current-rol="${u.Rol}">${rolSelect}</td> 
        <td data-current-vivienda="${u.IdViviendaAsignada || ''}">${viviendaHTML}</td>
        <td>${fechaIngresoDisplay}</td>
        <td>
            ${accionesSocioHTML}
            ${accionesViviendaHTML}
            <button class="btn-eliminar" data-usuario-id="${u.IdUsuario}">Eliminar</button>
        </td>
    `;
    return row;
}


// =========================================================
// === GESTIÓN DE EVENTOS DE VIVIENDA (ADICIÓN) ===
// =========================================================

// --- GESTIONAR ASIGNACIÓN DE VIVIENDA MEDIANTE SELECT ---
document.addEventListener('change', async e => {
    const selectVivienda = e.target;
    // 1. Verificar si el evento proviene de nuestro select de asignación
    if (!selectVivienda.classList.contains('select-vivienda-asignar')) return;

    const idSocio = selectVivienda.dataset.socioId;
    const idVivienda = selectVivienda.value; 
    
    // Buscar el NroVivienda para el mensaje de confirmación
    const viviendaSeleccionada = viviendasDisponibles.find(v => v.IdVivienda == idVivienda);
    const nroVivienda = viviendaSeleccionada ? viviendaSeleccionada.NroVivienda : 'N/A';
    
    // 2. Solicitud de confirmación
    const confirmar = confirm(`¿Estás seguro de asignar la Vivienda ${nroVivienda} al socio ID ${idSocio}?`);

    if (!confirmar) {
        // Si el usuario cancela, revertir el select al valor por defecto
        selectVivienda.value = ""; 
        return;
    }

    try {
        // 3. Enviar la solicitud a la API (gestionar_vivienda.php)
        const formData = new FormData();
        formData.append('accion', 'asignar');
        formData.append('idSocio', idSocio);
        formData.append('idVivienda', idVivienda);
        
        selectVivienda.disabled = true;

        const res = await fetch(API_GESTIONAR, {
            method: 'POST',
            body: formData,
        });

        const result = await res.json();

        if (res.ok && result.status === 'success') {
            alert(`Vivienda ${nroVivienda} asignada correctamente.`);
            
            // Recargar la tabla para que el SELECT desaparezca y muestre el botón Desasignar
            cargarTablaUsuarios(); 
            
        } else {
            alert(result.message || 'Error al asignar la vivienda.');
            // Si falla en el backend, reactivar el select y revertir
            selectVivienda.value = "";
            selectVivienda.disabled = false;
        }
    } catch (error) {
        console.error("Error al asignar vivienda:", error);
        alert("No se pudo conectar con el servidor para asignar la vivienda.");
        selectVivienda.value = "";
        selectVivienda.disabled = false;
    }
});


// --- GESTIONAR DESASIGNACIÓN DE VIVIENDA MEDIANTE BOTÓN ---
document.addEventListener('click', async e => {
    const btn = e.target;
    if (!btn.classList.contains('btn-desasignar-vivienda')) return;

    const idSocio = btn.dataset.socioId;
    
    if (!confirm(`¿Estás seguro de desasignar la vivienda del socio ID ${idSocio}?`)) return;

    try {
        const formData = new FormData();
        formData.append('accion', 'desasignar');
        formData.append('idSocio', idSocio); 
        
        btn.disabled = true;

        const res = await fetch(API_GESTIONAR, { method: 'POST', body: formData });
        const result = await res.json();

        if (res.ok && result.status === 'success') {
            alert(result.message);
            // Recargar la tabla para que el botón Desasignar se convierta en el SELECT Asignar
            cargarTablaUsuarios(); 
        } else {
            alert(result.message || 'Error al desasignar la vivienda.');
            btn.disabled = false;
        }
    } catch (error) {
        console.error("Error al desasignar vivienda:", error);
        alert("No se pudo conectar con el servidor para desasignar la vivienda.");
        btn.disabled = false;
    }
});


// =========================================================
// === GESTIÓN DE CAMBIO DE ROL (MANTENIDO) ===
// =========================================================
document.addEventListener('change', async e => {
    const selectRol = e.target;
    if (!selectRol.classList.contains('select-rol')) return;

    const idUsuario = selectRol.dataset.usuarioId;
    const nuevoRol = selectRol.value;
    const tdRol = selectRol.closest('td');
    const rolAnterior = tdRol.dataset.currentRol;
    
    // 1. Solicitud de confirmación
    const confirmar = confirm(`¿Estás seguro de que quieres cambiar el rol del usuario ID ${idUsuario} de "${rolAnterior.toUpperCase()}" a "${nuevoRol.toUpperCase()}"?`);

    if (!confirmar) {
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
            selectRol.value = rolAnterior;
        }
    } catch (error) {
        console.error("Error al cambiar rol:", error);
        alert("No se pudo conectar con el servidor para cambiar el rol.");
        selectRol.value = rolAnterior;
    }
});

// =========================================================
// === GESTIÓN DE ELIMINAR USUARIO (MANTENIDO) ===
// =========================================================
document.addEventListener('click', async e => {
    const btn = e.target;
    if (!btn.classList.contains('btn-eliminar')) return;

    const idUsuario = btn.dataset.usuarioId;
    const fila = btn.closest('tr');

    // 1. Solicitud de confirmación
    const confirmar = confirm(`⚠️ ¡ATENCIÓN! ¿Estás seguro de que quieres ELIMINAR permanentemente al usuario ID ${idUsuario}?`);

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


// =========================================================
// === GESTIÓN DE DETALLES E HISTORIAL DE SOCIO (MANTENIDO) ===
// =========================================================
document.addEventListener('click', async e => {
    const btn = e.target;
    
    // Solo actuar si es uno de los botones de socio/historial
    if (!btn.classList.contains('btn-ver-socio') && !btn.classList.contains('btn-historial')) return;

    const idSocio = btn.dataset.socioId;
    const accion = btn.classList.contains('btn-ver-socio') ? 'detalles' : 'historial';
    
    const detallesContainer = document.getElementById('socioDetailsContainer');

    if (!detallesContainer) {
        alert('Error: Contenedor de detalles de socio no encontrado (#socioDetailsContainer).');
        return;
    }
    
    // Mostrar un mensaje de carga
    detallesContainer.innerHTML = `<p>Cargando ${accion} del Socio ID ${idSocio}...</p>`;
    
    try {
        // 1. Llamar a la nueva API get_socio_details.php
        const res = await fetch('../api/get_socio_details.php?idSocio=' + idSocio, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        const result = await res.json();

        if (res.ok && result.status === 'ok') {
            
            if (accion === 'detalles') {
                mostrarDetallesSocio(result.socio, result.vivienda, detallesContainer);
            } else if (accion === 'historial') {
                mostrarHistorialSocio(result.horas, result.pagos, detallesContainer, result.socio);
            }

        } else {
            detallesContainer.innerHTML = `<p class="error">Error al cargar datos: ${result.error || 'Respuesta inválida del servidor.'}</p>`;
        }
    } catch (error) {
        console.error(`Error al cargar ${accion}:`, error);
        detallesContainer.innerHTML = `<p class="error">Error de conexión con el servidor.</p>`;
    }
});


// --- Funciones auxiliares para mostrar la información (MANTENIDAS) ---
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
            html += `<tr><td>${p.IdPago}</td><td>${p.FchaPago}</td><td>${p.Monto}</td><td><a href="/Cooperativa/Backoffice/comprobantes/${p.Comprobante}" target="_blank">${p.Comprobante ? 'Ver' : 'N/A'}</a></td><td>${p.EstadoPago}</td></tr>`;
        });
        html += '</tbody></table>';
    } else {
        html += '<p>No hay pagos registrados.</p>';
    }

    container.innerHTML = html;
}

const API_URL = '../api/get_viviendas.php';

    const tablaBody = document.getElementById('viviendasTableBody');
    /**
     * Función principal para obtener y mostrar la lista de viviendas.
     */
    async function cargarViviendas() {
        if (!tablaBody) {
            console.error("El elemento con id 'viviendasTableBody' no fue encontrado.");
            return;
        }
        // Mostrar un mensaje de carga inicial
        tablaBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Cargando unidades de vivienda...</td></tr>';
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const jsonResponse = await response.json();
            if (jsonResponse.status === 'success') {
                const viviendas = jsonResponse.data;
                if (viviendas.length > 0) {
                    llenarTabla(viviendas);
                } else {
                    tablaBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay viviendas registradas.</td></tr>';
                }
            } else {
                tablaBody.innerHTML = `<tr><td colspan="5" style="color: red; text-align: center;">Error al cargar los datos: ${jsonResponse.message}</td></tr>`;
            }

        } catch (error) {
            console.error('Error al intentar obtener las viviendas:', error);
            tablaBody.innerHTML = `<tr><td colspan="5" style="color: red; text-align: center;">Ocurrió un error de red o de servidor.</td></tr>`;
        }
    }
    /**
     * Itera sobre el array de viviendas y construye las filas de la tabla.
     */
    function llenarTabla(viviendas) {
        tablaBody.innerHTML = ''; // Limpiar el contenido de carga
        viviendas.forEach(vivienda => {
            const idVivienda = vivienda.IdVivienda;
            // Si el valor es nulo (resultado del LEFT JOIN), se considera "Sin Asignar"
            const socioId = vivienda.IdSocio ? vivienda.IdSocio : 'N/A';
            const socioNombre = vivienda.NombreSocio ? vivienda.NombreSocio : '<span style="color: orange; font-weight: bold;">Sin Asignar</span>';

            // Verificar si IdSocio tiene un valor asignado (usamos el campo NombreSocio como indicador)
            const isAsignado = !!vivienda.NombreSocio; 

            // Determinar qué botón mostrar en la columna Acciones
            const accionBoton = isAsignado 
                ? `<button onclick="desasignarSocio(${idVivienda}, ${vivienda.IdSocio})" class="btn-desasignar">Desasignar</button>`
                : `<button onclick="abrirModalAsignar(${idVivienda})" class="btn-asignar">Asignar</button>`;

            // Crear la fila <tr> e insertar celdas <td>
            const row = tablaBody.insertRow();
            row.insertCell().textContent = idVivienda;                      // ID Vivienda
            row.insertCell().textContent = vivienda.NroVivienda;             // Número
            row.insertCell().textContent = socioId;                          // ID Socio Asignado
            row.insertCell().innerHTML = socioNombre;                        // Asignado a (Usuario)
        });

    }
    // Ejecutar la función para cargar las viviendas al iniciar la página
    cargarViviendas();

 // =======================================
// === CONFIGURACIÓN DE METAS (ADMIN) ===
// =======================================

const METAS_API_URL = '../api/set_metas.php';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar datos en la sección de HORAS
    if (document.getElementById('metas-config')) {
        cargarMetasActuales();
    }
    
    // 2. Cargar datos en la sección de PAGO
    if (document.getElementById('metas-pago-config')) {
        cargarMetasPagoActuales();
    }
});

/**
 * Función central para obtener las horas y el monto actuales de la DB.
 * Es utilizada por ambas funciones de carga.
 */
async function fetchMetasConfig() {
    try {
        const response = await fetch(METAS_API_URL, { method: 'GET' });
        const result = await response.json();
        
        if (!response.ok || result.status !== 'ok') {
            // Manejar error de autenticación (403 Prohibido) o error general
            return { error: result.message || 'Error al obtener configuración', status: response.status };
        }
        return result.data;
    } catch (error) {
        console.error('Error de conexión al obtener metas:', error);
        return { error: 'Error de conexión con el servidor.' };
    }
}


// --- LÓGICA DE CARGA: SECCIÓN HORAS ---
async function cargarMetasActuales() {
    const data = await fetchMetasConfig();
    const metasConfigDiv = document.getElementById('metas-config');

    if (data && data.error) {
        if (data.status === 403 && metasConfigDiv) {
             metasConfigDiv.innerHTML = `<h3>⚙️ Configuración de Horas Requeridas</h3><p style="color:red;">Acceso denegado. Solo administradores pueden configurar metas.</p>`;
        }
        return;
    }
    
    if (data) {
        // Rellena el campo visible de horas
        document.getElementById('horas_req').value = data.HorasRequeridas || 0.00;
        
        // Crea y rellena el campo OCULTO para el MontoPagar (CLAVE)
        let montoInput = document.getElementById('monto_pagar_hidden_horas');
        if (!montoInput) {
            montoInput = document.createElement('input');
            montoInput.type = 'hidden';
            montoInput.id = 'monto_pagar_hidden_horas';
            montoInput.name = 'monto_pagar';
            document.querySelector('.form-metas').appendChild(montoInput);
        }
        montoInput.value = data.MontoPagar || 0.00; 
    }
}


// --- LÓGICA DE CARGA: SECCIÓN PAGO ---
async function cargarMetasPagoActuales() {
    const data = await fetchMetasConfig();
    const metasPagoConfigDiv = document.getElementById('metas-pago-config');
    
    if (data && data.error) {
        if (data.status === 403 && metasPagoConfigDiv) {
             metasPagoConfigDiv.innerHTML = `<h3>💰 Configuración de Monto a Pagar</h3><p style="color:red;">Acceso denegado. Solo administradores pueden configurar metas de pago.</p>`;
        }
        return;
    }

    if (data) {
        // Rellena el campo visible de monto
        document.getElementById('monto_pagar_input').value = data.MontoPagar || 0.00;
        
        // Crea y rellena el campo OCULTO para HorasRequeridas (CLAVE)
        let horasInput = document.getElementById('horas_req_hidden_pago');
        if (!horasInput) {
            horasInput = document.createElement('input');
            horasInput.type = 'hidden';
            horasInput.id = 'horas_req_hidden_pago';
            horasInput.name = 'horas_req';
            document.querySelector('.form-metas-pago').appendChild(horasInput);
        }
        horasInput.value = data.HorasRequeridas || 0.00; 
    }
}


// --- LÓGICA DE ENVÍO DE FORMULARIO (POST) ---
document.addEventListener('submit', async e => {
    // Identifica qué formulario se está enviando
    const isHorasForm = e.target.classList.contains('form-metas');
    const isPagoForm = e.target.classList.contains('form-metas-pago');
    
    if (!isHorasForm && !isPagoForm) return;
    
    e.preventDefault(); 

    const form = e.target;
    const formData = new FormData(form);

    const submitButton = form.querySelector('button[type="submit"]');
    const statusSpan = form.querySelector('span'); // El span está al lado del botón
    const originalText = submitButton.textContent;
    
    submitButton.disabled = true;
    statusSpan.style.color = 'black';
    statusSpan.textContent = 'Guardando...';

    try {
        const res = await fetch(form.action, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        const result = await res.json();

        if (res.ok && result.status === 'ok') {
            statusSpan.style.color = 'green';
            statusSpan.textContent = '✅ ' + result.message;
            
            // Recargar ambas configuraciones para mantener los campos ocultos actualizados
            cargarMetasActuales(); 
            cargarMetasPagoActuales(); 
            
        } else {
            statusSpan.style.color = 'red';
            statusSpan.textContent = '❌ Error: ' + (result.message || 'Error desconocido.');
        }

    } catch (error) {
        statusSpan.style.color = 'red';
        statusSpan.textContent = '❌ Error de conexión con el servidor.';
        console.error("Error al actualizar metas:", error);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        
        setTimeout(() => {
            statusSpan.textContent = '';
        }, 5000);
    }
});

// ========================================================
// === LÓGICA DE REINICIO DE PROGRESO GLOBAL (SOLO ADMIN) ===
// ========================================================

document.addEventListener('DOMContentLoaded', () => {
    // ... otros listeners ...
    
    const globalResetButton = document.getElementById('btn-reset-global');
    if (globalResetButton) {
        globalResetButton.addEventListener('click', manejarReinicioGlobal);
    }
});


/**
 * Maneja la acción de reiniciar las metas de todos los usuarios.
 */
async function manejarReinicioGlobal() {
    const confirmacion = confirm("⚠️ ADVERTENCIA: Esta acción reiniciará el progreso de Horas y Pagos para TODOS los usuarios. ¿Está seguro?");
    
    if (!confirmacion) {
        return;
    }

    const resetButton = document.getElementById('btn-reset-global');
    const statusSpan = document.getElementById('reset-global-status');
    const originalText = resetButton.textContent;
    
    resetButton.disabled = true;
    statusSpan.style.color = 'black';
    statusSpan.textContent = 'Ejecutando reinicio global...';

    try {
        const response = await fetch('../api/reiniciar_progreso_global.php', {
            method: 'POST',
            credentials: 'include'
        });

        const result = await response.json();

        if (response.ok && result.status === 'ok') {
            statusSpan.style.color = 'green';
            statusSpan.textContent = '✅ ' + result.message;
            
            // Si el admin está viendo un dashboard, recargarlo
            if (document.getElementById('pago-dashboard')) cargarProgresoPago();
            if (document.getElementById('horas-dashboard')) cargarProgresoHoras();

        } else {
            statusSpan.style.color = 'red';
            statusSpan.textContent = '❌ Error: ' + (result.message || 'Error desconocido.');
        }

    } catch (error) {
        statusSpan.style.color = 'red';
        statusSpan.textContent = '❌ Error de conexión con el servidor.';
        console.error("Error al reiniciar globalmente:", error);
    } finally {
        resetButton.disabled = false;
        resetButton.textContent = originalText;
        
        setTimeout(() => {
            statusSpan.textContent = '';
        }, 8000);
    }
}



// =========================================================
// === INICIO AL CARGAR EL DOCUMENTO ===
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    // ⚠️ Importante: Cargar la tabla al inicio para mostrar los datos
    cargarTablaUsuarios(); 
    
    // Las funciones cargarViviendas(), llenarTabla() y sus acciones 
    // (desasignarSocio, abrirModalAsignar) son redundantes si ya estás 
    // cargando las viviendas dentro de cargarTablaUsuarios, así que las hemos omitido.
});
  // --- LLAMADA INICIAL: Cargar la tabla de gestión de usuarios ---
  cargarTablaUsuarios();
  