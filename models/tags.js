module.exports = (sequelize, DataTypes) => {
    const Tags = sequelize.define('Tags', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false
      }
    }, {
      timestamps: false
    });
  
    Tags.associate = function (models) {
      Tags.belongsToMany(models.Product, {
        through: 'product_tags',
        as: 'products',
        foreignKey: 'tag_id'
      });
    };
  
    return Tags;
  };
  