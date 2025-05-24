module.exports = (sequelize, DataTypes) => {
  const UsuarioViaje = sequelize.define(
    "UsuarioViaje",
    {
      usuario_id: DataTypes.INTEGER,
      viaje_id: DataTypes.INTEGER,
    },
    {
      tableName: "usuarios_viajes",
    }
  );

  UsuarioViaje.associate = function (models) {
    UsuarioViaje.belongsTo(models.Usuario, {
      foreignKey: "usuario_id",
      as: "usuario",
    });

    UsuarioViaje.belongsTo(models.Viaje, {
      foreignKey: "viaje_id",
      as: "viaje",
    });
  };

  return UsuarioViaje;
};
