module.exports = (sequelize, DataTypes) => {
  const Frase = sequelize.define('Frase', {
    idioma: {
      type: DataTypes.STRING,
      allowNull: false
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: true
    },
    original: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    traduccion: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'frases',
    timestamps: false
  });

  Frase.associate = function(models) {
  
  };

  return Frase;
};
