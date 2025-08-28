// Validaciones de formularios con Bootstrap
(function() {
  'use strict';

  // Expresiones regulares para validaciones
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Seleccionar todos los formularios que necesitan validación
  const forms = document.querySelectorAll('.needs-validation');

  // Iterar sobre cada formulario
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      // Prevenir el envío por defecto
      event.preventDefault();
      event.stopPropagation();

      let isFormValid = true;

      // --- Validación para el formulario de Registro ---
      if (form.id === 'formRegistro') {
        const password = form.querySelector('#password');
        const confirmPassword = form.querySelector('#confirmPassword');

        // 1. Validar formato de la contraseña
        if (!passRegex.test(password.value)) {
          password.classList.add('is-invalid');
          password.classList.remove('is-valid');
          // Cambiar mensaje de error
          password.nextElementSibling.textContent = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo (@$!%*?&).';
          isFormValid = false;
        } else {
          password.classList.remove('is-invalid');
          password.classList.add('is-valid');
        }

        // 2. Validar que las contraseñas coincidan
        if (password.value !== confirmPassword.value) {
          confirmPassword.classList.add('is-invalid');
          confirmPassword.classList.remove('is-valid');
          confirmPassword.nextElementSibling.textContent = 'Las contraseñas no coinciden.';
          isFormValid = false;
        } else if (password.value) { // Solo validar si la primera contraseña es válida
          confirmPassword.classList.remove('is-invalid');
          confirmPassword.classList.add('is-valid');
        }
      }
      
      // --- Validación de contraseña en el formulario de Perfil (si se ingresa una nueva) ---
      if (form.id === 'formPerfil') {
        const passwordPerfil = form.querySelector('#passwordPerfil');
        // La contraseña es opcional, pero si se escribe, debe ser válida
        if (passwordPerfil.value && !passRegex.test(passwordPerfil.value)) {
            passwordPerfil.classList.add('is-invalid');
            passwordPerfil.classList.remove('is-valid');
            passwordPerfil.nextElementSibling.textContent = 'Si cambia la contraseña, debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.';
            isFormValid = false;
        } else if (passwordPerfil.value) {
            passwordPerfil.classList.remove('is-invalid');
            passwordPerfil.classList.add('is-valid');
        } else {
            passwordPerfil.classList.remove('is-invalid');
            passwordPerfil.classList.remove('is-valid');
        }
      }

      // --- Validación genérica para campos requeridos y formato de email ---
      const inputs = form.querySelectorAll('input[required]');
      inputs.forEach(input => {
        if (!input.value) {
          input.classList.add('is-invalid');
          input.classList.remove('is-valid');
          isFormValid = false;
        } else if (input.type === 'email' && !emailRegex.test(input.value)) {
          input.classList.add('is-invalid');
          input.classList.remove('is-valid');
          isFormValid = false;
        } else if (input.id !== 'password' && input.id !== 'confirmPassword' && input.id !== 'passwordPerfil') { // Evitar sobreescribir validaciones de contraseña
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');
        }
      });

      // Si el formulario es válido, se puede proceder con el envío (simulado aquí)
      if (isFormValid) {
        console.log('El formulario es válido y está listo para ser enviado.');
        // Aquí iría la lógica para enviar los datos al servidor.
        // Por ahora, mostraremos una alerta de éxito.
        alert('¡Formulario enviado con éxito!');
        // Opcionalmente, se podría resetear el formulario: form.reset();
        // y quitar las clases de validación
        form.classList.remove('was-validated');
        inputs.forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
        });
      } else {
         console.log('El formulario contiene errores.');
      }

      // Añadir la clase de Bootstrap para mostrar los estilos de feedback
      form.classList.add('was-validated');
    }, false);
  });
})();