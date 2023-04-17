module.exports = (sequelize, DataTypes) => {
    const Operator = sequelize.define('Operator', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      country_iso_code: {
        type: DataTypes.CHAR(3),
        allowNull: false
      },
      country_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      country_regions: {
        type: DataTypes.JSON
      },
      regions: {
        type: DataTypes.JSON
      }
    }, {
      timestamps: false
    });
  
    Operator.associate = function (models) {
      Operator.hasMany(models.Product, {
        foreignKey: 'operator_id',
        as: 'products'
      });
    };
  
    return Operator;
  };
  