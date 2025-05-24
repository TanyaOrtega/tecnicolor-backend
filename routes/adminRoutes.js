const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");
const upload = require("../middleware/multerConfig");

const {
  Viaje,
  Itinerario,
  Calendario,
  Recomendacion,
  Tour,
} = require("../models");

// Autenticación y permisos
router.use(authMiddleware);
router.use(isAdmin("admin"));

// USUARIOS
router.post("/usuarios", adminController.crearUsuario);
router.get("/usuarios", adminController.getUsuarios);
router.get("/usuarios/:id", adminController.getUsuarioPorId);
router.put("/usuarios/:id", adminController.editarUsuario);
router.delete("/usuarios/:id", adminController.eliminarUsuario);

//  VIAJES
router.post(
  "/viajes",
  upload.single("imagen_portada"),
  adminController.crearViaje
);
router.get("/viajes", adminController.getViajes);
router.put(
  "/viajes/:id",
  upload.single("imagen_portada"),
  adminController.editarViaje
);
router.delete("/viajes/:id", adminController.eliminarViaje);
router.post("/viajes/:viajeId/asignar", adminController.asignarUsuarioAViaje);

//  TOURS
router.post(
  "/viajes/:viajeId/tours",
  upload.single("imagen"),
  adminController.crearTour
);
router.get("/tours", adminController.getTours);
router.put("/tours/:id", upload.single("imagen"), adminController.updateTour);
router.delete("/tours/:id", adminController.deleteTour);

//  ITINERARIOS
router.post("/viajes/:viajeId/itinerarios", adminController.crearItinerario);
router.get("/itinerarios", adminController.getItinerarios);
router.put("/itinerarios/:id", adminController.editarItinerario);
router.delete("/itinerarios/:id", adminController.eliminarItinerario);

// CALENDARIO
router.get("/calendarios", adminController.getCalendarios);
router.post("/calendario", adminController.crearEventoCalendario);
router.put("/calendarios/:id", adminController.editarEventoCalendario);
router.delete("/calendarios/:id", adminController.eliminarEventoCalendario);

// RECOMENDACIONES
router.get("/recomendaciones", adminController.getRecomendaciones);
router.post(
  "/recomendaciones",
  upload.single("imagen"),
  adminController.crearRecomendacion
);
router.put(
  "/recomendaciones/:id",
  upload.single("imagen"),
  adminController.editarRecomendacion
);
router.delete("/recomendaciones/:id", adminController.eliminarRecomendacion);

module.exports = router;
