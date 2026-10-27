// Información de la tienda mientras existe la base de datos real.
// Estos valores son de ejemplo y se cambian aquí, no dentro de las pantallas.
export const STORE = Object.freeze({
  nombre: 'Forno & Farina',
  lema: 'Pizzería Napolitana Auténtica',
  telefono: '+52 55 4821 7390',
  telefonoVisible: '55 4821 7390',
  correo: 'hola@fornoyfarina.mx',
  direccion: 'Av. Álvaro Obregón 168',
  colonia: 'Roma Norte',
  ciudad: 'Ciudad de México',
  codigoPostal: '06700',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Forno+%26+Farina+Av.+Alvaro+Obregon+168+Roma+Norte+CDMX',
  tiempoEspera: '25–35 min',
  pedidoMinimo: 0,
  redes: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
  },
})

export const STORE_HOURS = Object.freeze([
  { dia: 'Lunes a jueves', horas: '13:00 – 22:00', abierto: true },
  { dia: 'Viernes y sábado', horas: '13:00 – 23:30', abierto: true },
  { dia: 'Domingo', horas: '13:00 – 21:00', abierto: true },
])

export const PICKUP_LABEL = 'Recoger en Av. Álvaro Obregón 168'
