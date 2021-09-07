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

router.get('/:id', auth, function (req, res, next) {

    var user_id = req.params.id;

    connection.query('SELECT * FROM tb_user WHERE user_id = ?', [user_id],
        function (error, rows, field) {
            if (error) {
                console.log(error);
            } else {
                response.ok(true, 'Data Berhasil Diambil', 1, rows[0], res);
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

    //Hash Password
    var salt = bcrypt.genSaltSync(10);
    var pass = bcrypt.hashSync('' + user_password + '', salt);

    const check = await new Promise(resolve => {
        connection.query('SELECT COUNT(user_ktp) AS cnt FROM tb_user WHERE user_ktp = ?', [user_ktp], function (error, rows, field) {
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
        connection.query('INSERT INTO tb_user (user_ktp, user_nama, user_name, user_password, user_tlp, user_alamat, user_foto, user_lvl) values(?, ?, ?, ?, ?, ?, ?, ?)', [user_ktp, user_nama, user_name, pass, user_tlp, user_alamat, user_foto, user_lvl], function (error, rows, field) {
            if (error) {
                console.log(error);
            } else {
                response.ok(true, "Berhasil Menambahkan Data!", 1, 'success', res);
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

    const check = await new Promise(resolve => {
        connection.query('SELECT COUNT(user_ktp) AS cnt, user_foto, user_id FROM tb_user WHERE user_ktp = ?', [user_ktp], function (error, rows, field) {
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
            response.error(false, "NIK Telah Terdaftar!", 'empty', res);
        } else {
            connection.query('UPDATE tb_user SET user_ktp=?, user_nama=?, user_name=?, user_tlp=?, user_alamat=?, user_foto=?, user_lvl=? WHERE user_id=?', [user_ktp, user_nama, user_tlp, user_alamat, user_foto, user_lvl, user_id], function (error, rows, field) {
                if (error) {
                    console.log(error);
                } else {
                    response.ok(true, "Berhasil Merubah Data!", 1, 'success', res)
                }
            })
        }
    } else {
        //Hash Password
        var salt = bcrypt.genSaltSync(10);
        var pass = bcrypt.hashSync('' + user_password + '', salt);

        if (check.cnt > 0 && check.user_id != user_id) {
            response.error(false, "NIK Telah Terdaftar!", 'empty', res);
        } else {
            connection.query('UPDATE tb_user SET user_ktp=?, user_nama=?, user_name=?, user_password=?, user_tlp=?, user_alamat=?, user_foto=? WHERE user_id=?', [user_ktp, user_nama, user_name, pass, user_tlp, user_alamat, user_foto, user_id], function (error, rows, field) {
                if (error) {
                    console.log(error);
                } else {
                    response.ok(true, "Berhasil Merubah Data!", 1, 'success', res)
                }
            })
        }
    }
});

router.delete('/:id', auth, async function (req, res) {
    var user_id = req.params.id;

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

module.exports = router;