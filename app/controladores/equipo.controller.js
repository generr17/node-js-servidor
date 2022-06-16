const bd = require("../modelos");
const configuracion = require("../configuracion/auth.config");
const Equipo = bd.equipo;
const Serie= bd.serie;

exports.crearEquipo = (req, res) => {
    Equipo.create({
        nombre: req.body.nombre,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        serieId: req.body.serieId
    })
    .then((equipo) => {
        res.send({message: "Usuario registrado satisfactriamente"});
        return equipo;
      })
      .catch((err) => {
        console.log(">> Error mientras se creaba el usuario: ", err);
      })
      .catch(err => {
          res.status(500).send({message: err.message});
      });
};

exports.listarSeries = (req, res) => {
    Serie.findAll()
    .then(data => {
      res.send(data); 
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error al encontrar los datos"
        });
       
    });
};

exports.listarEquipos = (req, res) => {
  Equipo.findAll()
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: 
      err.message || "Error al encontrar los datos"
    });
  });
}