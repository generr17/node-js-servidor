const bd = require("../modelos");
const UsuarioSuscripcion = bd.usuario_suscripcion;


  exports.guardar = (req, res) => {
  
    UsuarioSuscripcion.create({
        usuarioId: req.body.usuarioId,
        suscripcionId: req.body.suscripcionId,
        fechaInicio: req.body.fechaInicio,
        fechaFin: req.body.fechaFin
    })
    .then((usuario_suscripcion) => {
        res.send({message: "Suscripcion guardada satisfactriamente"});
        return usuario_suscripcion;
      })
      .catch((err) => {
        console.log(">> Error mientras se guardaba la suscripcion: ", err);
      })
      .catch(err => {
          res.status(500).send({message: err.message});
      });
};



