console.log("Iniciando sincronización de la base de datos...");

const sequelize = require("./database");
const {
  Usuario,
  Viaje,
  Itinerario,
  Calendario,
  Recomendacion,
  Tour,
} = require("../models");
const bcrypt = require("bcryptjs");

async function sincronizar() {
  try {
    await sequelize.sync({ force: true });
    console.log("Base de datos sincronizada");

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await Usuario.create({
      nombre: "Administrador",
      email: "admin@tecnicolor.com",
      password: hashedPassword,
      rol: "admin",
    });

    console.log("Usuario administrador creado con éxito");
    process.exit();
  } catch (error) {
    console.error("Error al sincronizar la base de datos:", error);
    process.exit(1);
  }
}

sincronizar();
