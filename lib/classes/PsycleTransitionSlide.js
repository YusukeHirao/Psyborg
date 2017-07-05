"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StyleSheet_1 = require("./StyleSheet");
var Util_1 = require("./Util");
var PsycleReflowTiming_1 = require("./PsycleReflowTiming");
var PsycleRepeat_1 = require("./PsycleRepeat");
var PsycleTransition_1 = require("./PsycleTransition");
var Draggable = (function () {
    function Draggable($el, psycle, config) {
        var _this = this;
        this.isDragging = false;
        this.isSwiping = false;
        this.$el = $el;
        this.psycle = psycle;
        this.config = config;
        var passive = { passive: true }; // tslint:disable-line:no-any
        this.$el[0].addEventListener('touchstart', function (e) {
            _this._dragStartX = e.touches[0].pageX;
            _this._dragstart(e);
        }, passive);
        this.$el[0].addEventListener('touchmove', function (e) {
            _this._drag(e);
        }, passive);
        this.$el[0].addEventListener('touchend', function (e) {
            _this._dragend(e);
        });
        this.$el[0].addEventListener('touchcancel', function (e) {
            _this._dragend(e);
        });
    }
    Draggable.prototype._tap = function () {
        this.isDragging = false;
    };
    Draggable.prototype._dragstart = function (e) {
        // ドラッグ開始時のタイムスタンプ
        this.dragStartTimestamp = Date.now();
        // パネルの動きをその位置で停止する
        this.psycle.freeze();
        // ドラッグ開始時のコンテナの位置
        this.dragStartPsycleLeftPosition = this.psycle.container.$el.position().left;
        // 現在のインデックス番号
        this.currentIndex = this.psycle.index;
    };
    Draggable.prototype._drag = function (e) {
        var _this = this;
        // ドラッグ開始からの移動距離
        var x = e.touches[0].pageX - this._dragStartX;
        // コンテナの位置
        var panelX = this.dragStartPsycleLeftPosition + x;
        this.isDragging = true;
        this._moveValueFromPrevTouchMove = x;
        cancelAnimationFrame(this._rafId);
        this._rafId = requestAnimationFrame(function () {
            _this.psycle.container.$el[0].style.left = panelX + "px";
        });
    };
    Draggable.prototype._dragend = function (e) {
        var BUFFER_DIST_RATIO = 0.25;
        var touch = e.touches[0] || e.changedTouches[0];
        var x = touch.pageX - this._dragStartX;
        var pWidth = this.psycle.panelWidth;
        var panelX = this.dragStartPsycleLeftPosition + x;
        var cloneLength = this.psycle.cloneCount * this.psycle.length;
        var cloneWidth = cloneLength * pWidth;
        // 移動領域の余裕
        var bufferDist = pWidth * BUFFER_DIST_RATIO;
        // インデックス基準の相対位置
        var indexicalPosRatio = (panelX / pWidth) * -1;
        var indexicalPosRatioReal = indexicalPosRatio;
        if (this.psycle.repeat === PsycleRepeat_1.default.LOOP) {
            indexicalPosRatio -= cloneLength;
        }
        var ratioX = indexicalPosRatio - this.psycle.index;
        // バッファ距離からのインデックス基準の相対位置
        var distIndexicalPosRatio = 0;
        // →方向
        if (0 < ratioX) {
            if (BUFFER_DIST_RATIO < ratioX) {
                distIndexicalPosRatio = indexicalPosRatio - BUFFER_DIST_RATIO;
            }
            else {
                distIndexicalPosRatio = this.psycle.index;
            }
            // ←方向
        }
        else if (ratioX < 0) {
            if (ratioX < BUFFER_DIST_RATIO * -1) {
                distIndexicalPosRatio = indexicalPosRatio - BUFFER_DIST_RATIO;
            }
            else {
                distIndexicalPosRatio = this.psycle.index;
            }
            // 移動なし
        }
        else {
            return;
        }
        // 目的のインデックスまでのパネル数
        var vector = Util_1.default.roundUp(distIndexicalPosRatio - this.psycle.index);
        // 目的のインデックスの位置
        var disPos = vector * pWidth;
        // 目的のインデックスまでの距離
        var distance = Math.abs((disPos - cloneWidth) - panelX);
        var direction = (distance === 0 ? 0 : vector > 0 ? 1 : -1) * -1;
        // 距離の変化による移動時間の再計算
        var speed = Util_1.default.getSpeed(distance, this.config.duration);
        var duration = Util_1.default.getDuration(distance, speed);
        // 目的のインデックス
        var to = this.psycle.index + vector;
        /**
         * スワイプの判定
         *
         * SWIPE_DETECTION_INTERVALの時間以下
         * SWIPE_DETECTION_PIXELの範囲以上の動き
         */
        var SWIPE_DETECTION_INTERVAL = 200;
        var SWIPE_DETECTION_PIXEL = 5;
        var isSwipeTime = Date.now() - this.dragStartTimestamp < SWIPE_DETECTION_INTERVAL;
        var isSwipeDest = SWIPE_DETECTION_PIXEL < Math.abs(this._moveValueFromPrevTouchMove);
        if (isSwipeTime && isSwipeDest) {
            if (this._moveValueFromPrevTouchMove < 0) {
                this._swipeleft();
            }
            else {
                this._swiperight();
            }
        }
        if (!this.isSwiping && distance !== 0) {
            // swipeイベントが発火していた場合は処理をしない。
            // イベントは dragstart → drag → swipe → dragend の順番に発火する
            // 目的のインデックスまでの距離が0のときも処理しない
            // 中途半端な位置からの遷移として第5引数にtrueを渡す
            this.psycle.transitionTo(to, duration, direction, vector, true);
        }
        this.isSwiping = false;
        this.isDragging = false;
        this.psycle.isTransition = false;
    };
    Draggable.prototype._swipeleft = function () {
        if (this.config.swipeable) {
            this.isSwiping = true;
            this.psycle.stop();
            var swipeDuration = Date.now() - this.dragStartTimestamp;
            this.psycle.next(swipeDuration);
        }
    };
    Draggable.prototype._swiperight = function () {
        if (this.config.swipeable) {
            this.isSwiping = true;
            this.psycle.stop();
            var swipeDuration = Date.now() - this.dragStartTimestamp;
            this.psycle.prev(swipeDuration);
        }
    };
    return Draggable;
}());
/**
 *
 * @version 0.9.1
 * @since 0.1.0
 */
PsycleTransition_1.default.create({
    slide: {
        init: function () {
            // スタイルを設定
            StyleSheet_1.default.posBase(this.stage.$el);
            StyleSheet_1.default.posAbs(this.container.$el);
            StyleSheet_1.default.posBase(this.panels.$el);
            StyleSheet_1.default.floating(this.panels.$el);
            // 初期のスタイルを保存
            StyleSheet_1.default.saveCSS(this.panels.$el);
            // 初期化時のインラインスタイルを保持
            if (this.config.draggable) {
                new Draggable(this.stage.$el, this, this.config);
            }
        },
        reflow: function (info) {
            switch (info.timing) {
                case PsycleReflowTiming_1.default.TRANSITION_END: {
                    var distination = this.panelWidth * this.index * -1 + (this.cloneCount * this.panelWidth * this.length * -1);
                    this.container.$el.css({
                        left: distination,
                    });
                    break;
                }
                case PsycleReflowTiming_1.default.RESIZE_END:
                case PsycleReflowTiming_1.default.RESIZE_START:
                case PsycleReflowTiming_1.default.INIT:
                case PsycleReflowTiming_1.default.LOAD: {
                    if (info.timing === PsycleReflowTiming_1.default.RESIZE_END) {
                        this.cloneCount = 0;
                        this.panels.removeClone();
                    }
                    var $panels = this.panels.$el;
                    var $container = this.container.$el;
                    /**
                     * 直接幅を設定してしまうとインラインCSSで設定されるので
                     * 次回取得時にその幅しか取得できない。
                     * 固定の場合は問題ないが相対値の場合は問題となるので
                     * 初期化時のインラインスタイルに戻すことで
                     * 常にオリジナルの幅を取得できるようになる。
                     */
                    // 初期化時のスタイルに戻す
                    StyleSheet_1.default.cleanCSS($panels);
                    StyleSheet_1.default.posBase($panels);
                    StyleSheet_1.default.floating($panels);
                    StyleSheet_1.default.cleanCSS($container);
                    StyleSheet_1.default.posAbs($container);
                    // ステージ・パネル 各幅を取得
                    var panelWidth = $panels.width() || 0; // 初期化時のスタイルの状態で幅を取得
                    var panelOuterWidth = $panels.outerWidth(true) || 0;
                    this.panelWidth = panelOuterWidth;
                    this.stageWidth = this.stage.$el.width() || 0;
                    // 取得した幅を設定
                    $panels.width(panelWidth);
                    this.panels.getClones().width(panelWidth);
                    // コンテナの幅を計算
                    var containerWidth = panelOuterWidth * this.length;
                    // ループの時の処理
                    if (this.repeat === PsycleRepeat_1.default.LOOP) {
                        /*
                            * ステージがコンテナに対して何倍大きいか
                            *
                            * ステージがコンテナの0倍から2倍まではパネルは3つにする 前後に1ずつクローンパネルをappendする
                            * ステージがコンテナの2倍から3倍まではパネルは5つにする 前後に2ずつクローンパネルをappendする
                            * ステージがコンテナの3倍から5倍まではパネルは7つにする 前後に3ずつクローンパネルをappendする
                            * ステージがコンテナの5倍から7倍まではパネルは8つにする 前後に4ずつクローンパネルをappendする
                            * ステージがコンテナの7倍から9倍まではパネルは11つにする 前後に5ずつクローンパネルをappendする
                            *  ・
                            *  ・
                            *  ・
                            *
                            */
                        var stageWidthRatio = this.stageWidth / containerWidth;
                        var addtionalCloneCount = Math.ceil(stageWidthRatio / 2) + 1;
                        // 幅が取れないタイミングでは addtionalCloneCount が Infinity になる場合がある
                        if (addtionalCloneCount === Infinity) {
                            addtionalCloneCount = this.cloneCount + 1;
                        }
                        // クローン数が多くなった時に以下実行
                        if (this.cloneCount < addtionalCloneCount) {
                            // クローンを前方後方に生成追加
                            this.panels.removeClone();
                            this.panels.cloneBefore(addtionalCloneCount);
                            this.panels.cloneAfter(addtionalCloneCount);
                            // クローンの数を更新
                            this.cloneCount = addtionalCloneCount;
                        }
                        // クローンを作った分幅を再計算して広げる
                        containerWidth = this.panelWidth * this.length * (this.cloneCount * 2 + 1);
                    }
                    // コンテナの位置を計算
                    var distination = this.panelWidth * this.index * -1 + (this.cloneCount * this.panelWidth * this.length * -1);
                    // コンテナの計算値を反映
                    $container.css({
                        width: containerWidth,
                        left: distination,
                    });
                    // ステージの高さの再計算
                    if (this.config.resizable) {
                        var height = void 0;
                        switch (this.config.dimension) {
                            case 'max': {
                                height = this.panels.getMaxHeight();
                                break;
                            }
                            case 'min': {
                                height = this.panels.getMinHeight();
                                break;
                            }
                            default: {
                                height = this.panels.getHeight();
                            }
                        }
                        this.stage.setHeight(height);
                    }
                    break;
                }
                default:
            }
        },
        silent: function () { },
        before: function () { },
        fire: function () {
            if (this.animation) {
                this.animation.stop();
            }
            var duration = this.duration || this.config.duration;
            var distination = this.panelWidth * (this.index + this.vector) * -1 + (this.cloneCount * this.panelWidth * this.length * -1);
            this.animation = this.container.$el.animate({
                left: distination,
            }, {
                duration: duration,
                easing: this.config.easing,
            });
        },
        cancel: function () { },
        after: function () { },
    },
});
