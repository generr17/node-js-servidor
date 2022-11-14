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
const { NUMBER } = require("sequelize/lib/data-types");

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

exports.actualizarEstado= (req, res) => {
  const id = req.params.id;

      console.log("Actualizar estado: ");
      Usuario.update(
          {
              activo : 1
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
                        FROM usuario_habilidads uh JOIN usuarios u
                        ON uh.usuarioId = u.id
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
          if(num > 0) {
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

exports.actualizarEstadoUsuario = (req, res) => {
  var date = new Date();
  var local_fecha = date.toLocaleDateString();
  const fecha = local_fecha.split('/');
  var mes = fecha[1] -1;
  const fechaActual = fecha[2] +'-'+ fecha[1] + '-' + fecha[0];
  const fechaInicial = fecha[2]+'-'+ mes +'-' + '01';
  console.log(mes);
sequelize.query(`UPDATE usuarios u SET u.activo = 0 
                WHERE (SELECT count(*)
                                    FROM videos v
                                    WHERE CAST(createdAt AS DATE) BETWEEN ` + fechaInicial + ` AND ` + fechaActual +
                                  ` AND v.usuarioId = u.id) < 1
                AND u.roleId = 3` , {
      type: Sequelize.QueryTypes.UPDATE,
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
     
      console.log("Error al obtener las habilidades del usuario", err.message);
      });
}

exports.actualizarEstadoSuscrito = (req, res) => {
  var date = new Date();
  var local_fecha = date.toLocaleDateString();
  const fecha = local_fecha.split('/');
  const fechaActual = fecha[2] +'-'+ fecha[1] + '-' + fecha[0];
  sequelize.query(`UPDATE usuarios u SET u.suscrito = 0
                  WHERE u.id = ( SELECT s.usuarioId
                              FROM usuario_suscripcions s
                              WHERE CAST(fechaFin As DATE) = '` 
                              + fechaActual  + `' 
                              AND s.usuarioId = u.id ) 
                              AND u.roleId = 2`
                           , {
      type: Sequelize.QueryTypes.UPDATE,
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
     
      console.log("Error al actualizar el estado del usuario", err.message);
      });
}


