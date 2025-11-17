// Este es el único bloque de código para manejar el formulario de REGISTRO
document.querySelector('.formulario-registro form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const apellido = document.getElementById('apellido').value;
  const email = document.getElementById('email-registro').value;
  const password = document.getElementById('password-registro').value;

const res = await fetch('../api/registro_postulante.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, apellido, email, password })
  });

  const data = await res.json();
  if (res.ok) {
    alert('Postulación enviada correctamente');
  } else {
    alert(data.error || 'Error al registrar');
  }
});

// Este es el único bloque de código para manejar el formulario de LOGIN
document.querySelector('.login-form').addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.querySelector('#email-login').value;
  const password = document.querySelector('#password-login').value;

  try {
    const res = await fetch('../api/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok && data.status === 'ok') {
        
        // 🔑 AGREGADO: Guardar el rol en localStorage para que el script del frontend pueda leerlo
        localStorage.setItem('user_rol', data.rol);
        
      if (data.rol === 'socio' || data.rol === 'admin') {
        window.location.href = '../Frontend/index.html';
      } else {
        alert('Rol desconocido');
      }
    } else {
      alert(data.error || 'Error de autenticación');
    }
  } catch (err) {
    console.error('Error en login:', err);
    alert('Error de conexión con el servidor');
  }
});

