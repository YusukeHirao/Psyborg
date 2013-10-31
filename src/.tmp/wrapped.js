/**
 * Psyborg.js - v0.2.1 r657
 * update: 2013-10-31
 * Author: Yusuke Hirao [http://www.yusukehirao.com]
 * Github: https://github.com/YusukeHirao/Psyborg
 * License: Licensed under the MIT License
 * Require: jQuery v1.10.x
 */

!function(){
'use strict';

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var psyborg;
(function (psyborg) {
    var $ = jQuery;

    (function (PsycleRepeat) {
        PsycleRepeat[PsycleRepeat["NONE"] = 0] = "NONE";
        PsycleRepeat[PsycleRepeat["RETURN"] = 1] = "RETURN";
        PsycleRepeat[PsycleRepeat["LOOP"] = 2] = "LOOP";
    })(psyborg.PsycleRepeat || (psyborg.PsycleRepeat = {}));
    var PsycleRepeat = psyborg.PsycleRepeat;

    (function (PsycleEvent) {
        PsycleEvent[PsycleEvent["INIT"] = 0] = "INIT";
        PsycleEvent[PsycleEvent["PANEL_CHANGE_START"] = 1] = "PANEL_CHANGE_START";
        PsycleEvent[PsycleEvent["PANEL_CHANGE_END"] = 2] = "PANEL_CHANGE_END";
        PsycleEvent[PsycleEvent["PANEL_CHANGE_CANCEL"] = 3] = "PANEL_CHANGE_CANCEL";
        PsycleEvent[PsycleEvent["WAIT_START"] = 4] = "WAIT_START";
        PsycleEvent[PsycleEvent["WAIT_END"] = 5] = "WAIT_END";
    })(psyborg.PsycleEvent || (psyborg.PsycleEvent = {}));
    var PsycleEvent = psyborg.PsycleEvent;

    (function (PsycleReflowTiming) {
        PsycleReflowTiming[PsycleReflowTiming["INIT"] = 0] = "INIT";
        PsycleReflowTiming[PsycleReflowTiming["TRANSITION_END"] = 1] = "TRANSITION_END";
        PsycleReflowTiming[PsycleReflowTiming["RESIZE"] = 2] = "RESIZE";
        PsycleReflowTiming[PsycleReflowTiming["RESIZE_START"] = 3] = "RESIZE_START";
        PsycleReflowTiming[PsycleReflowTiming["RESIZE_END"] = 4] = "RESIZE_END";
    })(psyborg.PsycleReflowTiming || (psyborg.PsycleReflowTiming = {}));
    var PsycleReflowTiming = psyborg.PsycleReflowTiming;

    var CustomEvent = (function () {
        function CustomEvent(type) {
            this.type = type;
            this.defaultPrevented = false;
            this.timeStamp = new Date().valueOf();
        }
        CustomEvent.prototype.preventDefault = function () {
            this.defaultPrevented = true;
        };
        return CustomEvent;
    })();

    var PsyborgEventDispacther = (function () {
        function PsyborgEventDispacther() {
            this._listeners = {};
        }
        PsyborgEventDispacther.prototype.on = function (types, listener) {
            var typeList = types.split(/\s+/);
            var i = 0;
            var l = typeList.length;
            for (; i < l; i++) {
                this._listeners[typeList[i]] = listener;
            }
        };
        PsyborgEventDispacther.prototype.off = function (types, listener) {
            var typeList = types.split(/\s+/);
            var i = 0;
            var l = typeList.length;
            var type;
            for (; i < l; i++) {
                type = typeList[i];
                if (listener == null || this._listeners[type] === listener) {
                    delete this._listeners[type];
                }
            }
        };
        PsyborgEventDispacther.prototype.trigger = function (type, data, context) {
            if (typeof data === "undefined") { data = {}; }
            if (typeof context === "undefined") { context = this; }
            var listener;
            if (listener = this._listeners[type]) {
                var e = new CustomEvent(type);
                e.data = data;
                listener.call(context, e);
                return !e.defaultPrevented;
            }
            return true;
        };
        return PsyborgEventDispacther;
    })();
    psyborg.PsyborgEventDispacther = PsyborgEventDispacther;

    var PsycleTransition = (function () {
        function PsycleTransition(name, process) {
            this.name = name;
            $.extend(this, process);
        }
        PsycleTransition.create = function (extend) {
            var transitionName;
            var transition;
            for (transitionName in extend) {
                transition = new PsycleTransition(transitionName, extend[transitionName]);
                PsycleTransition.transitions[transitionName] = transition;
            }
        };
        PsycleTransition.transitions = {};
        return PsycleTransition;
    })();
    psyborg.PsycleTransition = PsycleTransition;

    var PsyclePanel = (function () {
        function PsyclePanel($el, index, list) {
            this.index = index;
            this.$el = $el;
            this._list = list;
        }
        PsyclePanel.prototype.show = function () {
            this.$el.show();
            return this;
        };

        PsyclePanel.prototype.hide = function () {
            this.$el.hide();
            return this;
        };

        PsyclePanel.prototype.clone = function () {
            var clone = new PsyclePanelClone(this.$el.clone(), this.index, this._list);
            this.$el.after(clone.$el);
            this._list.clones.push(clone);
            return clone;
        };
        return PsyclePanel;
    })();
    psyborg.PsyclePanel = PsyclePanel;

    var PsyclePanelClone = (function (_super) {
        __extends(PsyclePanelClone, _super);
        function PsyclePanelClone($el, index, list) {
            _super.call(this, $el, index, list);
            this.$el.addClass('__psycle_panel_clone__');
        }
        return PsyclePanelClone;
    })(PsyclePanel);
    psyborg.PsyclePanelClone = PsyclePanelClone;

    var PsyclePanelList = (function () {
        function PsyclePanelList($el) {
            this.el = [];
            this.clones = [];
            this.length = 0;
            this.$el = $el;
            var i = 0;
            var l = $el.length;
            var $panel;
            for (; i < l; i++) {
                $panel = $($el[i]);
                this.add($panel);
            }
        }
        PsyclePanelList.prototype.add = function ($el) {
            var index = this.el.length;
            var panel = new PsyclePanel($el, index, this);
            this.el.push(panel);
            this.length += 1;
            return this;
        };

        PsyclePanelList.prototype.remove = function (index, removeFromDOM) {
            if (typeof removeFromDOM === "undefined") { removeFromDOM = true; }
            if (removeFromDOM) {
                this.$el.eq(index).remove();
            }
            this.el.splice(index, 1);
            this._renumbering();
            this.length -= 1;
            return this;
        };

        PsyclePanelList.prototype.item = function (searchIndex) {
            var index = this._getRealIndex(searchIndex);
            return this.el[index];
        };

        PsyclePanelList.prototype.each = function (callback) {
            var i = 0;
            var l = this.el.length;
            var panel;
            for (; i < l; i++) {
                panel = this.el[i];
                callback.call(panel, panel.index, panel);
            }
        };

        PsyclePanelList.prototype.show = function () {
            this.$el.show();
            return this;
        };

        PsyclePanelList.prototype.hide = function () {
            this.$el.hide();
            return this;
        };

        PsyclePanelList.prototype.removeClone = function () {
            var i = 0;
            var l = this.clones.length;
            for (; i < l; i++) {
                this.clones[i].$el.remove();
            }
            this.clones = [];
            return this;
        };

        PsyclePanelList.prototype._getRealIndex = function (searchIndex) {
            var length = this.el.length;
            searchIndex = searchIndex % length;
            var index = searchIndex < 0 ? length + searchIndex : searchIndex;
            return index;
        };

        PsyclePanelList.prototype._renumbering = function () {
            var i = 0;
            var l = this.el.length;
            for (; i < l; i++) {
                this.el[i].index = i;
            }
            return l;
        };
        return PsyclePanelList;
    })();
    psyborg.PsyclePanelList = PsyclePanelList;

    var PsycleContainer = (function () {
        function PsycleContainer($el) {
            this.$el = $el;
        }
        return PsycleContainer;
    })();
    psyborg.PsycleContainer = PsycleContainer;

    var PsycleStage = (function () {
        function PsycleStage($el) {
            this.$el = $el;
        }
        return PsycleStage;
    })();
    psyborg.PsycleStage = PsycleStage;

    var Psycle = (function (_super) {
        __extends(Psycle, _super);
        function Psycle($el, options) {
            _super.call(this);
            this.index = 0;
            this.vector = 1;
            this.isTransition = false;
            this.isPaused = false;

            var defaults = {
                startIndex: 0,
                transition: 'slide',
                duration: 600,
                easing: 'swing',
                delay: 3000,
                auto: true,
                cancel: true,
                repeat: PsycleRepeat.RETURN,
                container: '>ul:eq(0)',
                panels: '>li',
                cols: 1,
                rows: 1,
                offsetX: 0,
                offsetY: 0,
                innerFocus: false,
                noFocus: true,
                bindKeyboard: false,
                showOnlyOnce: null,
                controller: null,
                marker: null,
                thumbnail: null,
                css3: true,
                loopCloneLength: null,
                scenes: []
            };

            this._config = $.extend(defaults, options);
            this.$el = $el;

            var $stage = $el;
            var $container = $stage.find(this._config.container);
            var $panels = $container.find(this._config.panels);
            this.stage = new PsycleStage($stage);
            this.container = new PsycleContainer($container);
            this.panels = new PsyclePanelList($panels);
            this.transition = PsycleTransition.transitions[this._config.transition];

            this.index = this._config.startIndex;

            this.length = this.panels.length;
            this.progressIndex = this.index;

            this._bind();

            this._init();
            this._silent();

            if (this._config.auto) {
                this.play();
            }

            $el.data('psyborg.Psycle', this);
        }
        Psycle.prototype.play = function () {
            var _this = this;
            var defaultPrevented = this.trigger('play');
            if (defaultPrevented) {
                this.timer = setTimeout(function () {
                    _this.next();
                }, this._config.delay);
            }
            return this;
        };

        Psycle.prototype.stop = function () {
            clearTimeout(this.timer);
            return this;
        };

        Psycle.prototype.gotoPanel = function (to) {
            var _this = this;
            if (this.isTransition) {
                return this;
            }
            this.stop();
            this.isPaused = false;
            this.from = this.index;
            this.to = to;
            this.progressIndex = to;
            this._before();
            this.isTransition = true;
            this._fire();

            this.animation.done(function () {
                _this._done();
            });

            this.animation.fail(function () {
                _this._fail();
            });
            return this;
        };

        Psycle.prototype.prev = function () {
            if (this.isTransition) {
                return this;
            }
            this.vector = -1;
            var to = this._optimizeCounter(this.index - 1);
            this.gotoPanel(to);
            return this;
        };

        Psycle.prototype.next = function () {
            if (this.isTransition) {
                return this;
            }
            this.vector = 1;
            var to = this._optimizeCounter(this.index + 1);
            this.gotoPanel(to);
            return this;
        };

        Psycle.prototype._done = function () {
            this.index = this.to;
            this.isTransition = false;
            this._after();
            this._silent();
            if (this._config.auto) {
                this.play();
            }
        };

        Psycle.prototype._fail = function () {
            this.stop();
            this._cancel();
            this.isPaused = true;
        };

        Psycle.prototype._optimizeCounter = function (index) {
            var maxIndex = this.length - 1;
            switch (this._config.repeat) {
                case PsycleRepeat.LOOP:
                case PsycleRepeat.RETURN:
                    index = index < 0 ? maxIndex + (index % maxIndex) + 1 : index;
                    index = index < maxIndex ? index : index % (maxIndex + 1);
                    break;
                default:
                    index = index < 0 ? 0 : index;
                    index = index < maxIndex ? index : maxIndex;
                    if (this._isMin(index) || this._isMax(index)) {
                        this.stop();
                    }
            }
            return index;
        };

        Psycle.prototype._isMax = function (index) {
            return index === this.length - 1;
        };

        Psycle.prototype._isMin = function (index) {
            return index === 0;
        };

        Psycle.prototype._bind = function () {
            var _this = this;
            var resizeEndDelay = 1200;
            var resizeTimer;
            var resizing = false;
            $(window).on('resize', function (e) {
                if (!resizing) {
                    resizing = true;
                    _this._resizeStart();
                }
                clearTimeout(resizeTimer);
                _this._resize();
                resizeTimer = setTimeout(function () {
                    _this._resizeEnd();
                    resizing = false;
                }, resizeEndDelay);
            });
        };

        Psycle.prototype._init = function () {
            this.transition.init.call(this);
            this.transition.reflow.call(this, { timing: PsycleReflowTiming.INIT });
        };

        Psycle.prototype._silent = function () {
            this.transition.silent.call(this);
            this.transition.reflow.call(this, { timing: PsycleReflowTiming.TRANSITION_END });
        };

        Psycle.prototype._before = function () {
            this.transition.before.call(this);
        };

        Psycle.prototype._fire = function () {
            this.transition.fire.call(this);
        };

        Psycle.prototype._cancel = function () {
            this.transition.cancel.call(this);
        };

        Psycle.prototype._after = function () {
            this.transition.after.call(this);
        };

        Psycle.prototype._resize = function () {
            this.transition.reflow.call(this, { timing: PsycleReflowTiming.RESIZE });
        };

        Psycle.prototype._resizeStart = function () {
            this.transition.reflow.call(this, { timing: PsycleReflowTiming.RESIZE_START });
            if (this.animation && this.isTransition) {
                this.animation.stop();
                this.stop();
            }
        };

        Psycle.prototype._resizeEnd = function () {
            this.transition.reflow.call(this, { timing: PsycleReflowTiming.RESIZE_END });
            if (this.isPaused && this.isTransition) {
                this.gotoPanel(this.to);
            }
        };
        return Psycle;
    })(psyborg.PsyborgEventDispacther);
    psyborg.Psycle = Psycle;

    var PsyborgCSS = (function () {
        function PsyborgCSS() {
        }
        PsyborgCSS.posAbs = function ($el, top, left) {
            if (typeof top === "undefined") { top = 0; }
            if (typeof left === "undefined") { left = 0; }
            $el.css({
                position: 'absolute',
                top: top,
                left: left
            });
        };
        PsyborgCSS.posBase = function ($el) {
            var posi = $el.css('position');
            if (posi == null || posi === 'static' || posi === '') {
                $el.css({
                    position: 'relative'
                });
            }
        };
        PsyborgCSS.isOverflowHidden = function ($el) {
            return $el.css('overflow').toLowerCase() === 'hidden';
        };
        return PsyborgCSS;
    })();
    psyborg.PsyborgCSS = PsyborgCSS;

    PsycleTransition.create({
        slide: {
            init: function () {
                PsyborgCSS.posBase(this.stage.$el);
                PsyborgCSS.posAbs(this.container.$el);
                PsyborgCSS.posAbs(this.panels.$el);

                var $panel = this.panels.$el;

                $panel.data('originStyle', $panel.attr('style'));
            },
            reflow: function (info) {
                var $panel = this.panels.$el;

                $panel.attr('style', $panel.data('originStyle'));

                this.panelWidth = $panel.width();

                $panel.width(this.panelWidth);

                this.stageWidth = this.stage.$el.width();

                var l = Math.floor((this.length + 2) / 2);
                var i = l * -1;

                this.panels.removeClone();

                var panel;
                var clone;
                for (; i <= l; i++) {
                    panel = this.panels.item(i + this.index);
                    if (0 <= i) {
                        panel.show();
                        panel.$el.css({ left: this.panelWidth * i });
                    } else {
                        clone = panel.clone();
                        clone.show();
                        clone.$el.css({ left: this.panelWidth * i });
                    }
                }
            },
            silent: function () {
                this.container.$el.css({
                    left: 0
                });
                this.panels.hide();
            },
            before: function () {
            },
            fire: function () {
                this.animation = $.Animation(this.container.$el[0], {
                    left: this.panelWidth * -1 * this.vector
                }, {
                    duration: this._config.duration
                });
            },
            cancel: function () {
            },
            after: function () {
            }
        }
    });

    $.fn.psycle = function (options) {
        var psycle = new psyborg.Psycle(this, options);
        return psycle.$el;
    };
})(psyborg || (psyborg = {}));

jQuery.fn.linkboxChart = function (config) {
};

}();