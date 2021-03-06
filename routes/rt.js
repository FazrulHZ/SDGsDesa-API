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
            connection.query('SELECT COUNT(*) AS cnt FROM tb_rt', function (error, rows, field) {
                if (error) {
                    console.log(error)
                } else {
                    resolve(rows[0].cnt);
                }
            });
        });

        connection.query('SELECT tb_rt.*, tb_kabupaten.kabupaten_nama, tb_kecamatan.kecamatan_nama, tb_desainfo.desa_nama FROM tb_rt LEFT JOIN tb_kabupaten ON tb_rt.kabupaten_id = tb_kabupaten.kabupaten_id LEFT JOIN tb_kecamatan ON tb_rt.kecamatan_id = tb_kecamatan.kecamatan_id LEFT JOIN tb_desainfo ON tb_rt.desa_id = tb_desainfo.desa_id ORDER BY tb_rt.created_at DESC', function (error, rows, field) {
            if (error) {
                console.log(error);
            } else {
                response.ok(true, 'Data Berhasil Diambil', count, rows, res);
            }
        });

    } else {

        const count = await new Promise(resolve => {
            connection.query('SELECT COUNT(*) AS cnt FROM tb_rt WHERE desa_id = ?', [cekAuth.desa_id], function (error, rows, field) {
                if (error) {
                    console.log(error)
                } else {
                    resolve(rows[0].cnt);
                }
            });
        });

        connection.query('SELECT tb_rt.*, tb_kabupaten.kabupaten_nama, tb_kecamatan.kecamatan_nama, tb_desainfo.desa_nama FROM tb_rt LEFT JOIN tb_kabupaten ON tb_rt.kabupaten_id = tb_kabupaten.kabupaten_id LEFT JOIN tb_kecamatan ON tb_rt.kecamatan_id = tb_kecamatan.kecamatan_id LEFT JOIN tb_desainfo ON tb_rt.desa_id = tb_desainfo.desa_id WHERE tb_rt.desa_id = ? ORDER BY tb_rt.created_at DESC', [cekAuth.desa_id], function (error, rows, field) {
            if (error) {
                console.log(error);
            } else {
                response.ok(true, 'Data Berhasil Diambil', count, rows, res);
            }
        });
    }
});

router.get('/:id', auth, function (req, res, next) {

    var rt_id = req.params.id;

    connection.query('SELECT * FROM tb_rt WHERE rt_id = ?', [rt_id],
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

    let rt_nama = req.body.rt_nama;
    let rt_ketua = req.body.rt_ketua;
    let rt_alamat = req.body.rt_alamat;
    let rt_tlp = req.body.rt_tlp;
    let rt_topografi = req.body.rt_topografi;
    let rt_jumlah_warga = req.body.rt_jumlah_warga;
    let kabupaten_id = cekAuth.user_lvl === '1' ? req.body.kabupaten_id : cekAuth.kabupaten_id;
    let kecamatan_id = cekAuth.user_lvl === '1' ? req.body.kecamatan_id : cekAuth.kecamatan_id;
    let desa_id = cekAuth.user_lvl === '1' ? req.body.desa_id : cekAuth.desa_id;

    const check = await new Promise(resolve => {
        connection.query('SELECT COUNT(rt_id) AS cnt, kabupaten_id, kecamatan_id, desa_id FROM tb_rt WHERE rt_nama = ? AND kabupaten_id=? AND kecamatan_id=? AND desa_id=?', [rt_nama, kabupaten_id, kecamatan_id, desa_id], function (error, rows, field) {
            if (error) {
                console.log(error)
            } else {
                resolve(rows[0]);
            }
        });
    });

    if (check.cnt > 0 && check.kabupaten_id == kabupaten_id && check.kecamatan_id == kecamatan_id && check.desa_id == desa_id) {
        response.error(false, "RT/RW Telah Terdaftar!", 'empty', res);
    } else {
        connection.query('INSERT INTO tb_rt (rt_nama, rt_ketua, rt_alamat, rt_tlp, rt_topografi, rt_jumlah_warga, kabupaten_id, kecamatan_id, desa_id) values(?, ?, ?, ?, ?, ?, ?, ?, ?)', [rt_nama, rt_ketua, rt_alamat, rt_tlp, rt_topografi, rt_jumlah_warga, kabupaten_id, kecamatan_id, desa_id], function (error, rows, field) {
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

    let rt_id = req.body.rt_id;
    let rt_nama = req.body.rt_nama;
    let rt_ketua = req.body.rt_ketua;
    let rt_alamat = req.body.rt_alamat;
    let rt_tlp = req.body.rt_tlp;
    let rt_topografi = req.body.rt_topografi;
    let rt_jumlah_warga = req.body.rt_jumlah_warga;
    let kabupaten_id = cekAuth === '1' ? req.body.kabupaten_id : cekAuth.kabupaten_id;
    let kecamatan_id = cekAuth === '1' ? req.body.kecamatan_id : cekAuth.kecamatan_id;
    let desa_id = req.body.desa_id;

    const check = await new Promise(resolve => {
        connection.query('SELECT COUNT(rt_id) AS cnt, kabupaten_id, kecamatan_id, desa_id, rt_id FROM tb_rt WHERE rt_nama = ? AND kabupaten_id=? AND kecamatan_id=? AND desa_id=?', [rt_nama, kabupaten_id, kecamatan_id, desa_id], function (error, rows, field) {
            if (error) {
                console.log(error)
            } else {
                resolve(rows[0]);
            }
        });
    });

    if (check.cnt > 0 && check.kabupaten_id == kabupaten_id && check.kecamatan_id == kecamatan_id && check.desa_id == desa_id && check.rt_id != rt_id) {
        response.error(false, "RT/RW Telah Terdaftar!", 'empty', res);
    } else {
        connection.query('UPDATE tb_rt SET rt_nama=?, rt_ketua=?, rt_alamat=?, rt_tlp=?, rt_topografi=?, rt_jumlah_warga=?, kabupaten_id=?, kecamatan_id=?, desa_id=? WHERE rt_id=?', [rt_nama, rt_ketua, rt_alamat, rt_tlp, rt_topografi, rt_jumlah_warga, kabupaten_id, kecamatan_id, desa_id, rt_id], function (error, rows, field) {
            if (error) {
                console.log(error);
            } else {
                response.ok(true, "Berhasil Merubah Data!", 1, 'success', res)
            }
        })
    }
});

router.delete('/:id', auth, function (req, res) {
    var rt_id = req.params.id;

    connection.query('DELETE FROM tb_rt WHERE rt_id=?', [rt_id], function (error, rows, field) {
        if (error) {
            console.log(error)
        } else {
            response.ok(true, "Berhasil Menghapus Data!", 1, 'success', res)
        }
    })
});

module.exports = router;