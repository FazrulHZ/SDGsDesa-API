var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

var response = require('../helper/response');
var connection = require('../helper/connection');

router.post('/', async function (req, res, next) {

    let user_ktp = req.body.user_ktp;
    let user_password = req.body.user_password;

    console.log("Input KTP: " + user_ktp);
    console.log("Input Password: " + user_password);

    const check = await new Promise(resolve => {
        connection.query('SELECT COUNT(user_ktp) AS cnt, user_password FROM tb_user WHERE user_ktp = ?', [user_ktp], function (error, rows, field) {
            if (error) {
                console.log(error)
            } else {
                resolve(rows[0]);
            }
        });
    });

    if (check.cnt > 0) {

        const hash = await new Promise(resolve => {
            connection.query('SELECT user_password AS pass FROM tb_user WHERE user_ktp = ?', [user_ktp], function (error, rows, field) {
                if (error) {
                    console.log(error)
                } else {
                    if (rows.length == 0) {
                        response.error404(res);
                    } else {
                        resolve(rows[0].pass);
                    }
                }
            });
        });

        var cekpass = bcrypt.compareSync(user_password, hash);
        console.log(hash);
        console.log(cekpass);

        if (cekpass) {
            connection.query('SELECT * FROM tb_user WHERE user_ktp = ?', [user_ktp], function (error, rows, field) {
                if (error) {
                    console.log(error);
                } else {
                    response.ok(true, "Berhasil Menambahkan Data!", 1, rows[0], res);
                }
            })
        } else {
            response.error(false, "Password Anda Salah!", 'empty', res);
        }

    } else {
        response.error(false, "NIK Anda Tidak Terdaftar!", 'empty', res);
    }

});

module.exports = router;