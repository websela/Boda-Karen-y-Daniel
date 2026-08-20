/**
 * ================================================================
 * LISTA DE INVITADOS — Karen & Daniel
 * ================================================================
 * Generada a partir de tu archivo invitados_final.xlsx (55 invitados).
 *
 * Campos por invitado:
 * - acompanantesPermitidos = cuántos acompañantes ADULTOS puede
 *   confirmar esta persona/familia (0, 1, 2...).
 * - acompanantesNombres = nombres de referencia de esos acompañantes
 *   adultos, tal como venían en tu Excel. Son solo referencia — el
 *   sitio NO los marca como confirmados automáticamente, cada
 *   invitado escribe el nombre real al confirmar.
 * - ninosPermitidos = cuántos NIÑOS puede confirmar esta persona/
 *   familia (0, 1, 2...). Es un campo separado de los acompañantes
 *   adultos para poder mostrar una casilla de confirmación propia
 *   para niños en el formulario.
 * - ninosNombres = nombres de referencia de esos niños, igual que
 *   acompanantesNombres: solo referencia.
 * - tipo = grupo del invitado (Familia Novio, Familia Novia, Amigos,
 *   Trabajo). Solo es informativo, se usa en el panel de Karen y
 *   Daniel — no afecta el formulario público.
 *
 * Esta lista es la que se usa MIENTRAS no conectes Google Sheets en
 * vivo (ver guests-remote.js).
 *
 * Formato: { id: "gNN", nombre: "...", acompanantesPermitidos: N,
 *            acompanantesNombres: [...], ninosPermitidos: N,
 *            ninosNombres: [...], tipo: "..." },
 * El "id" es el código del enlace personalizado: tusitio.com/?inv=gNN
 * ================================================================
 */

let GUEST_LIST = [
  { id: "g01", nombre: "Sonia Perez", acompanantesPermitidos: 1, acompanantesNombres: ["Yesid Vasquez"], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novio" },
  { id: "g02", nombre: "Victor Vaquez", acompanantesPermitidos: 1, acompanantesNombres: ["Sandra Drada"], ninosPermitidos: 1, ninosNombres: ["Sara Vasquez"], tipo: "Familia Novio" },
  { id: "g03", nombre: "Vanessa Garcia", acompanantesPermitidos: 1, acompanantesNombres: ["Yeison Solarte"], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novio" },
  { id: "g04", nombre: "Ana Maria Vasquez", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novio" },
  { id: "g05", nombre: "Lesly Perez", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novio" },
  { id: "g06", nombre: "Raul Perez", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novio" },
  { id: "g07", nombre: "Luzmila Perez", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novio" },
  { id: "g08", nombre: "Yamir Perez", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novio" },
  { id: "g09", nombre: "Santiago Ospina", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novio" },
  { id: "g10", nombre: "Juan David Ospna", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novio" },
  { id: "g11", nombre: "Fabiola Perez", acompanantesPermitidos: 1, acompanantesNombres: ["Ramon Ospina"], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novio" },
  { id: "g12", nombre: "Yesica Perez", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 1, ninosNombres: ["Abigail Perez"], tipo: "Familia Novio" },
  { id: "g13", nombre: "Eduar Perez", acompanantesPermitidos: 1, acompanantesNombres: ["Mateo Perez"], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novio" },
  { id: "g14", nombre: "Luisa Perez", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novio" },
  { id: "g15", nombre: "Osman Castro", acompanantesPermitidos: 1, acompanantesNombres: ["Emily Tejada"], ninosPermitidos: 0, ninosNombres: [], tipo: "Amigos" },
  { id: "g16", nombre: "Michelle Cortez", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Trabajo" },
  { id: "g17", nombre: "Isabela Clavijo", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Trabajo" },
  { id: "g18", nombre: "Carlos Mario Escobar", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Amigos" },
  { id: "g19", nombre: "Marcela Perez", acompanantesPermitidos: 1, acompanantesNombres: ["Julian Bedoya"], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novio" },
  { id: "g20", nombre: "Didier Garcia", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novio" },
  { id: "g21", nombre: "Diana Meneses", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Amigos" },
  { id: "g22", nombre: "Nataly Guzman", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Amigos" },
  { id: "g23", nombre: "Victoria Sanchez", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Amigos" },
  { id: "g24", nombre: "Hoover Cruz", acompanantesPermitidos: 2, acompanantesNombres: ["Felipe Cruz", "Liliana Lopez"], ninosPermitidos: 0, ninosNombres: [], tipo: "Amigos" },
  { id: "g25", nombre: "Alfonso Rosero", acompanantesPermitidos: 2, acompanantesNombres: ["Mariluz Montoya", "Samuel rosero"], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novia" },
  { id: "g26", nombre: "Jhon Wilber Rosero", acompanantesPermitidos: 1, acompanantesNombres: ["Regina Perdomo"], ninosPermitidos: 1, ninosNombres: ["Joaquin Rosero"], tipo: "Familia Novia" },
  { id: "g27", nombre: "Laddy Cardona", acompanantesPermitidos: 1, acompanantesNombres: ["Leonardo Ruiz"], ninosPermitidos: 0, ninosNombres: [], tipo: "Amigos" },
  { id: "g28", nombre: "Valeria Ortiz", acompanantesPermitidos: 1, acompanantesNombres: ["Luis Maldonado"], ninosPermitidos: 0, ninosNombres: [], tipo: "Trabajo" },
  { id: "g29", nombre: "Juan Manuel Soto", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Amigos" },
  { id: "g30", nombre: "David Trujillo", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Amigos" },
  { id: "g31", nombre: "Laura Chaleal", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Trabajo" },
  { id: "g32", nombre: "Juliana Castillo", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Trabajo" },
  { id: "g33", nombre: "Jesus Gomez", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Trabajo" },
  { id: "g34", nombre: "Rocio Ospina", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Trabajo" },
  { id: "g35", nombre: "Adiela Montoya", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novia" },
  { id: "g36", nombre: "Wilson Diaz", acompanantesPermitidos: 3, acompanantesNombres: ["Lina Escobar", "Nicolle Diaz", "Sofia Diaz"], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novia" },
  { id: "g37", nombre: "Hebrth Diaz", acompanantesPermitidos: 2, acompanantesNombres: ["Ximena Eusse", "Maria Jose Diaz"], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novia" },
  { id: "g38", nombre: "Patricia Diaz", acompanantesPermitidos: 2, acompanantesNombres: ["Jhon Savedra", "Salome Diaz"], ninosPermitidos: 1, ninosNombres: ["Dominic Savedra"], tipo: "Familia Novia" },
  { id: "g39", nombre: "Alba Montoya", acompanantesPermitidos: 1, acompanantesNombres: ["Maicol Duque"], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novia" },
  { id: "g40", nombre: "Ancizar Montoya", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novia" },
  { id: "g41", nombre: "Armando Rosero", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novia" },
  { id: "g42", nombre: "Yenni Rosero", acompanantesPermitidos: 2, acompanantesNombres: ["Alvaro Erazo Mora", "Alvaro Erazo Rosero"], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novia" },
  { id: "g43", nombre: "Judith Perdomo", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novia" },
  { id: "g44", nombre: "Familia Portilla Rosero", acompanantesPermitidos: 1, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novia" },
  { id: "g45", nombre: "Gabriel Rosero", acompanantesPermitidos: 1, acompanantesNombres: ["Esposa o Hijo"], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novia" },
  { id: "g46", nombre: "Cristian Portilla", acompanantesPermitidos: 1, acompanantesNombres: ["Marisol Jimenes"], ninosPermitidos: 1, ninosNombres: ["Mariana Portilla"], tipo: "Familia Novia" },
  { id: "g47", nombre: "Ruby Rosero", acompanantesPermitidos: 1, acompanantesNombres: ["Hija"], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novia" },
  { id: "g48", nombre: "Susana Rosero", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novia" },
  { id: "g49", nombre: "Ana Silva Marin", acompanantesPermitidos: 1, acompanantesNombres: ["Andres Montoya"], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novia" },
  { id: "g50", nombre: "Ximena Rosero", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novia" },
  { id: "g51", nombre: "Omar Rosero", acompanantesPermitidos: 1, acompanantesNombres: ["Enriqueta Madroñero"], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novia" },
  { id: "g52", nombre: "Vanessa Rosero", acompanantesPermitidos: 1, acompanantesNombres: ["Esposo o Hija"], ninosPermitidos: 0, ninosNombres: [], tipo: "Familia Novia" },
  { id: "g53", nombre: "Valentina Salazar", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Amigos" },
  { id: "g54", nombre: "Luis Rengifo", acompanantesPermitidos: 0, acompanantesNombres: [], ninosPermitidos: 0, ninosNombres: [], tipo: "Amigos" },
  { id: "g55", nombre: "Karolay Montoya Marin", acompanantesPermitidos: 1, acompanantesNombres: ["Andres Felipe Espitia"], ninosPermitidos: 1, ninosNombres: ["Isabella Espitia Montoya"], tipo: "Familia Novia" },
];

// Normaliza texto para comparar sin tildes / mayúsculas al buscar.
function normalizar(texto){
  return texto
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
