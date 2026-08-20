/**
 * ================================================================
 * CONEXIÓN CON GOOGLE SHEETS — LISTA DE INVITADOS EN VIVO
 * ================================================================
 * Este archivo reemplaza GUEST_LIST (definida en guests-data.js)
 * con los datos reales de tu Google Sheet, leyendo desde el mismo
 * Apps Script que ya recibe las confirmaciones.
 *
 * CONFIGURACIÓN:
 * 1. Despliega google-apps-script.gs en tu Sheet (ver instrucciones
 *    dentro de ese archivo — ya incluye doGet además de doPost).
 * 2. Pega la misma URL del despliegue aquí abajo, en APPS_SCRIPT_URL.
 * 3. ¡Listo! Cada vez que alguien abre el sitio, se descarga la
 *    lista de invitados actualizada directamente de tu hoja.
 *
 * Mientras APPS_SCRIPT_URL esté vacío, o si la conexión falla, el
 * sitio sigue funcionando con la lista de respaldo de guests-data.js.
 * ================================================================
 */

const APPS_SCRIPT_URL = ""; // <-- pega aquí tu URL de Apps Script (Web App URL)

async function actualizarListaInvitados(){
  if (!APPS_SCRIPT_URL) return;

  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?accion=invitados`);
    const datos = await res.json();

    if (datos && datos.ok && Array.isArray(datos.invitados) && datos.invitados.length > 0) {
      GUEST_LIST.length = 0;
      datos.invitados.forEach((g) => GUEST_LIST.push(g));
      document.dispatchEvent(new CustomEvent("guest-list-updated"));
    }
  } catch (err) {
    console.warn("No se pudo cargar la lista de invitados desde Google Sheets, usando respaldo local:", err);
  }
}

actualizarListaInvitados();
