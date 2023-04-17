const { Sequelize } = require('sequelize');
const config = require('../config/config.json');

const sequelize = new Sequelize(config.database, config.username, config.password, config);

// const models = {
//   Service: require('./service.js')(sequelize, Sequelize.DataTypes),
//   Subservice: require('./subservice.js')(sequelize, Sequelize.DataTypes),
//   Operator: require('./operator.js')(sequelize, Sequelize.DataTypes),
//   Product: require('./product.js')(sequelize, Sequelize.DataTypes),
//   Tags: require('./tags.js')(sequelize, Sequelize.DataTypes),
//   ProductTags: require('./product_tags.js')(sequelize, Sequelize.DataTypes),
//   Benefit: require('./benefit.js')(sequelize, Sequelize.DataTypes),
//   ProductPromotion: require('./product_promotion.js')(sequelize, Sequelize.DataTypes),
// };
// const Tags = require('./tags')(sequelize, Sequelize.DataTypes);

// const models = {
//     Service: require('./service')(sequelize, Sequelize.DataTypes),
//     Subservice: require('./subservice')(sequelize, Sequelize.DataTypes),
//     Operator: require('./operator')(sequelize, Sequelize.DataTypes),
//     Product: require('./product')(sequelize, Sequelize.DataTypes),
//     // Tags: require('./tags')(sequelize, Sequelize.DataTypes),
//     Tags,
//     ProductTags: require('./product_tags')(sequelize, Sequelize.DataTypes),
//     Benefit: require('./benefit')(sequelize, Sequelize.DataTypes),
//     ProductPromotion: require('./product_promotion')(sequelize, Sequelize.DataTypes),
//   };

const models = {
    Service: require('./service')(sequelize, Sequelize.DataTypes),
    Subservice: require('./subservice')(sequelize, Sequelize.DataTypes),
    Operator: require('./operator')(sequelize, Sequelize.DataTypes),
    Product: require('./product')(sequelize, Sequelize.DataTypes),
    Tags: require('./tags')(sequelize, Sequelize.DataTypes),
    ProductTags: require('./product_tags')(sequelize, Sequelize.DataTypes),
    Benefit: require('./benefit')(sequelize, Sequelize.DataTypes),
    ProductPromotion: require('./product_promotion')(sequelize, Sequelize.DataTypes),
    ProductPromotionRelation: require('./product_promotion_relation')(sequelize, Sequelize.DataTypes),
  };
  

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
