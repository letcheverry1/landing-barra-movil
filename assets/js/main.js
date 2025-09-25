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
const msgEl = document.getElementById('formMsg');
formEl?.addEventListener('submit', ()=> {
  msgEl.textContent = 'Enviando…';
  // Formspree redirige o responde; este mensaje es solo feedback rápido
  setTimeout(()=>{ msgEl.textContent = '¡Gracias! Te contactaremos a la brevedad.'; }, 1500);
});


// Año en footer
document.getElementById('year').textContent = new Date().getFullYear();

/* === INTERACTIVIDAD LIGERA === */
(function(){
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  /* A) REVEAL ON SCROLL + NAV ACTIVO */
  const revealTargets = $$('.hero, .section, .card, .gallery figure');
  revealTargets.forEach(el => el.classList.add('reveal'));
  const sections = $$('#nosotros, #servicios, #galeria, #precios, #contacto');
  const navLinks = $$('.nav a[href^="#"]');

  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); }
    });
  }, {threshold: .12, rootMargin: '0px 0px -10% 0px'});
  revealTargets.forEach(el=>io.observe(el));

  const spy = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const id = '#' + e.target.id;
        navLinks.forEach(a=>a.classList.toggle('active', a.getAttribute('href')===id));
      }
    });
  }, {threshold:.5});
  sections.forEach(s=>spy.observe(s));

  /* B) PERSONALIZACIÓN SUAVE (localStorage + saludo) */
  const form = $('#leadForm');
  const fields = ['nombre','email','telefono','tipo','fecha','invitados','mensaje'];
  const storeKey = 'edc_lead';

  // Restaura
  try{
    const saved = JSON.parse(localStorage.getItem(storeKey) || '{}');
    fields.forEach(k => { if(saved[k] && $('#'+k)) $('#'+k).value = saved[k]; });
    if(saved.nombre){
      const hero = $('.hero .hero-cta')?.parentElement;
      if(hero && !$('#helloBadge')){
        const p = document.createElement('p');
        p.id = 'helloBadge';
        p.className = 'pill';
        p.textContent = `Hola, ${saved.nombre} 👋 ¿vemos disponibilidad?`;
        hero.insertBefore(p, hero.querySelector('.hero-cta'));
      }
    }
  }catch(e){/* noop */ }

  // Persiste + mantiene WA actualizado (reusa tu updateWaLinks si existe)
  const persist = () => {
    const data = {};
    fields.forEach(k => { const el = $('#'+k); if(el) data[k] = el.value; });
    localStorage.setItem(storeKey, JSON.stringify(data));
    if(typeof updateWaLinks === 'function') updateWaLinks();
  };
  fields.forEach(k => $('#'+k)?.addEventListener('input', persist));
  fields.forEach(k => $('#'+k)?.addEventListener('change', persist));

  /* C) VALIDACIÓN EN TIEMPO REAL + sugerencia de pack */
  const email = $('#email'), tel = $('#telefono'), invitados = $('#invitados');
  const ensureMsg = (el, id, cls) => {
    let m = $('#'+id);
    if(!m){ m = document.createElement('div'); m.id = id; m.className = cls; el.parentElement.appendChild(m); }
    return m;
  };
  const telRe = /^[0-9+\-\s()]{6,}$/;

  function validate(){
    let ok = true;

    // email
    if(email){
      const m = ensureMsg(email, 'errEmail', 'form-error');
      if(!email.validity.valid){
        m.textContent = 'Ingresá un email válido.'; email.classList.add('input-error'); ok = false;
      } else { m.textContent = ''; email.classList.remove('input-error'); }
    }

    // teléfono
    if(tel){
      const m = ensureMsg(tel, 'errTel', 'form-error');
      if(!telRe.test(tel.value.trim())){
        m.textContent = 'Ingresá un WhatsApp válido (con código de país).';
        tel.classList.add('input-error'); ok = false;
      } else { m.textContent = ''; tel.classList.remove('input-error'); }
    }

    // sugerencia de pack (según invitados)
    if(invitados){
      const h = ensureMsg(invitados, 'hintPack', 'form-hint');
      const n = parseInt(invitados.value, 10) || 0;
      let s = '';
      if(n > 0){
        if(n <= 80) s = 'Recomendado: Essenza';
        else if(n <= 140) s = 'Recomendado: Clásico';
        else s = 'Recomendado: Maestría';
      }
      h.textContent = s;
    }

    return ok;
  }

  [email, tel, invitados].forEach(el => el?.addEventListener('input', validate));
  validate();

  // Feedback visual al enviar (Formspree)
  const msgEl = $('#formMsg');
  form?.addEventListener('submit', () => {
    if(!validate()){ (msgEl||{}).textContent = 'Revisá los campos marcados.'; return; }
    if(msgEl){ msgEl.textContent = 'Enviando…'; setTimeout(()=>{ msgEl.textContent = '¡Gracias! Te contactamos en breve.'; }, 1500); }
  });

  /* D) LIGHTBOX mínimo para la galería */
  const galleryImgs = $$('.gallery img');
  if(galleryImgs.length){
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = '<button aria-label="Cerrar">✕</button><img alt="Foto de galería" />';
    document.body.appendChild(lb);
    const imgTag = $('img', lb), closeBtn = $('button', lb);
    galleryImgs.forEach(img => img.addEventListener('click', ()=>{
      imgTag.src = img.src; lb.classList.add('open');
    }));
    lb.addEventListener('click', e => { if(e.target === lb) lb.classList.remove('open'); });
    closeBtn.addEventListener('click', ()=> lb.classList.remove('open'));
  }

  /* (Bonus) Barra de progreso de scroll */
  const bar = document.createElement('div'); bar.className = 'progress'; document.body.prepend(bar);
  window.addEventListener('scroll', ()=>{
    const h = document.documentElement;
    const p = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    bar.style.width = p + '%';
  }, {passive:true});
})();
