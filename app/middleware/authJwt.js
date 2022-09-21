const jwt = require("jsonwebtoken");
const configuracion = require("../configuracion/auth.config.js");
const bd = require("../modelos");
const Usuario = bd.usuario;
verificarToken = (req, res, next) => {
    let token= req.headers["x-access-token"];
    jwt.verify(token, configuracion.secret, (err, decoded) => {
        if(err)
         {
             return res.status(401).send({
                 message: "No autorizado"
             });
        }
        
        req.usuarioId = decoded.id;
        next();
    });
};

esAdministrador = (req, res, next) => {
    Usuario.findByPk(req.usuarioId).then(usuario => {
        console.log(usuario.roleId);
        if (usuario.roleId === 1){
            next();
            return;
        }
        res.status(403).send({
            message: "Requiere rol administrador"
        });
        return;
    });
};

esDirectivo = (req, res, next) => {
    Usuario.findByPk(req.usuarioId).then(usuario => {
        console.log(usuario);
        if (usuario.roleId === 2){
            next();
            return;
        }
        res.status(403).send({
            message: "Requiere rol directivo"
        });
        return;
    });
};




esUsuarioComun = (req, res, next) => {
    Usuario.findByPk(req.usuarioId).then(usuario => {
        const rol= usuario.roleId;
        console.log("rol admin: " + rol);
        if (rol === 3){
            next();
            return;
        }
        res.status(403).send({
            message: "Requiere rol usuario"
        });
        return;
    });
};

estaLogeado = (req, res, next) => {
    Usuario.findByPk(req.usuarioId).then(usuario => {
       const rol= usuario.roleId;
            console.log(rol);
            if (rol === 1 || rol === 2 || rol === 3){
                next();
                return;
            }
            res.status(403).send({
                message: "Requiere iniciar sesion"
            });
            return;
        
    });
};

esAdministradorOUsuario = (req, res, next) => {
    Usuario.findByPk(req.usuarioId).then(usuario => {
        console.log(usuario.roleId);
        if (usuario.roleId === 1 || usuario.roleId === 3){
            next();
            return;
        }
        res.status(403).send({
            message: "Requiere rol administrador o Usuario"
        });
        return;
    });
};

const authJwt = {
    verificarToken: verificarToken,
    esAdministrador: esAdministrador,
    esDirectivo: esDirectivo,
    esUsuarioComun: esUsuarioComun,
    esAdministradorOUsuario : esAdministradorOUsuario,
    estaLogeado: estaLogeado
   
};

module.exports = authJwt;