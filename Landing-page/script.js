document.querySelector('.login-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const email = document.getElementById('email-login').value;
  const password = document.getElementById('password-login').value;

  const res = await fetch('api/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem('usuario_id', data.usuario_id);
    window.location.href = 'panel.html'; // redirige al panel de usuario
  } else {
    alert(data.error || 'Error de autenticación');
  }
});

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
