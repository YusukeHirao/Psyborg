"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Psycle_1 = require("./classes/Psycle");
var PsycleEvent_1 = require("./classes/PsycleEvent");
var PsycleReflowTiming_1 = require("./classes/PsycleReflowTiming");
var PsycleRepeat_1 = require("./classes/PsycleRepeat");
require("./classes/PsycleTransitionFade");
require("./classes/PsycleTransitionFadeSVG");
require("./classes/PsycleTransitionSlide");
function psycle(selector, config) {
    var nodeList;
    if (typeof selector === 'string') {
        nodeList = document.querySelectorAll(selector);
    }
    else if (selector instanceof Element) {
        return [new Psycle_1.default($(selector), config)];
    }
    else {
        var list = [];
        for (var _i = 0, _a = Array.from(selector); _i < _a.length; _i++) {
            var el = _a[_i];
            list.push(new Psycle_1.default($(el), config));
        }
        return list;
    }
}
(function (psycle) {
    psycle.version = '@VERSION';
    psycle.Psycle = Psycle_1.default;
    psycle.PsycleEvent = PsycleEvent_1.default;
    psycle.PsycleReflowTiming = PsycleReflowTiming_1.default;
    psycle.PsycleRepeat = PsycleRepeat_1.default;
})(psycle || (psycle = {}));
Object.freeze(psycle);
