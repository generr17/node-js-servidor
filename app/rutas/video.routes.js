
const {authJwt} = require("../middleware");
const multer = require('multer');
path = require('path');
const PATH ='./videos';

//const { verificarCrearCuenta} = require("../middleware");
const controlador = require("../controladores/video.controller.js");
let storage= multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, PATH);
    },
    filename: (req, file, cb) => {
        cb(null,file.fieldname + '-' + Date.now() +'.mp4')
    }
});

let upload = multer({
    storage:storage
});
module.exports = function(app) {
 
    app.use(function(req, res, next){
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
   
    app.post('/api/video/subir',upload.single('video'), function (req, res) {
        if(!req.file) {
            console.log("Archivo no válido");
            return res.send({
                success: false
            });

        }else{
            console.log('Archivo válido');
            console.log(req.file);
            const url=req.file.filename;
            var proc =  new ffmpeg(req.file.path)
            .takeScreenshots({
                count: 1,
                timemarks: ['600']
            }, './miniaturas/', function(err) {
                console.log("miniatura guardada")
            });
            return res.send({
                success: true,
                message: url
            });
            
            
        }
    });

    app.post('/api/video/guardar',
    controlador.guardar
    );

    app.get('/api/video/obtenerVideos/:equipoId', 
    controlador.listarVideos);
    
    app.get ('/api/video/reproducir',controlador.reproducirVideo);

};

