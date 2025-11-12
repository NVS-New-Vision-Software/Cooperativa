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
            const response = await fetch('/Cooperativa/api/get_horas.php'); 
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
            const response = await fetch('/Cooperativa/api/get_pagos.php'); 
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
                    ? `<a href="/Cooperativa/Backoffice/comprobantes/${pago.Comprobante}" target="_blank">Ver PDF</a>` 
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
        const res = await fetch('/Cooperativa/api/registrar_horas.php', {
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
        const res = await fetch('/Cooperativa/api/registrar_pago.php', {
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

