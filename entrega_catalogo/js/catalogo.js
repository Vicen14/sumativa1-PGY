
(async function(){
  const map = {
    "categoria-accion.html": "accion",
    "categoria-aventura.html": "aventura",
    "categoria-deportes.html": "deportes",
    "categoria-carreras.html": "carreras",
    "categoria-indie.html": "indie"
  };
  const archivo = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const categoria = map[archivo];
  if(!categoria) return;

  const grid = document.querySelector('#grid-juegos');
  if(!grid) return;

  // Cargar dataset
  let juegos;
  try {
    const resp = await fetch('data/juegos.json');
    const json = await resp.json();
    juegos = json[categoria] || [];
  } catch(e) {
    console.error('No se pudo cargar juegos.json', e);
    juegos = [];
  }

  // Render
  grid.innerHTML = '';
  juegos.forEach(j => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="thumb">
        <img src="${j.portada}" alt="Portada del juego ${j.nombre}">
      </div>
      <div class="content">
        <h3>${j.nombre}</h3>
        <p>${j.descripcion}</p>
        <div class="price">$${j.precio.toLocaleString('es-CL')}</div>
      </div>`;
    grid.appendChild(card);
  });
})();
