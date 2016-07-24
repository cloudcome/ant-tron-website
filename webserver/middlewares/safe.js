/**
 * 安全相关中间件
 * @author ydr.me
 * @create 2016-01-13 15:07
 */


'use strict';

var configs = require('../../configs');


// 头信息必须包含 host
exports.mustHasHeaderHost = function () {
    return function (req, res, next) {
        if (!req.headers.host) {
            return next(new Error('非法访问，无 headers.host'));
        }

        next();
    };
};


// 头信息添加 ua-compatible
exports.addUACompatibleHeader = function () {
    return function (req, res, next) {
        res.set('x-ua-compatible', 'IE=Edge,chrome=1');
        next();
    };
};


// 头信息添加 frame-options
exports.addFrameOptionsHeader = function () {
    return function (req, res, next) {
        res.set('x-frame-options', 'sameorigin');
        next();
    };
};


// 必须登录
exports.mustLogin = function () {
    return function (req, res, next) {
        var domain = req.hostname;

        if (domain === configs.pay.domain) {
            res.locals.$club = {};
            return next();
        }

        if (req.session.$user && req.session.$user.userId !== 0) {
            return next();
        }

        var err = new Error('请登录之后操作');
        err.code = 403;
        next(err);
    }
};

