var express = require('express');
var router = express.Router();

var response = require('../helper/response');
var connection = require('../helper/connection');

router.get('/', function (req, res, next) {
    connection.query('SELECT * FROM tb_kecamatan', function (error, rows, field) {
        if (error) {
            console.log(error);
        } else {
            response.ok(rows, res);
        }
    });
});

router.get('/:id', function (req, res, next) {

    var kecamatan_id = req.params.id;

    connection.query('SELECT * FROM tb_kecamatan WHERE kecamatan_id == ?', [kecamatan_id],
        function (error, rows, field) {
            if (error) {
                console.log(error);
            } else {
                response.ok(rows, res);
            }
        });
});

module.exports = router;