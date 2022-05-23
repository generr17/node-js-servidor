module.exports = (sequelize, Sequelize) => {
    const Serie = sequelize.define("serie", {
      nombre: {
        type: Sequelize.STRING
      }
    });
    return Serie;
  };