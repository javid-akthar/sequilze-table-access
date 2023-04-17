module.exports = (sequelize, DataTypes) => {
    const ProductPromotionRelation = sequelize.define('ProductPromotionRelation', {
      product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'Product',
          key: 'id'
        }
      },
      promotion_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'ProductPromotion',
          key: 'id'
        }
      }
    }, {
      timestamps: false,
      tableName: 'product_promotion_relation'
    });
  
    return ProductPromotionRelation;
  };
  