const bd = require("../modelos");
const Rol = bd.Rol;
const Usuario = bd.usuario;
const Op = bd.Sequelize.Op;
const Habilidad = bd.habilidad;
const UsuarioHabilidad = bd.usuario_habilidad;
var bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");
const configurac = require("../configuracion/db.config.js");
const { habilidad } = require("../modelos");



const sequelize = new Sequelize(
    configurac.DB,
    configurac.USER,
    configurac.PASSWORD,
    {
      host: configurac.HOST,
      dialect: configurac.dialect,
      operatorsAliases: false,
      pool: {
        max: configurac.pool.max,
        min: configurac.pool.min,
        acquire: configurac.pool.acquire,
        idle: configurac.pool.idle
      }
    }
  );


exports.actualizar= (req, res) => {
    const id = req.params.id;
    if(!req.body.clave){
        console.log("Actualizar sin clave, clave : " + req.body.clave);
        Usuario.update(
            {
                nombreusuario:  req.body.nombreusuario,
                apellidousuario: req.body.apellidousuario,
                telefono: req.body.telefono,
                direccion: req.body.direccion
               
            },
            {where: { id:id}}
        )
        .then((num) => {
            if(num == 1) {
                res.send({
                    message: "Usuario actualizado correctamente",
                });
            }else {
                res.send({
                    message: "No se puede actualizar el usuario",
                });
            }
           })
            .catch((err) => {
            console.log(">> Error mientras se actualizaba el usuario: ", err);
            res.status(500).send({message: err.message});
        });
    }else{
        console.log("Actualizar con clave: " + req.body.clave);
        Usuario.update(
            {
                nombreusuario:  req.body.nombreusuario,
                apellidousuario: req.body.apellidousuario,
                telefono: req.body.telefono,
                direccion: req.body.direccion,
               clave: bcrypt.hashSync(req.body.clave, 8)
            },
            {where: { id:id}}
        )
        .then((num) => {
            if(num == 1) {
                res.send({
                    message: "Usuario actualizado correctamente",
                });
            }else {
                res.send({
                    message: "No se puede actualizar el usuario",
                });
            }
           })
            .catch((err) => {
            console.log(">> Error mientras se actualizaba el usuario: ", err);
            res.status(500).send({message: err.message});
        });
    }
   
}

exports.obtenerUsuario= (req, res)=> {
    const id = req.params.id;
   Usuario.findByPk(id)
   .then((user) => {
    if(user){
        res.send(user);
    }else{
        res.status(404).send({
            message: "No se puede encontrar el usuario"
        });
    }
   })
   .catch((err) => {
    res.status(500).send({
        message: "Error al recuperar el usuario" + err.message
    });
   });
};

exports.usuarioAdministrador = (req, res) => {
    res.status(200).send("Contenido Administrador");
};
exports.usuarioComun = (req, res) => {
    res.status(200).send("Contenido de usuario");
};

exports.usuarioDirectivo = (req, res) => {
    res.status(200).send("Contenido directivo");
};

exports.obtenerUsuarioPorId = (req, res) => {
    const id = req.params.id;
    Usuario.findByPk(id)
      .then((usuario) => {
        if (usuario) {
          res.send(usuario);
        } else {
          res.status(404).send({
            message:" No se puede encontrar el usuario",
          });
          return;
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error al recuperar el producto con la id: " + id,
        });
      });
  };

exports.listarHabilidades = (req, res) => {
    Habilidad.findAll()
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

exports.listarHabilidadesPorUsuario = (req, res) => {
    const idUsuario = req.params.id;
    sequelize.query(`SELECT  h.nombre
                        FROM usuario_habilidad uh JOIN usuarios u
                        ON uh.usuarioId= u.id
                        JOIN habilidads h 
                        ON  h.id = uh.habilidadId
                        AND u.id = 
              ` + idUsuario, {
        type: Sequelize.QueryTypes.SELECT,
      })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Error al obtener las habilidades del usuario",
        });
      });
  };

  exports.contarHabilidades = (req, res) => {
    const idUsuario = req.params.id;
    sequelize.query(`SELECT  COUNT(h.nombre) as total
                        FROM usuario_habilidads uh JOIN usuarios u
                        ON uh.usuarioId= u.id
                        JOIN habilidads h 
                        ON  h.id = uh.habilidadId
                        AND u.id =
              ` + idUsuario, {
        type: Sequelize.QueryTypes.SELECT,
      })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Error al contar las habilidades del usuario",
        });
      });
  };


exports.guardar =(req, res) => {
  console.log(req.body.habilidades);
 
  var data = [];
  let i=0;
  req.body.habilidades.forEach(element => {
    data[i] = {
      'usuarioId': req.body.usuarioId,
      'habilidadId': element
    }
    i++;
  });
  UsuarioHabilidad.bulkCreate(data, {individualHooks: true}).then((usuariohabilidad) => {
    res.send({message: "Habilidades registradas satisfactriamente"});
  })
  .catch((err) => {
    console.log(">> Error mientras se guardaban las habilidades: ", err);
  });
}

exports.actualizarEstadoSuscripcion= (req, res) => {
  const id = req.params.id;
  if(!req.body.clave){
  
      Usuario.update(
          {
              suscrito: req.body.suscrito
          },
          {where: { id:id}}
      )
      .then((num) => {
          if(num == 1) {
              res.send({
                  message: "Usuario actualizado correctamente",
              });
          }else {
              res.send({
                  message: "No se puede actualizar el usuario",
              });
          }
         })
          .catch((err) => {
          console.log(">> Error mientras se actualizaba el usuario: ", err);
          res.status(500).send({message: err.message});
      });
  }
 
}
