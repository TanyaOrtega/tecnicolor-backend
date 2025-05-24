const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");
const upload = require("../middleware/multerConfig");
const {
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
} = require("../controllers/viajesController");

router.use(authMiddleware);

router.get("/", getViajesPorUsuario);
router.get("/:id", getDetallesViaje);
router.get("/:id/itinerario", getItinerario);
router.get("/:id/recomendaciones", getRecomendaciones);
router.get("/:id/tours", getTours);
router.post("/tours/:id/reservar", reservarTour);
router.post(
  "/crear",
  isAdmin("admin"),
  upload.single("imagen_portada"),
  crearViaje
);
router.post("/asignar", isAdmin("admin"), asignarViajeAUsuario);
router.post("/calendarios", isAdmin("admin"), crearCalendario);
router.put(
  "/:id",
  isAdmin("admin"),
  upload.single("imagen_portada"),
  editarViaje
);

module.exports = router;
