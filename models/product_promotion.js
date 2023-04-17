module.exports = (sequelize, DataTypes) => {
    const ProductPromotion = sequelize.define('ProductPromotion', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      terms: {
        type: DataTypes.TEXT
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      timestamps: false,
      tableName: 'product_promotion'
    });
  
    ProductPromotion.associate = function (models) {
      ProductPromotion.belongsToMany(models.Product, {
        through: 'product_promotion_relation',
        as: 'products',
        foreignKey: 'promotion_id'
      });
    };
  
    return ProductPromotion;
  };
  