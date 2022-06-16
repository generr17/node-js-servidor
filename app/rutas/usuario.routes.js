const {authJwt} = require("../middleware");
//const { verificarCrearCuenta} = require("../middleware");
const controlador = require("../controladores/usuario.controller.js");
module.exports = function(app) {
    app.use(function(req, res, next){
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.get(
        "/api/test/administrador",
        [authJwt.verificarToken, authJwt.esAdministrador],
        controlador.usuarioAdministrador
    );
    app.get(
        "/api/test/directivo",
        [authJwt.verificarToken, authJwt.esDirectivo],
        controlador.usuarioDirectivo
    );
    app.get(
        "/api/test/usuario",
        [authJwt.verificarToken, authJwt.esUsuarioComun],
        controlador.usuarioComun
    );

    app.put("/api/test/editar/:id",
    [authJwt.verificarToken, authJwt.estaLogeado],
        controlador.actualizar
    ); 

    app.get("/api/test/obtener/:id",
    [authJwt.verificarToken, authJwt.estaLogeado],
    controlador.obtenerUsuario
    );
};