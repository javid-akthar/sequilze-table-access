module.exports = (sequelize, DataTypes) => {
    const ProductTags = sequelize.define('ProductTags', {
      product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      tag_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    }
  }, {
    timestamps: false,
    tableName: 'product_tags'
  });

  return ProductTags;
};
  