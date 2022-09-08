const bd = require("../modelos");
const configuracion = require("../configuracion/auth.config");
const configurac = require("../configuracion/db.config.js");
const { path } = require("express/lib/application");
const Video = bd.video;
const Equipo = bd.equipo;
const Suscripcion = bd.suscripcion;
const Op = bd.Sequelize.Op;
const fs = require('fs');
const Sequelize = require("sequelize");
const dbConfig = require("../configuracion/db.config.js");


const sequelize = new Sequelize(
  configurac.DB,
  configurac.USER,
  configurac.PASSWORD,
  {
    host: configurac.HOST,
    dialect: configurac.dialect,
    operatorsAliases: false,
    pool: {
      max: configurac.pool.max,
      min: configurac.pool.min,
      acquire: configurac.pool.acquire,
      idle: configurac.pool.idle
    }
  }
);

exports.guardar = (req, res) => {
    Video.create({
        url:req.body.url,
        imagen: req.body.imagen,
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        usuarioId: req.body.usuarioId,
    })
    .then(video => {
        if(req.body.equipos){
          Equipo.findAll ({
            where: {
              id: {
                [Op.or]: req.body.equipos
              }
            }
          }).then(equipos => {
            video.setEquipos(equipos).then(()=> {
              res.send({message: "Video guardado exitosamente"});
            });
          });
        }else {
          video.setEquipos([1]).then(()=> {
            res.send({message: "Video guaradado exitosamente"});
          });
        }
    })
    .catch(err => {
      res.status(500).send({message: err.message});
    });
};

exports.reproducirVideo = (req, res) => {
    const path = './videos/'+req.params.url
    const stat  = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range

  if(range) {
    const parts = range.replace(/bytes=/,"").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
    ? parseInt(parts[1], 10)
    : fileSize-1
    if (start >= fileSize) {
      res.status(416).send('El rango solicitado no es satisfactorio\n'  + start + '>=' + fileSize);
      return
    }

    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head)
    file.pipe(res)
  }else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type':'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
};

exports.listarVideos = (req, res) => {
  const idEquipo = req.params.equipoId;
  sequelize.query(`SELECT  u.id, u.nombreusuario, u.apellidousuario, v.url, v.imagen, v.createdAt, v.titulo, v.descripcion
                    FROM equipo_videos ev JOIN videos v
                    ON ev.videoId = v.id
                    JOIN usuarios u 
                    ON  u.id = v.usuarioId
                    JOIN equipos e ON ev.equipoId = e.id
                    AND ev.equipoId = 
            ` + idEquipo, {
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Error al obtener los equipos.",
      });
    });
};

exports.listarSuscripciones = (req, res) => {
  Suscripcion.findAll()
  .then(data => {
    
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: 
      err.message || "Error al encontrar los datos"
    });
  });
};

exports.buscarVideos = (req, res) => {
  const idEquipo = req.params.equipoId;
  const texto = req.params.texto;
  sequelize.query(`SELECT  u.id, u.nombreusuario, u.apellidousuario, v.url, v.imagen, v.createdAt, v.titulo, v.descripcion, v.visto
                      FROM equipo_videos ev JOIN videos v
                      ON ev.videoId = v.id
                      JOIN usuarios u 
                      ON  u.id = v.usuarioId
                      JOIN equipos e ON ev.equipoId = e.id
                      AND ev.equipoId = ` + idEquipo + 
                      ` AND u.nombreusuario LIKE '%`+ texto + `%'
                      OR u.apellidousuario LIKE '%` + texto + `%'
                      OR v.titulo LIKE '%` + texto + `%'
                      OR v.descripcion LIKE '%` + texto + `%'
                       GROUP BY v.id`, {
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Error al obtener los equipos.",
      });
    });
};

exports.buscarVideosNoVistos = (req, res) => {
  const idEquipo = req.params.equipoId;
  const texto = req.params.texto;
  sequelize.query(`SELECT  u.id, u.nombreusuario, u.apellidousuario, v.url, v.imagen, v.createdAt, v.titulo, v.descripcion
                      FROM equipo_videos ev JOIN videos v
                      ON ev.videoId = v.id
                      JOIN usuarios u 
                      ON  u.id = v.usuarioId
                      JOIN equipos e ON ev.equipoId = e.id
                      AND v.visto = 0 AND ev.equipoId = ` + idEquipo + 
                      ` AND u.nombreusuario LIKE '%`+ texto + `%'
                      OR u.apellidousuario LIKE '%` + texto + `%'
                      OR v.titulo LIKE '%` + texto + `%'
                      OR v.descripcion LIKE '%` + texto + `%'
                       GROUP BY v.id`, {
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Error al obtener los equipos.",
      });
    });
};

exports.buscarVideosVistos = (req, res) => {
  const idEquipo = req.params.equipoId;
  const texto = req.params.texto;
  sequelize.query(`SELECT  u.id, u.nombreusuario, u.apellidousuario, v.url, v.imagen, v.createdAt, v.titulo, v.descripcion
                      FROM equipo_videos ev JOIN videos v
                      ON ev.videoId = v.id
                      JOIN usuarios u 
                      ON  u.id = v.usuarioId
                      JOIN equipos e ON ev.equipoId = e.id
                      AND v.visto = 1  AND ev.equipoId = ` + idEquipo + 
                      ` AND u.nombreusuario LIKE '%`+ texto + `%'
                      OR u.apellidousuario LIKE '%` + texto + `%'
                      OR v.titulo LIKE '%` + texto + `%'
                      OR v.descripcion LIKE '%` + texto + `%'
                       GROUP BY v.id`, {
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Error al obtener los equipos.",
      });
    });
};

exports.listarVideoPorUsuario = (req, res) => {
  const usuarioId = req.params.usuarioId;
  Video.findAll({
    where: {
      usuarioId: usuarioId
    }
  })
    .then(data => {
      res.send(data); 
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error al encontrar los datos"
        });
       
    });
}

exports.buscarVideoDeUsuario = (req, res) => {
  const usuarioId = req.params.usuarioId;
  const texto = req.params.texto;
  sequelize.query(`SELECT id, url, imagen, titulo, descripcion, createdAt  FROM videos  WHERE usuarioId =` + usuarioId +
                    ` AND titulo LIKE '%` + texto + `%'  OR ` +
                    ` descripcion LIKE '%` + texto + `%'`, {
type: Sequelize.QueryTypes.SELECT,
})
.then((data) => {
res.send(data);
})
.catch((err) => {
res.status(500).send({
message:
err.message ||
"No se encontraron videos.",
});
});
}

exports.buscarVideoNuevosDeUsuario = (req, res) => {
  const usuarioId = req.params.usuarioId;
  const texto = req.params.texto;
  sequelize.query(`SELECT id, url, imagen, titulo, descripcion, createdAt  FROM videos  WHERE visto = 0 AND usuarioId =` + usuarioId +
                    ` AND titulo LIKE '%` + texto + `%'  OR ` +
                    ` descripcion LIKE '%` + texto + `%'`, {
type: Sequelize.QueryTypes.SELECT,
})
.then((data) => {
res.send(data);
})
.catch((err) => {
res.status(500).send({
message:
err.message ||
"No se encontraron videos.",
});
});
}

exports.buscarVideoVistosDeUsuario = (req, res) => {
  const usuarioId = req.params.usuarioId;
  const texto = req.params.texto;
  sequelize.query(`SELECT id, url, imagen, titulo, descripcion, createdAt  FROM videos  WHERE visto = 1 AND usuarioId =` + usuarioId +
                    ` AND titulo LIKE '%` + texto + `%'  OR ` +
                    ` descripcion LIKE '%` + texto + `%'`, {
type: Sequelize.QueryTypes.SELECT,
})
.then((data) => {
res.send(data);
})
.catch((err) => {
res.status(500).send({
message:
err.message ||
"No se encontraron videos.",
});
});
}

