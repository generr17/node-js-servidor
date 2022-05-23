const bd = require("../modelos");
const ROLES = bd.ROLES;
const Usuario = bd.usuario;

verificarEmailDuplicado = (req, res, next) => {
    Usuario.findOne({
        where : {
            email: req.body.email
        }
    }).then (usuario => {
        if (usuario) {
            res.status(400).send({
                message: "Error. El correo ya esta en uso"
            });
            return;
        }
        next ();
    });
};

verificarSiExisteRol = (req, res, next) => {
    if (req.body.roleId) {
          if (!ROLES.includes(req.body.roleId)) {
                res.status(400).send({
                    message:"Error. El rol no existe = " + req.body.roles[i]
                });
                return;
            }
    }
    next();
};

const verificarCrearCuenta = {
    verificarEmailDuplicado: verificarEmailDuplicado,
    verificarSiExisteRol: verificarSiExisteRol
};

module.exports = verificarCrearCuenta;
