  module.exports = (sequelize, Sequelize) => {
    const Equipo = sequelize.define("equipos", {
      nombre: {
        type: Sequelize.STRING
      },
      direccion: {
        type: Sequelize.STRING
      },
      telefono: {
        type: Sequelize.STRING
      }
    });
    return Equipo;
  };