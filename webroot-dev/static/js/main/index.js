/**
 * 文件描述
 * @author ydr.me
 * @create 2016-07-24 13:13
 */


'use strict';

var Slider = require('blear.ui.slider');
var layout = require('blear.core.layout');

var buildSlider = function () {
    var bannerRatio = 1366/377;
    var bannerWidth = layout.width(document);
    var bannerHeight = bannerWidth/bannerRatio;
    new Slider({
        el: '#banner',
        width: bannerWidth,
        height: bannerHeight
    });
};


// ========================================================
// ========================================================
// ========================================================
buildSlider();
