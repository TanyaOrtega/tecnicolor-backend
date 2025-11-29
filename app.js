require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const { sequelize } = require("./models");
const path = require("path");

// Importación de rutas
const authRoutes = require("./routes/auth.routes"); // login y registro
const viajesRoutes = require("./routes/viajesRoutes"); // rutas de viajes
const adminRoutes = require("./routes/adminRoutes"); // rutas de admin
const phrasesRoutes = require('./routes/phrasesRoutes');
const pagosRoutes = require("./routes/pagosRoutes");




app.use(cors());
app.use(express.json());
app.use(
  "/imagenes",
  express.static(path.join(__dirname, "public", "imagenes"))
);

// Rutas
app.use("/api/auth", authRoutes); // POST /api/auth/register, /login
app.use("/api/viajes", viajesRoutes); // rutas protegidas por JWT
app.use("/api/admin", adminRoutes); // solo accesibles por admin
app.use('/api/frases', phrasesRoutes);
app.use('/api/admin/frases', phrasesRoutes);
app.use("/api/pagos", pagosRoutes);
app.use("/api/reservas", require("./routes/reservasRoutes"));
app.use(express.static("public"));






// Base de datos y servidor
const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false }).then(() => {
  console.log("Base de datos conectada");
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
