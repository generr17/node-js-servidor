  module.exports = (sequelize, Sequelize) => {
    const UsuarioHabilidad = sequelize.define("usuario_habilidad", {
    
      usuarioId: {
        type: Sequelize.INTEGER,
      },
      habilidadId: {
        type: Sequelize.INTEGER,
      },
    });
    return UsuarioHabilidad;
  };