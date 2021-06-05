var express = require('express');
var router = express.Router();

var response = require('../../helper/response');
var connection = require('../../helper/connection');

router.get('/', function (req, res, next) {
    connection.query('SELECT * FROM tb_desa', function (error, rows, field) {
        if (error) {
            console.log(error);
        } else {
            response.ok(true, 'Data Berhasil Diambil', rows, res);
        }
    });
});

router.get('/:id', async function (req, res, next) {

    var kecamatan_id = req.params.id;

    const count = await new Promise(resolve => {
        connection.query('SELECT COUNT(*) AS cnt FROM tb_desainfo WHERE kecamatan_id = ?', [kecamatan_id], function (error, rows, field) {
            if (error) {
                console.log(error)
            } else {
                resolve(rows[0].cnt);
            }
        });
    });

    connection.query('SELECT * FROM tb_desainfo WHERE kecamatan_id = ?', [kecamatan_id],
        function (error, rows, field) {
            if (error) {
                console.log(error);
            } else {
                response.ok(true, 'Data Berhasil Diambil', count, rows, res);
            }
        });
});

module.exports = router;