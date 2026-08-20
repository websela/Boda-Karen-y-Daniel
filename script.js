// =====================================================================
// Karen & Daniel — 14 de noviembre de 2026
// =====================================================================

/* ---------------------- Fecha de la boda ---------------------- */
// EDITA AQUÍ si cambia la hora de la ceremonia.
const FECHA_BODA = new Date("2026-11-14T17:00:00-05:00");

// EDITA AQUÍ si cambia la fecha límite para confirmar asistencia.
const FECHA_LIMITE_RSVP = new Date("2026-10-25T23:59:59-05:00");

/* ---------------------- Cuenta regresiva ---------------------- */
function actualizarCountdown(){
  const ahora = new Date();
  let diff = FECHA_BODA - ahora;
  if (diff < 0) diff = 0;

  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diff / (1000 * 60)) % 60);
  const segundos = Math.floor((diff / 1000) % 60);

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(val).padStart(2, "0");
  };
  set("cd-dias", dias);
  set("cd-horas", horas);
  set("cd-minutos", minutos);
  set("cd-segundos", segundos);
}
actualizarCountdown();
setInterval(actualizarCountdown, 1000);

/* ---------------------- Reproductor de música ---------------------- */
// EDITA AQUÍ el título y artista que se muestran en el reproductor.
const SONG_TITLE = "Nuestra canción";
const SONG_ARTIST = "Karen & Daniel";

const audio = document.getElementById("cancion-boda");
const player = document.getElementById("player");
const musicBtn = document.getElementById("music-btn");
const iconPlay = document.getElementById("icon-play");
const iconPause = document.getElementById("icon-pause");
const playerTitle = document.getElementById("player-title");
const playerArtist = document.getElementById("player-artist");
const playerBar = document.getElementById("player-bar");
const playerBarFill = document.getElementById("player-bar-fill");
const playerTimeCurrent = document.getElementById("player-time-current");
const playerTimeTotal = document.getElementById("player-time-total");

if (playerTitle) playerTitle.textContent = SONG_TITLE;
if (playerArtist) playerArtist.textContent = SONG_ARTIST;

function formatearTiempo(segundos){
  if (!isFinite(segundos) || segundos < 0) return "0:00";
  const m = Math.floor(segundos / 60);
  const s = Math.floor(segundos % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function actualizarBotonMusica(reproduciendo){
  if (player) player.classList.toggle("playing", reproduciendo);
  iconPlay.style.display = reproduciendo ? "none" : "block";
  iconPause.style.display = reproduciendo ? "block" : "none";
  musicBtn.setAttribute("aria-label", reproduciendo ? "Pausar canción" : "Reproducir canción");
}

if (musicBtn && audio) {
  musicBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch(() => {
        // Algunos navegadores móviles bloquean el autoplay con sonido;
        // el clic del usuario ya cuenta como interacción, así que
        // normalmente este catch no debería dispararse.
      });
    } else {
      audio.pause();
    }
  });

  audio.addEventListener("play", () => actualizarBotonMusica(true));
  audio.addEventListener("pause", () => actualizarBotonMusica(false));
  audio.addEventListener("ended", () => actualizarBotonMusica(false));

  audio.addEventListener("loadedmetadata", () => {
    if (playerTimeTotal) playerTimeTotal.textContent = formatearTiempo(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    if (playerTimeCurrent) playerTimeCurrent.textContent = formatearTiempo(audio.currentTime);
    if (playerBarFill && audio.duration) {
      playerBarFill.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
    }
  });

  // Si el archivo de audio no carga (ruta incorrecta, archivo faltante),
  // avisa en el reproductor en vez de fallar en silencio.
  audio.addEventListener("error", () => {
    if (playerArtist) playerArtist.textContent = "No se encontró assets/cancion-boda.mp3";
    musicBtn.disabled = true;
    musicBtn.style.opacity = "0.5";
    musicBtn.style.cursor = "not-allowed";
    console.error("No se pudo cargar el audio. Verifica que 'assets/cancion-boda.mp3' esté en la misma carpeta que index.html.");
  });

  if (playerBar) {
    playerBar.addEventListener("click", (e) => {
      if (!audio.duration) return;
      const rect = playerBar.getBoundingClientRect();
      const proporcion = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
      audio.currentTime = proporcion * audio.duration;
    });
  }
}

/* ---------------------- Revelado al hacer scroll ---------------------- */
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach((el) => io.observe(el));

/* ---------------------- Carrusel de fotos (tarjetas apiladas) ---------------------- */
const stage = document.getElementById("carousel-stage");
const cards = stage ? Array.from(stage.children) : [];
const dotsWrap = document.getElementById("carousel-dots");
const prevBtn = document.getElementById("carousel-prev");
const nextBtn = document.getElementById("carousel-next");
const totalCartas = cards.length;
let slideActual = 0;
let carouselTimer = null;
const AUTOPLAY_MS = 4200;
const prefiereMenosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Calcula la posición visual (active / next / next2 / prev / far) de cada tarjeta
// según su distancia respecto a la tarjeta activa actual.
function posicionPara(delta){
  const d = ((delta % totalCartas) + totalCartas) % totalCartas;
  if (d === 0) return "active";
  if (d === 1) return "next";
  if (d === 2) return "next2";
  if (d === totalCartas - 1) return "prev";
  return "far";
}

function pintarStack(){
  cards.forEach((card, i) => { card.dataset.pos = posicionPara(i - slideActual); });
  if (dotsWrap) {
    Array.from(dotsWrap.children).forEach((dot, i) => dot.classList.toggle("active", i === slideActual));
  }
}

function irASlide(indice){
  if (!stage || totalCartas === 0) return;
  slideActual = ((indice % totalCartas) + totalCartas) % totalCartas;
  pintarStack();
}

function crearDots(){
  if (!dotsWrap) return;
  cards.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ir a la foto ${i + 1}`);
    dot.addEventListener("click", () => { irASlide(i); reiniciarAutoplay(); });
    dotsWrap.appendChild(dot);
  });
  pintarStack();
}

function reiniciarAutoplay(){
  if (prefiereMenosMovimiento || !stage) return;
  clearInterval(carouselTimer);
  carouselTimer = setInterval(() => irASlide(slideActual + 1), AUTOPLAY_MS);
}

if (stage && totalCartas > 0) {
  crearDots();
  reiniciarAutoplay();

  nextBtn && nextBtn.addEventListener("click", () => { irASlide(slideActual + 1); reiniciarAutoplay(); });
  prevBtn && prevBtn.addEventListener("click", () => { irASlide(slideActual - 1); reiniciarAutoplay(); });

  stage.addEventListener("mouseenter", () => clearInterval(carouselTimer));
  stage.addEventListener("mouseleave", reiniciarAutoplay);

  // Arrastrar la tarjeta activa con el mouse o el dedo (mouse + touch vía Pointer Events)
  let arrastrando = false;
  let inicioX = 0, inicioY = 0;

  function cartaActiva(){ return cards.find((c) => c.dataset.pos === "active"); }

  stage.addEventListener("pointerdown", (e) => {
    const activa = cartaActiva();
    if (!activa) return;
    arrastrando = true;
    inicioX = e.clientX;
    inicioY = e.clientY;
    activa.classList.add("dragging");
    clearInterval(carouselTimer);
    stage.setPointerCapture(e.pointerId);
  });

  stage.addEventListener("pointermove", (e) => {
    if (!arrastrando) return;
    const activa = cartaActiva();
    if (!activa) return;
    const dx = e.clientX - inicioX;
    const dy = (e.clientY - inicioY) * 0.15;
    activa.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx / 18}deg)`;
  });

  function soltarArrastre(e){
    if (!arrastrando) return;
    arrastrando = false;
    const activa = cartaActiva();
    const dx = e.clientX - inicioX;
    if (activa) {
      activa.classList.remove("dragging");
      activa.style.transform = "";
    }
    if (Math.abs(dx) > 60) irASlide(slideActual + (dx < 0 ? 1 : -1));
    reiniciarAutoplay();
  }
  stage.addEventListener("pointerup", soltarArrastre);
  stage.addEventListener("pointercancel", soltarArrastre);
  stage.addEventListener("pointerleave", (e) => { if (arrastrando) soltarArrastre(e); });
}

/* ---------------------- Brillo cálido dinámico en tarjetas liquid glass ---------------------- */
if (!prefiereMenosMovimiento) {
  document.querySelectorAll(".glass").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
      el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
    });
  });
}

/* ---------------------- Invitación individual (RSVP) ---------------------- */
const inputNombre = document.getElementById("rsvp-nombre");
const nombreLista = document.getElementById("rsvp-nombre-list");
const guestStatus = document.getElementById("guest-status");
const companionBlock = document.getElementById("companion-block");
const companionCheckbox = document.getElementById("companion-checkbox");
const companionCheckboxLabel = document.getElementById("companion-checkbox-label");
const companionNameField = document.getElementById("companion-name-field");
const companionNamesContainer = document.getElementById("companion-names-container");
const childrenBlock = document.getElementById("children-block");
const childrenCheckbox = document.getElementById("children-checkbox");
const childrenCheckboxLabel = document.getElementById("children-checkbox-label");
const childrenNameField = document.getElementById("children-name-field");
const childrenNamesContainer = document.getElementById("children-names-container");
const rsvpForm = document.getElementById("rsvp-form");
const rsvpSuccess = document.getElementById("rsvp-success");
const rsvpClosed = document.getElementById("rsvp-closed");
const inviteLookup = document.getElementById("invite-lookup");
const inviteCard = document.getElementById("invite-card");
const inviteGreeting = document.getElementById("invite-greeting");
const inviteDetail = document.getElementById("invite-detail");
const rsvpBox = document.getElementById("rsvp-box");
const btnBuscarInvitacion = document.getElementById("btn-buscar-invitacion");
const btnConfirmarAsistencia = document.getElementById("btn-confirmar-asistencia");
const btnCambiarInvitado = document.getElementById("btn-cambiar-invitado");

let invitadoSeleccionado = null;

// Controla cuál de los 3 pasos se ve: "lookup" (buscar), "card" (tarjeta de
// invitación) o "form" (formulario real de sí/no + acompañantes).
function mostrarPaso(paso){
  if (inviteLookup) inviteLookup.classList.toggle("hide", paso !== "lookup");
  if (inviteCard) inviteCard.classList.toggle("show", paso === "card");
  if (rsvpBox) rsvpBox.classList.toggle("show", paso === "form");
  if (paso === "form" && rsvpBox) {
    rsvpBox.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Quita el texto entre paréntesis para un saludo más limpio.
// Ej: "Familia Diaz Escobar(willly, Lina, nicolle, sofia)" -> "Familia Diaz Escobar"
function nombreParaSaludo(nombre){
  return nombre.replace(/\s*\([^)]*\)\s*/g, "").trim();
}

function textoDetalleAcompanantes(guest){
  const adultos = guest.acompanantesPermitidos || 0;
  const ninos = guest.ninosPermitidos || 0;

  if (adultos === 0 && ninos === 0) {
    return "Tu invitación es individual — nos encantaría que seas tú quien confirme.";
  }

  const partes = [];
  if (adultos === 1) partes.push("1 acompañante");
  else if (adultos > 1) partes.push(`hasta ${adultos} acompañantes`);

  if (ninos === 1) partes.push("1 niño");
  else if (ninos > 1) partes.push(`hasta ${ninos} niños`);

  return `Tu invitación incluye ${partes.join(" y ")}.`;
}

function mostrarTarjetaInvitacion(guest){
  invitadoSeleccionado = guest;

  if (inviteGreeting) inviteGreeting.textContent = `Hola, ${nombreParaSaludo(guest.nombre)}`;
  if (inviteDetail) inviteDetail.textContent = textoDetalleAcompanantes(guest);

  // El/los acompañante(s) adulto(s) SOLO se habilitan para invitados con acompanantesPermitidos > 0
  if (guest.acompanantesPermitidos > 0) {
    companionBlock.classList.add("show");
    companionCheckbox.disabled = false;
    companionCheckbox.checked = false;
    companionNameField.classList.remove("show");
    companionCheckboxLabel.textContent = guest.acompanantesPermitidos === 1
      ? "Llevaré acompañante"
      : `Llevaré acompañante(s) (hasta ${guest.acompanantesPermitidos})`;
    renderCamposNombres(companionNamesContainer, "companion-name", guest.acompanantesPermitidos, "Nombre de tu acompañante", "Nombre del acompañante", guest.acompanantesNombres);
  } else {
    companionBlock.classList.remove("show");
    companionCheckbox.checked = false;
    companionCheckbox.disabled = true;
    companionNameField.classList.remove("show");
    companionNamesContainer.innerHTML = "";
  }

  // El/los niño(s) SOLO se habilitan para invitados con ninosPermitidos > 0
  if (guest.ninosPermitidos > 0) {
    childrenBlock.classList.add("show");
    childrenCheckbox.disabled = false;
    childrenCheckbox.checked = false;
    childrenNameField.classList.remove("show");
    childrenCheckboxLabel.textContent = guest.ninosPermitidos === 1
      ? "Llevaré niño"
      : `Llevaré niño(s) (hasta ${guest.ninosPermitidos})`;
    renderCamposNombres(childrenNamesContainer, "children-name", guest.ninosPermitidos, "Nombre del niño", "Nombre del niño", guest.ninosNombres);
  } else {
    childrenBlock.classList.remove("show");
    childrenCheckbox.checked = false;
    childrenCheckbox.disabled = true;
    childrenNameField.classList.remove("show");
    childrenNamesContainer.innerHTML = "";
  }

  mostrarPaso("card");
}

// ---------------------- Enlace personalizado (?inv=código) ----------------------
// Si alguien entra por su enlace único, se salta el buscador y va directo
// a su tarjeta de invitación con su nombre y su cantidad de acompañantes.
function aplicarInvitadoDesdeEnlace(){
  const params = new URLSearchParams(window.location.search);
  const codigo = params.get("inv");
  if (!codigo) return;

  const guest = GUEST_LIST.find((g) => g.id === codigo);
  if (!guest) return;

  mostrarTarjetaInvitacion(guest);
}

// Genera un campo de nombre por cada acompañante o niño permitido (1, 2, 3...).
// Se usa tanto para el bloque de acompañantes adultos como para el de niños.
// Si ya conocemos el nombre (viene del Excel), lo dejamos precargado para
// que el invitado NO tenga que escribirlo — solo confirma o corrige si hace falta.
function renderCamposNombres(contenedor, idPrefix, cantidad, etiquetaSingular, etiquetaPlural, nombresConocidos){
  contenedor.innerHTML = "";
  for (let i = 1; i <= cantidad; i++) {
    const wrap = document.createElement("div");
    wrap.className = "field";
    wrap.style.marginTop = "12px";
    wrap.style.marginBottom = "0";

    const label = document.createElement("label");
    label.setAttribute("for", `${idPrefix}-${i}`);
    label.textContent = cantidad === 1 ? etiquetaSingular : `${etiquetaPlural} ${i}`;

    const input = document.createElement("input");
    input.type = "text";
    input.id = `${idPrefix}-${i}`;
    input.className = "companion-name-input";
    input.placeholder = "Nombre completo";
    const conocido = nombresConocidos && nombresConocidos[i - 1];
    if (conocido) input.value = conocido;

    wrap.appendChild(label);
    wrap.appendChild(input);
    contenedor.appendChild(wrap);
  }
}

/* ---------------------- Buscador inteligente (autocompletar) ----------------------
 * A medida que la persona escribe, se muestran los nombres de la lista que
 * contienen ese texto (sin importar tildes/mayúsculas), para que elija el
 * suyo con un clic en vez de tener que escribirlo completo y exacto.
 */
const MAX_SUGERENCIAS = 6;

function cerrarSugerencias(){
  if (!nombreLista) return;
  nombreLista.classList.remove("open");
  nombreLista.innerHTML = "";
}

function mostrarSugerencias(texto){
  if (!nombreLista) return;
  const consulta = normalizar(texto);
  if (!consulta) { cerrarSugerencias(); return; }

  const coincidencias = GUEST_LIST
    .filter((g) => normalizar(g.nombre).includes(consulta))
    .slice(0, MAX_SUGERENCIAS);

  if (coincidencias.length === 0) { cerrarSugerencias(); return; }

  nombreLista.innerHTML = "";
  coincidencias.forEach((g) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = g.nombre;
    btn.addEventListener("click", () => {
      inputNombre.value = g.nombre;
      cerrarSugerencias();
      guestStatus.classList.remove("show", "not-found");
      mostrarTarjetaInvitacion(g);
    });
    nombreLista.appendChild(btn);
  });
  nombreLista.classList.add("open");
}

if (inputNombre) {
  inputNombre.addEventListener("input", () => mostrarSugerencias(inputNombre.value));
  inputNombre.addEventListener("focus", () => mostrarSugerencias(inputNombre.value));

  // Cierra la lista al hacer clic fuera (con un pequeño retraso para que el
  // clic sobre una sugerencia alcance a dispararse primero).
  document.addEventListener("pointerdown", (e) => {
    if (nombreLista && !nombreLista.contains(e.target) && e.target !== inputNombre) {
      cerrarSugerencias();
    }
  });

  inputNombre.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarSugerencias();
  });
}

if (btnBuscarInvitacion) {
  btnBuscarInvitacion.addEventListener("click", () => {
    cerrarSugerencias();
    const valor = inputNombre.value;
    const match = GUEST_LIST.find((g) => normalizar(g.nombre) === normalizar(valor));

    if (!valor.trim()) {
      guestStatus.classList.add("show", "not-found");
      guestStatus.textContent = "Escribe tu nombre para ver tu invitación.";
      return;
    }

    if (match) {
      guestStatus.classList.remove("show", "not-found");
      mostrarTarjetaInvitacion(match);
    } else {
      guestStatus.classList.add("show", "not-found");
      guestStatus.textContent = "No encontramos ese nombre. Verifica que esté escrito igual que en tu invitación, o contáctanos directamente.";
    }
  });

  inputNombre.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      btnBuscarInvitacion.click();
    }
  });
}

if (btnConfirmarAsistencia) {
  btnConfirmarAsistencia.addEventListener("click", () => {
    if (new Date() > FECHA_LIMITE_RSVP) {
      rsvpForm.classList.add("hide");
      if (rsvpClosed) rsvpClosed.classList.add("show");
    }
    mostrarPaso("form");
  });
}

if (btnCambiarInvitado) {
  btnCambiarInvitado.addEventListener("click", () => {
    invitadoSeleccionado = null;
    inputNombre.value = "";
    guestStatus.classList.remove("show", "not-found");
    cerrarSugerencias();
    mostrarPaso("lookup");
  });
}

if (companionCheckbox) {
  companionCheckbox.addEventListener("change", () => {
    companionNameField.classList.toggle("show", companionCheckbox.checked);
  });
}

if (childrenCheckbox) {
  childrenCheckbox.addEventListener("change", () => {
    childrenNameField.classList.toggle("show", childrenCheckbox.checked);
  });
}

if (rsvpForm) {
  rsvpForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (new Date() > FECHA_LIMITE_RSVP) {
      rsvpForm.classList.add("hide");
      if (rsvpClosed) rsvpClosed.classList.add("show");
      return;
    }

    if (!invitadoSeleccionado) {
      mostrarPaso("lookup");
      return;
    }

    const asistenciaEl = document.querySelector('input[name="asistencia"]:checked');
    if (!asistenciaEl) {
      alert("Por favor indica si asistirás.");
      return;
    }

    const nombresAcompanantes = companionCheckbox.checked
      ? Array.from(companionNamesContainer.querySelectorAll(".companion-name-input"))
          .map((input) => input.value.trim())
          .filter((nombre) => nombre !== "")
      : [];

    const nombresNinos = childrenCheckbox.checked
      ? Array.from(childrenNamesContainer.querySelectorAll(".companion-name-input"))
          .map((input) => input.value.trim())
          .filter((nombre) => nombre !== "")
      : [];

    const registro = {
      nombre: invitadoSeleccionado.nombre,
      asistencia: asistenciaEl.value, // "si" | "no"
      llevaAcompanante: companionCheckbox.checked && nombresAcompanantes.length > 0,
      nombreAcompanante: nombresAcompanantes.join(", "),
      nombresAcompanantes: nombresAcompanantes,
      llevaNino: childrenCheckbox.checked && nombresNinos.length > 0,
      nombreNino: nombresNinos.join(", "),
      nombresNinos: nombresNinos,
      fechaConfirmacion: new Date().toISOString(),
    };

    guardarConfirmacion(registro);
    enviarAGoogleSheets(registro); // no-op hasta que se configure Apps Script (ver guests-remote.js)

    rsvpForm.classList.add("hide");
    rsvpSuccess.classList.add("show");
    document.getElementById("rsvp-success-nombre").textContent = nombreParaSaludo(registro.nombre).split(" ")[0];
    document.getElementById("rsvp-success-msg").textContent =
      registro.asistencia === "si"
        ? "¡Qué alegría! Ya quedó registrada tu confirmación."
        : "Gracias por avisarnos. ¡Te vamos a extrañar ese día!";
  });
}

// Si la persona entró por su enlace personalizado, se identifica ahora
// (después de que todas las funciones y listeners de arriba ya existen).
aplicarInvitadoDesdeEnlace();

// Si más adelante conectas Google Sheets en vivo (guests-remote.js), la
// lista real puede llegar un poco después de esta primera carga — se
// vuelve a intentar identificar al invitado cuando eso pase.
document.addEventListener("guest-list-updated", aplicarInvitadoDesdeEnlace);

/* ---------------------- Guardado local (respaldo) ---------------------- */
const LS_KEY = "rsvps_karen_daniel";

function guardarConfirmacion(registro){
  const actuales = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  const sinDuplicado = actuales.filter((r) => normalizar(r.nombre) !== normalizar(registro.nombre));
  sinDuplicado.push(registro);
  localStorage.setItem(LS_KEY, JSON.stringify(sinDuplicado));
}

/* ---------------------- Envío real a Google Sheets ----------------------
 * La URL de Apps Script se configura una sola vez, en guests-remote.js
 * (constante APPS_SCRIPT_URL), y se reutiliza aquí para escribir.
 *
 * Importante: usamos "text/plain" como Content-Type (no "application/json")
 * a propósito. Un Content-Type application/json obliga al navegador a
 * hacer una petición OPTIONS de preflight antes del POST, y Apps Script
 * no responde ese preflight — la confirmación fallaría silenciosamente.
 * Con text/plain el navegador la trata como petición "simple" (sin
 * preflight), y Apps Script igual puede leer y parsear el JSON del body.
 * ------------------------------------------------------------------------- */
function enviarAGoogleSheets(registro){
  if (typeof APPS_SCRIPT_URL === "undefined" || !APPS_SCRIPT_URL) return;

  fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(registro),
  }).catch((err) => {
    console.error("No se pudo enviar la confirmación a Google Sheets:", err);
  });
}
