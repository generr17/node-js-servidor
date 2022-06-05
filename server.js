const express = require("express");
const cors = require("cors");
bodyParser = require('body-parser');
const app = express();


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

const bd = require("./app/modelos");
const Rol = bd.rol;
const Serie = bd.serie;

const dbConfig = require("./app/configuracion/db.config");
const controlador = require("./app/controladores/usuario.controller");

bd.sequelize.sync({force: true}).then (() => {
  console.log("Drop and Resync db");
  inicio();
});

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
}
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la aplicacion"});
});


require('./app/rutas/auth.routes')(app);
require('./app/rutas/usuario.routes')(app);
require('./app/rutas/equipo.routes')(app);
require('./app/rutas/video.routes')(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


