"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StyleSheet_1 = require("../StyleSheet");
var PsycleReflowTiming_1 = require("./PsycleReflowTiming");
var PsycleTransition_1 = require("./PsycleTransition");
PsycleTransition_1.default.create({
    fade: {
        init: function () {
            // スタイルを設定
            StyleSheet_1.default.posBase(this.container.$el);
            StyleSheet_1.default.posAbs(this.panels.$el);
        },
        reflow: function (info) {
            switch (info.timing) {
                case PsycleReflowTiming_1.default.TRANSITION_END:
                case PsycleReflowTiming_1.default.RESIZE_START:
                case PsycleReflowTiming_1.default.RESIZE_END:
                case PsycleReflowTiming_1.default.LOAD: {
                    if (this.config.resizable) {
                        this.stage.$el.height(this.panels.$el.height());
                    }
                    StyleSheet_1.default.z(this.panels.$el, 0);
                    StyleSheet_1.default.z(this.panels.item(this.to).$el, 10);
                    this.panels.$el.css({ opacity: 0 });
                    this.panels.item(this.to).$el.css({ opacity: 1 });
                    break;
                }
                default:
            }
        },
        silent: function () { },
        before: function () { },
        fire: function () {
            this.panels.item(this.to).$el.css({ opacity: 0 });
            StyleSheet_1.default.z(this.panels.item(this.to).$el, 20);
            if (this.animation) {
                this.animation.stop();
            }
            this.animation = $.Animation(this.panels.item(this.to).$el[0], {
                opacity: 1,
            }, {
                duration: this.config.duration,
            });
            if (this.config.crossFade) {
                $.Animation(this.panels.item(this.from).$el[0], {
                    opacity: 0,
                }, {
                    duration: this.config.duration,
                });
            }
        },
        cancel: function () { },
        after: function () {
            var self = this;
            this.panels.$el.css({ opacity: 0 });
            this.panels.item(this.to).$el.css({ opacity: 1 });
        },
    },
});
