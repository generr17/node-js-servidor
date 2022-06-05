const configuracion = require("../configuracion/db.config.js");
const Sequelize = require("sequelize");
const dbConfig = require("../configuracion/db.config.js");
const sequelize = new Sequelize(
  configuracion.DB,
  configuracion.USER,
  configuracion.PASSWORD,
  {
    host: configuracion.HOST,
    dialect: configuracion.dialect,
    operatorsAliases: false,
    pool: {
      max: configuracion.pool.max,
      min: configuracion.pool.min,
      acquire: configuracion.pool.acquire,
      idle: configuracion.pool.idle
    }
  }
);

const bd = {};
bd.Sequelize = Sequelize;
bd.sequelize = sequelize;
bd.usuario = require("../modelos/usuario.model.js")(sequelize, Sequelize);
bd.rol = require("../modelos/rol.model.js")(sequelize, Sequelize);
bd.equipo = require("../modelos/equipo.model.js")(sequelize, Sequelize);
bd.serie = require("../modelos/serie.model.js")(sequelize,Sequelize);
bd.video = require("../modelos/video.model.js")(sequelize,Sequelize);
bd.rol.hasMany(bd.usuario, {
  foreignKey: 'roleId'
});
bd.usuario.belongsTo(bd.rol);

bd.serie.hasMany(bd.equipo, {
  foreignKey: 'serieId'
});
bd.equipo.belongsTo(bd.serie);

bd.equipo.hasMany(bd.usuario, {
  foreignKey: 'equipoId'
});
bd.usuario.belongsTo(bd.equipo);

bd.usuario.hasMany(bd.video, {
  foreignKey:'usuarioId'
});

bd.video.belongsTo(bd.usuario);

bd.equipo.belongsToMany(bd.video, {
  through: "equipo_videos",
  foreignKey: "equipoId",
  otherKey: "videoId"
});
bd.video.belongsToMany(bd.equipo, {
  through: "equipo_videos",
  foreignKey: "videoId",
  otherKey: "equipoId"
});
bd.ROLES = [1, 2, 3];
module.exports = bd;
