var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
const fs = require('fs')

let slugify = require('slugify')

var response = require('../helper/response');
var connection = require('../helper/connection');
var auth = require('../helper/auth');

var storage = multer.diskStorage({
  destination: path.join(__dirname + './../public/upload/desaGambar'),
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

var upload = multer({ storage: storage });

router.get('/', auth, async function (req, res, next) {

  const count = await new Promise(resolve => {
    connection.query('SELECT COUNT(*) AS cnt FROM tb_desainfo', function (error, rows, field) {
      if (error) {
        console.log(error)
      } else {
        resolve(rows[0].cnt);
      }
    });
  });

  connection.query('SELECT * FROM tb_desainfo LEFT JOIN tb_kabupaten ON tb_desainfo.kabupaten_id = tb_kabupaten.kabupaten_id LEFT JOIN tb_kecamatan ON tb_desainfo.kecamatan_id = tb_kecamatan.kecamatan_id ORDER BY tb_desainfo.created_at DESC', function (error, rows, field) {
    if (error) {
      console.log(error);
    } else {
      response.ok(true, 'Data Berhasil Diambil', count, rows, res);
    }
  });
});

router.get('/:id', auth, function (req, res, next) {

  var desa_id = req.params.id;

  connection.query('SELECT * FROM tb_desainfo WHERE desa_id = ?', [desa_id],
    function (error, rows, field) {
      if (error) {
        console.log(error);
      } else {
        response.ok(true, 'Data Berhasil Diambil', 1, rows[0], res);
      }
    });
});

router.post('/', auth, upload.single('desa_foto'), async function (req, res, next) {

  let desa_nama = req.body.desa_nama;
  let desa_slug = slugify(desa_nama.toLowerCase());
  let desa_email = req.body.desa_email;
  let desa_web = req.body.desa_web;
  let desa_fb = req.body.desa_fb;
  let desa_twitter = req.body.desa_twitter;
  let desa_ig = req.body.desa_ig;
  let desa_yt = req.body.desa_yt;
  let desa_status_pemerintahan = req.body.desa_status_pemerintahan;
  let desa_foto = req.file === undefined ? "" : req.file.filename;
  let kabupaten_id = req.body.kabupaten_id;
  let kecamatan_id = req.body.kecamatan_id;

  const check = await new Promise(resolve => {
    connection.query('SELECT COUNT(desa_id) AS cnt, kabupaten_id, kecamatan_id FROM tb_desainfo WHERE desa_slug = ? AND kabupaten_id=? AND kecamatan_id=?', [desa_slug, kabupaten_id, kecamatan_id], function (error, rows, field) {
      if (error) {
        console.log(error)
      } else {
        resolve(rows[0]);
      }
    });
  });

  if (check.cnt > 0 && check.kabupaten_id == kabupaten_id && check.kecamatan_id == kecamatan_id) {
    response.error(false, "Desa Telah Terdaftar!", 'empty', res);
  } else {
    connection.query('INSERT INTO tb_desainfo (desa_nama, desa_slug, desa_email, desa_web, desa_fb, desa_twitter, desa_ig, desa_yt, desa_status_pemerintahan, desa_foto, kabupaten_id, kecamatan_id) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [desa_nama, desa_slug, desa_email, desa_web, desa_fb, desa_twitter, desa_ig, desa_yt, desa_status_pemerintahan, desa_foto, kabupaten_id, kecamatan_id], function (error, rows, field) {
      if (error) {
        console.log(error);
      } else {
        response.ok(true, "Berhasil Menambahkan Data!", 1, 'success', res);
      }
    })
  }

});

router.put('/', auth, upload.single('desa_foto'), async function (req, res, next) {

  let desa_id = req.body.desa_id;
  let desa_nama = req.body.desa_nama;
  let desa_slug = slugify(desa_nama.toLowerCase());
  let desa_email = req.body.desa_email;
  let desa_web = req.body.desa_web;
  let desa_fb = req.body.desa_fb;
  let desa_twitter = req.body.desa_twitter;
  let desa_ig = req.body.desa_ig;
  let desa_yt = req.body.desa_yt;
  let desa_status_pemerintahan = req.body.desa_status_pemerintahan;
  let kabupaten_id = req.body.kabupaten_id;
  let kecamatan_id = req.body.kecamatan_id;

  const check = await new Promise(resolve => {
    connection.query('SELECT COUNT(desa_id) AS cnt, desa_foto, kabupaten_id, kecamatan_id, desa_slug, desa_id FROM tb_desainfo WHERE desa_slug = ? AND kabupaten_id=? AND kecamatan_id=?', [desa_slug, kabupaten_id, kecamatan_id], function (error, rows, field) {
      if (error) {
        console.log(error)
      } else {
        resolve(rows[0]);
      }
    });
  });

  let desa_foto = req.file === undefined ? check.desa_foto : req.file.filename;

  if (check.cnt > 0 && check.kabupaten_id == kabupaten_id && check.kecamatan_id == kecamatan_id && check.desa_id != desa_id) {
    response.error(false, "Desa Telah Terdaftar!", 'empty', res);
  } else {
    connection.query('UPDATE tb_desainfo SET desa_nama=?, desa_slug=?, desa_email=?, desa_web=?, desa_fb=?, desa_twitter=?, desa_ig=?, desa_yt=?, desa_status_pemerintahan=?, desa_foto=?, kabupaten_id=?, kecamatan_id=? WHERE desa_id=?', [desa_nama, desa_slug, desa_email, desa_web, desa_fb, desa_twitter, desa_ig, desa_yt, desa_status_pemerintahan, desa_foto, kabupaten_id, kecamatan_id, desa_id], function (error, rows, field) {
      if (error) {
        console.log(error);
      } else {
        response.ok(true, "Berhasil Merubah Data!", 1, 'success', res)
      }
    })
  }
});

router.delete('/:id', auth, async function (req, res) {
  var desa_id = req.params.id;

  const check = await new Promise(resolve => {
    connection.query('SELECT * FROM tb_desainfo WHERE desa_id = ?', [desa_id], function (error, rows, field) {
      if (error) {
        console.log(error)
      } else {
        resolve(rows[0]);
      }
    });
  });

  if (check.desa_foto == "") {
    connection.query('DELETE FROM tb_desainfo WHERE desa_id=?', [desa_id], function (error, rows, field) {
      if (error) {
        console.log(error)
      } else {
        response.ok(true, "Berhasil Menghapus Data!", 1, 'success', res)
      }
    })
  } else {
    fs.unlink("./public/upload/desaGambar/" + check.desa_foto, (err) => {
      if (err) {
        console.log("failed to delete local image:" + err);
      } else {
        console.log('successfully deleted local image');
        connection.query('DELETE FROM tb_desainfo WHERE desa_id=?', [desa_id], function (error, rows, field) {
          if (error) {
            console.log(error)
          } else {
            response.ok(true, "Berhasil Menghapus Data!", 1, 'success', res)
          }
        })
      }
    });
  }
});

module.exports = router;