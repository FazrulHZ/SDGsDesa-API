var express = require('express');
var router = express.Router();

var response = require('../../helper/response');
var connection = require('../../helper/connection');

router.get('/', async function (req, res, next) {

  const count = await new Promise(resolve => {
    connection.query('SELECT COUNT(*) AS cnt FROM tb_kabupaten', function (error, rows, field) {
      if (error) {
        console.log(error)
      } else {
        resolve(rows[0].cnt);
      }
    });
  });

  connection.query('SELECT * FROM tb_kabupaten', function (error, rows, field) {
    if (error) {
      console.log(error);
    } else {
      response.ok(true, 'Data Berhasil Diambil', count, rows, res);
    }
  });
});

router.get('/:id', async function (req, res, next) {

  var kabupaten_id = req.params.id;

  const count = await new Promise(resolve => {
    connection.query('SELECT COUNT(*) AS cnt FROM tb_kabupaten WHERE kabupaten_id == ?', [kabupaten_id], function (error, rows, field) {
      if (error) {
        console.log(error)
      } else {
        resolve(rows[0].cnt);
      }
    });
  });

  connection.query('SELECT * FROM tb_kabupaten WHERE kabupaten_id == ?', [kabupaten_id],
    function (error, rows, field) {
      if (error) {
        console.log(error);
      } else {
        response.ok(true, 'Data Berhasil Diambil', 1, rows[0], res);
      }
    });
});

module.exports = router;