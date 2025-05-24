module.exports = (sequelize, DataTypes) => {
  const Recomendacion = sequelize.define(
    "Recomendacion",
    {
      titulo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imagen: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      descripcion: DataTypes.TEXT,
      viaje_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "recomendaciones",
    }
  );

  Recomendacion.associate = function (models) {
    Recomendacion.belongsTo(models.Viaje, {
      foreignKey: "viaje_id",
      as: "viaje",
    });
  };

  return Recomendacion;
};
