const bcrypt = require('bcryptjs');
const sequelize = require('./config/database');
const { Usuario, Viaje, UsuarioViaje, Itinerario, Calendario, Recomendacion, Tour, Frase } = require('./models');

const runSeed = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Base de datos sincronizada');

    // Crear usuarios
    const adminPassword = await bcrypt.hash('admin123', 10);
    const viajeroPassword = await bcrypt.hash('viajero123', 10);

    const admin = await Usuario.create({
      nombre: 'Admin',
      email: 'admin@demo.com',
      password: adminPassword,
      rol: 'admin'
    });

    const viajero = await Usuario.create({
      nombre: 'Tanya',
      email: 'viajero@demo.com',
      password: viajeroPassword,
      rol: 'viajero'
    });

    // Crear viajes
    const viaje1 = await Viaje.create({
      nombre: 'Aventura en Europa',
      descripcion: 'Explora las ciudades más icónicas del continente europeo. Desde París hasta Roma, pasando por Praga y Budapest.',
      imagen_portada: '/imagenes/eurotrip1.png',
      fecha_inicio: new Date('2025-06-05'),
      fecha_fin: new Date('2025-06-20'),
      usuario_id: admin.id
    });

    const viaje2 = await Viaje.create({
      nombre: 'Descubriendo Italia, Croacia y las Islas Griegas',
      descripcion: 'Navega por el mar Egeo y disfruta de las playas, cultura y comida de Italia, Grecia y Croacia.',
      imagen_portada: '/imagenes/grecia-croacia.png',
      fecha_inicio: new Date('2025-06-25'),
      fecha_fin: new Date('2025-07-09'),
      usuario_id: admin.id
    });

    // Relacionar viajero al viaje2
    await UsuarioViaje.create({
      usuario_id: viajero.id,
      viaje_id: viaje2.id
    });
// Itinerarios 

    const itinerariosViaje1 = Array.from({ length: 16 }, (_, i) => ({
      dia: i + 1,
      titulo: `Día ${i + 1} - ${[
        'Llegada a París y bienvenida',
        'Tour por París',
        'Dia libre en París',
        'Viaje a Bruselas',
        'Paseo a Brujas ',
        'Amsterdam y sus encantos ',
        'Día libre en Amsterdam',
        'Llegada a Budapest ',
        'Recorrido por Pest ',
        'Llegada a Viena ',
        'Palacios y elegancia en Viena ',
        'Llegada a Praga ',
        'Recorrido por el Castillo de Praga ',
        'La histórica Roma ',
        'Día libre en Roma ',
        'El Vaticano y fin del Tour ',
      ][i]}`,
      descripcion: [
        'Recepción en el aeropuerto y traslado al hotel. Tarde libre para pasear por los Campos Elíseos.',
        'Visita guiada por la Torre Eiffel, el Louvre y paseo en barco por el Sena.',
        'Disfruta de las actividades que Paris tiene par aofrecerte, este dia puedes ir a Disney Paris o Versailles',
        'Traslado en tren a Bruselas. Tarde para explorar el centro histórico y probar chocolates belgas.',
        'Nos vamos en tren al pueblo mágico de Brujas, a disfrutar de paseos por los canales y casitas de galleta.',
        'Salida de Bruselas a Amsterdam, llegada y paseo por el centro histórico de la ciudad.',
        'Día libre en Amsterdam, aprovecha para pasear por los canales, sus museos o ir a los pueblos cercanos a ver tulipanes y molinos.',
        'Volamos a Budapest y nos preparamos para conocer el área del castillo de Buda, donde tenemos vistas del maravilloso Parlamento.',
        'Pasaremos el día descubriendo el lado de Pest, el Parlamento, los puentes y mercados tradicionales, prepararnos par ade noche salir de fiesta.',
        'Tomamos el tren para irnos a la maravillosa ciudad de Viena, paseo nocturno guiado por el centro de la ciudad.',
        'Día libre para pasear por sus majestuosos museos, palacios y hasta un concierto en la Opera Estatal de Viena.',
        'Nos vamos en autobus a la bellísima Praga, llegada y tour guiado por el centro histórico.',
        'Recorrido por el castillo de Praga, la majestuosa catedral y tarde libre para disfrutar de su belleza.',
        'Volamos a la maravillosa Roma, paseamos por la noche en el barrio de Trastévere para tener una deliciosa cena.',
        'Día libre, disfruta entre el Coliseo, foro Romano y todas las maravillas que Roma te ofrece.',
        'Vamos a conocer el Vaticano por la mañana, paseo por la ciudad y fin de nuestro Tour.'
      ][i],
      viaje_id: viaje1.id
    }));

    const itinerariosViaje2 = Array.from({ length: 15 }, (_, i) => ({
      dia: i + 1,
      titulo: `Día ${i + 1} - ${[
        'Llegada a Atenas',
        'Recorrido arqueológico',
        'Ferry a Mykonos',
        'Día libre en Mykonos',
        'Ferry a Santorini',
        'Paseo por la caldera de Oía',
        'Vuelo a Dubrovnik',
        'Recorrido por la ciudad amurallada',
        'Autobús a Trogir',
        'Paseo por Trogir y Split',
        'Vuelo a Bari',
        'Recorrido a los pueblos pesqueros',
        'Tren a Roma',
        'Visita al Vaticano',
        'Paseo por sitios arqueológicos y despedida',
      ][i]}`,
      descripcion: [
        'Llegada al hotel y primera caminata por el barrio de Plaka con cena típica griega.',
        'Visita a la Acrópolis, el Partenón y el Museo Arqueológico Nacional.',
        'Traslado al puerto y viaje en ferry hacia Mykonos. Llegada y paseo por el casco antiguo.',
        'Aprovecha este día para perderte en las calles blancas del pueblo, ir a un beach club o tomar un tour de islas alrededor',
        'Traslado al puerto y viaje en ferry hacia Santorino. Llegada y paseo por el casco antiguo.',
        'Paseo por el área más famosa de la ciudad, entre tiendas, casitas blancas y restaurantes, disfruta del día y toma muchas fotos.',
        'Vuelo a la ciudad de Dubrovnik, noche libre para descansar o ir a alguno de los clubs de la ciudad.',
        'Tendremos un recorrido por el casco histórico de la ciudad amurallada, aprovecha el día de playa.',
        'Traslado en autobús al pueblo de Trogir. Llegada y paseo por el casco antiguo.',
        'Paseamos por al encantadora ciudad y nos vamos al centro histórico de Split.',
        'Nos trasladamos al aeropuerto y volamos a la hermosa Bari en Italia.',
        'Aprovechamos el día para irnos a los pueblos Polignano a Mare y Monopoli y disfrutar de sus playas turquesas.',
        'Tomamos el tren a Roma y llegando nos vamos de paseo por el centro histórico.',
        'Visitamos la maravillosa ciudad del Vaticano y paseamos por sus calles e iglesias.',
        'Recrremos el Coliseo y el Foro Romano, terminamos nuestro viaje'
      ][i],
      viaje_id: viaje2.id
    }));

await Itinerario.bulkCreate([...itinerariosViaje1, ...itinerariosViaje2]);

    // Calendario de actividades
    await Calendario.bulkCreate([
      // Viaje 1: Aventura en Europa
      { viaje_id: viaje1.id, fecha: '2025-06-05', actividad: 'Llegada a París y cena de bienvenida' },
      { viaje_id: viaje1.id, fecha: '2025-06-06', actividad: 'Tour guiado por París y paseo en barco por el Sena' },
      { viaje_id: viaje1.id, fecha: '2025-06-07', actividad: 'Día libre en París' },
      { viaje_id: viaje1.id, fecha: '2025-06-08', actividad: 'Traslado a Bruselas y Tour por la ciudad' },
      { viaje_id: viaje1.id, fecha: '2025-06-09', actividad: 'Visita a los canales de Brujas' },
      { viaje_id: viaje1.id, fecha: '2025-06-10', actividad: 'Ida a Amsterdam y paseo por la ciudad ' },
      { viaje_id: viaje1.id, fecha: '2025-06-11', actividad: 'Día libre en Amsterdam' },
      { viaje_id: viaje1.id, fecha: '2025-06-12', actividad: 'Vuelo a Budapest' },
      { viaje_id: viaje1.id, fecha: '2025-06-13', actividad: 'Paseo por el centro histórico de Budapest' },
      { viaje_id: viaje1.id, fecha: '2025-06-14', actividad: 'Traslado a Viena y Tour nocturno con concierto opcional' },
      { viaje_id: viaje1.id, fecha: '2025-06-15', actividad: 'Día libre en Viena' },
      { viaje_id: viaje1.id, fecha: '2025-06-16', actividad: 'Traslado a Praga y recorrido por el centro histórico' },
      { viaje_id: viaje1.id, fecha: '2025-06-17', actividad: 'Paseo por el Castillo de Praga' },
      { viaje_id: viaje1.id, fecha: '2025-06-18', actividad: 'Vuelo a Roma y paseo nocturno' },
      { viaje_id: viaje1.id, fecha: '2025-06-19', actividad: 'Día libre en Roma' },
      { viaje_id: viaje1.id, fecha: '2025-06-20', actividad: 'Visita al Vaticano y cena de despedida' },
    
      // Viaje 2: Italia, Croacia y las Islas Griegas
      { viaje_id: viaje2.id, fecha: '2025-06-25', actividad: 'Llegada a Atenas y cena típica en Plaka' },
      { viaje_id: viaje2.id, fecha: '2025-06-26', actividad: 'Visita guiada a la Acrópolis' },
      { viaje_id: viaje2.id, fecha: '2025-06-27', actividad: 'Traslado en Ferry a Mykonos' },
      { viaje_id: viaje2.id, fecha: '2025-06-28', actividad: 'Día libre en Mykonos' },
      { viaje_id: viaje2.id, fecha: '2025-06-29', actividad: 'Traslado en Ferry a Santorini y tarde libre' },
      { viaje_id: viaje2.id, fecha: '2025-06-30', actividad: 'Paseo pro el centro y Atardecer en Oía, Santorini' },
      { viaje_id: viaje2.id, fecha: '2025-07-01', actividad: 'Vuelo a Dubrovnik y noche libre'},
      { viaje_id: viaje2.id, fecha: '2025-07-02', actividad: 'Paseo por el centro histórico de Dubrovnik y paseo por la playa'},
      { viaje_id: viaje2.id, fecha: '2025-07-03', actividad: 'Traslado a Trogir'},
      { viaje_id: viaje2.id, fecha: '2025-07-04', actividad: 'Paseo por Trogir y Split'},
      { viaje_id: viaje2.id, fecha: '2025-07-05', actividad: 'Vuelo a Bari'},
      { viaje_id: viaje2.id, fecha: '2025-07-06', actividad: 'Excursión por Polignano a Mare y Monopoli' },
      { viaje_id: viaje2.id, fecha: '2025-07-07', actividad: 'Tren a Roma y pase por centro Histórico'},
      { viaje_id: viaje2.id, fecha: '2025-07-08', actividad: 'Visita a El Vaticano'},
      { viaje_id: viaje2.id, fecha: '2025-07-09', actividad: 'Tour por el Coliseo y despedida en Roma' }
    ]);


    // Recomendaciones
const recomendacionesViaje1 = [
  {
    viaje_id: viaje1.id,
    titulo: 'Empaca ligero y con estilo',
    imagen: '/imagenes/europa1.png',
    descripcion: 'Lleva ropa cómoda, pero también considera algo elegante para las cenas en ciudades como París o Viena.'
  },
  {
    viaje_id: viaje1.id,
    titulo: 'Aprende lo básico de los idiomas',
    imagen: '/imagenes/europa2.jpg',
    descripcion: 'Un "bonjour", "danke" o "grazie" puede abrir muchas puertas y mejorar tu experiencia local.'
  },
  {
    viaje_id: viaje1.id,
    titulo: 'Reserva con anticipación',
    imagen: '/imagenes/europa3.jpg',
    descripcion: 'Museos como el Louvre o la Sagrada Familia requieren entradas con semanas de anticipación.'
  },
  {
    viaje_id: viaje1.id,
    titulo: 'Usa transporte público',
    imagen: '/imagenes/europa4.jpg',
    descripcion: 'En ciudades como Ámsterdam o Praga, el metro y los tranvías son rápidos y eficientes.'
  },
  {
    viaje_id: viaje1.id,
    titulo: 'Cuidado con los horarios de comidas',
    imagen: '/imagenes/europa5.jpg',
    descripcion: 'En algunos países europeos las cocinas cierran temprano. Planifica tus comidas con tiempo.'
  },
  {
    viaje_id: viaje1.id,
    titulo: 'Lleva adaptador de corriente',
    imagen: '/imagenes/europa6.jpg',
    descripcion: 'Los enchufes europeos son distintos. Asegúrate de llevar adaptadores para cargar tus dispositivos.'
  }
];

const recomendacionesViaje2 = [
  {
    viaje_id: viaje2.id,
    titulo: 'Protégete del sol',
    imagen: '/imagenes/grecia1.jpg',
    descripcion: 'El sol del Mediterráneo puede ser muy fuerte. Lleva bloqueador solar y gorra.'
  },
  {
    viaje_id: viaje2.id,
    titulo: 'Explora fuera de los puntos turísticos',
    imagen: '/imagenes/grecia2.jpg',
    descripcion: 'Pequeños pueblos en islas griegas o en la costa dálmata ofrecen experiencias más auténticas.'
  },
  {
    viaje_id: viaje2.id,
    titulo: 'Usa calzado cómodo',
    imagen: '/imagenes/grecia3.jpg',
    descripcion: 'Las calles empedradas de lugares como Dubrovnik o Atenas pueden ser cansadas sin buen calzado.'
  },
  {
    viaje_id: viaje2.id,
    titulo: 'Disfruta la comida local',
    imagen: '/imagenes/grecia4.jpg',
    descripcion: 'Prueba desde un gyro griego hasta mariscos frescos en Croacia. ¡No te arrepentirás!'
  },
  {
    viaje_id: viaje2.id,
    titulo: 'Cuidado con los ferris',
    imagen: '/imagenes/grecia5.jpg',
    descripcion: 'En temporada alta, los ferris se llenan. Llega temprano y confirma siempre tu horario.'
  },
  {
    viaje_id: viaje2.id,
    titulo: 'Lleva cámara o espacio en el celular',
    imagen: '/imagenes/grecia6.jpg',
    descripcion: 'Los paisajes en Santorini, Mykonos o Split son espectaculares. Vas a querer muchas fotos.'
  }
];

await Recomendacion.bulkCreate([...recomendacionesViaje1, ...recomendacionesViaje2]);


    await Tour.bulkCreate([
      // Tours viaje1
      {
        viaje_id: viaje1.id,
        nombre: 'Tour en París',
        descripcion: 'Un recorrido por los principales monumentos parisinos.',
        precio: 120,
        imagen: '/imagenes/tour_paris.jpg'
      },
      {
        viaje_id: viaje1.id,
        nombre: 'Excursión a los Alpes',
        descripcion: 'Día completo de aventura en la naturaleza suiza.',
        precio: 150,
        imagen: '/imagenes/tour_alpes.jpg'
      },
      // Tours viaje2
      {
        viaje_id: viaje2.id,
        nombre: 'Crucero en Santorini',
        descripcion: 'Recorrido en barco por las islas cercanas.',
        precio: 95,
        imagen: '/imagenes/tour_santorini.jpg'
      },
      {
        viaje_id: viaje2.id,
        nombre: 'Tour arqueológico en Atenas',
        descripcion: 'Explora los tesoros históricos de la ciudad.',
        precio: 80,
        imagen: '/imagenes/tour_atenas.jpg'
      }
    ]);

    const frases = [
      // Inglés
      { idioma: 'en', categoria: 'Saludos', original: 'Hello', traduccion: 'Hola' },
      { idioma: 'en', categoria: 'Saludos', original: 'Good morning', traduccion: 'Buenos días' },
      { idioma: 'en', categoria: 'Transporte', original: 'Where is the bus stop?', traduccion: '¿Dónde está la parada de autobús?' },
      { idioma: 'en', categoria: 'Emergencia', original: 'I need a doctor', traduccion: 'Necesito un médico' },

      // Francés
      { idioma: 'fr', categoria: 'Saludos', original: 'Bonjour', traduccion: 'Buenos días / Hola' },
      { idioma: 'fr', categoria: 'Restaurante', original: 'La carte, s’il vous plaît', traduccion: 'El menú, por favor' },
      { idioma: 'fr', categoria: 'Emergencia', original: 'Appelez une ambulance', traduccion: 'Llame a una ambulancia' },

      // Italiano
      { idioma: 'it', categoria: 'Saludos', original: 'Buongiorno', traduccion: 'Buenos días' },
      { idioma: 'it', categoria: 'Restaurante', original: 'Il conto, per favore', traduccion: 'La cuenta, por favor' },
      { idioma: 'it', categoria: 'Transporte', original: 'Dove è la stazione?', traduccion: '¿Dónde está la estación?' }
    ];

    // Validación y log para detectar problemas
    const created = await Frase.bulkCreate(frases, { validate: true });
    console.log(`Frases creadas: ${created.length}`);



    console.log('Seed ejecutado correctamente');
    process.exit();
  } catch (error) {
    console.error('Error en el seed:', error);
    process.exit(1);
  };

};

runSeed();

