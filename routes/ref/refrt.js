var express = require('express');
var router = express.Router();

var response = require('../../helper/response');
var connection = require('../../helper/connection');

router.get('/', function (req, res, next) {
    connection.query('SELECT * FROM tb_rt', function (error, rows, field) {
        if (error) {
            console.log(error);
        } else {
            response.ok(true, 'Data Berhasil Diambil', rows, res);
        }
    });
});

router.get('/:id', function (req, res, next) {

    var desa_id = req.params.id;

    connection.query('SELECT * FROM tb_rt WHERE desa_id = ?', [desa_id],
        function (error, rows, field) {
            if (error) {
                console.log(error);
            } else {
                response.ok(true, 'Data Berhasil Diambil', rows, res);
            }
        });
});

module.exports = router;