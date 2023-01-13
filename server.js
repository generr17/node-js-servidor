const express = require("express");
const cors = require("cors");
bodyParser = require('body-parser');
const app = express();
const cron = require('node-cron');

var corsOptions = {
  origin: "https://futsite.online/"
};
app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
const { QueryTypes } = require('sequelize');
app.use(express.static('imagenes'));

const bd = require("./app/modelos");
const Rol = bd.rol;
const Serie = bd.serie;
const Habilidad = bd.habilidad;
const Suscripcion = bd.suscripcion;
const Usuario = bd.usuario;
const Video = bd.video;
const controler = require("./app/controladores/usuario.controller.js");

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
 
 
  controler.actualizarEstadoSuscrito();
  
  console.log("Tarea ejecutandose")
   
   
  })

  
cron.schedule('0 0 28 * *', function(){
 
controler.actualizarEstadoUsuario();

console.log("Tarea actualizandose")
 
 
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


