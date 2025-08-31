
// === Validaciones y utilidades compartidas ===

// Password: min 8, al menos 1 mayúscula, 1 número y 1 carácter especial
function validarPassword(password) {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}\[\]:;"'<>?,./]).{8,}$/;
  return regex.test(password);
}

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Registro
document.addEventListener("DOMContentLoaded", () => {
  const fr = document.getElementById("formRegistro");
  if(fr){
    fr.addEventListener("submit", (e)=>{
      const nombre = document.getElementById("nombre").value.trim();
      const apellido = document.getElementById("apellido").value.trim();
      const email = document.getElementById("email").value.trim();
      const p1 = document.getElementById("reg_password").value;
      const p2 = document.getElementById("reg_password2").value;

      let ok = true;
      if(!nombre || !apellido){ alert("Nombre y apellido son obligatorios."); ok=false; }
      if(!validarEmail(email)){ alert("El correo no es válido."); ok=false; }
      if(!validarPassword(p1)){ alert("La contraseña no cumple las reglas de seguridad."); ok=false; }
      if(p1 !== p2){ alert("Las contraseñas no coinciden."); ok=false; }

      if(!ok) e.preventDefault();
      else {
        alert("Registro simulado exitoso. Ahora puedes iniciar sesión.");
        window.location.href = "login.html";
      }
    });
  }

  const fp = document.getElementById("formPerfil");
  if(fp){
    fp.addEventListener("submit", (e)=>{
      e.preventDefault();
      const np = document.getElementById("pf_password").value;
      if(np && !validarPassword(np)){
        alert("Si cambias la contraseña, debe cumplir las reglas de seguridad.");
        return;
      }
      alert("Perfil actualizado (simulado).");
    });
  }
});

// Exponer addToCart globalmente (para index/productos)
function addToCart(id){
  const cart = JSON.parse(localStorage.getItem("cart")||"[]");
  const ex = cart.find(i=>i.id===id);
  if(ex) ex.qty += 1; else cart.push({id, qty:1});
  localStorage.setItem("cart", JSON.stringify(cart));
  // feedback
  try { if(typeof renderCart === "function") renderCart(); } catch(e){}
  alert("Añadido al carrito.");
}
