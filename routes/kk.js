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
            connection.query('SELECT COUNT(*) AS cnt FROM tb_keluarga', function (error, rows, field) {
                if (error) {
                    console.log(error)
                } else {
                    resolve(rows[0].cnt);
                }
            });
        });

        connection.query('SELECT tb_keluarga.*, tb_kabupaten.kabupaten_nama, tb_kecamatan.kecamatan_nama, tb_desainfo.desa_nama, tb_rt.rt_nama FROM tb_keluarga LEFT JOIN tb_kabupaten ON tb_keluarga.kabupaten_id = tb_kabupaten.kabupaten_id LEFT JOIN tb_kecamatan ON tb_keluarga.kecamatan_id = tb_kecamatan.kecamatan_id LEFT JOIN tb_desainfo ON tb_keluarga.desa_id = tb_desainfo.desa_id LEFT JOIN tb_rt ON tb_keluarga.rt_id = tb_rt.rt_id ORDER BY tb_keluarga.created_at DESC', function (error, rows, field) {
            if (error) {
                console.log(error);
            } else {
                response.ok(true, 'Data Berhasil Diambil', count, rows, res);
            }
        });

    } else {

        const count = await new Promise(resolve => {
            connection.query('SELECT COUNT(*) AS cnt FROM tb_keluarga WHERE desa_id = ?', [cekAuth.desa_id], function (error, rows, field) {
                if (error) {
                    console.log(error)
                } else {
                    resolve(rows[0].cnt);
                }
            });
        });

        connection.query('SELECT tb_keluarga.*, tb_kabupaten.kabupaten_nama, tb_kecamatan.kecamatan_nama, tb_desainfo.desa_nama, tb_rt.rt_nama FROM tb_keluarga LEFT JOIN tb_kabupaten ON tb_keluarga.kabupaten_id = tb_kabupaten.kabupaten_id LEFT JOIN tb_kecamatan ON tb_keluarga.kecamatan_id = tb_kecamatan.kecamatan_id LEFT JOIN tb_desainfo ON tb_keluarga.desa_id = tb_desainfo.desa_id LEFT JOIN tb_rt ON tb_keluarga.rt_id = tb_rt.rt_id WHERE tb_keluarga.desa_id = ? ORDER BY tb_keluarga.created_at DESC', [cekAuth.desa_id], function (error, rows, field) {
            if (error) {
                console.log(error);
            } else {
                response.ok(true, 'Data Berhasil Diambil', count, rows, res);
            }
        });
    }
});

router.get('/:id', auth, function (req, res, next) {

    var kk_id = req.params.id;

    connection.query('SELECT * FROM tb_keluarga WHERE kk_id = ?', [kk_id],
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

    let kk_no = req.body.kk_no;
    let kk_nama = req.body.kk_nama;
    let kk_nik = req.body.kk_nik;
    let kk_alamat = req.body.kk_alamat;
    let kk_tlp = req.body.kk_tlp;
    let kk_lahan = req.body.kk_lahan;
    let kk_lantai = req.body.kk_lantai;
    let kk_tanah = req.body.kk_tanah;
    let kabupaten_id = cekAuth === '1' ? req.body.kabupaten_id : cekAuth.kabupaten_id;
    let kecamatan_id = cekAuth === '1' ? req.body.kecamatan_id : cekAuth.kecamatan_id;
    let desa_id = cekAuth === '1' ? req.body.desa_id : cekAuth.desa_id;
    let rt_id = req.body.rt_id;

    const check = await new Promise(resolve => {
        connection.query('SELECT COUNT(*) AS cnt FROM tb_keluarga WHERE kk_no = ?', [kk_no], function (error, rows, field) {
            if (error) {
                console.log(error)
            } else {
                resolve(rows[0]);
            }
        });
    });

    if (check.cnt > 0) {
        response.error(false, "No Kartu Keluarga Telah Terdaftar!", 'empty', res);
    } else {
        connection.query('INSERT INTO tb_keluarga (kk_no, kk_nama, kk_nik, kk_alamat, kk_tlp, kk_lahan, kk_lantai, kk_tanah, kabupaten_id, kecamatan_id, desa_id, rt_id) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [kk_no, kk_nama, kk_nik, kk_alamat, kk_tlp, kk_lahan, kk_tanah, kk_lantai, kabupaten_id, kecamatan_id, desa_id, rt_id], function (error, rows, field) {
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

    let kk_id = req.body.kk_id;
    let kk_no = req.body.kk_no;
    let kk_nama = req.body.kk_nama;
    let kk_nik = req.body.kk_nik;
    let kk_alamat = req.body.kk_alamat;
    let kk_tlp = req.body.kk_tlp;
    let kk_lahan = req.body.kk_lahan;
    let kk_lantai = req.body.kk_lantai;
    let kk_tanah = req.body.kk_tanah;
    let kabupaten_id = cekAuth === '1' ? req.body.kabupaten_id : cekAuth.kabupaten_id;
    let kecamatan_id = cekAuth === '1' ? req.body.kecamatan_id : cekAuth.kecamatan_id;
    let desa_id = cekAuth === '1' ? req.body.desa_id : cekAuth.desa_id;
    let rt_id = req.body.rt_id;

    const check = await new Promise(resolve => {
        connection.query('SELECT COUNT(kk_id) AS cnt, kk_no FROM tb_keluarga WHERE kk_no = ?', [kk_no], function (error, rows, field) {
            if (error) {
                console.log(error)
            } else {
                resolve(rows[0]);
            }
        });
    });

    if (check.cnt > 0 && check.kk_no != kk_no) {
        response.error(false, "No Kartu Keluarga Telah Terdaftar!", 'empty', res);
    } else {
        connection.query('UPDATE tb_keluarga SET kk_no=?, kk_nama=?, kk_nik=?, kk_alamat=?, kk_tlp=?, kk_lahan=?, kk_lantai=?, kk_tanah=?, kabupaten_id=?, kecamatan_id=?, desa_id=?, rt_id=? WHERE kk_id=?', [kk_no, kk_nama, kk_nik, kk_alamat, kk_tlp, kk_lahan, kk_lantai, kk_tanah, kabupaten_id, kecamatan_id, desa_id, rt_id, kk_id], function (error, rows, field) {
            if (error) {
                console.log(error);
            } else {
                response.ok(true, "Berhasil Merubah Data!", 1, 'success', res)
            }
        })
    }
});

router.delete('/:id', auth, function (req, res) {
    var kk_id = req.params.id;

    connection.query('DELETE FROM tb_keluarga WHERE kk_id=?', [kk_id], function (error, rows, field) {
        if (error) {
            console.log(error)
        } else {
            response.ok(true, "Berhasil Menghapus Data!", 1, 'success', res)
        }
    })
});

module.exports = router;