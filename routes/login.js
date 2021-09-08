var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var response = require('../helper/response');
var connection = require('../helper/connection');
var config = require('../helper/config');

router.post('/', async function (req, res, next) {

    let user_name = req.body.user_name;
    let user_password = req.body.user_password;

    const check = await new Promise(resolve => {
        connection.query('SELECT COUNT(user_name) AS cnt, user_password, user_id FROM tb_user WHERE user_name = ?', [user_name], function (error, rows, field) {
            if (error) {
                console.log(error)
            } else {
                resolve(rows[0]);
            }
        });
    });

    //Yang Mo Return
    let token = await jwt.sign({ id: check.user_id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
    });

    if (check.cnt > 0) {

        const hash = await new Promise(resolve => {
            connection.query('SELECT user_password AS pass FROM tb_user WHERE user_name = ?', [user_name], function (error, rows, field) {
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

        if (cekpass) {
            connection.query('SELECT * FROM tb_user WHERE user_name = ?', [user_name], function (error, rows, field) {
                if (error) {
                    console.log(error);
                } else {
                    response.ok(true, "Berhasil Mengambil Data!", 0, { identitas: rows[0], token: token }, res);
                }
            })
        } else {
            response.error(false, "Password Anda Salah!", 'empty', res);
        }

    } else {
        response.error(false, "Username Anda Tidak Terdaftar!", 'empty', res);
    }

});

module.exports = router;