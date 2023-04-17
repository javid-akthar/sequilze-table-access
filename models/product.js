module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      operator_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      validity_quantity: {
        type: DataTypes.INTEGER
      },
      validity_unit: {
        type: DataTypes.STRING(10)
      },
      destination_amount: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      destination_unit: {
        type: DataTypes.STRING(10),
        allowNull: false
      },
      destination_unit_type: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      source_amount: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      source_unit: {
        type: DataTypes.STRING(10),
        allowNull: false
      },
      source_unit_type: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      wholesale_amount: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      wholesale_fee: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      retail_amount: {
        type: DataTypes.FLOAT
      },
      retail_fee: {
        type: DataTypes.FLOAT
      },
      base_rate: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      wholesale_rate: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      retail_rate: {
        type: DataTypes.FLOAT
      },
      regions: {
        type: DataTypes.JSON
      },
      availability_zones: {
        type: DataTypes.ENUM('DOMESTIC', 'INTERNATIONAL'),
        allowNull: false
      },
      service_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      subservice_id: {
        type: DataTypes.INTEGER
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
      }
    }, {
      timestamps: false
    });
  
    Product.associate = function (models) {
      Product.belongsTo(models.Operator, {
        foreignKey: 'operator_id',
        as: 'operator'
      });
  
      Product.belongsTo(models.Service, {
        foreignKey: 'service_id',
        as: 'service'
      });
  
      Product.belongsTo(models.Subservice, {
        foreignKey: 'subservice_id',
        as: 'subservice'
      });
  
      Product.belongsToMany(models.Tags, {
        through: 'product_tags',
        as: 'tags',
        foreignKey: 'product_id'
      });
  
      Product.hasMany(models.Benefit, {
        foreignKey: 'product_id',
        as: 'benefits'
      });
  
    //   Product.hasMany(models.ProductPromotion, {
    //     foreignKey: 'product_id',
    //     as: 'promotions'
    //   });

      Product.belongsToMany(models.ProductPromotion, {
        through: 'product_promotion_relation',
        as: 'promotions',
        foreignKey: 'product_id'
      });
    };
  
    return Product;
  };
  