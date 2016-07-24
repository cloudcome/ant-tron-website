/**
 * main
 * @author ydr.me
 * @create 2016-07-24 13:13
 */


'use strict';

var Slider = require('blear.ui.slider');
var layout = require('blear.core.layout');
var selector = require('blear.core.selector');

var buildSlider = function () {
    var bannerEl = selector.query('#banner')[0];

    if (!bannerEl) {
        return;
    }

    var bannerRatio = 1366 / 377;
    var bannerWidth = layout.width(document);
    var bannerHeight = bannerWidth / bannerRatio;
    new Slider({
        el: bannerEl,
        width: bannerWidth,
        height: bannerHeight
    });
};


// ========================================================
// ========================================================
// ========================================================
buildSlider();
