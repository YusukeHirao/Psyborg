"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PsycleContainer_1 = require("./PsycleContainer");
var PsyclePanelList_1 = require("./PsyclePanelList");
var PsycleReflowTiming_1 = require("./PsycleReflowTiming");
var PsycleTransition_1 = require("./PsycleTransition");
var originRect = {
    width: 0,
    height: 0,
    scale: 1,
};
PsycleTransition_1.default.create({
    fadeSVG: {
        fallback: 'fade',
        fallbackFilter: function () {
            return !document.implementation.hasFeature;
        },
        init: function () {
            var width = this.getWidth();
            var height = this.getHeight();
            this.container.$el.hide();
            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', "" + width);
            svg.setAttribute('height', "" + height);
            $(svg).css('display', 'block');
            var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            svg.appendChild(g);
            var $panels = $();
            this.panels.each(function (i, panel) {
                var imgSrc = panel.$el.find('img').attr('src');
                var image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', imgSrc);
                image.setAttribute('width', "" + width);
                image.setAttribute('height', "" + height);
                image.setAttribute('visibility', 'visible');
                image.setAttribute('data-index', "" + i);
                g.appendChild(image);
                $panels = $panels.add($(image));
            });
            this.container = new PsycleContainer_1.default($(g));
            this.panels = new PsyclePanelList_1.default($panels);
            this.stage.el.appendChild(svg);
        },
        reflow: function (info) {
            var self = this;
            switch (info.timing) {
                case PsycleReflowTiming_1.default.TRANSITION_END:
                case PsycleReflowTiming_1.default.RESIZE_END:
                case PsycleReflowTiming_1.default.LOAD: {
                    if (this.config.resizable) {
                        var _a = this.stage.el.getBoundingClientRect(), width = _a.width, height = _a.height;
                        if (originRect.width && originRect.height) {
                            height = originRect.height / originRect.width * width;
                            originRect.scale = width / originRect.width;
                        }
                        else {
                            originRect.width = width;
                            originRect.height = height;
                        }
                        var svg = this.container.$el.closest('svg')[0];
                        svg.setAttribute('width', "" + width);
                        svg.setAttribute('height', "" + height);
                        this.panels.$el.attr({ width: width, height: height });
                    }
                    var to = this.panels.item(this.to);
                    // 重ね順
                    to.$el.appendTo(this.container.$el);
                    // 不透明度
                    to.$el.css({ opacity: 1 });
                    break;
                }
                case PsycleReflowTiming_1.default.RESIZE_START: {
                    break;
                }
                default:
            }
        },
        silent: function () { },
        before: function () { },
        fire: function () {
            var to = this.panels.item(this.to);
            var from = this.panels.item(this.from);
            if (this.animation) {
                this.animation.stop();
            }
            // 重ね順の更新
            to.$el.appendTo(this.container.$el);
            // フェード効果
            to.$el.css({ opacity: 0 });
            this.animation = to.$el.animate({
                opacity: 1,
            }, {
                duration: this.config.duration,
            });
            if (this.config.crossFade) {
                from.$el.animate({
                    opacity: 0,
                }, {
                    duration: this.config.duration,
                });
            }
        },
        cancel: function () { },
        after: function () { },
    },
});
