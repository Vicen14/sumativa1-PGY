// Validaciones de formularios con Bootstrap
(function() {
  'use strict';

  // Expresiones regulares para validaciones
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Inicializar datos de ejemplo si no existen
  if (!localStorage.getItem('usuarios')) {
    const usuariosEjemplo = [
      {
        id: 1,
        nombre: 'Administrador Principal',
        email: 'admin@pixelplay.com',
        password: 'Admin123!',
        rol: 'administrador',
        fechaRegistro: new Date().toLocaleDateString()
      },
      {
        id: 2,
        nombre: 'Cliente Ejemplo',
        email: 'cliente@ejemplo.com',
        password: 'Cliente123!',
        rol: 'cliente',
        fechaRegistro: new Date().toLocaleDateString()
      }
    ];
    localStorage.setItem('usuarios', JSON.stringify(usuariosEjemplo));
  }

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
        // Manejar el envío según el tipo de formulario
        if (form.id === 'formlogin') {
          handleLogin(form);
        } else if (form.id === 'formRegistro') {
          handleRegistro(form);
        } else if (form.id === 'formPerfil') {
          handlePerfil(form);
        } else if (form.id === 'formRecuperar') {
          handleRecuperar(form);
        } else {
          console.log('El formulario es válido y está listo para ser enviado.');
          alert('¡Formulario enviado con éxito!');
        }
      } else {
         console.log('El formulario contiene errores.');
      }

      // Añadir la clase de Bootstrap para mostrar los estilos de feedback
      form.classList.add('was-validated');
    }, false);
  });

  // Función para manejar el inicio de sesión
  function handleLogin(form) {
    const email = form.querySelector('#emailLogin').value;
    const password = form.querySelector('#passwordLogin').value;
    
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find(u => u.email === email && u.password === password);
    
    if (usuario) {
      // Guardar usuario en sesión
      localStorage.setItem('usuarioActual', JSON.stringify(usuario));
      alert(`¡Bienvenido ${usuario.nombre}!`);
      window.location.href = 'index.html';
    } else {
      alert('Credenciales incorrectas. Por favor, intente nuevamente.');
    }
  }

  // Función para manejar el registro
  function handleRegistro(form) {
    const nombre = form.querySelector('#nombre').value;
    const email = form.querySelector('#email').value;
    const password = form.querySelector('#password').value;
    
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    
    // Verificar si el email ya existe
    if (usuarios.some(u => u.email === email)) {
      alert('Este correo electrónico ya está registrado.');
      return;
    }
    
    // Crear nuevo usuario (por defecto como cliente)
    const nuevoUsuario = {
      id: usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1,
      nombre,
      email,
      password,
      rol: 'cliente',
      fechaRegistro: new Date().toLocaleDateString()
    };
    
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    // Iniciar sesión automáticamente
    localStorage.setItem('usuarioActual', JSON.stringify(nuevoUsuario));
    alert('¡Registro exitoso! Bienvenido a PixelPlay Games.');
    window.location.href = 'index.html';
  }

  // Función para manejar la actualización del perfil
  function handlePerfil(form) {
    const nombre = form.querySelector('#nombrePerfil').value;
    const email = form.querySelector('#emailPerfil').value;
    const password = form.querySelector('#passwordPerfil').value;
    
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    
    // Encontrar y actualizar usuario
    const usuarioIndex = usuarios.findIndex(u => u.id === usuarioActual.id);
    
    if (usuarioIndex !== -1) {
      usuarios[usuarioIndex].nombre = nombre;
      usuarios[usuarioIndex].email = email;
      
      // Actualizar contraseña solo si se proporcionó una nueva
      if (password) {
        usuarios[usuarioIndex].password = password;
      }
      
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      localStorage.setItem('usuarioActual', JSON.stringify(usuarios[usuarioIndex]));
      
      alert('Perfil actualizado correctamente.');
    }
  }

  // Función para manejar recuperación de contraseña
  function handleRecuperar(form) {
    const email = form.querySelector('#emailRecuperar').value;
    
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find(u => u.email === email);
    
    if (usuario) {
      alert('Se han enviado instrucciones para restablecer su contraseña a su correo electrónico.');
    } else {
      alert('No se encontró una cuenta asociada a este correo electrónico.');
    }
  }
})();