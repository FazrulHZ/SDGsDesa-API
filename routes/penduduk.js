var express = require('express');
var router = express.Router();
var auth = require('../helper/auth');

var response = require('../helper/response');
var connection = require('../helper/connection');

router.get('/', auth, async function (req, res, next) {

    const role = req.user;

    const cekAuth = await new Promise(resolve => {
        connection.query('SELECT * FROM tb_user WHERE user_id = ?', [role.id], function (error, rows, field) {
            if (error) {
                console.log(error)
            } else {
                resolve(rows[0]);
            }
        });
    });

    if (cekAuth.user_lvl === '1') {

        const count = await new Promise(resolve => {
            connection.query('SELECT COUNT(*) AS cnt FROM tb_penduduk', function (error, rows, field) {
                if (error) {
                    console.log(error)
                } else {
                    resolve(rows[0].cnt);
                }
            });
        });

        connection.query('SELECT tb_penduduk.*, tb_kabupaten.kabupaten_nama, tb_kecamatan.kecamatan_nama, tb_desainfo.desa_nama, tb_rt.rt_nama FROM tb_penduduk LEFT JOIN tb_kabupaten ON tb_penduduk.kabupaten_id = tb_kabupaten.kabupaten_id LEFT JOIN tb_kecamatan ON tb_penduduk.kecamatan_id = tb_kecamatan.kecamatan_id LEFT JOIN tb_desainfo ON tb_penduduk.desa_id = tb_desainfo.desa_id LEFT JOIN tb_rt ON tb_penduduk.rt_id = tb_rt.rt_id ORDER BY tb_penduduk.created_at DESC', function (error, rows, field) {
            if (error) {
                console.log(error);
            } else {
                response.ok(true, 'Data Berhasil Diambil', count, rows, res);
            }
        });

    } else {

        const count = await new Promise(resolve => {
            connection.query('SELECT COUNT(*) AS cnt FROM tb_penduduk WHERE desa_id = ?', [cekAuth.desa_id], function (error, rows, field) {
                if (error) {
                    console.log(error)
                } else {
                    resolve(rows[0].cnt);
                }
            });
        });

        connection.query('SELECT tb_penduduk.*, tb_kabupaten.kabupaten_nama, tb_kecamatan.kecamatan_nama, tb_desainfo.desa_nama, tb_rt.rt_nama FROM tb_penduduk LEFT JOIN tb_kabupaten ON tb_penduduk.kabupaten_id = tb_kabupaten.kabupaten_id LEFT JOIN tb_kecamatan ON tb_penduduk.kecamatan_id = tb_kecamatan.kecamatan_id LEFT JOIN tb_desainfo ON tb_penduduk.desa_id = tb_desainfo.desa_id LEFT JOIN tb_rt ON tb_penduduk.rt_id = tb_rt.rt_id WHERE tb_penduduk.desa_id = ? ORDER BY tb_penduduk.created_at DESC', [cekAuth.desa_id], function (error, rows, field) {
            if (error) {
                console.log(error);
            } else {
                response.ok(true, 'Data Berhasil Diambil', count, rows, res);
            }
        });
    }

});

router.get('/:id', auth, function (req, res, next) {

    var penduduk_id = req.params.id;

    connection.query('SELECT * FROM tb_penduduk WHERE penduduk_id = ?', [penduduk_id],
        function (error, rows, field) {
            if (error) {
                console.log(error);
            } else {
                response.ok(true, 'Data Berhasil Diambil', 1, rows[0], res);
            }
        });
});

router.post('/', auth, async function (req, res, next) {

    const role = req.user;

    const cekAuth = await new Promise(resolve => {
        connection.query('SELECT * FROM tb_user WHERE user_id = ?', [role.id], function (error, rows, field) {
            if (error) {
                console.log(error)
            } else {
                resolve(rows[0]);
            }
        });
    });

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
    let kabupaten_id = cekAuth === '1' ? req.body.kabupaten_id : cekAuth.kabupaten_id;
    let kecamatan_id = cekAuth === '1' ? req.body.kecamatan_id : cekAuth.kecamatan_id;
    let desa_id = cekAuth === '1' ? req.body.desa_id : cekAuth.desa_id;
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
                response.ok(true, "Berhasil Menambahkan Data!", 1, 'success', res);
            }
        })
    }

});

router.put('/', auth, async function (req, res, next) {

    const role = req.user;

    const cekAuth = await new Promise(resolve => {
        connection.query('SELECT * FROM tb_user WHERE user_id = ?', [role.id], function (error, rows, field) {
            if (error) {
                console.log(error)
            } else {
                resolve(rows[0]);
            }
        });
    });

    let penduduk_id = req.body.penduduk_id;
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
    let kabupaten_id = cekAuth === '1' ? req.body.kabupaten_id : cekAuth.kabupaten_id;
    let kecamatan_id = cekAuth === '1' ? req.body.kecamatan_id : cekAuth.kecamatan_id;
    let desa_id = cekAuth === '1' ? req.body.desa_id : cekAuth.desa_id;
    let rt_id = req.body.rt_id;

    const check = await new Promise(resolve => {
        connection.query('SELECT COUNT(penduduk_nik) AS cnt, penduduk_id FROM tb_penduduk WHERE penduduk_nik = ?', [penduduk_nik], function (error, rows, field) {
            if (error) {
                console.log(error)
            } else {
                resolve(rows[0]);
            }
        });
    });

    if (check.cnt > 0 && check.penduduk_id != penduduk_id) {
        response.error(false, "NIK Telah Terdaftar!", 'empty', res);
    } else {
        connection.query('UPDATE tb_penduduk SET penduduk_nik=?, penduduk_nama=?, penduduk_kelamin=?, penduduk_tempatlahir=?, penduduk_tgllahir=?, penduduk_umur=?, penduduk_kawin=?, penduduk_agama=?, penduduk_suku=?, penduduk_wn=?, kabupaten_id=?, kecamatan_id=?, desa_id=?, rt_id=? WHERE penduduk_id=?', [penduduk_nik, penduduk_nama, penduduk_kelamin, penduduk_tempatlahir, penduduk_tgllahir, penduduk_umur, penduduk_kawin, penduduk_agama, penduduk_suku, penduduk_wn, kabupaten_id, kecamatan_id, desa_id, rt_id, penduduk_id], function (error, rows, field) {
            if (error) {
                console.log(error);
            } else {
                response.ok(true, "Berhasil Merubah Data!", 1, 'success', res)
            }
        })
    }
});

router.delete('/:id', auth, function (req, res) {
    var penduduk_id = req.params.id;

    connection.query('DELETE FROM tb_penduduk WHERE penduduk_id=?', [penduduk_id], function (error, rows, field) {
        if (error) {
            console.log(error)
        } else {
            response.ok(true, "Berhasil Menghapus Data!", 1, 'success', res)
        }
    })
});

module.exports = router;