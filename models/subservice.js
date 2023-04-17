module.exports = (sequelize, DataTypes) => {
    const Subservice = sequelize.define('Subservice', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING
      },
      service_id: {
        type: DataTypes.INTEGER
      }
    }, {
      timestamps: false
    });
  
    Subservice.associate = function (models) {
      Subservice.belongsTo(models.Service, {
        foreignKey: 'service_id',
        as: 'service'
      });
  
      Subservice.hasMany(models.Product, {
        foreignKey: 'subservice_id',
        as: 'products'
      });
    };
  
    return Subservice;
  };
  