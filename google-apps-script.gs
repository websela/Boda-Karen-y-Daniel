/**
 * ================================================================
 * BACKEND REAL PARA LA INVITACIÓN — Karen & Daniel
 * ================================================================
 * Este script hace TRES cosas conectadas a tu Google Sheet:
 *
 *  1. doGet(?accion=invitados)      -> le entrega al sitio web la
 *     (por defecto)                    lista de invitados (nombre +
 *                                       acompañantes adultos + niños
 *                                       permitidos) para que el
 *                                       formulario público funcione.
 *  2. doPost()                      -> recibe cada confirmación del
 *                                       formulario y la escribe en tu
 *                                       hoja (Confirmado, fecha,
 *                                       nombre de acompañante y de
 *                                       niño).
 *  3. doGet(?accion=confirmaciones  -> le entrega al panel privado de
 *          &clave=...)                 Karen y Daniel (confirmaciones.html)
 *                                       el estado real de TODAS las
 *                                       confirmaciones, para que se
 *                                       vea igual desde cualquier
 *                                       dispositivo. Exige la clave
 *                                       configurada abajo — sin ella
 *                                       no entrega datos.
 *
 * ---------------- CÓMO INSTALARLO (5 minutos) ------------------
 * 1. Abre tu Google Sheet de invitados.
 * 2. Ve a Extensiones → Apps Script.
 * 3. Borra el contenido de Code.gs y pega TODO este archivo.
 * 4. Revisa las constantes de configuración abajo (nombre de hoja,
 *    nombres de columnas y CLAVE_NOVIOS) y ajústalas para que
 *    coincidan EXACTO con los encabezados de tu hoja.
 * 5. Cambia CLAVE_NOVIOS por una clave propia (la misma que vas a
 *    escribir en confirmaciones.html).
 * 6. Haz clic en "Implementar" → "Nueva implementación".
 *    - Tipo: Aplicación web
 *    - Ejecutar como: Yo (tu cuenta)
 *    - Quién tiene acceso: Cualquier usuario
 * 7. Copia la URL que te entrega ("Web app URL").
 * 8. Pega esa URL en:
 *      - guests-remote.js   (constante APPS_SCRIPT_URL) → para leer invitados
 *      - script.js          (constante APPS_SCRIPT_URL) → para escribir confirmaciones
 *      - confirmaciones.html (constante APPS_SCRIPT_URL, junto a CLAVE_ACCESO) → para el panel
 * 9. ¡Listo! El sitio lee y escribe directo en tu hoja.
 *
 * IMPORTANTE sobre seguridad: este sitio se publica como archivos
 * estáticos (ej. GitHub Pages), así que no existe un "login" real de
 * servidor. La CLAVE_NOVIOS + la clave de acceso en confirmaciones.html
 * son una protección básica (evita que cualquiera que encuentre el
 * enlace vea las confirmaciones), no una seguridad a prueba de todo:
 * alguien con suficiente conocimiento técnico podría revisar el
 * código del sitio y encontrarla. No la reutilicen para nada sensible.
 * ================================================================
 */

// --------- CONFIGURACIÓN: ajusta estos nombres a tu hoja real ---------
const NOMBRE_HOJA = "Invitados";                          // pestaña de tu Sheet
const COLUMNA_NOMBRE = "Nombre";                           // nombre del invitado
const COLUMNA_ACOMPANANTES_PERMITIDOS = "Acompañantes adultos"; // cuántos acompañantes ADULTOS puede traer
const COLUMNA_NINOS_PERMITIDOS = "Niños";                  // cuántos NIÑOS puede traer
const COLUMNA_TIPO = "tipo de invitado";                   // grupo (opcional, solo informativo en el panel)
const COLUMNA_CONFIRMADO = "Confirmado (Sí/No)";           // columna donde se escribirá Sí/No
const COLUMNA_FECHA = "Fecha de confirmación";             // se crea si no existe
const COLUMNA_NOMBRE_ACOMPANANTE = "nombre del acompañante"; // se crea si no existe
const COLUMNA_NOMBRE_NINO = "nombre del niño confirmado";    // se crea si no existe

// Clave que debe mandar el panel de Karen y Daniel para poder leer las
// confirmaciones. Cámbiala por una tuya y usa la MISMA en confirmaciones.html.
const CLAVE_NOVIOS = "KarenYDaniel2026";

/* ------------------------- LECTURA (doGet) ------------------------- */
function doGet(e) {
  const accion = (e && e.parameter && e.parameter.accion) || "invitados";
  if (accion === "confirmaciones") return doGetConfirmaciones(e);
  return doGetInvitados(e);
}

// Lista pública de invitados (nombre + cupos), la usa el formulario del sitio.
function doGetInvitados(e) {
  try {
    const hoja = obtenerHoja();
    const encabezados = obtenerEncabezados(hoja);
    const colNombre = encabezados.indexOf(COLUMNA_NOMBRE);
    const colAcompanantes = encabezados.indexOf(COLUMNA_ACOMPANANTES_PERMITIDOS);
    const colNinos = encabezados.indexOf(COLUMNA_NINOS_PERMITIDOS);

    if (colNombre === -1) throw new Error("No se encontró la columna: " + COLUMNA_NOMBRE);

    const filas = hoja.getRange(2, 1, Math.max(hoja.getLastRow() - 1, 0), hoja.getLastColumn()).getValues();

    let contador = 0;
    const invitados = filas
      .filter((fila) => fila[colNombre] && fila[colNombre].toString().trim() !== "")
      .map((fila) => {
        contador++;
        return {
          id: "g" + String(contador).padStart(2, "0"),
          nombre: fila[colNombre].toString().trim(),
          acompanantesPermitidos: colAcompanantes !== -1 ? (Number(fila[colAcompanantes]) || 0) : 0,
          ninosPermitidos: colNinos !== -1 ? (Number(fila[colNinos]) || 0) : 0,
        };
      });

    return respuesta({ ok: true, invitados: invitados });
  } catch (err) {
    return respuesta({ ok: false, error: err.message });
  }
}

// Estado real de las confirmaciones, solo para el panel privado de los novios.
function doGetConfirmaciones(e) {
  try {
    const clave = e && e.parameter && e.parameter.clave;
    if (clave !== CLAVE_NOVIOS) {
      return respuesta({ ok: false, error: "Clave incorrecta." });
    }

    const hoja = obtenerHoja();
    const encabezados = obtenerEncabezados(hoja);
    const colNombre = encabezados.indexOf(COLUMNA_NOMBRE);
    const colAcompanantesPermitidos = encabezados.indexOf(COLUMNA_ACOMPANANTES_PERMITIDOS);
    const colNinosPermitidos = encabezados.indexOf(COLUMNA_NINOS_PERMITIDOS);
    const colTipo = encabezados.indexOf(COLUMNA_TIPO);
    const colConfirmado = encabezados.indexOf(COLUMNA_CONFIRMADO);
    const colFecha = encabezados.indexOf(COLUMNA_FECHA);
    const colAcompanante = encabezados.indexOf(COLUMNA_NOMBRE_ACOMPANANTE);
    const colNino = encabezados.indexOf(COLUMNA_NOMBRE_NINO);

    if (colNombre === -1) throw new Error("No se encontró la columna: " + COLUMNA_NOMBRE);

    const filas = hoja.getRange(2, 1, Math.max(hoja.getLastRow() - 1, 0), hoja.getLastColumn()).getValues();

    const val = (fila, col) => (col !== -1 ? fila[col] : "");

    const confirmaciones = filas
      .filter((fila) => fila[colNombre] && fila[colNombre].toString().trim() !== "")
      .map((fila) => {
        const confirmadoTexto = val(fila, colConfirmado).toString().trim().toLowerCase();
        let asistencia = "pendiente";
        if (confirmadoTexto === "sí" || confirmadoTexto === "si") asistencia = "si";
        else if (confirmadoTexto === "no") asistencia = "no";

        const fechaValor = val(fila, colFecha);

        return {
          nombre: fila[colNombre].toString().trim(),
          tipo: colTipo !== -1 ? val(fila, colTipo).toString().trim() : "",
          acompanantesPermitidos: colAcompanantesPermitidos !== -1 ? (Number(val(fila, colAcompanantesPermitidos)) || 0) : 0,
          ninosPermitidos: colNinosPermitidos !== -1 ? (Number(val(fila, colNinosPermitidos)) || 0) : 0,
          asistencia: asistencia,
          fechaConfirmacion: fechaValor instanceof Date ? fechaValor.toISOString() : (fechaValor ? fechaValor.toString() : ""),
          nombreAcompanante: colAcompanante !== -1 ? val(fila, colAcompanante).toString().trim() : "",
          nombreNino: colNino !== -1 ? val(fila, colNino).toString().trim() : "",
        };
      });

    return respuesta({ ok: true, confirmaciones: confirmaciones });
  } catch (err) {
    return respuesta({ ok: false, error: err.message });
  }
}

/* ------------------------- ESCRITURA (doPost) ------------------------- */
function doPost(e) {
  try {
    const datos = JSON.parse(e.postData.contents);
    const hoja = obtenerHoja();
    const encabezados = obtenerEncabezados(hoja);

    const colNombre = encabezados.indexOf(COLUMNA_NOMBRE) + 1;
    let colConfirmado = encabezados.indexOf(COLUMNA_CONFIRMADO) + 1;
    let colFecha = encabezados.indexOf(COLUMNA_FECHA) + 1;
    let colAcompanante = encabezados.indexOf(COLUMNA_NOMBRE_ACOMPANANTE) + 1;
    let colNino = encabezados.indexOf(COLUMNA_NOMBRE_NINO) + 1;

    // Si faltan columnas, las crea al final.
    if (colConfirmado === 0) { colConfirmado = hoja.getLastColumn() + 1; hoja.getRange(1, colConfirmado).setValue(COLUMNA_CONFIRMADO); }
    if (colFecha === 0) { colFecha = hoja.getLastColumn() + 1; hoja.getRange(1, colFecha).setValue(COLUMNA_FECHA); }
    if (colAcompanante === 0) { colAcompanante = hoja.getLastColumn() + 1; hoja.getRange(1, colAcompanante).setValue(COLUMNA_NOMBRE_ACOMPANANTE); }
    if (colNino === 0) { colNino = hoja.getLastColumn() + 1; hoja.getRange(1, colNino).setValue(COLUMNA_NOMBRE_NINO); }

    const valoresNombre = hoja.getRange(2, colNombre, Math.max(hoja.getLastRow() - 1, 0), 1).getValues();
    let filaEncontrada = -1;
    for (let i = 0; i < valoresNombre.length; i++) {
      if (normalizar(valoresNombre[i][0]) === normalizar(datos.nombre)) {
        filaEncontrada = i + 2; // +2: la hoja empieza en fila 2 y el arreglo es 0-indexado
        break;
      }
    }

    if (filaEncontrada === -1) {
      return respuesta({ ok: false, error: "Invitado no encontrado en la hoja." });
    }

    hoja.getRange(filaEncontrada, colConfirmado).setValue(datos.asistencia === "si" ? "Sí" : "No");
    hoja.getRange(filaEncontrada, colFecha).setValue(new Date(datos.fechaConfirmacion));
    if (datos.llevaAcompanante && datos.nombreAcompanante) {
      hoja.getRange(filaEncontrada, colAcompanante).setValue(datos.nombreAcompanante);
    }
    if (datos.llevaNino && datos.nombreNino) {
      hoja.getRange(filaEncontrada, colNino).setValue(datos.nombreNino);
    }

    return respuesta({ ok: true });
  } catch (err) {
    return respuesta({ ok: false, error: err.message });
  }
}

/* ------------------------- Utilidades ------------------------- */
function obtenerHoja() {
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NOMBRE_HOJA);
  if (!hoja) throw new Error("No se encontró la hoja: " + NOMBRE_HOJA);
  return hoja;
}

function obtenerEncabezados(hoja) {
  return hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0];
}

function normalizar(texto) {
  return texto.toString().trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function respuesta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
