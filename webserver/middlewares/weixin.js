/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-04 16:42
 */


'use strict';

var weixin = require('blear.node.weixin');
var console = require('blear.node.console');
var qs = require('blear.utils.querystring');
var object = require('blear.utils.object');
var typeis = require('blear.utils.typeis');
var howdo = require('blear.utils.howdo');
var random = require('blear.utils.random');


var configs = require('../../configs.js');
var redisKey = require('../static/redis-key');

var weixinAuthOptions = {
    appid: configs.weixin.appId,
    redirect_uri: '',
    response_type: 'code',
    scope: 'snsapi_userinfo'
};


weixin.config(configs.weixin);


exports.JSSDK = function () {
    return function (req, res, next) {
        var key = redisKey.WEIXIN_JS_API_TICKET + configs.weixin.appId;
        res.redis.get(key, function (err, tickect) {
            weixin.config({
                jsApiTicket: tickect
            });

            weixin.JSSDKSignature(req.$fullURL, function (err, signature) {
                if (err) {
                    return next(err);
                }

                console.log(signature);

                if (!tickect) {
                    res.redis.set(key, signature.jsApiTicket, 7000000);
                }

                res.locals.$weixinJSSDK = signature;
                next();
            });
        });
    };
};


exports.auth = function () {
    return function (req, res, next) {
        if (req.session.$weixinUser) {
            res.locals.$weixinUser = req.session.$weixinUser;
            return next();
        }

        var redirectURL = configs.weixin.authCallbackURL + qs.stringify({
                url: req.$fullURL
            });
        var q = object.assign({}, weixinAuthOptions, {
            redirect_uri: redirectURL,
            state: random.string()
        });
        var url = configs.weixin.authURL + qs.stringify(q);
        var code = req.query.code;

        if (typeis.Array(code)) {
            code = code.pop();
        }

        if (!code) {
            return res.redirect(url);
        }

        howdo
        // 获取 accessToken、openId
            .task(function (next) {
                weixin.getAccessToken(req.query.code, next);
            })
            // 获取用户基本信息
            .task(function (next, ao) {
                weixin.getUserInfo(ao.openId, ao.accessToken, next);
            })
            .follow(function (err, weixinUser) {
                if (err) {
                    return res.redirect(url);
                }

                res.locals.$weixinUser = req.session.$weixinUser = weixinUser;
                next();
            });
    };
};

