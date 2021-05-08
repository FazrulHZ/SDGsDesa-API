var express = require('express');
var router = express.Router();

var response = require('../helper/response');
var connection = require('../helper/connection');

router.get('/', function (req, res, next) {
  connection.query('SELECT * FROM tb_desainfo', function (error, rows, field) {
    if (error) {
      console.log(error);
    } else {
      response.ok(rows, res);
    }
  });
});

router.get('/:id', function (req, res, next) {

  var desa_id = req.params.id;

  connection.query('SELECT * FROM tb_desainfo WHERE desa_id != ?', [desa_id],
    function (error, rows, field) {
      if (error) {
        console.log(error);
      } else {
        response.ok(rows, res);
      }
    });
});

router.post('/', function (req, res, next) {

  let desa_lokasi = req.body.desa_lokasi;
  let desa_email = req.body.desa_email;
  let desa_web = req.body.desa_web;
  let desa_fb = req.body.desa_fb;
  let desa_twitter = req.body.desa_twitter;
  let desa_ig = req.body.desa_ig;
  let desa_yt = req.body.desa_yt;
  let desa_status_pemerintahan = req.body.desa_status_pemerintahan;

  connection.query('INSERT INTO tb_desainfo (desa_lokasi, desa_email, desa_web, desa_fb, desa_twitter, desa_ig, desa_yt, desa_status_pemerintahan) values(?, ?, ?, ?, ?, ?, ?, ?)', [desa_lokasi, desa_email, desa_web, desa_fb, desa_twitter, desa_ig, desa_yt, desa_status_pemerintahan], function (error, rows, field) {
    if (error) {
      console.log(error);
    } else {
      response.ok("Berhasil Menambahkan Data!", res);
    }
  })

});

router.put('/', function (req, res, next) {

  let desa_id = req.body.desa_id;
  let desa_lokasi = req.body.desa_lokasi;
  let desa_email = req.body.desa_email;
  let desa_web = req.body.desa_web;
  let desa_fb = req.body.desa_fb;
  let desa_twitter = req.body.desa_twitter;
  let desa_ig = req.body.desa_ig;
  let desa_yt = req.body.desa_yt;
  let desa_status_pemerintahan = req.body.desa_status_pemerintahan;

  connection.query('UPDATE tb_desainfo SET desa_lokasi=?, desa_email=?, desa_web=?, desa_fb=?, desa_twitter=?, desa_ig=?, desa_yt=?, desa_status_pemerintahan=? WHERE desa_id=?', [desa_lokasi, desa_email, desa_web, desa_fb, desa_twitter, desa_ig, desa_yt, desa_status_pemerintahan, desa_id], function (error, rows, field) {
    if (error) {
      console.log(error);
    } else {
      response.ok("Berhasil Di Edit!", res)
    }
  })
});

router.delete('/:id', function (req, res) {
  var desa_id = req.params.id;

  connection.query('DELETE FROM tb_desainfo WHERE desa_id=?', [desa_id], function (error, rows, field) {
    if (error) {
      console.log(error)
    } else {
      response.ok("Berhasil Menghapus Data!!", res)
    }
  })
});

module.exports = router;