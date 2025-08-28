/// validaciones.js — validaciones Bootstrap + sesión simulada 
function activarValidacionBootstrap(form) {
  form.addEventListener('submit', function (e) {
    if (!form.checkValidity()) { e.preventDefault(); e.stopPropagation(); }
    form.classList.add('was-validated');
  }, false);
}

// LOGIN (formlogin) 
(function () {
  const form = document.getElementById('formlogin');
  if (!form) return;

  activarValidacionBootstrap(form);

  form.addEventListener('submit', function (e) {
    if (!form.checkValidity()) return;
    e.preventDefault();

    const email = document.getElementById('emailLogin')?.value || '';
    const user = { email, name: email.split('@')[0] || 'Usuario', loggedIn: true };
    localStorage.setItem('ppg_user', JSON.stringify(user));

    alert('Inicio de sesión exitoso ✅');
    // redirección priorizando retorno
    const ret = localStorage.getItem('ppg_return');
    if (ret) {
      localStorage.removeItem('ppg_return');
      window.location.href = ret;
    } else {
      window.location.href = 'perfil.html';
    }
  });
})();

/// REGISTRO (formRegistro) 
(function () {
  const form = document.getElementById('formRegistro');
  if (!form) return;

  const pass  = document.getElementById('password');
  const pass2 = document.getElementById('confirmPassword');

  const validarCoincidencia = () => {
    if (pass.value && pass2.value && pass.value !== pass2.value) {
      pass2.setCustomValidity('No coincide');
    } else {
      pass2.setCustomValidity('');
    }
  };
  pass.addEventListener('input', validarCoincidencia);
  pass2.addEventListener('input', validarCoincidencia);

  activarValidacionBootstrap(form);

  form.addEventListener('submit', function (e) {
    validarCoincidencia();
    if (!form.checkValidity()) return;
    e.preventDefault();
    alert('Registro exitoso ✅');
    window.location.href = 'login.html';
  });
})();

///// RECUPERAR (formRecuperar) 
(function () {
  const form = document.getElementById('formRecuperar');
  if (!form) return;

  activarValidacionBootstrap(form);

  form.addEventListener('submit', function (e) {
    if (!form.checkValidity()) return;
    e.preventDefault();
    alert('Te enviamos un correo de recuperación (demo) 📧');
  });
})();
