const bd = require("../modelos");
const configuracion = require("../configuracion/auth.config");
const Usuario = bd.usuario;
const Rol = bd.Rol;
const Op = bd.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    Usuario.create({
        nombreusuario: req.body.nombreusuario,
        apellidousuario: req.body.apellidousuario,
        telefono: req.body.telefono,
        fechanacimiento: req.body.fechanacimiento,
        genero: req.body.genero,
        direccion: req.body.direccion,
        email: req.body.email,
        clave: bcrypt.hashSync(req.body.clave, 8),
        roleId: req.body.roleId,
        equipoId: req.body.equipoId,
        suscrito: 0
        
    })
    .then((usuario) => {
        res.send({message: "Usuario registrado satisfactriamente"});
        return usuario;
      })
      .catch((err) => {
        console.log(">> Error mientra se creaba el usuario: ", err);
      })
      .catch(err => {
          res.status(500).send({message: err.message});
      });
};

exports.singin = (req, res) => {
    Usuario.findOne({
        where: {
            email: req.body.email
        }
    })
     .then(usuario => {
         if (!usuario) {
             return res.status(404).send({message: "Usuario no encontrado"});
         }
         var claveValida = bcrypt.compareSync(
             req.body.clave,
             usuario.clave
         );
         if (!claveValida || !req.body.email) {
             return res.status(401).send({
                 accessToken: null,
                 message: "Correo o Contraseña incorrecta"
             });
         }
         var token = jwt.sign({ id: usuario.id}, configuracion.secret, {
             expiresIn: 86400
         });
             var rol ="";
             if (usuario.roleId == 1){
                 rol = "admin";
             }else if (usuario.roleId == 2){
                rol = "directivo";
             }else  if (usuario.roleId == 3){
                 rol = "usuario";
             }
             res.status(200).send({
                 id: usuario.id,
                 nombreusuario: usuario.nombreusuario,
                 apellidousuario: usuario.apellidousuario,
                 telefono: usuario.telefono,
                 direccion: usuario.direccion,
                 fechanacimiento: usuario.fechanacimiento,
                 genero: usuario.genero,
                 email: usuario.email,
                 rolusuario: rol,
                 equipoId: usuario.equipoId,
                 accessToken: token
             });
         
     })
     .catch(err => {
         res.status(500).send({message: err.message});
     });
};
