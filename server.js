const express = require("express");
const cors = require("cors");
bodyParser = require('body-parser');
const app = express();
const cron = require('node-cron');

var corsOptions = {
  origin: "http://localhost:4200"
};
app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('imagenes'));

const bd = require("./app/modelos");
const Rol = bd.rol;
const Serie = bd.serie;
const Habilidad = bd.habilidad;
const Suscripcion = bd.suscripcion;
const Usuario = bd.usuario;


const dbConfig = require("./app/configuracion/db.config");
const controlador = require("./app/controladores/usuario.controller");
/*
bd.sequelize.sync({force: true}).then (() => {
  console.log("Drop and Resync db");
  inicio();
}); */
bd.sequelize.sync();
function inicio() {
  Rol.create({
    
    nombre: "admin"
  });
 
  Rol.create({
    
    nombre: "directivo"
  });
 
  Rol.create({
    
    nombre: "usuario"
  });

  Serie.create({
    nombre: "A"
  });

  Serie.create({
    nombre: "B"
  });

  Habilidad.create({
    nombre: "Dominio del balón"
  });

  Habilidad.create({
    nombre: "Dominio del cuerpo"
  });

  Habilidad.create({
    nombre: "Rapidez"
  });

  Habilidad.create({
    nombre: "Resistencia"
  });

  Habilidad.create({
    nombre: "Coordinación"
  });

  Habilidad.create({
    nombre: "Disciplina"
  });

  Habilidad.create({
    nombre: "Equilibrio"
  });
  

  Suscripcion.create({
    nombre: "Mensual",
    descripcion: "Visualiza videos ilimitados por un mes",
    nota: "Se renueva cada mes",
    precio: 20.00
  });

  Suscripcion.create({
    nombre: "Semestral",
    descripcion: "Visualiza videos ilimitados por un 6 meses",
    nota: "Se renueva cada 6 meses",
    precio: 50.50
  });

  Suscripcion.create({
    nombre: "Anual",
    descripcion: "Visualiza videos ilimitados por un año",
    nota: "Se renueva cada año",
    precio: 90.75
  });
}
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la aplicacion"});
});

cron.schedule('0 0 * * *', function(){
  console.log("Tarea ejecutandose");
  const date = new Date();
  const day = date.getDay();
  const month = date.getMonth();
  const year = date.getFullYear();
  const fullYear = year+"-"+month+"-"+day; 
  sequelize.query(`UPDATE usuarios AS u
                    JOIN usuario_suscripcions AS us
                    ON u.id = us.usuarioId
                    SET u.suscrito = 0
                    WHERE
                    Cast(us.fechaFin As Date)  = 
              ` + fullYear, {
        type: Sequelize.QueryTypes.SELECT,
      })
      .then((data) => {
        console.log(data)
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Error al obtener los equipos.",
        });
      });
  //console.log("tarea corriendo, ", fullYear);
})

cron.schedule('* * * * *', function(){
  const query = `SELECT COUNT(v.id), u.id
  FROM videos v
  JOIN usuarios u
  ON u.id = v.usuarioId
  GROUP BY u.id`;
})

require('./app/rutas/auth.routes')(app);
require('./app/rutas/usuario.routes')(app);
require('./app/rutas/equipo.routes')(app);
require('./app/rutas/video.routes')(app);
require('./app/rutas/mensaje.routes')(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


