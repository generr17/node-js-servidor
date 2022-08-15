module.exports = (sequelize, Sequelize) => {
    const ChatRoom = sequelize.define("chat_room", {
      usuarioUId: {
        type: Sequelize.INTEGER
      },
      usuarioDId: {
        type: Sequelize.INTEGER
      },
    });
    return ChatRoom;
  };