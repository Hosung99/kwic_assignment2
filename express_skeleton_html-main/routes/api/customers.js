const { query } = require("express");
const express = require("express");
const mysql = require("../../mysql/index");
const router = express.Router();
const fs = require("fs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = 'MY-SECRET-KEY';
const auth = require('../../app');

router.get("/idcheck", async (req, res) => {
    const customers = await mysql.query("customerList");
    res.send(customers);
});
//read

router.post('/login', async (req, res, next) => {
    var id = req.body.x;
    var password = req.body.b;
    const customers = await mysql.query("customerList");
    var i;
    for (i = 0; i < customers.length; i++) {
        if (id == customers[i].id) {
            break;
        }
    }
    if (i == customers.length) {
        return res.status(200).json({
            code: 200,
            message: '아이디 오류입니다.',
        });
    }
    //jwt.sign(payload, secretOrPrivateKey, [options, callback])
    token = jwt.sign({
        type: 'JWT',
        nickname: id,
    }, SECRET_KEY, {
        expiresIn: '15m', // 만료시간 15분
        issuer: '토큰발급자',
    });
    if ((id == customers[i].id) && (password == customers[i].password)) {
        console.log("토큰 발급");
        return res.status(200).json({
            code: 200,
            message: '토큰이 발급되었습니다.',
            token: token
        });
    } else {
        return res.status(200).json({
            code: 200,
            message: '비밀번호  오류입니다.',
        });
    }
});

router.post("/insert", async (req, res) => {

    var username = req.body.id;
    var password = req.body.pwd;

    console.log(username);
    const result = await mysql.query("customerInsert", [username, password]);
    fs.readFile("./views/login.html", (err, data) => {
        if (err) {
            res.send("error");
        } else {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            res.end();
        }
    });

});
//create

/*
router.put("/update", async (req, res) => {
    try {
        const result = await mysql.query("customerUpdate", req.body.param);
        res.send(result);
    }
    catch {
        console.log("error");
    }
});
//update

router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    const result = await mysql.query("customerDelete", id); //id가 customerDelete의 ?에 들어가게 된다.
    res.send(result);
});
*/

module.exports = router;
