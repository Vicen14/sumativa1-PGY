// Validaciones de formularios
(function() { 
  'use strict';
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', function(event) {
      // Validar contraseña con reglas
      const pass = form.querySelector('input[type="password"]');
      if (pass && pass.value) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!regex.test(pass.value)) {
          event.preventDefault();
          event.stopPropagation();
          pass.classList.add('is-invalid');
        } else {
          pass.classList.remove("is-invalid");
        }
      }

      form.classList.add('was-validated');
    });
  });
})(); // Pocos cierres jajaja