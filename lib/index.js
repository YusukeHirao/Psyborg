"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Psycle_1 = require("./psyborg/Psycle/Psycle");
var PsycleEvent_1 = require("./psyborg/Psycle/PsycleEvent");
var PsycleReflowTiming_1 = require("./psyborg/Psycle/PsycleReflowTiming");
var PsycleRepeat_1 = require("./psyborg/Psycle/PsycleRepeat");
require("./psyborg/Psycle/PsycleTransitionFade");
require("./psyborg/Psycle/PsycleTransitionFadeSVG");
require("./psyborg/Psycle/PsycleTransitionSlide");
$.fn.psycle = function (config) {
    if (this.length === 0) {
        if (console && console.warn) {
            console.warn('This jQuery object is empty.');
        }
    }
    return this.each(function () {
        new Psycle_1.default($(this), config); // tslint:disable-line:no-invalid-this no-unused-expression
    });
};
$['Psycle'] = Psycle_1.default; // tslint:disable-line:no-string-literal
$['PsycleEvent'] = PsycleEvent_1.default; // tslint:disable-line:no-string-literal
$['PsycleRepeat'] = PsycleRepeat_1.default; // tslint:disable-line:no-string-literal
$['PsycleReflowTiming'] = PsycleReflowTiming_1.default; // tslint:disable-line:no-string-literal
