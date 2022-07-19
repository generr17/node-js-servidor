module.exports = (sequelize, Sequelize) => {
    const Suscripcion = sequelize.define("suscripcion", {
    
      nombre: {
        type: Sequelize.STRING,
      },
      descripcion: {
        type: Sequelize.STRING,
      },
      nota: {
        type: Sequelize.STRING,
      },
      precio: {
        type: Sequelize.FLOAT,
      },
    });
    return Suscripcion;
  };