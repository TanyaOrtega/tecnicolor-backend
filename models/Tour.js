module.exports = (sequelize, DataTypes) => {
  const Tour = sequelize.define(
    "Tour",
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imagen: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      descripcion: DataTypes.TEXT,
      lugar: DataTypes.STRING,
      precio: DataTypes.FLOAT,
      fecha: DataTypes.DATE,
      viaje_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "tours",
    }
  );

  Tour.associate = function (models) {
    Tour.belongsTo(models.Viaje, {
      foreignKey: "viaje_id",
      as: "viaje",
    });

    Tour.hasMany(models.ReservaTour, {
      foreignKey: "tour_id",
      as: "reservas",
    });
  };

  return Tour;
};
