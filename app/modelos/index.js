const configuracion = require("../configuracion/db.config.js");
const Sequelize = require("sequelize");
const dbConfig = require("../configuracion/db.config.js");
const DataTypes = require('sequelize/lib/data-types');
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

const Equipo_videos = sequelize.define("equipo_videos",{
  visto: { type: DataTypes.INTEGER,
            defaultValue: 0   }
 });
const bd = {};
bd.Sequelize = Sequelize;
bd.sequelize = sequelize;
bd.usuario = require("../modelos/usuario.model.js")(sequelize, Sequelize);
bd.rol = require("../modelos/rol.model.js")(sequelize, Sequelize);
bd.equipo = require("../modelos/equipo.model.js")(sequelize, Sequelize);
bd.serie = require("../modelos/serie.model.js")(sequelize,Sequelize);
bd.video = require("../modelos/video.model.js")(sequelize,Sequelize);
bd.habilidad = require("../modelos/habilidad.model.js")(sequelize, Sequelize);
bd.usuario_habilidad = require("../modelos/usuario_habilidad.model.js")(sequelize, Sequelize);
bd.suscripcion = require("../modelos/suscripcion.model.js")(sequelize, Sequelize);
bd.usuario_suscripcion = require("../modelos/usuario_suscripcion.model.js")(sequelize, Sequelize);
bd.mensaje = require("../modelos/mensaje.model.js")(sequelize, Sequelize);
bd.chatRoom = require("../modelos/chat_room.model.js")(sequelize, Sequelize);
bd.equipo_videos = Equipo_videos;
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
/*
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
*/
bd.equipo.belongsToMany(bd.video, { through: Equipo_videos  });
bd.video.belongsToMany(bd.equipo, { through: Equipo_videos  });

bd.usuario.hasMany(bd.usuario_habilidad, {
  foreignKey:'usuarioId'
});

bd.usuario_habilidad.belongsTo(bd.usuario);

bd.habilidad.hasMany(bd.usuario_habilidad, {
  foreignKey:'habilidadId'
});

bd.usuario_habilidad.belongsTo(bd.habilidad);

bd.usuario.hasMany(bd.usuario_suscripcion, {
  foreignKey:'usuarioId'
});

bd.usuario_suscripcion.belongsTo(bd.usuario);

bd.suscripcion.hasMany(bd.usuario_suscripcion, {
  foreignKey: 'suscripcionId'
});
bd.usuario_suscripcion.belongsTo(bd.suscripcion);


//bd.usuario.belongsTo(bd.chatRoom);

bd.usuario.hasMany(bd.chatRoom,{
  foreignKey: 'usuarioDId'
});

bd.usuario.hasMany(bd.chatRoom,{
  foreignKey: 'usuarioUId'
});

//bd.chatRoom.belongsTo(bd.usuario);


bd.usuario.hasMany(bd.mensaje,{
  foreignKey: 'usuarioId'
});
bd.mensaje.belongsTo(bd.usuario);

bd.chatRoom.hasMany(bd.mensaje,{
  foreignKey: 'chatRoomId'
});
bd.mensaje.belongsTo(bd.chatRoom);
bd.ROLES = [1, 2, 3];

module.exports = bd;

