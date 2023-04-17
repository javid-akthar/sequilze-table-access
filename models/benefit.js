module.exports = (sequelize, DataTypes) => {
    const Benefit = sequelize.define('Benefit', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      type: {
        type: DataTypes.ENUM('TALKTIME', 'DATA', 'SMS', 'PAYMENT', 'CREDITS'),
        allowNull: false
      },
      unit_type: {
        type: DataTypes.ENUM('TIME', 'DATA', 'QUANTITY', 'CURRENCY'),
        allowNull: false
      },
      unit: {
        type: DataTypes.STRING(10),
        allowNull: false
      },
      amount_base: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      promotion_bonus: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      total_excluding_tax: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      total_including_tax: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      additional_information: {
        type: DataTypes.TEXT
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      timestamps: false
    });
  
    Benefit.associate = function (models) {
      Benefit.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
    };
  
    return Benefit;
  };
  