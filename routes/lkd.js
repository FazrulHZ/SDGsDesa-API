var express = require('express');
var router = express.Router();

let slugify = require('slugify')

var response = require('../helper/response');
var connection = require('../helper/connection');

router.get('/', function (req, res, next) {
    connection.query('SELECT tb_lkd.*, tb_kabupaten.kabupaten_nama, tb_kecamatan.kecamatan_nama, tb_desainfo.desa_nama FROM tb_lkd LEFT JOIN tb_kabupaten ON tb_lkd.kabupaten_id = tb_kabupaten.kabupaten_id LEFT JOIN tb_kecamatan ON tb_lkd.kecamatan_id = tb_kecamatan.kecamatan_id LEFT JOIN tb_desainfo ON tb_lkd.desa_id = tb_desainfo.desa_id ORDER BY tb_lkd.created_at DESC', function (error, rows, field) {
        if (error) {
            console.log(error);
        } else {
            response.ok(true, 'Data Berhasil Diambil', rows, res);
        }
    });
});

router.get('/:id', function (req, res, next) {

    var lkd_id = req.params.id;

    connection.query('SELECT * FROM tb_lkd WHERE lkd_id = ?', [lkd_id],
        function (error, rows, field) {
            if (error) {
                console.log(error);
            } else {
                response.ok(rows, res);
            }
        });
});

router.post('/', async function (req, res, next) {

    let lkd_nama = req.body.lkd_nama;
    let lkd_slug = slugify(lkd_nama.toLowerCase());
    let lkd_pengurus = req.body.lkd_pengurus;
    let lkd_anggota = req.body.lkd_anggota;
    let kabupaten_id = req.body.kabupaten_id;
    let kecamatan_id = req.body.kecamatan_id;
    let desa_id = req.body.desa_id;

    const check = await new Promise(resolve => {
        connection.query('SELECT COUNT(*) AS cnt FROM tb_lkd WHERE lkd_slug = ?', [lkd_slug], function (error, rows, field) {
            if (error) {
                console.log(error)
            } else {
                resolve(rows[0]);
            }
        });
    });

    if (check.cnt > 0) {
        response.error(false, "LKD Telah Terdaftar!", 'empty', res);
    } else {
        connection.query('INSERT INTO tb_lkd (lkd_nama, lkd_slug, lkd_pengurus, lkd_anggota, kabupaten_id, kecamatan_id, desa_id) values(?, ?, ?, ?, ?, ?, ?)', [lkd_nama, lkd_slug, lkd_pengurus, lkd_anggota, kabupaten_id, kecamatan_id, desa_id], function (error, rows, field) {
            if (error) {
                console.log(error);
            } else {
                response.ok(true, "Berhasil Menambahkan Data!", 'success', res);
            }
        })
    }

});

router.put('/', async function (req, res, next) {

    let lkd_id = req.body.lkd_id;
    let lkd_nama = req.body.lkd_nama;
    let lkd_slug = slugify(lkd_nama.toLowerCase());
    let lkd_pengurus = req.body.lkd_pengurus;
    let lkd_anggota = req.body.lkd_anggota;
    let kabupaten_id = req.body.kabupaten_id;
    let kecamatan_id = req.body.kecamatan_id;
    let desa_id = req.body.desa_id;

    const check = await new Promise(resolve => {
        connection.query('SELECT COUNT(lkd_slug) AS cnt, lkd_id FROM tb_lkd WHERE lkd_id = ?', [lkd_id], function (error, rows, field) {
            if (error) {
                console.log(error)
            } else {
                resolve(rows[0]);
            }
        });
    });

    if (check.cnt > 0 && check.lkd_slug != lkd_slug) {
        response.error(false, "LKD Telah Terdaftar!", 'empty', res);
    } else {
        connection.query('UPDATE tb_lkd SET lkd_nama=?, lkd_slug=?, lkd_pengurus=?, lkd_anggota=?, kabupaten_id=?, kecamatan_id=?, desa_id=? WHERE lkd_id=?', [lkd_nama, lkd_slug, lkd_pengurus, lkd_anggota, kabupaten_id, kecamatan_id, desa_id, lkd_id], function (error, rows, field) {
            if (error) {
                console.log(error);
            } else {
                response.ok(true, "Berhasil Merubah Data!", 'success', res)
            }
        })
    }
});

router.delete('/:id', function (req, res) {
    var lkd_id = req.params.id;

    connection.query('DELETE FROM tb_lkd WHERE lkd_id=?', [lkd_id], function (error, rows, field) {
        if (error) {
            console.log(error)
        } else {
            response.ok(true, "Berhasil Menghapus Data!", 'success', res)
        }
    })
});

module.exports = router;