module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define('Service', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      timestamps: false
    });
  
    Service.associate = function (models) {
      Service.hasMany(models.Product, {
        foreignKey: 'service_id',
        as: 'products'
      });
  
      Service.hasMany(models.Subservice, {
        foreignKey: 'service_id',
        as: 'subservices'
      });
    };
  
    return Service;
  };
  