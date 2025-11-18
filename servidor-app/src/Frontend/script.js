document.addEventListener('DOMContentLoaded', () => {
  console.log("Script cargado");

    const userRole = localStorage.getItem('user_rol');
    
    // Usamos querySelector para buscar el <li> con el atributo data-target="admin"
    const adminMenuItem = document.querySelector('li[data-target="admin"]');
    
    const adminPageUrl = '../Backoffice/backoffice.html'; // URL de la página de administración

    if (adminMenuItem) {
        if (userRole === 'admin') {
            
            // 1. Mostrar el elemento si el rol es 'admin'
            // NOTA: 'list-item' es el valor correcto para un <li>
            adminMenuItem.style.display = 'list-item'; 

            // 2. Agregar el manejador de clic para redirigir a la página de administración
            adminMenuItem.addEventListener('click', function() {
                window.location.href = adminPageUrl;
            });
            
        } else {
            // Si no es admin, aseguramos que esté oculto
            adminMenuItem.style.display = 'none';
        }
    }

  // --- INICIO: Código Nuevo - Funciones de Carga de Historial (GET) ---

    // Asume que las APIs GET devuelven un array JSON de datos.
    async function cargarHistorialHoras() {
        const tablaBody = document.querySelector('.tabla-horas tbody');
        if (!tablaBody) return;

        tablaBody.innerHTML = '<tr><td colspan="5">Cargando historial de horas...</td></tr>'; 

        try {
            // Ajusta esta URL si es necesario
            const response = await fetch('/Cooperativa/servidor-app/src/api/get_horas.php'); 
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            
            const horas = await response.json();
            tablaBody.innerHTML = ''; 

            if (horas.length === 0) {
                tablaBody.innerHTML = '<tr><td colspan="5">No hay horas registradas.</td></tr>';
                return;
            }

            horas.forEach(hora => {
                const fila = `
                    <tr>
                        <td>${hora.FchaHoras}</td>
                        <td>${hora.HoraInicio ? hora.HoraInicio.substring(0, 5) : ''}</td>
                        <td>${hora.HoraFin ? hora.HoraFin.substring(0, 5) : ''}</td>
                        <td>${hora.Descripción}</td>
                        <td><strong>${hora.EstadoHoras}</strong></td>
                    </tr>
                `;
                tablaBody.insertAdjacentHTML('beforeend', fila);
            });

        } catch (error) {
            console.error('Error al cargar historial de horas:', error);
            tablaBody.innerHTML = `<tr><td colspan="5" style="color: red;">Error al obtener los datos.</td></tr>`;
        }
    }

    async function cargarHistorialPagos() {
        const tablaBody = document.querySelector('.tabla-pagos tbody');
        if (!tablaBody) return;
        
        tablaBody.innerHTML = '<tr><td colspan="4">Cargando historial de pagos...</td></tr>'; 

        try {
            // Ajusta esta URL si es necesario
            const response = await fetch('/Cooperativa/servidor-app/src/api/get_pagos.php'); 
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            
            const pagos = await response.json();
            tablaBody.innerHTML = ''; 

            if (pagos.length === 0) {
                tablaBody.innerHTML = '<tr><td colspan="4">No hay pagos registrados.</td></tr>';
                return;
            }

            pagos.forEach(pago => {
                const montoFormateado = `$${parseFloat(pago.Monto).toFixed(2)}`;
                const enlaceComprobante = pago.Comprobante 
                    ? `<a href="/Cooperativa/servidor-app/src/Backoffice/comprobantes/${pago.Comprobante}" target="_blank">Ver PDF</a>` 
                    : 'N/A';
                
                const fila = `
                    <tr>
                        <td>${pago.FchaPago}</td>
                        <td>${montoFormateado}</td>
                        <td>${enlaceComprobante}</td>
                        <td><strong>${pago.EstadoPago}</strong></td>
                    </tr>
                `;
                tablaBody.insertAdjacentHTML('beforeend', fila);
            });

        } catch (error) {
            console.error('Error al cargar historial de pagos:', error);
            tablaBody.innerHTML = `<tr><td colspan="4" style="color: red;">Error al obtener los datos.</td></tr>`;
        }
    }

  // --- FIN: Código Nuevo - Funciones de Carga de Historial (GET) ---


  // 🧭 Navegación entre secciones
  const items = document.querySelectorAll(".lateral li");
  const secciones = document.querySelectorAll(".seccion");

  items.forEach(item => {
    item.addEventListener("click", () => {
      secciones.forEach(sec => sec.classList.remove("activa"));
      const target = document.getElementById(item.dataset.target);
      if (target) {
        target.classList.add("activa");
        
        // --- INICIO: Código Nuevo - Lógica de navegación para cargar historiales ---
        if (item.dataset.target === 'reporte') {
            cargarHistorialHoras();
            cargarHistorialPagos();
        }
        // --- FIN: Código Nuevo - Lógica de navegación para cargar historiales ---
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
        
        // NOTA: Para POST con FormData (si el backend espera $_POST), usa este bloque:
        /*
        const formData = new FormData();
        formData.append('fecha', document.querySelector('#fecha').value);
        // ... (otros campos)
        */

      try {
        const res = await fetch('/Cooperativa/servidor-app/src/api/registrar_horas.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }, // Si tu API espera JSON
          body: JSON.stringify(data), // Si tu API espera JSON
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
            
            // --- INICIO: Código Nuevo - Actualizar historial después del éxito ---
            cargarHistorialHoras(); 
            // --- FIN: Código Nuevo - Actualizar historial después del éxito ---
            
        } else {
          alert(result.error || 'Error al registrar horas');
        }
      } catch (error) {
        console.error("Error de red (horas):", error);
        alert("No se pudo conectar con el servidor");
      }
    });
  }

  // 💰 Registro de pago
  const formPago = document.querySelector('.form-pago');
  if (formPago) {
    formPago.addEventListener('submit', async e => {
      e.preventDefault();

const formData = new FormData(formPago);

      try {
        const res = await fetch('/Cooperativa/servidor-app/src/api/registrar_pago.php', {
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

            // --- INICIO: Código Nuevo - Actualizar historial después del éxito ---
            cargarHistorialPagos();
            // --- FIN: Código Nuevo - Actualizar historial después del éxito ---
            
        } else {
          alert(result.error || 'Error al registrar pago');
        }
      } catch (error) {
        console.error("Error de red (pago):", error);
        alert("No se pudo conectar con el servidor");
      }
    });
  }
});

const PERFIL_API_URL = '/Cooperativa/servidor-app/src/api/get_perfil.php';

// Asegura que el script se ejecute cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Inicia la carga de los datos del perfil si la sección con id="perfil" existe
    if (document.getElementById('perfil')) {
        cargarPerfilUsuario();
    }
});

/**
 * 1. Obtiene los datos del perfil del usuario logueado desde la API.
 * 2. Rellena los campos del formulario de perfil (visualización y edición).
 */
async function cargarPerfilUsuario() {
    try {
        const response = await fetch(PERFIL_API_URL);
        const result = await response.json();

        if (response.ok && result.status === 'ok') {
            const data = result.data;
            
            // 🟢 RELLENAR CAMPOS DE VISUALIZACIÓN (readonly/disabled)
            document.getElementById('nombre').value = data.nombre || 'N/A';
            document.getElementById('apellido').value = data.apellido || 'N/A';
            document.getElementById('vivienda').value = data.vivienda || 'Sin Asignar';
            // La API devuelve la fecha de ingreso en 'ingreso'
            document.getElementById('ingreso').value = data.ingreso || 'N/A'; 

            // 🟢 RELLENAR CAMPOS EDITABLES (Muestra valores actuales)
            // 'cedula' corresponde a la columna CI en la DB
            document.getElementById('cedula').value = data.cedula || ''; 
            // 'fecha' corresponde a FchaNac en la DB y rellena el input type="date"
            document.getElementById('fecha').value = data.fecha || ''; 
            
        } else {
            console.error('Error al cargar perfil:', result.message || 'Respuesta inválida.');
            alert('No se pudo cargar el perfil del usuario: ' + (result.message || 'Intente de nuevo.'));
        }

    } catch (error) {
        console.error('Error de conexión al cargar el perfil:', error);
        alert('Error de conexión al obtener los datos del perfil.');
    }
}

/**
 * 3. Maneja el envío del formulario para actualizar el perfil (POST a actualizar_perfil.php).
 */
document.addEventListener('submit', async e => {
    // Solo procesar el submit si proviene del formulario de perfil
    if (!e.target.classList.contains('form-perfil')) return;
    
    e.preventDefault(); // Evitar la recarga de la página

    const form = e.target;
    const formData = new FormData(form);

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.disabled = true;
    submitButton.textContent = 'Guardando...';

    try {
        // Ejecuta la llamada a la API de actualización
        const res = await fetch(form.action, {
            method: 'POST',
            body: formData,
            credentials: 'include' 
        });

        const result = await res.json();

        if (res.ok && result.status === 'ok') {
            alert('✅ ' + result.message);
            // Si la actualización fue exitosa, recarga los datos para asegurar la consistencia
            cargarPerfilUsuario();
        } else {
            alert('❌ Error al actualizar: ' + (result.message || 'Error desconocido.'));
        }

    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        alert('❌ Error de conexión con el servidor para actualizar el perfil.');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
});

// ========================================================
// === LÓGICA DE PROGRESO DE HORAS Y PAGOS (USUARIO) ===
// ========================================================

const METAS_USUARIO_API = '/Cooperativa/servidor-app/src/api/get_metas_usuario.php'; 

// --- Añadir al document.addEventListener('DOMContentLoaded', ...) ---

    // Lógica de usuario para el dashboard de Pago
    if (document.getElementById('pago-dashboard')) {
        cargarProgresoPago();
    }
    
    // Lógica de usuario para el dashboard de Horas
    if (document.getElementById('horas-dashboard')) {
        cargarProgresoHoras();
    }

// --------------------------------------------------------------------


/**
 * Carga las metas de pago del usuario y actualiza el dashboard.
 */
async function cargarProgresoPago() {
    try {
        const response = await fetch(METAS_USUARIO_API);
        const result = await response.json();

        if (response.ok && result.status === 'ok') {
            const data = result.data;
            
            // Formateador para moneda (asume USD)
            const formatter = new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'USD',
            });

            const montoReq = data.monto_requerido;
            const montoPagado = data.monto_pagado;
            const montoRestante = data.monto_restante;
            
            // 1. Actualizar Dashboard
            document.getElementById('monto-requerido').textContent = formatter.format(montoReq);
            document.getElementById('monto-pagado').textContent = formatter.format(montoPagado);
            document.getElementById('monto-restante').textContent = formatter.format(montoRestante);

            // 2. Lógica de Estilo para el restante
            const restanteDiv = document.querySelector('#pago-dashboard .card-meta.restante');
            if (montoRestante <= 0) {
                restanteDiv.style.backgroundColor = '#d4edda'; // Verde claro
                restanteDiv.querySelector('h4').textContent = '¡Pago Completo! ✅';
                restanteDiv.querySelector('.valor-restante').style.color = '#28a745';
            } else {
                restanteDiv.style.backgroundColor = '#f8d7da'; // Rojo claro
                restanteDiv.querySelector('h4').textContent = 'Monto Restante';
                restanteDiv.querySelector('.valor-restante').style.color = '#dc3545';
            }

        } else {
            console.error('Error al cargar el progreso de pago:', result.message || 'Respuesta inválida.');
            const dashboard = document.getElementById('pago-dashboard');
            if (dashboard) {
                dashboard.innerHTML = '<p style="color:red;">Error al cargar datos. Intente de nuevo.</p>';
            }
        }

    } catch (error) {
        console.error('Error de conexión al cargar el progreso de pago:', error);
    }
}

/**
 * Carga las metas de horas del usuario y actualiza el dashboard de horas.
 */
async function cargarProgresoHoras() {
    try {
        const response = await fetch(METAS_USUARIO_API);
        const result = await response.json();

        if (response.ok && result.status === 'ok') {
            const data = result.data;
            
            // Asumiendo que la API devuelve los campos:
            const horasReq = data.horas_requeridas;
            const horasReg = data.horas_registradas;
            const horasRestantes = data.horas_restantes;
            
            // 1. Actualizar Dashboard
            document.getElementById('horas-requeridas').textContent = `${horasReq.toFixed(2)} h`;
            document.getElementById('horas-registradas').textContent = `${horasReg.toFixed(2)} h`;
            document.getElementById('horas-restantes').textContent = `${horasRestantes.toFixed(2)} h`;

            // 2. Lógica de Estilo para el restante
            const restanteDiv = document.querySelector('#horas-dashboard .card-meta.restante');
            
            if (horasRestantes <= 0) {
                restanteDiv.style.backgroundColor = '#d4edda'; // Verde claro
                restanteDiv.querySelector('h4').textContent = '¡Meta Cumplida! ✅';
                restanteDiv.querySelector('.valor-restante').style.color = '#28a745';
            } else {
                restanteDiv.style.backgroundColor = '#f8d7da'; // Rojo claro
                restanteDiv.querySelector('h4').textContent = 'Horas Restantes';
                restanteDiv.querySelector('.valor-restante').style.color = '#dc3545';
            }

        } else {
            console.error('Error al cargar el progreso de horas:', result.message || 'Respuesta inválida.');
            const dashboard = document.getElementById('horas-dashboard');
            if (dashboard) {
                dashboard.innerHTML = '<p style="color:red;">Error al cargar datos. Intente de nuevo.</p>';
            }
        }

    } catch (error) {
        console.error('Error de conexión al cargar el progreso de horas:', error);
    }
}