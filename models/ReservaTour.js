module.exports = (sequelize, DataTypes) => {
  const ReservaTour = sequelize.define(
    "ReservaTour",
    {
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tour_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cantidad_personas: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      estado: {
        type: DataTypes.STRING,
        defaultValue: "pendiente",
      },
    },
    {
      tableName: "reservas_tour",
    }
  );

  ReservaTour.associate = function (models) {
    ReservaTour.belongsTo(models.Usuario, {
      foreignKey: "usuario_id",
      as: "usuario",
    });

    ReservaTour.belongsTo(models.Tour, {
      foreignKey: "tour_id",
      as: "tour",
    });
  };

  return ReservaTour;
};
