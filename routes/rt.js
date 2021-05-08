var express = require('express');
var router = express.Router();

var response = require('../helper/response');
var connection = require('../helper/connection');

router.get('/', function (req, res, next) {
    connection.query('SELECT * FROM tb_rt', function (error, rows, field) {
        if (error) {
            console.log(error);
        } else {
            response.ok(rows, res);
        }
    });
});

router.get('/:id', function (req, res, next) {

    var rt_id = req.params.id;

    connection.query('SELECT * FROM tb_rt WHERE rt_id == ?', [rt_id],
        function (error, rows, field) {
            if (error) {
                console.log(error);
            } else {
                response.ok(rows, res);
            }
        });
});

router.post('/', function (req, res, next) {

    let rt_ketua = req.body.rt_ketua;
    let rt_alamat = req.body.rt_alamat;
    let rt_tlp = req.body.rt_tlp;
    let rt_lokasi = req.body.rt_lokasi;
    let rt_topografi = req.body.rt_topografi;
    let rt_jumlah_warga = req.body.rt_jumlah_warga;

    connection.query('INSERT INTO tb_rt (rt_ketua, rt_alamat, rt_tlp, rt_lokasi, rt_topografi, rt_jumlah_warga) values(?, ?, ?, ?, ?, ?)', [rt_ketua, rt_alamat, rt_tlp, rt_lokasi, rt_topografi, rt_jumlah_warga], function (error, rows, field) {
        if (error) {
            console.log(error);
        } else {
            response.ok("Berhasil Menambahkan Data!", res);
        }
    })

});

router.put('/', function (req, res, next) {

    let rt_id = req.body.rt_id;
    let rt_ketua = req.body.rt_ketua;
    let rt_alamat = req.body.rt_alamat;
    let rt_tlp = req.body.rt_tlp;
    let rt_lokasi = req.body.rt_lokasi;
    let rt_topografi = req.body.rt_topografi;
    let rt_jumlah_warga = req.body.rt_jumlah_warga;

    connection.query('UPDATE tb_rt SET rt_ketua=?, rt_alamat=?, rt_tlp=?, rt_lokasi=?, rt_topografi=?, rt_jumlah_warga=? WHERE rt_id=?', [rt_ketua, rt_alamat, rt_tlp, rt_lokasi, rt_topografi, rt_jumlah_warga, rt_id], function (error, rows, field) {
        if (error) {
            console.log(error);
        } else {
            response.ok("Berhasil Di Edit!", res)
        }
    })
});

router.delete('/:id', function (req, res) {
    var rt_id = req.params.id;

    connection.query('DELETE FROM tb_rt WHERE rt_id=?', [rt_id], function (error, rows, field) {
        if (error) {
            console.log(error)
        } else {
            response.ok("Berhasil Menghapus Data!!", res)
        }
    })
});

module.exports = router;