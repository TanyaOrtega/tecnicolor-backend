const bcrypt = require("bcryptjs");
const {
  Usuario,
  Viaje,
  Tour,
  Itinerario,
  Calendario,
  ReservaTour,
  Recomendacion,
} = require("../models");

module.exports = {
  //  USUARIOS
  async crearUsuario(req, res) {
    try {
      const { nombre, email, password, rol } = req.body;

      if (!nombre || !email || !password || !rol) {
        return res
          .status(400)
          .json({ mensaje: "Todos los campos son obligatorios" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const nuevoUsuario = await Usuario.create({
        nombre,
        email,
        password: hashedPassword,
        rol,
      });
      res
        .status(201)
        .json({
          mensaje: "Usuario creado exitosamente",
          usuario: nuevoUsuario,
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al crear usuario", error });
    }
  },

  async getUsuarios(req, res) {
    try {
      const usuarios = await Usuario.findAll();
      res.json(usuarios);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener usuarios." });
    }
  },

  async getUsuarioPorId(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.params.id);
      if (!usuario)
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      res.json(usuario);
    } catch (error) {
      console.error("Error al obtener usuario por ID:", error);
      res.status(500).json({ mensaje: "Error del servidor" });
    }
  },

  async editarUsuario(req, res) {
    const { id } = req.params;
    const { nombre, email, rol } = req.body;
    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario)
        return res.status(404).json({ error: "Usuario no encontrado" });

      usuario.nombre = nombre || usuario.nombre;
      usuario.email = email || usuario.email;
      usuario.rol = rol || usuario.rol;

      await usuario.save();
      res.json({ mensaje: "Usuario actualizado correctamente", usuario });
    } catch (error) {
      res.status(500).json({ error: "Error del servidor" });
    }
  },

  async eliminarUsuario(req, res) {
    const { id } = req.params;
    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario)
        return res.status(404).json({ error: "Usuario no encontrado" });

      await usuario.destroy();
      res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error del servidor" });
    }
  },

  // VIAJES
  async getViajes(req, res) {
    try {
      const viajes = await Viaje.findAll();
      res.json(viajes);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener viajes." });
    }
  },

  async crearViaje(req, res) {
    try {
      const { nombre, descripcion, fecha_inicio, fecha_fin } = req.body;
      const imagen_portada = req.file ? `/imagenes/${req.file.filename}` : "";

      const nuevoViaje = await Viaje.create({
        nombre,
        descripcion,
        fecha_inicio,
        fecha_fin,
        imagen_portada,
      });

      res.status(201).json(nuevoViaje);
    } catch (error) {
      res.status(500).json({ error: "Error al crear viaje." });
    }
  },

  async editarViaje(req, res) {
    const { id } = req.params;
    const { nombre, descripcion, fecha_inicio, fecha_fin } = req.body;
    const imagen_portada = req.file
      ? `/imagenes/${req.file.filename}`
      : undefined;

    try {
      const viaje = await Viaje.findByPk(id);
      if (!viaje) return res.status(404).json({ error: "Viaje no encontrado" });

      await viaje.update({
        nombre: nombre ?? viaje.nombre,
        descripcion: descripcion ?? viaje.descripcion,
        fecha_inicio: fecha_inicio ?? viaje.fecha_inicio,
        fecha_fin: fecha_fin ?? viaje.fecha_fin,
        imagen_portada: imagen_portada ?? viaje.imagen_portada,
      });

      res.json(viaje);
    } catch (error) {
      res.status(500).json({ error: "Error al editar viaje." });
    }
  },

  async eliminarViaje(req, res) {
    try {
      const viaje = await Viaje.findByPk(req.params.id);
      if (!viaje) return res.status(404).json({ error: "Viaje no encontrado" });

      await viaje.destroy();
      res.json({ message: "Viaje eliminado" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar viaje." });
    }
  },

  async asignarUsuarioAViaje(req, res) {
    const { viajeId } = req.params;
    const { usuarioId } = req.body;
    try {
      const viaje = await Viaje.findByPk(viajeId);
      const usuario = await Usuario.findByPk(usuarioId);
      if (!viaje || !usuario)
        return res
          .status(404)
          .json({ error: "Viaje o usuario no encontrado." });

      await viaje.addParticipante(usuario);
      res.json({ mensaje: "Usuario asignado al viaje correctamente." });
    } catch (err) {
      res.status(500).json({ error: "Error al asignar usuario." });
    }
  },

  //  TOURS
  async crearTour(req, res) {
    const { viajeId } = req.params;
    const { nombre, descripcion, fecha, lugar, precio } = req.body;

    try {
      const viaje = await Viaje.findByPk(viajeId);
      if (!viaje)
        return res.status(404).json({ error: "Viaje no encontrado." });

      const imagen = req.file ? `/imagenes/${req.file.filename}` : null;

      const nuevoTour = await Tour.create({
        nombre,
        descripcion,
        lugar,
        fecha,
        precio,
        imagen,
        viaje_id: viajeId,
      });
      res.status(201).json(nuevoTour);
    } catch (err) {
      res.status(500).json({ error: "Error al crear tour." });
    }
  },

  async getTours(req, res) {
    try {
      const tours = await Tour.findAll({ include: ["viaje"] });
      res.json(tours);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener tours." });
    }
  },

  async updateTour(req, res) {
    const { id } = req.params;
    const data = req.body;

    try {
      const tour = await Tour.findByPk(id);
      if (!tour) return res.status(404).json({ error: "Tour no encontrado" });

      if (req.file) {
        data.imagen = `/imagenes/${req.file.filename}`;
      }

      await tour.update(data);
      res.json(tour);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar tour." });
    }
  },

  async deleteTour(req, res) {
    const { id } = req.params;
    try {
      const tour = await Tour.findByPk(id);
      if (!tour) return res.status(404).json({ error: "Tour no encontrado" });

      await tour.destroy();
      res.json({ mensaje: "Tour eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar tour." });
    }
  },

  //ITINERARIOS
  async crearItinerario(req, res) {
    try {
      const { viajeId } = req.params;
      const { dia, titulo, descripcion } = req.body;

      if (!dia || !descripcion) {
        return res
          .status(400)
          .json({ error: "Faltan datos obligatorios: día y descripción." });
      }

      const viaje = await Viaje.findByPk(viajeId);
      if (!viaje)
        return res.status(404).json({ error: "Viaje no encontrado." });

      const nuevo = await Itinerario.create({
        viaje_id: viajeId,
        dia,
        titulo,
        descripcion,
      });
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(500).json({ error: "Error al crear itinerario" });
    }
  },

  async getItinerarios(req, res) {
    try {
      const itinerarios = await Itinerario.findAll();
      res.json(itinerarios);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener itinerarios" });
    }
  },

  async editarItinerario(req, res) {
    const { id } = req.params;
    const { dia, titulo, descripcion, viaje_id } = req.body;

    try {
      const itinerario = await Itinerario.findByPk(id);
      if (!itinerario)
        return res.status(404).json({ error: "Itinerario no encontrado" });

      await itinerario.update({ dia, titulo, descripcion, viaje_id });
      res.json(itinerario);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar itinerario" });
    }
  },

  async eliminarItinerario(req, res) {
    const { id } = req.params;
    try {
      const itinerario = await Itinerario.findByPk(id);
      if (!itinerario)
        return res.status(404).json({ error: "Itinerario no encontrado" });

      await itinerario.destroy();
      res.json({ mensaje: "Itinerario eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar itinerario." });
    }
  },

  // CALENDARIO
  async getCalendarios(req, res) {
    const datos = await Calendario.findAll();
    res.json(datos);
  },

  async crearEventoCalendario(req, res) {
    try {
      const { viaje_id, fecha, actividad } = req.body;

      if (!viaje_id || !fecha || !actividad) {
        return res.status(400).json({ error: "Faltan campos requeridos" });
      }

      const evento = await Calendario.create({ viaje_id, fecha, actividad });
      res.status(201).json(evento);
    } catch (error) {
      res.status(500).json({ error: "Error del servidor" });
    }
  },

  async editarEventoCalendario(req, res) {
    const { id } = req.params;
    const { fecha, actividad, viaje_id } = req.body;

    try {
      const calendario = await Calendario.findByPk(id);
      if (!calendario)
        return res.status(404).json({ error: "Evento no encontrado" });

      calendario.fecha = fecha;
      calendario.actividad = actividad;
      calendario.viaje_id = viaje_id;

      await calendario.save();
      res.json({ message: "Evento actualizado correctamente", calendario });
    } catch (error) {
      res.status(500).json({ error: "Error del servidor" });
    }
  },

  async eliminarEventoCalendario(req, res) {
    const { id } = req.params;

    try {
      const calendario = await Calendario.findByPk(id);
      if (!calendario)
        return res.status(404).json({ error: "Evento no encontrado" });

      await calendario.destroy();
      res.json({ message: "Evento eliminado exitosamente" });
    } catch (error) {
      res.status(500).json({ error: "Error del servidor" });
    }
  },

  //RECOMENDACIONES
  async getRecomendaciones(req, res) {
    const datos = await Recomendacion.findAll();
    res.json(datos);
  },

  async crearRecomendacion(req, res) {
    const { titulo, descripcion, viaje_id } = req.body;
    const imagen = req.file ? `/imagenes/${req.file.originalname}` : "";

    if (!titulo || !viaje_id) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    try {
      const recomendacion = await Recomendacion.create({
        titulo,
        descripcion,
        imagen,
        viaje_id,
      });
      res.status(201).json(recomendacion);
    } catch (error) {
      res.status(500).json({ error: "Error del servidor" });
    }
  },

  async editarRecomendacion(req, res) {
    const { id } = req.params;
    const { titulo, descripcion, viaje_id } = req.body;
    const imagen = req.file ? `/imagenes/${req.file.originalname}` : undefined;

    try {
      const recomendacion = await Recomendacion.findByPk(id);
      if (!recomendacion)
        return res.status(404).json({ error: "Recomendación no encontrada" });

      if (titulo) recomendacion.titulo = titulo;
      if (descripcion) recomendacion.descripcion = descripcion;
      if (viaje_id) recomendacion.viaje_id = viaje_id;
      if (imagen) recomendacion.imagen = imagen;

      await recomendacion.save();
      res.json(recomendacion);
    } catch (error) {
      res.status(500).json({ error: "Error del servidor" });
    }
  },

  async eliminarRecomendacion(req, res) {
    const { id } = req.params;
    try {
      const recomendacion = await Recomendacion.findByPk(id);
      if (!recomendacion)
        return res.status(404).json({ error: "Recomendación no encontrada" });

      await recomendacion.destroy();
      res.json({ message: "Recomendación eliminada exitosamente" });
    } catch (error) {
      res.status(500).json({ error: "Error del servidor" });
    }
  },
};
