const {authJwt} = require("../middleware");
const controlador = require("../controladores/equipo.controller.js");
module.exports = function(app) {
    app.use(function(req, res, next){
        res.header(
            "Access-Control-Allow-Headers",
            '*',
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post("/api/equipo/crear",
     [authJwt.verificarToken, authJwt.esAdministrador],
     controlador.crearEquipo
    );

    app.get("/api/serie/listar",
    [authJwt.verificarToken, authJwt.esAdministradorOUsuario],
    controlador.listarSeries
    );
 
    app.get("/api/equipo/listar",
    [authJwt.verificarToken, authJwt.esAdministradorOUsuario],
    controlador.listarEquipos
    );
};