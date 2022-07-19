module.exports = (sequelize, Sequelize) => {
    const UsuarioSuscripcion = sequelize.define("usuario_suscripcion", {
    
      usuarioId: {
        type: Sequelize.INTEGER,
      },
      suscripcionId: {
        type: Sequelize.INTEGER,
      },
      fechaInicio: {
        type: Sequelize.DATE,
      },
      fechaFin: {
        type: Sequelize.DATE,
      },
    });
    return UsuarioSuscripcion;
  };