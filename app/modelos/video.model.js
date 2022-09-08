module.exports = (sequelize, Sequelize) => {
    const Video = sequelize.define("videos", {
     
     url : {
        type: Sequelize.STRING
      },
     imagen: {
      type: Sequelize.STRING
     },
     titulo: {
      type: Sequelize.STRING
     },
     descripcion: {
      type: Sequelize.STRING
     },
     visto: {
      type: Sequelize.INTEGER
     }
    });
    return Video;
  };
  