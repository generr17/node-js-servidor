module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define("usuarios", {
     
      nombreusuario: {
        type: Sequelize.STRING
      },
      apellidousuario: {
         type: Sequelize.STRING
      },
      telefono: {
        type: Sequelize.STRING
      },
      fechanacimiento: {
        type: Sequelize.DATE
      },
      genero: {
        type:Sequelize.STRING
      },
      direccion: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      clave: {
        type: Sequelize.STRING
      },
    });
    return Usuario;
  };
  