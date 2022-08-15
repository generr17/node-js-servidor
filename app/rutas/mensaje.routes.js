const {authJwt} = require("../middleware");
//const { verificarCrearCuenta} = require("../middleware");
const controlador = require("../controladores/usuario.controller.js");
const controladorMsg= require("../controladores/mensaje.controller.js");
module.exports = function(app) {
    app.use(function(req, res, next){
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post("/api/enviarMensaje",
     [authJwt.verificarToken, authJwt.estaLogeado],
        controladorMsg.guardadMensaje
    ); 

    app.get("/api/obtenerChatRooms/:id",
     [authJwt.verificarToken, authJwt.estaLogeado],
        controladorMsg.listarChatRooms
    ); 

    app.post("/api/enviar",
     [authJwt.verificarToken, authJwt.estaLogeado],
        controladorMsg.enviarMensaje
    ); 

    app.put("/api/actualizarMensajes",
    [authJwt.verificarToken, authJwt.estaLogeado],
       controladorMsg.actualizarEstadoMensaje
   ); 

    app.get("/api/obtenerMensajes/:id",
    [authJwt.verificarToken, authJwt.estaLogeado],
       controladorMsg.listarMensajes
   ); 
}