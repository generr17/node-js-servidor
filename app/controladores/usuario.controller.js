const bd = require("../modelos");
const Rol = bd.Rol;
const Usuario = bd.usuario;
const Op = bd.Sequelize.Op;
var bcrypt = require("bcryptjs");


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


exports.usuarioAdministrador = (req, res) => {
    res.status(200).send("Contenido Administrador");
};
exports.usuarioComun = (req, res) => {
    res.status(200).send("Contenido de usuario");
};

exports.usuarioDirectivo = (req, res) => {
    res.status(200).send("Contenido directivo");
};
