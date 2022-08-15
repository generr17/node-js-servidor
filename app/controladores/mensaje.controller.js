const bd = require("../modelos");
const Mensaje = bd.mensaje;
const ChatRoom = bd.chatRoom;
const Sequelize = require("sequelize");
const configurac = require("../configuracion/db.config.js");
const { Op } = require("sequelize");
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


exports.listarMensajes = (req, res) => {
        const idChat = req.params.id;
        Mensaje.findAll(
          {where: { chatRoomId: idChat}}
        )
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

exports.listarChatRooms = (req, res) => {
  const idUsuario = req.params.id;
  sequelize.query(`SELECT c.id, c.usuarioUId, u.nombreusuario nombreusuarioU, u.apellidousuario apellidoUsuarioU, c.usuarioDId, ud.nombreusuario nombreusuarioD, ud.apellidousuario apellidousuarioD,
                    (SELECT texto FROM mensajes where id = (SELECT MAX(id) FROM mensajes WHERE chatRoomId = c.id)) mensaje, 
                    (SELECT usuarioId FROM mensajes where id = (SELECT MAX(id) FROM mensajes WHERE chatRoomId = c.id)) emisor,
                    (SELECT leido FROM mensajes where id = (SELECT MAX(id) FROM mensajes WHERE chatRoomId = c.id)) estado
                    FROM chat_rooms c JOIN usuarios u
                    ON c.usuarioUId = u.id
                    JOIN usuarios ud
                    ON ud.id = c.usuarioDId
                    WHERE c.usuarioUId = `+ idUsuario +
                    ` OR c.usuarioDId=       
            ` + idUsuario , {
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Error al obtener los mensajes.",
      });
    });
};
 
exports.guardadMensaje = (req, res) => {
  if (!req.body.usuarioEmisor || !req.body.usuarioReceptor || !req.body.mensaje ) {
    res.status(400).send({
      message: "Debe ingresar todos los campos",
    });
    return;
  }
  ChatRoom.findOne({
    where : {
        
        [Op.or]: [
          { usuarioUId: req.body.usuarioEmisor,
            usuarioDId: req.body.usuarioReceptor },
          { usuarioUId: req.body.usuarioReceptor,
            usuarioDId: req.body.usuarioEmisor }
        ]
        
    }
}).then (chat => {
  console.log(chat)
    if (chat) {
      Mensaje.create({
        usuarioId: req.body.usuarioEmisor,
        chatRoomId: chat.id,
        texto: req.body.mensaje,
        leido: 0
    })
    .then((mensaje) => {
        res.send({message: "Mensaje enviado satisfactriamente"});
        return mensaje;
      })
      .catch((err) => {
        console.log(">> Error mientras se enviaba el mensaje: ", err);
      })
      .catch(err => {
          res.status(500).send({message: err.message});
      });
    }else{
      
  // Guardamos factura y su detalle
  ChatRoom.create({
    usuarioUId: req.body.usuarioEmisor,
    usuarioDId: req.body.usuarioReceptor
  })
    .then((data) => {
      console.log(data.id);
      if (req.body.mensaje) {
       
        Mensaje.create({
          chatRoomId: data.id,
          usuarioId: req.body.usuarioEmisor,
          texto: req.body.mensaje,
          leido: 0
        })
          .then(() => {
            res.send({
              message: "Mensaje enviado correctamente",
            });
          })
          .catch((err) => {
            res.status(500).send({ message: err.message });
          });
      } else {
        res.status(404).send({
          message: "No se puede enviar un mensaje vacio",
        });
      }
    });
    }
   // next ();
})
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.enviarMensaje = (req, res) => {
  Mensaje.create({
    usuarioId: req.body.usuarioEmisor,
    chatRoomId: req.body.id,
    texto: req.body.mensaje,
    leido: 0
    })
    .then((mensaje) => {
        res.send({message: "Mensaje enviado satisfactoriamente"});
        return mensaje;
      })
      .catch((err) => {
        console.log(">> Error mientras se enviaba el mensaje: ", err);
      })
      .catch(err => {
          res.status(500).send({message: err.message});
      });
};

exports.actualizarEstadoMensaje = (req, res) => {

  Mensaje.update({
       leido: 1,
    },
    {
       where: {
        chatRoomId: req.body.id,
        [Op.not]: [
          {usuarioId: req.body.usuarioEmisor},  
        ] 
       }
    }
    )
    .then((mensaje) => {
        res.send({message: "Datos actualizados exitosamente"});
        return mensaje;
      })
      .catch((err) => {
        console.log(">> Error mientras se actualizaban los datos: ", err);
      })
      .catch(err => {
          res.status(500).send({message: err.message});
      });
}


/* 
SELECT *
FROM `chat-rooms` c JOIN mensajes m 
ON c.id = m.chatRoomId
WHERE  
c.usuarioUId = 1
OR c.usuarioDId = 1
GROUP by c.id


SELECT *
FROM `chat-rooms` c JOIN mensajes m 
ON c.id = m.chatRoomId
WHERE  
c.id= 1
GROUP by c.id

*/