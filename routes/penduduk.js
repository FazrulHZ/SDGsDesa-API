var express = require('express');
var router = express.Router();

var response = require('../helper/response');
var connection = require('../helper/connection');

router.get('/', function (req, res, next) {
    connection.query('SELECT tb_penduduk.*, tb_kabupaten.kabupaten_nama, tb_kecamatan.kecamatan_nama, tb_desainfo.desa_nama, tb_rt.rt_nama FROM tb_penduduk LEFT JOIN tb_kabupaten ON tb_penduduk.kabupaten_id = tb_kabupaten.kabupaten_id LEFT JOIN tb_kecamatan ON tb_penduduk.kecamatan_id = tb_kecamatan.kecamatan_id LEFT JOIN tb_desainfo ON tb_penduduk.desa_id = tb_desainfo.desa_id LEFT JOIN tb_rt ON tb_penduduk.rt_id = tb_rt.rt_id ORDER BY tb_penduduk.created_at DESC', function (error, rows, field) {
        if (error) {
            console.log(error);
        } else {
            response.ok(true, 'Data Berhasil Diambil', rows, res);
        }
    });
});

router.get('/:id', function (req, res, next) {

    var penduduk_id = req.params.id;

    connection.query('SELECT * FROM tb_penduduk WHERE penduduk_id = ?', [penduduk_id],
        function (error, rows, field) {
            if (error) {
                console.log(error);
            } else {
                response.ok(rows, res);
            }
        });
});

router.post('/', async function (req, res, next) {

    let penduduk_nik = req.body.penduduk_nik;
    let penduduk_nama = req.body.penduduk_nama;
    let penduduk_kelamin = req.body.penduduk_kelamin;
    let penduduk_tempatlahir = req.body.penduduk_tempatlahir;
    let penduduk_tgllahir = req.body.penduduk_tgllahir;
    let penduduk_umur = req.body.penduduk_umur;
    let penduduk_kawin = req.body.penduduk_kawin;
    let penduduk_agama = req.body.penduduk_agama;
    let penduduk_suku = req.body.penduduk_suku;
    let penduduk_wn = req.body.penduduk_wn;
    let kabupaten_id = req.body.kabupaten_id;
    let kecamatan_id = req.body.kecamatan_id;
    let desa_id = req.body.desa_id;
    let rt_id = req.body.rt_id;

    const check = await new Promise(resolve => {
        connection.query('SELECT COUNT(*) AS cnt FROM tb_penduduk WHERE penduduk_nik = ?', [penduduk_nik], function (error, rows, field) {
            if (error) {
                console.log(error)
            } else {
                resolve(rows[0]);
            }
        });
    });

    if (check.cnt > 0) {
        response.error(false, "NIK Telah Terdaftar!", 'empty', res);
    } else {
        connection.query('INSERT INTO tb_penduduk (penduduk_nik, penduduk_nama, penduduk_kelamin, penduduk_tempatlahir, penduduk_tgllahir, penduduk_umur, penduduk_kawin, penduduk_agama, penduduk_suku, penduduk_wn, kabupaten_id, kecamatan_id, desa_id, rt_id) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [penduduk_nik, penduduk_nama, penduduk_kelamin, penduduk_tempatlahir, penduduk_tgllahir, penduduk_umur, penduduk_kawin, penduduk_agama, penduduk_suku, penduduk_wn, kabupaten_id, kecamatan_id, desa_id, rt_id], function (error, rows, field) {
            if (error) {
                console.log(error);
            } else {
                response.ok(true, "Berhasil Menambahkan Data!", 'success', res);
            }
        })
    }

});

router.put('/', async function (req, res, next) {

    let penduduk_nik = req.body.penduduk_nik;
    let penduduk_nama = req.body.penduduk_nama;
    let penduduk_kelamin = req.body.penduduk_kelamin;
    let penduduk_tempatlahir = req.body.penduduk_tempatlahir;
    let penduduk_tgllahir = req.body.penduduk_tgllahir;
    let penduduk_umur = req.body.penduduk_umur;
    let penduduk_kawin = req.body.penduduk_kawin;
    let penduduk_agama = req.body.penduduk_agama;
    let penduduk_suku = req.body.penduduk_suku;
    let penduduk_wn = req.body.penduduk_wn;
    let kabupaten_id = req.body.kabupaten_id;
    let kecamatan_id = req.body.kecamatan_id;
    let desa_id = req.body.desa_id;
    let rt_id = req.body.rt_id;

    const check = await new Promise(resolve => {
        connection.query('SELECT COUNT(penduduk_id) AS cnt, penduduk_nik FROM tb_penduduk WHERE penduduk_nik = ?', [penduduk_nik], function (error, rows, field) {
            if (error) {
                console.log(error)
            } else {
                resolve(rows[0]);
            }
        });
    });

    if (check.cnt > 0 && check.penduduk_nik != penduduk_nik) {
        response.error(false, "NIK Telah Terdaftar!", 'empty', res);
    } else {
        connection.query('UPDATE tb_penduduk SET penduduk_nik=?, penduduk_nama=?, penduduk_kelamin=?, penduduk_tempatlahir=?, penduduk_tgllahir=?, penduduk_umur=?, penduduk_kawin=?, penduduk_agama=?, penduduk_suku=?, penduduk_wn=?, kabupaten_id=?, kecamatan_id=?, desa_id=?, rt_id=? WHERE penduduk_id=?', [penduduk_nik, penduduk_nama, penduduk_kelamin, penduduk_tempatlahir, penduduk_tgllahir, penduduk_umur, penduduk_kawin, penduduk_agama, penduduk_suku, penduduk_wn, kabupaten_id, kecamatan_id, desa_id, rt_id, penduduk_id], function (error, rows, field) {
            if (error) {
                console.log(error);
            } else {
                response.ok(true, "Berhasil Merubah Data!", 'success', res)
            }
        })
    }
});

router.delete('/:id', function (req, res) {
    var penduduk_id = req.params.id;

    connection.query('DELETE FROM tb_penduduk WHERE penduduk_id=?', [penduduk_id], function (error, rows, field) {
        if (error) {
            console.log(error)
        } else {
            response.ok(true, "Berhasil Menghapus Data!", 'success', res)
        }
    })
});

module.exports = router;