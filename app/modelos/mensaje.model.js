module.exports = (sequelize, Sequelize) => {
    const Mensaje = sequelize.define("mensaje", {
      chatRoomId: {
        type: Sequelize.INTEGER
      },
      usuarioId: {
        type: Sequelize.INTEGER
      },
      texto: {
        type: Sequelize.STRING
      },
      leido: {
        type: Sequelize.INTEGER
      },
    });
    return Mensaje;
  };