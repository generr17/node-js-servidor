const { verificarCrearCuenta} = require("../middleware");
const controlador = require("../controladores/auth.controller.js");
module.exports = function(app) {
    app.use(function(req, res, next){
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/auth/crearcuenta",
         [
             verificarCrearCuenta.verificarEmailDuplicado,
             verificarCrearCuenta.verificarSiExisteRol
         ],
         controlador.signup
    );
    app.post("/api/auth/iniciarsesion", controlador.singin);
};