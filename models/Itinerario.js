module.exports = (sequelize, DataTypes) => {
  const Itinerario = sequelize.define('Itinerario', {
    dia: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    titulo: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
    viaje_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'itinerarios'
  });

  Itinerario.associate = function(models) {
    Itinerario.belongsTo(models.Viaje, {
      foreignKey: 'viaje_id',
      as: 'viaje'
    });
  };

  return Itinerario;
};
