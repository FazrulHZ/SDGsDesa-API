var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var bcrypt = require('bcryptjs');
var auth = require('../helper/auth');
const fs = require('fs')

let slugify = require('slugify')

var response = require('../helper/response');
var connection = require('../helper/connection');

var storage = multer.diskStorage({
    destination: path.join(__dirname + './../public/upload/userGambar'),
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({ storage: storage });

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

    if (cekAuth.user_lvl !== '1') {
        return response.noAkses(res);
    }

    const count = await new Promise(resolve => {
        connection.query('SELECT COUNT(*) AS cnt FROM tb_user', function (error, rows, field) {
            if (error) {
                console.log(error)
            } else {
                resolve(rows[0].cnt);
            }
        });
    });

    connection.query('SELECT * FROM tb_user WHERE user_ktp != 531414009 ORDER BY created_at DESC', function (error, rows, field) {
        if (error) {
            console.log(error);
        } else {
            response.ok(true, 'Data Berhasil Diambil', count, rows, res);
        }
    });
});

router.post('/', auth, upload.single('user_foto'), async function (req, res, next) {

    let user_ktp = req.body.user_ktp;
    let user_nama = req.body.user_nama;
    let user_name = req.body.user_name;
    let user_password = req.body.user_password;
    let user_tlp = req.body.user_tlp;
    let user_alamat = req.body.user_alamat;
    let user_foto = req.file === undefined ? "" : req.file.filename;
    let user_lvl = req.body.user_lvl;
    let kabupaten_id = req.body.kabupaten_id;
    let kecamatan_id = req.body.kecamatan_id;
    let desa_id = req.body.desa_id;

    //Hash Password
    var salt = bcrypt.genSaltSync(10);
    var pass = bcrypt.hashSync('' + user_password + '', salt);

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

    if (cekAuth.user_lvl !== '1') {
        return response.noAkses(res);
    }

    const check = await new Promise(resolve => {
        connection.query('SELECT COUNT(user_name) AS cnt FROM tb_user WHERE user_name = ?', [user_name], function (error, rows, field) {
            if (error) {
                console.log(error)
            } else {
                resolve(rows[0]);
            }
        });
    });

    if (check.cnt > 0) {
        response.error(false, "Username Telah Terdaftar!", 'empty', res);
    } else {
        connection.query('INSERT INTO tb_user (user_ktp, user_nama, user_name, user_password, user_tlp, user_alamat, user_foto, user_lvl, kabupaten_id, kecamatan_id, desa_id) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [user_ktp, user_nama, user_name, pass, user_tlp, user_alamat, user_foto, user_lvl, kabupaten_id, kecamatan_id, desa_id], function (error, rows, field) {
            if (error) {
                console.log(error);
            } else {
                response.ok(true, "Berhasil Menambahkan Data!", 0, 'success', res);
            }
        })
    }

});

router.put('/', auth, upload.single('user_foto'), async function (req, res, next) {

    let user_id = req.body.user_id;
    let user_ktp = req.body.user_ktp;
    let user_nama = req.body.user_nama;
    let user_name = req.body.user_name;
    let user_password = req.body.user_password;
    let user_tlp = req.body.user_tlp;
    let user_alamat = req.body.user_alamat;
    let user_lvl = req.body.user_lvl;
    let kabupaten_id = req.body.kabupaten_id;
    let kecamatan_id = req.body.kecamatan_id;
    let desa_id = req.body.desa_id;

    const check = await new Promise(resolve => {
        connection.query('SELECT COUNT(user_name) AS cnt, user_foto, user_id FROM tb_user WHERE user_name = ?', [user_ktp], function (error, rows, field) {
            if (error) {
                console.log(error)
            } else {
                resolve(rows[0]);
            }
        });
    });

    let user_foto = req.file === undefined ? check.user_foto : req.file.filename;

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

    if (cekAuth.user_lvl !== '1') {
        return response.noAkses(res);
    }

    if (user_password == "") {
        if (check.cnt > 0 && check.user_id != user_id) {
            response.error(false, "Username Telah Terdaftar!", 'empty', res);
        } else {
            connection.query('UPDATE tb_user SET user_ktp=?, user_nama=?, user_name=?, user_tlp=?, user_alamat=?, user_foto=?, user_lvl=?, kabupaten_id=?, kecamatan_id=?, desa_id=? WHERE user_id=?', [user_ktp, user_nama, user_name, user_tlp, user_alamat, user_foto, user_lvl, kabupaten_id, kecamatan_id, desa_id, user_id], function (error, rows, field) {
                if (error) {
                    console.log(error);
                } else {
                    response.ok(true, "Berhasil Merubah Data!", 0, 'success', res)
                }
            })
        }
    } else {
        //Hash Password
        var salt = bcrypt.genSaltSync(10);
        var pass = bcrypt.hashSync('' + user_password + '', salt);

        if (check.cnt > 0 && check.user_id != user_id) {
            response.error(false, "Username Telah Terdaftar!", 'empty', res);
        } else {
            connection.query('UPDATE tb_user SET user_ktp=?, user_nama=?, user_name=?, user_password=?, user_tlp=?, user_alamat=?, user_foto=?, user_lvl=?, kabupaten_id=?, kecamatan_id=?, desa_id=? WHERE user_id=?', [user_ktp, user_nama, user_name, pass, user_tlp, user_alamat, user_foto, user_lvl, kabupaten_id, kecamatan_id, desa_id, user_id], function (error, rows, field) {
                if (error) {
                    console.log(error);
                } else {
                    response.ok(true, "Berhasil Merubah Data!", 0, 'success', res)
                }
            })
        }
    }
});

router.delete('/:id', auth, async function (req, res) {
    var user_id = req.params.id;

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

    if (cekAuth.user_lvl !== '1') {
        return response.noAkses(res);
    }

    const check = await new Promise(resolve => {
        connection.query('SELECT * FROM tb_user WHERE user_id = ?', [user_id], function (error, rows, field) {
            if (error) {
                console.log(error)
            } else {
                resolve(rows[0]);
            }
        });
    });

    if (check.user_foto == "") {
        connection.query('DELETE FROM tb_user WHERE user_id=?', [user_id], function (error, rows, field) {
            if (error) {
                console.log(error)
            } else {
                response.ok(true, "Berhasil Menghapus Data!", 1, 'success', res)
            }
        })
    } else {
        fs.unlink("./public/upload/userGambar/" + check.user_foto, (err) => {
            if (err) {
                console.log("failed to delete local image:" + err);
            } else {
                console.log('successfully deleted local image');
                connection.query('DELETE FROM tb_user WHERE user_id=?', [user_id], function (error, rows, field) {
                    if (error) {
                        console.log(error)
                    } else {
                        response.ok(true, "Berhasil Menghapus Data!", 1, 'success', res)
                    }
                })
            }
        });
    }
});

router.get('/profil', auth, async function (req, res, next) {

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

    connection.query('SELECT * FROM tb_user WHERE user_id = ?', [role.id], function (error, rows, field) {
        if (error) {
            console.log(error);
        } else {
            response.ok(true, 'Data Berhasil Diambil', 1, rows[0], res);
        }
    });
});

router.put('/profil', auth, upload.single('desa_foto'), async function (req, res, next) {

    let user_id = req.body.user_id;
    let user_ktp = req.body.user_ktp;
    let user_nama = req.body.user_nama;
    let user_name = req.body.user_name;
    let user_password = req.body.user_password;
    let user_tlp = req.body.user_tlp;
    let user_alamat = req.body.user_alamat;
    let user_lvl = req.body.user_lvl;
    let kabupaten_id = req.body.kabupaten_id;
    let kecamatan_id = req.body.kecamatan_id;
    let desa_id = req.body.desa_id;

    const check = await new Promise(resolve => {
        connection.query('SELECT COUNT(user_name) AS cnt, user_foto, user_id FROM tb_user WHERE user_name = ?', [user_name], function (error, rows, field) {
            if (error) {
                console.log(error)
            } else {
                resolve(rows[0]);
            }
        });
    });

    let user_foto = req.file === undefined ? check.user_foto : req.file.filename;

    if (user_password == "") {
        if (check.cnt > 0 && check.user_id != user_id) {
            response.error(false, "Username Telah Terdaftar!", 'empty', res);
        } else {
            connection.query('UPDATE tb_user SET user_ktp=?, user_nama=?, user_name=?, user_tlp=?, user_alamat=?, user_foto=?, user_lvl=?, kabupaten_id=?, kecamatan_id=?, desa_id=? WHERE user_id=?', [user_ktp, user_nama, user_name, user_tlp, user_alamat, user_foto, user_lvl, kabupaten_id, kecamatan_id, desa_id, user_id], function (error, rows, field) {
                if (error) {
                    console.log(error);
                } else {
                    response.ok(true, "Berhasil Merubah Data!", 0, 'success', res)
                }
            })
        }
    } else {
        //Hash Password
        var salt = bcrypt.genSaltSync(10);
        var pass = bcrypt.hashSync('' + user_password + '', salt);

        if (check.cnt > 0 && check.user_id != user_id) {
            response.error(false, "Username Telah Terdaftar!", 'empty', res);
        } else {
            connection.query('UPDATE tb_user SET user_ktp=?, user_nama=?, user_name=?, user_password=?, user_tlp=?, user_alamat=?, user_foto=?, user_lvl=?, kabupaten_id=?, kecamatan_id=?, desa_id=? WHERE user_id=?', [user_ktp, user_nama, user_name, pass, user_tlp, user_alamat, user_foto, user_lvl, kabupaten_id, kecamatan_id, desa_id, user_id], function (error, rows, field) {
                if (error) {
                    console.log(error);
                } else {
                    response.ok(true, "Berhasil Merubah Data!", 0, 'success', res)
                }
            })
        }
    }
});

module.exports = router;