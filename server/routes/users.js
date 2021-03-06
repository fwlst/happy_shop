var express = require('express');
var router = express.Router();

var User = require('./../models/users');

/*
* 注册接口
* */
router.post('/register', (req, res, next) => {
  let param = {
    userName: req.body.username,
    userPwd: req.body.password
  };

  if (param.userName === '') {
    res.json({
      code: 600,
      msg: '用户名不能为空'
    })
  } else if (param.userPwd === '') {
    res.json({
      code: 600,
      msg: '密码不能为空'
    })
  } else {
    User.findOne({userName: param.userName}).then((doc,err) => {
      if (err) {
        res.json({
          code: 600,
          msg: err.message
        })
      } else {
        if (doc) {
          res.json({
            code: 600,
            msg: '用户已存在'
          });
        } else {
          User.create(param).then((createErr, createDoc) => {
            if (createErr) {
              res.json({
                code: 600,
                msg: err.message
              })
            } else {
              res.json({
                code: 200,
                data: {
                  session: createDoc,
                },
                msg: '注册成功'
              });
            }
          })
        }
      }
    });
  }
});

/*
* 登录接口
* */
router.post('/login', (req, res, next) => {
  let param = {
    userName: req.body.username,
    userPwd: req.body.password
  };
  if (param.userName === '') {
    res.json({
      code: 600,
      msg: '用户名不能为空'
    })
  } else if (param.userPwd === '') {
    res.json({
      code: 600,
      msg: '密码不能为空'
    })
  } else {
    User.findOne({userName: param.userName}).then((doc,err) => {
      if (err) {
        res.json({
          code: 600,
          msg: err.message
        })
      } else {
        if (doc) {
          if (doc.userPwd === param.userPwd) {
            req.session.userName = param.userName;
            res.json({
              code: 200,
              data: {
                session: param.userName,
              },
              msg: '登录成功'
            });
          } else {
            res.json({
              code: 600,
              data: '',
              msg: '账户名或密码错误'
            });
          }
        } else {
          res.json({
            code: 600,
            data: '',
            msg: '账户名不存在'
          });
        }
      }
    });
  }
});

/*
* 购物车详情接口
* */
router.post('/cartInfo', (req, res, next) => {
  let param = {
    userName: req.session.userName,
  };

  User.findOne(param).then((doc,err) => {
    if (err) {
      res.json({
        code: 600,
        msg: err.message
      })
    } else {
      if (doc) {
        let cartNub = 0;
        let cartList = doc.cartList;
        cartList.forEach((arr,index)=>{
          cartNub += arr.goodNum;
        });
        res.json({
          code: 200,
          data: {
            cartNub: cartNub,
            cartInfo: cartList,
          },
          msg: 'OK'
        });
      } else {
        res.json({
          code: 600,
          data: '',
          msg: '您的购物车还是空的'
        });
      }
    }
  });
});


module.exports = router;
