"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Psycle_1 = require("./classes/Psycle");
var PsycleEvent_1 = require("./classes/PsycleEvent");
var PsycleReflowTiming_1 = require("./classes/PsycleReflowTiming");
var PsycleRepeat_1 = require("./classes/PsycleRepeat");
require("./classes/PsycleTransitionFade");
require("./classes/PsycleTransitionFadeSVG");
require("./classes/PsycleTransitionSlide");
$.fn['psycle'] = function (config) {
    if (this.length === 0) {
        if (console && console.warn) {
            console.warn('This jQuery object is empty.');
        }
    }
    return this.each(function () {
        new Psycle_1.default($(this), config);
    });
};
$['Psycle'] = Psycle_1.default; // tslint:disable-line:no-string-literal
$['PsycleEvent'] = PsycleEvent_1.default; // tslint:disable-line:no-string-literal
$['PsycleRepeat'] = PsycleRepeat_1.default; // tslint:disable-line:no-string-literal
$['PsycleReflowTiming'] = PsycleReflowTiming_1.default; // tslint:disable-line:no-string-literal
