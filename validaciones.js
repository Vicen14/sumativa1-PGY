// Validaciones de formularios
(function() {
  'use strict';
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', function(event) {
      let isFormValid = true;

      // Validación de nombre de usuario
      const username = form.querySelector('input[id="username"]');
      if (username && username.value) {
        const usernameRegex = /^[a-zA-Z0-9_.-]{4,16}$/;
        if (!usernameRegex.test(username.value)) {
          isFormValid = false;
          username.classList.add('is-invalid');
        } else {
          username.classList.remove('is-invalid');
        }
      }

      // Validación de email
      const email = form.querySelector('input[type="email"]');
      if (email && email.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
          isFormValid = false;
          email.classList.add('is-invalid');
        } else {
          email.classList.remove('is-invalid');
        }
      }

      // Validación de contraseña
      const pass = form.querySelector('input[type="password"]');
      if (pass && pass.value) {
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passRegex.test(pass.value)) {
          isFormValid = false;
          pass.classList.add('is-invalid');
        } else {
          pass.classList.remove('is-invalid');
        }
      }

      // Mostrar estilos de validación
      form.classList.add('was-validated');

      // Evitar envío si hay campos inválidos
      if (!isFormValid) {
        event.preventDefault();
        event.stopPropagation();
      }
    });
  });
})();
})(); // Pocos cierres jajaja
