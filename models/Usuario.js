module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define(
    "Usuario",
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rol: DataTypes.STRING,
    },
    {
      tableName: "usuarios",
    }
  );

  Usuario.associate = function (models) {
    Usuario.hasMany(models.Viaje, {
      foreignKey: "usuario_id",
      as: "viajesCreados",
    });

    Usuario.belongsToMany(models.Viaje, {
      through: "UsuarioViaje",
      as: "viajesParticipados",
      foreignKey: "usuario_id",
    });

    Usuario.hasMany(models.UsuarioViaje, {
      foreignKey: "usuario_id",
      as: "usuarioViaje",
    });

    Usuario.hasMany(models.ReservaTour, {
      foreignKey: "usuario_id",
      as: "reservasTour",
    });
  };

  return Usuario;
};
