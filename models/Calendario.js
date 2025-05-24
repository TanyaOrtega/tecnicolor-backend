module.exports = (sequelize, DataTypes) => {
  const Calendario = sequelize.define('Calendario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    viaje_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Viajes',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    actividad: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'calendarios',
    timestamps: false
  });

  Calendario.associate = function(models) {
    Calendario.belongsTo(models.Viaje, {
      foreignKey: 'viaje_id',
      as: 'viaje'
    });
  };

  return Calendario;
};

