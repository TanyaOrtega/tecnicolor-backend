module.exports = (sequelize, DataTypes) => {
  const Viaje = sequelize.define(
    "Viaje",
    {
      nombre: DataTypes.STRING,
      descripcion: DataTypes.TEXT,
      imagen_portada: DataTypes.STRING,
      fecha_inicio: DataTypes.DATE,
      fecha_fin: DataTypes.DATE,
      usuario_id: DataTypes.INTEGER,
    },
    {
      tableName: "viajes",
    }
  );

  Viaje.associate = function (models) {
    Viaje.belongsTo(models.Usuario, {
      foreignKey: "usuario_id",
      as: "creador",
    });

    Viaje.belongsToMany(models.Usuario, {
      through: "UsuarioViaje",
      as: "participantes",
      foreignKey: "viaje_id",
    });

    Viaje.hasMany(models.UsuarioViaje, {
      foreignKey: "viaje_id",
      as: "usuarioViaje",
    });

    Viaje.hasMany(models.Tour, {
      foreignKey: "viaje_id",
      as: "tours",
    });

    Viaje.hasMany(models.Itinerario, {
      foreignKey: "viaje_id",
      as: "itinerarios",
    });

    Viaje.hasMany(models.Calendario, {
      foreignKey: "viaje_id",
      as: "calendarios",
    });

    Viaje.hasMany(models.Recomendacion, {
      foreignKey: "viaje_id",
      as: "recomendaciones",
    });
  };

  return Viaje;
};
