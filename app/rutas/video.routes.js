
const {authJwt} = require("../middleware");
const multer = require('multer');
var ffprobe = require('ffprobe');
var ffprobeStatic = require('ffprobe-static');
const fs = require('fs');
path = require('path');
const PATH ='./videos';

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const ffmpegCommand = require("fluent-ffmpeg");
ffmpegCommand.setFfmpegPath(ffmpegPath);
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
            '*',
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
   
    app.post('/api/video/subir',
         upload.single('video'), function (req, res) {
        if(!req.file) {
           
            console.log("Archivo no válido");
            return res.send({
                success: false
            });

        }else{
           
            console.log('Archivo válido');
            const path = './videos/'+req.file.filename;
          
            const url2= req.file.path;
            let segConvertidos = 0;
           ffprobe(url2, { path: ffprobeStatic.path }, function(err, info){
                if(err){
                    console.log(err);
                    return res.send(err);
                }else{
                    console.log("Informacion del video", info);
                    segConvertidos = convertirSegAMin(info.streams[0].duration);
                    console.log(segConvertidos)
                    if(segConvertidos === 3){
                        console.log(req.file);
                        const url=req.file.filename;
                        console.log(req.file.path);
                         let videoUrl =req.file.path;
                         
                         const filename =Date.now() + `-imagen`;
                         var im  =  ffmpegCommand(videoUrl)
                                .seekInput("00:00:30.000")
                                .outputOptions([
                                    "-q:v",
                                    "8",
                                    "-frames:v",
                                    "1",
                                    "-vsync",
                                    "0",
                                    "-qscale",
                                    "50",
                                    "-vf",
                                    "fps=1/10,scale=500:300,tile=1x1",
                                ])
                                .addOption("-preset", "superfast")
                                .on("error", (err) => {
                                    console.log("error", err);
                                    reject(err);
                                })
            
                                .save(`./imagenes/${filename}.png`);
                                 
                               
                        return res.send({
                            success: true,
                            message: url,
                            imagenUrl:`${filename}.png`
                        });
                    }else {
                       fs.unlinkSync(path);
                        success=false;
                        message="La duración del video debe ser igual a 3 minutos"
                        return res.send({message, success});
                    }
                }
            });
           
        }
    });

    let convertirSegAMin = (seconds) => {
        let minutos = 60;
        let resultado = Math.round(seconds/ minutos);
        return resultado;
    }

    app.post('/api/video/guardar',
    [authJwt.verificarToken],
    controlador.guardar
    );

    app.get('/api/video/obtenerVideos/:equipoId', 
    [authJwt.verificarToken, authJwt.esDirectivo],
    controlador.listarVideos);
    
    app.get('/api/video/reproducir/:url',
    controlador.reproducirVideo);

     app.get('/api/mostrarImagen/:img', function(req, res){
     res.sendFile( __dirname+`/imagenes/${img}` );});
    
     app.get('/obtenerSuscripciones', 
     [authJwt.verificarToken, authJwt.esDirectivo],
     controlador.listarSuscripciones);
    
     app.get('/api/video/buscarVideos/:equipoId/:texto',
     [authJwt.verificarToken, authJwt.esDirectivo],
     controlador.buscarVideos
     );

     app.get('/api/video/buscarVideosPorTipo/:equipoId/:texto',
     [authJwt.verificarToken, authJwt.esDirectivo],
     controlador.buscarVideosPorDescripcion
     );

     app.get('/api/video/buscarVideosNuevos/:equipoId/:texto',
     [authJwt.verificarToken, authJwt.esDirectivo],
     controlador.buscarVideoNuevosDeUsuario
     );

     app.get('/api/video/buscarVideosVistos/:equipoId/:texto',
     [authJwt.verificarToken, authJwt.esDirectivo],
     controlador.buscarVideoVistosDeUsuario
     );

     app.get('/api/video/videosNoVistos/:equipoId',
     [authJwt.verificarToken, authJwt.esDirectivo],
     controlador.buscarVideosNoVistos
     );

     app.get('/api/video/videosVistos/:equipoId',
     [authJwt.verificarToken, authJwt.esDirectivo],
     controlador.listarVideosNoVistos
     );

     app.get('/api/video/listarVideos/:usuarioId',
     [authJwt.verificarToken, authJwt.esUsuarioComun],
     controlador.listarVideoPorUsuario);

     app.get('/api/video/buscarVideosUsuario/:usuarioId/:texto',
     [authJwt.verificarToken, authJwt.esUsuarioComun],
     controlador.buscarVideoDeUsuario);

     

     app.get('/api/video/listarVideosVistos/:equipoId',
     //[authJwt.verificarToken, authJwt.esDirectivo],
     controlador.listarVideosVistos);

     app.get('/api/video/listarVideosNoVistos/:equipoId',
     //[authJwt.verificarToken, authJwt.esDirectivo],
     controlador.listarVideosNoVistos);
    
     app.put('/api/video/actualizarEstado',
     [authJwt.verificarToken, authJwt.esDirectivo],
     controlador.actualizarEstadoVideo);

};

