"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StyleSheet_1 = require("./StyleSheet");
var PsycleReflowTiming_1 = require("./PsycleReflowTiming");
var PsycleTransition_1 = require("./PsycleTransition");
PsycleTransition_1.default.create({
    fade: {
        init: function (psycle) {
            // スタイルを設定
            StyleSheet_1.default.posBase(psycle.container.$el);
            StyleSheet_1.default.posAbs(psycle.panels.$el);
        },
        reflow: function (psycle, info) {
            switch (info.timing) {
                case PsycleReflowTiming_1.default.TRANSITION_END:
                case PsycleReflowTiming_1.default.RESIZE_START:
                case PsycleReflowTiming_1.default.RESIZE_END:
                case PsycleReflowTiming_1.default.LOAD: {
                    if (psycle.config.resizable) {
                        psycle.stage.$el.height(psycle.panels.$el.height() || 0);
                    }
                    StyleSheet_1.default.z(psycle.panels.$el, 0);
                    StyleSheet_1.default.z(psycle.panels.item(psycle.to).$el, 10);
                    psycle.panels.$el.css({ opacity: 0 });
                    psycle.panels.item(psycle.to).$el.css({ opacity: 1 });
                    break;
                }
                default:
            }
        },
        silent: function () { },
        before: function () { },
        fire: function (psycle) {
            psycle.panels.item(psycle.to).$el.css({ opacity: 0 });
            StyleSheet_1.default.z(psycle.panels.item(psycle.to).$el, 20);
            if (psycle.animation) {
                psycle.animation.stop();
            }
            psycle.animation = psycle.panels.item(psycle.to).$el.animate({
                opacity: 1,
            }, {
                duration: psycle.config.duration,
            });
            if (psycle.config.crossFade) {
                psycle.panels.item(psycle.from).$el.animate({
                    opacity: 0,
                }, {
                    duration: psycle.config.duration,
                });
            }
        },
        cancel: function () { },
        after: function (psycle) {
            psycle.panels.$el.css({ opacity: 0 });
            psycle.panels.item(psycle.to).$el.css({ opacity: 1 });
        },
    },
});
