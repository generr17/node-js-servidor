module.exports = (sequelize, Sequelize) => {
    const Rol = sequelize.define("roles", {
    
      nombre: {
        type: Sequelize.STRING
      }
    });
    return Rol;
  };