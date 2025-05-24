const {
  Viaje,
  Itinerario,
  Recomendacion,
  Tour,
  Calendario,
  Usuario,
  UsuarioViaje,
  ReservaTour,
} = require("../models");

// Obtener todos los viajes del usuario autenticado
const getViajesPorUsuario = async (req, res) => {
  try {
    const { id, rol } = req.usuario;

    if (rol === "admin") {
      const viajes = await Viaje.findAll();
      return res.json(viajes);
    }

    const usuarioConViajes = await Usuario.findByPk(id, {
      include: {
        model: Viaje,
        as: "viajesParticipados",
        through: { attributes: [] },
      },
    });

    if (!usuarioConViajes || !usuarioConViajes.viajesParticipados?.length) {
      return res
        .status(404)
        .json({ mensaje: "No se encontraron viajes para este usuario" });
    }

    res.json(usuarioConViajes.viajesParticipados);
  } catch (error) {
    console.error("Error al obtener viajes por usuario:", error);
    res.status(500).json({ error: "Error al obtener viajes" });
  }
};

// Obtener detalles de un viaje
const getDetallesViaje = async (req, res) => {
  try {
    const viajeId = req.params.id;
    const { id: usuarioId, rol } = req.usuario;

    if (rol !== "admin") {
      const pertenece = await UsuarioViaje.findOne({
        where: { usuario_id: usuarioId, viaje_id: viajeId },
      });

      if (!pertenece) {
        return res.status(403).json({ error: "No tienes acceso a este viaje" });
      }
    }

    const viaje = await Viaje.findByPk(viajeId, {
      include: [
        { model: Itinerario, as: "itinerarios" },
        { model: Calendario, as: "calendarios" },
        { model: Recomendacion, as: "recomendaciones" },
        { model: Tour, as: "tours" },
      ],
    });

    if (!viaje) {
      return res.status(404).json({ error: "Viaje no encontrado" });
    }

    res.json({ viaje });
  } catch (error) {
    console.error("Error al obtener detalles:", error);
    res.status(500).json({ error: "Error al obtener detalles del viaje" });
  }
};

// Obtener itinerario
const getItinerario = async (req, res) => {
  try {
    const viajeId = req.params.id;
    const { id: usuarioId, rol } = req.usuario;

    if (rol !== "admin") {
      const pertenece = await UsuarioViaje.findOne({
        where: { usuario_id: usuarioId, viaje_id: viajeId },
      });

      if (!pertenece) {
        return res
          .status(403)
          .json({ error: "No autorizado para ver este itinerario" });
      }
    }

    const itinerario = await Itinerario.findAll({
      where: { viaje_id: viajeId },
      order: [["dia", "ASC"]],
    });

    res.json({ itinerario });
  } catch (error) {
    console.error("Error al obtener itinerario:", error);
    res.status(500).json({ error: "Error al obtener itinerario" });
  }
};

// Obtener recomendaciones
const getRecomendaciones = async (req, res) => {
  try {
    const viajeId = req.params.id;
    const { id: usuarioId, rol } = req.usuario;

    if (rol !== "admin") {
      const pertenece = await UsuarioViaje.findOne({
        where: { usuario_id: usuarioId, viaje_id: viajeId },
      });

      if (!pertenece) {
        return res
          .status(403)
          .json({ error: "No autorizado para ver recomendaciones" });
      }
    }

    const recomendaciones = await Recomendacion.findAll({
      where: { viaje_id: viajeId },
    });
    res.json({ recomendaciones });
  } catch (error) {
    console.error("Error al obtener recomendaciones:", error);
    res.status(500).json({ error: "Error al obtener recomendaciones" });
  }
};

// Obtener tours
const getTours = async (req, res) => {
  try {
    const viajeId = req.params.id;
    const { id: usuarioId, rol } = req.usuario;

    if (rol !== "admin") {
      const pertenece = await UsuarioViaje.findOne({
        where: { usuario_id: usuarioId, viaje_id: viajeId },
      });

      if (!pertenece) {
        return res.status(403).json({ error: "No autorizado para ver tours" });
      }
    }

    const tours = await Tour.findAll({ where: { viaje_id: viajeId } });
    res.json({ tours });
  } catch (error) {
    console.error("Error al obtener tours:", error);
    res.status(500).json({ error: "Error al obtener tours" });
  }
};

// Reservar tour
const reservarTour = async (req, res) => {
  try {
    const tourId = req.params.id;
    const { id: usuarioId, rol } = req.usuario;

    const tour = await Tour.findByPk(tourId);
    if (!tour) {
      return res.status(404).json({ error: "Tour no encontrado" });
    }

    if (rol !== "admin") {
      const pertenece = await UsuarioViaje.findOne({
        where: { usuario_id: usuarioId, viaje_id: tour.viaje_id },
      });

      if (!pertenece) {
        return res
          .status(403)
          .json({ error: "No tienes permiso para reservar este tour" });
      }
    }

    const yaReservado = await ReservaTour.findOne({
      where: { usuario_id: usuarioId, tour_id: tourId },
    });

    if (yaReservado) {
      return res.status(400).json({ error: "Ya reservaste este tour" });
    }

    await ReservaTour.create({ usuario_id: usuarioId, tour_id: tourId });
    res.json({ mensaje: "Tour reservado exitosamente" });
  } catch (error) {
    console.error("Error al reservar tour:", error);
    res.status(500).json({ error: "Error al reservar tour" });
  }
};

// Crear nuevo viaje con imagen (solo admin)
const crearViaje = async (req, res) => {
  try {
    const { nombre, descripcion, fecha_inicio, fecha_fin } = req.body;

    if (!nombre || !descripcion || !fecha_inicio || !fecha_fin) {
      return res
        .status(400)
        .json({ error: "Todos los campos obligatorios deben ser completados" });
    }

    if (req.usuario.rol !== "admin") {
      return res
        .status(403)
        .json({ mensaje: "Solo el administrador puede crear viajes" });
    }

    const imagen_portada = req.file ? `/imagenes/${req.file.filename}` : "";

    const nuevoViaje = await Viaje.create({
      nombre,
      descripcion,
      imagen_portada,
      fecha_inicio,
      fecha_fin,
      usuario_id: req.usuario.id,
    });

    console.log("req.file:", req.file);
    console.log("req.body:", req.body);

    res
      .status(201)
      .json({ mensaje: "Viaje creado exitosamente", viaje: nuevoViaje });
  } catch (error) {
    console.error("Error al crear el viaje:", error);
    res.status(500).json({ error: "Error al crear el viaje" });
  }
};

const editarViaje = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, fecha_inicio, fecha_fin } = req.body;
  const imagen_portada = req.file ? `/imagenes/${req.file.filename}` : null;

  try {
    const viaje = await Viaje.findByPk(id);
    if (!viaje) {
      return res.status(404).json({ error: "Viaje no encontrado" });
    }

    if (nombre) viaje.nombre = nombre;
    if (descripcion) viaje.descripcion = descripcion;
    if (fecha_inicio) viaje.fecha_inicio = fecha_inicio;
    if (fecha_fin) viaje.fecha_fin = fecha_fin;
    if (imagen_portada) viaje.imagen_portada = imagen_portada;

    await viaje.save();

    res.status(200).json({ mensaje: "Viaje actualizado exitosamente", viaje });
  } catch (error) {
    console.error("Error al editar el viaje:", error);
    res.status(500).json({ error: "Error al editar el viaje" });
  }
};

// Asignar usuario a viaje
const asignarViajeAUsuario = async (req, res) => {
  try {
    const { viajeId, usuarioId } = req.body;

    if (req.usuario.rol !== "admin") {
      return res
        .status(403)
        .json({ mensaje: "Solo el administrador puede asignar viajes" });
    }

    const yaExiste = await UsuarioViaje.findOne({
      where: { viaje_id: viajeId, usuario_id: usuarioId },
    });

    if (yaExiste) {
      return res
        .status(400)
        .json({ mensaje: "Este usuario ya tiene asignado este viaje" });
    }

    await UsuarioViaje.create({ viaje_id: viajeId, usuario_id: usuarioId });
    res
      .status(200)
      .json({ mensaje: "Viaje asignado correctamente al usuario" });
  } catch (error) {
    console.error("Error al asignar viaje:", error);
    res.status(500).json({ error: "Error al asignar viaje al usuario" });
  }
};

// Crear calendario
const crearCalendario = async (req, res) => {
  try {
    const viajeId = req.params.id;

    if (req.usuario.rol !== "admin") {
      return res
        .status(403)
        .json({ error: "Solo el administrador puede crear el calendario" });
    }

    const dias = req.body;

    if (!Array.isArray(dias) || dias.length === 0) {
      return res
        .status(400)
        .json({ error: "Debes enviar un arreglo con los días del calendario" });
    }

    const calendarioConViajeId = dias.map((d) => ({ ...d, viaje_id: viajeId }));
    await Itinerario.bulkCreate(calendarioConViajeId);

    res.status(201).json({ mensaje: "Calendario creado exitosamente" });
  } catch (error) {
    console.error("Error al crear calendario:", error);
    res.status(500).json({ error: "Error al crear el calendario" });
  }
};

module.exports = {
  getViajesPorUsuario,
  getDetallesViaje,
  getItinerario,
  getRecomendaciones,
  getTours,
  reservarTour,
  crearViaje,
  asignarViajeAUsuario,
  crearCalendario,
  editarViaje,
};
