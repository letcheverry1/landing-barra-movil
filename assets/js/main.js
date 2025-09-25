// Configura tu número de WhatsApp (solo dígitos, con país). Ej: 5491100000000
const WHATSAPP_NUMBER = '5491100000000';

function toggleMenu(){ document.getElementById('nav').classList.toggle('open'); }

// Autorrelleno del select "Tipo" cuando se hace clic en CTAs con data-type
document.querySelectorAll('[data-type]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const type = btn.getAttribute('data-type');
    const select = document.getElementById('tipo');
    if(select){ select.value = type; }
  });
});

// Construir link de WhatsApp (botón sección contacto + flotante)
function buildWaLink(){
  const nombre = document.getElementById('nombre')?.value || '';
  const tipo   = document.getElementById('tipo')?.value || '';
  const fecha  = document.getElementById('fecha')?.value || '';
  const invitados = document.getElementById('invitados')?.value || '';
  const msg = encodeURIComponent(`Hola, soy ${nombre}. Quiero cotizar una barra móvil para ${tipo}. Fecha: ${fecha}. Invitados: ${invitados}. Vengo desde la web.`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}
function updateWaLinks(){
  const href = buildWaLink();
  const a1 = document.getElementById('ctaWhatsApp');
  const a2 = document.getElementById('waFloat');
  if(a1) a1.href = href; if(a2) a2.href = href;
}
const formEl = document.getElementById('leadForm');
['input','change'].forEach(evt=> formEl?.addEventListener(evt,updateWaLinks));
updateWaLinks();

// Mensaje de envío (Netlify) + fallback futuro (Formspree si lo activas)
const msgEl = document.getElementById('formMsg');
formEl?.addEventListener('submit', async ()=>{
  // Si estás en Netlify, deja que procese el form nativamente.
  msgEl.textContent = 'Enviando…';
  setTimeout(()=>{ msgEl.textContent = '¡Gracias! Te contactaremos a la brevedad.'; }, 1200);
});

// Año en footer
document.getElementById('year').textContent = new Date().getFullYear();
