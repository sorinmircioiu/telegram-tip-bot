var Sequelize = require('sequelize'),
  _ = require('underscore'),
  config = require('./../config');

var sequelize = new Sequelize(config.mysql.connection_string, {
  logging: config.mysql.logging,
  maxConcurrentQueries: config.mysql.max_concurent_queries,
  pool: config.mysql.pool,
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    dialectOptions: {
      collate: 'utf8_general_ci'
    },
    timestamps: true
  }
});

module.exports.tip = require('./tip')(sequelize);
module.exports.transaction = require('./transaction')(sequelize);
module.exports.log = require('./log')(sequelize);
module.exports.user = require('./user')(sequelize);
module.exports.sequelize = sequelize;
