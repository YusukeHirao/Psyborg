/**
 * Psyborg.js - v0.8.3 r893
 * update: 2014-12-09
 * Author: Yusuke Hirao [http://www.yusukehirao.com]
 * Github: https://github.com/YusukeHirao/Psyborg
 * License: Licensed under the MIT License
 * Require: jQuery v1.11.0 or later
 */

(function () {
'use strict';

var window = this;
var document = window.document;
var location = window.location;
var $ = jQuery;
var psyborg;
(function (psyborg) {
    /**!
     * ユーティリティ関数郡
     *
     * @class Util
     * @since 0.3.4
     */
    var Util = (function () {
        function Util() {
        }
        /**!
         * 距離(px)と継続時間(ms)から速度(px/ms)を得る
         *
         * @method getSpeed
         * @since 0.3.4
         * @static
         * @param {number} distance 距離(px)
         * @param {number} duration 継続時間(ms)
         * @return {number} 速度(px/ms)
         */
        Util.getSpeed = function (distance, duration) {
            return distance / duration;
        };
        /**!
         * 距離(px)と速度(px/ms)から継続時間(ms)を得る
         *
         * @method getDuration
         * @since 0.3.4
         * @static
         * @param {number} distance 距離(px)
         * @param {number} speed 速度(px/ms)
         * @return {number} 継続時間(ms)
         */
        Util.getDuration = function (distance, speed) {
            return distance / speed;
        };
        /**!
         * 継続時間(ms)と速度(px/ms)から距離(px)を得る
         *
         * @method getDistance
         * @since 0.3.4
         * @static
         * @param {number} duration 継続時間(ms)
         * @param {number} speed 速度(px/ms)
         * @return {number} 距離(px)
         */
        Util.getDistance = function (duration, speed) {
            return duration * speed;
        };
        /**!
         *
         * @test test/util.html
         */
        Util.getloopSeriesNumber = function (n, length) {
            var res;
            res = n % length;
            if (res === 0) {
                return res;
            }
            if (n < 0) {
                res = length + (Math.abs(n) % length * -1);
            }
            return res;
        };
        /**!
         *
         * @param {number} direction 0 or 1 or -1 0は一番近い数字を算出する
         * @test test/util2.getloopSeriesVector.js
         */
        Util.getloopSeriesVector = function (from, to, direction, length) {
            var to2 = NaN;
            var vector;
            var dist;
            var dist2;
            var resDist;
            if (direction !== 0 && direction !== 1 && direction !== -1) {
                throw new RangeError('`direction` is must 1 or -1 or zero.');
            }
            if (direction === 0) {
                from = Util.getloopSeriesNumber(from, length);
                to = Util.getloopSeriesNumber(to, length);
                to2 = from < to ? to - length : to + length;
                dist = Math.abs(to - from);
                dist2 = Math.abs(to2 - from);
                resDist = Math.min(dist, dist2);
                if (dist === resDist) {
                    vector = to < from ? dist * -1 : dist;
                }
                else {
                    vector = to2 < from ? dist2 * -1 : dist2;
                }
            }
            else {
                if (from === to) {
                    vector = length * direction;
                }
                else {
                    if (from < to && direction === -1) {
                        to = Util.getloopSeriesNumber(to, length);
                        to2 = to - length;
                        vector = to2 - from;
                    }
                    else if (to < from && direction === 1) {
                        to = Util.getloopSeriesNumber(to, length);
                        to2 = to + length;
                        vector = to2 - from;
                    }
                    else {
                        vector = to - from;
                    }
                }
            }
            return vector;
        };
        /**!
         * 小数点切り捨て(0に近づける)
         *
         * @param {number} num 対象の数値
         */
        Util.roundDown = function (num) {
            // parseIntの第一引数はstringが仕様
            return parseInt('' + num, 10);
        };
        /**!
         * 小数点切り上げ(0から遠ざける)
         *
         * @param {number} num 対象の数値
         */
        Util.roundUp = function (num) {
            var res;
            if (0 < num) {
                res = Math.ceil(num);
            }
            else {
                res = Math.ceil(num * -1) * -1;
            }
            return res;
        };
        return Util;
    })();
    psyborg.Util = Util;
})(psyborg || (psyborg = {}));
var psyborg;
(function (psyborg) {
    /**!
     * Psyborgで取り扱うイベントデータ
     *
     * @class PsyborgEvent
     * @since 0.1.0
     * @constructor
     * @param {string} type イベントの種類
     */
    var PsyborgEvent = (function () {
        function PsyborgEvent(type) {
            /**!
             * デフォルトのイベントの発火を抑制するフラグ
             *
             * @property defaultPrevented
             * @since 0.1.0
             * @public
             * @type boolean
             * @default false
             */
            this.defaultPrevented = false;
            this.type = type;
            this.timeStamp = new Date().valueOf();
        }
        /**!
         * デフォルトのイベントの発火を抑制する
         *
         * @method preventDefault
         * @since 0.1.0
         * @public
         */
        PsyborgEvent.prototype.preventDefault = function () {
            this.defaultPrevented = true;
        };
        return PsyborgEvent;
    })();
    psyborg.PsyborgEvent = PsyborgEvent;
})(psyborg || (psyborg = {}));
var psyborg;
(function (psyborg) {
    /**!
     * Psyborgで取り扱うイベントディスパッチャ
     *
     * @class PsyborgEventDispacther
     * @since 0.1.0
     * @constructor
     */
    var PsyborgEventDispacther = (function () {
        function PsyborgEventDispacther() {
            /**!
             * イベントの種類
             *
             * @property _listeners
             * @since 0.1.0
             * @private
             * @type Object
             */
            this._listeners = {};
        }
        PsyborgEventDispacther.prototype.on = function (types, listener) {
            var typeList;
            if (types === String(types)) {
                typeList = types.split(/\s+/);
            }
            else {
                typeList = types;
            }
            var i = 0;
            var l = typeList.length;
            for (; i < l; i++) {
                if (!this._listeners[typeList[i]]) {
                    this._listeners[typeList[i]] = [];
                }
                this._listeners[typeList[i]].push(listener);
            }
        };
        /**!
         * イベントを削除する
         *
         * @method off
         * @since 0.1.0
         * @public
         * @param {string} types イベントの種類(スペース区切りで複数可)
         * @param {Function} [listener] リスナー関数
         */
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
        /**!
         * イベントを任意に発火させる
         *
         * @method trigger
         * @since 0.1.0
         * @public
         * @param {string} type イベントの種類
         * @param {any} [data={}] 発火と同時にリスナー関数に渡すハッシュデータ
         * @param {any} [context=this] リスナー関数の`this`コンテクスト
         * @return {boolean} デフォルトのイベントの抑制がされていないかどうか
         */
        PsyborgEventDispacther.prototype.trigger = function (type, data, context) {
            if (data === void 0) { data = {}; }
            if (context === void 0) { context = this; }
            var listener;
            var i = 0;
            var l;
            if (this._listeners[type]) {
                l = this._listeners[type].length;
                for (; i < l; i++) {
                    listener = this._listeners[type][i];
                    var e = new psyborg.PsyborgEvent(type);
                    e.data = data;
                    listener.call(context, e);
                    // preventDefaultされていたら以後のイベントを発火させない
                    if (e.defaultPrevented) {
                        return false;
                    }
                }
            }
            return true;
        };
        return PsyborgEventDispacther;
    })();
    psyborg.PsyborgEventDispacther = PsyborgEventDispacther;
})(psyborg || (psyborg = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var psyborg;
(function (psyborg) {
    /**!
     * Psyborgで取り扱うDOM要素
     *
     * @class PsyborgElement
     * @since 0.1.0
     * @extends PsyborgEventDispacther
     * @constructor
     * @param {jQuery} $el インスタンス化する要素
     */
    var PsyborgElement = (function (_super) {
        __extends(PsyborgElement, _super);
        function PsyborgElement($el) {
            _super.call(this);
            if (!$el.length) {
                throw new ReferenceError('This jQuery object is empty. Selector "' + $el.selector + '" doesn\'t exist.');
            }
            this.$el = $el;
        }
        /**!
         * イベントを任意に発火させる 要素にバインドされているイベントも同時に発火する
         *
         * @method trigger
         * @since 0.3.0
         * @public
         * @override
         * @param {string} type イベントの種類
         * @param {any} [data={}] 発火と同時にリスナー関数に渡すハッシュデータ
         * @param {any} [context=this] リスナー関数の`this`コンテクスト
         * @return {boolean} デフォルトのイベントの抑制がされていないかどうか
         */
        PsyborgElement.prototype.trigger = function (type, data, context) {
            if (data === void 0) { data = {}; }
            if (context === void 0) { context = this; }
            var defaultPrevented = _super.prototype.trigger.call(this, type, data, context);
            if (defaultPrevented) {
                this.$el.trigger(type, data, context);
            }
            return defaultPrevented;
        };
        /**!
         * 要素の幅を取得
         *
         * @method getWidth
         * @since 0.4.3
         * @public
         * @return {number} 要素の幅
         */
        PsyborgElement.prototype.getWidth = function () {
            return this.$el.width();
        };
        /**!
         * 要素の高さを取得
         *
         * @method getHeight
         * @since 0.4.3
         * @public
         * @return {number} 要素の高さ
         */
        PsyborgElement.prototype.getHeight = function () {
            return this.$el.height();
        };
        /**!
         * 要素の幅を設定
         *
         * @method setWidth
         * @since 0.4.3
         * @public
         * @chainable
         * @param {number} value 指定の値
         * @return {PsyborgElement} 自身
         */
        PsyborgElement.prototype.setWidth = function (value) {
            this.$el.width(value);
            return this;
        };
        /**!
         * 要素の高さを設定
         *
         * @method setHeight
         * @since 0.4.3
         * @public
         * @chainable
         * @param {number} value 指定の値
         * @return {PsyborgElement} 自身
         */
        PsyborgElement.prototype.setHeight = function (value) {
            this.$el.height(value);
            return this;
        };
        return PsyborgElement;
    })(psyborg.PsyborgEventDispacther);
    psyborg.PsyborgElement = PsyborgElement;
})(psyborg || (psyborg = {}));
var psyborg;
(function (psyborg) {
    /**!
     * ウィンドウ・ブラウザ/ユーザエージェントに関する操作をあつかう
     *
     * @class Window
     * @since 0.4.3
     */
    var Window = (function () {
        function Window() {
        }
        /**!
         * ポジションを絶対位置にする
         *
         * @method linkTo
         * @since 0.4.3
         * @static
         * @param {string} href リンク先URLおよびパス
         * @param {string} [target=''] ターゲットフレーム
         */
        Window.linkTo = function (href, target) {
            if (target === void 0) { target = ''; }
            switch (target) {
                case '_blank':
                    window.open(href, null);
                    break;
                default:
                    location.href = href;
            }
        };
        return Window;
    })();
    psyborg.Window = Window;
})(psyborg || (psyborg = {}));
var psyborg;
(function (psyborg) {
    /**!
     * CSSを変換するラッパー関数郡
     *
     * @class StyleSheet
     * @module psyborg
     * @since 0.1.0
     */
    var StyleSheet = (function () {
        function StyleSheet() {
        }
        /**!
         * ポジションを絶対位置にする
         *
         * @method posAbs
         * @since 0.1.0
         * @static
         * @param {jQuery} $el 対象要素
         * @param {number} [top=0] 垂直位置(単位:ピクセル)
         * @param {number} [left=0] 水平位置(単位:ピクセル)
         * @return {jQuery} 対象要素
         */
        StyleSheet.posAbs = function ($el, top, left) {
            if (top === void 0) { top = 0; }
            if (left === void 0) { left = 0; }
            return $el.css({
                position: 'absolute',
                top: top,
                left: left
            });
        };
        /**!
         * ポジションが 未指定もしくは`static`の場合は`relative`にする
         *
         * @method posBase
         * @since 0.1.0
         * @static
         * @param {jQuery} $el 対象要素
         * @return {jQuery} 対象要素
         */
        StyleSheet.posBase = function ($el) {
            var posi = $el.css('position');
            if (posi == null || posi === 'static' || posi === '') {
                $el.css({
                    position: 'relative'
                });
            }
            return $el;
        };
        /**!
         * `z-index`を指定する
         *
         * @method z
         * @since 0.3.1
         * @static
         * @param {jQuery} $el 対象要素
         * @param {number} [zIndex=0] Zレイヤー位置
         * @return {jQuery} 対象要素
         */
        StyleSheet.z = function ($el, zIndex) {
            if (zIndex === void 0) { zIndex = 0; }
            $el.css({
                zIndex: zIndex
            });
            return $el;
        };
        /**!
         * `float`を指定する
         *
         * @method floating
         * @since 0.5.3
         * @static
         * @param {jQuery} $el 対象要素
         * @param {boolean} [floating=true] フロートさせるかどうか
         * @return {jQuery} 対象要素
         */
        StyleSheet.floating = function ($el, floating) {
            if (floating === void 0) { floating = true; }
            $el.css({
                'float': (floating ? 'left' : 'none')
            });
            return $el;
        };
        /**!
         * `overflow:hidden`かどうか
         *
         * @method isOverflowHidden
         * @since 0.1.0
         * @static
         * @param {jQuery} $el 対象要素
         * @return {boolean} `overflow:hidden`だった場合は`true`、それ以外は`false`
         */
        StyleSheet.isOverflowHidden = function ($el) {
            return $el.css('overflow').toLowerCase() === 'hidden';
        };
        /**!
         * CSSを保存する
         *
         * @method saveCSS
         * @since 0.3.4
         * @static
         * @param {jQuery} $el 対象要素
         */
        StyleSheet.saveCSS = function ($el) {
            $el.each(function (i, el) {
                var $this = $(el);
                $this.data('originStyle', $this.attr('style'));
            });
        };
        /**!
         * 保存したCSSを元に戻す
         *
         * @method restoreCSS
         * @since 0.3.4
         * @static
         * @param {jQuery} $el 対象要素
         */
        StyleSheet.restoreCSS = function ($el) {
            $el.each(function (i, el) {
                var $this = $(el);
                $this.attr('style', $this.data('originStyle'));
            });
        };
        /**!
         * インラインCSSを削除する
         *
         * @method cleanCSS
         * @since 0.6.1
         * @static
         * @param {jQuery} $el 対象要素
         */
        StyleSheet.cleanCSS = function ($el) {
            $el.each(function (i, el) {
                var $this = $(el);
                $this.attr('style', '');
            });
        };
        return StyleSheet;
    })();
    psyborg.StyleSheet = StyleSheet;
})(psyborg || (psyborg = {}));
var psyborg;
(function (psyborg) {
    /**!
     * スライド要素を生成・管理するクラス
     *
     * @class Psycle
     * @since 0.1.0
     * @extends PsyborgElement
     * @constructor
     * @param {jQuery} $el インスタンス化する要素
     * @param {any} options
     * @param {string} [options.instanceKey='psycle'] `data`メソッドで取得できるインスタンスのキー文字列
     * @param {number} [options.startIndex=0] 最初に表示するパネル番号
     * @param {string} [options.transition='slide'] トランジションの種類
     * @param {number} [options.duration=600] アニメーション時間
     * @param {string} [options.easing='swing'] トランジションのイージング
     * @param {number} [options.delay=3000] オートプレイの時の待機時間
     * @param {boolean} [options.auto=true] オートプレイかどうか
     * @param {boolean} [options.cancel=true] アニメーション中にキャンセル可能かどうか（アニメーション中にパネル選択やパネル送りを上書きできるかどうか）
     * @param {any} [options.repeat=PsycleRepeat.RETURN] 繰り返しの種類(NONE: 繰り返ししない, RETURN: 最後まで到達すると最初に戻る, LOOP: ループしてるかのように最初に戻る（ループに対応しているトランジションのみ））
     * @param {string} [options.container='>ul:eq(0)'] コンテナを取得するためのセレクタ
     * @param {string} [options.panels='>li'] パネルを取得するためのセレクタ（コンテナからのパス）
     * @param {string} [options.currentClass='current'] 現在のパネルに設定されるクラス名
     * @param {string} [options.delayWhenFire=0] 遷移処理が発生する(`before`関数から`fire`関数)までの遅延時間(ミリ秒)
     * @param {number} [options.clone=2] ループリピートにしたときの各要素に対してのクローン要素の数
     * @param {number} [options.cols=1] カラム(列)の数（カラム対応のトランジションのみ）
     * @param {number} [options.rows=1] 行の数（行対応のトランジションのみ）
     * @param {number} [options.offsetX=0] コンテナの横方向のオフセット（コンテナが平行移動するトランジションのみ）
     * @param {number} [options.offsetY=0] コンテナの縦方向のオフセット（コンテナが平行移動するトランジションのみ）
     * @param {boolean} [options.nearby=false] ???
     * @param {boolean} [options.innerFocus=false] マルチカラムの時のフォーカスの当たり方が内側優先かどうか、noFocusがtrueの場合は無効
     * @param {boolean} [options.noFocus=true] マルチカラムの時、パネルにフォーカスを当てない、また、indexは先頭の要素だけを指すことになる
     * @param {boolean} [options.resizable=false] リサイズによってパネルの大きさが変わる場合はtrueを渡す
     * @param {boolean} [options.draggable=false] ドラッグによって遷移をコントロールさせる場合はtrueを渡す
     * @param {boolean} [options.swipeable=false] スワイプによって遷移をコントロールさせる場合はtrueを渡す
     * @param {boolean} [options.dragBlockVertical=false] ドラッグの上下を抑制させる(タッチデバイスのスクロールも抑制される)場合はtrueを渡す
     * @param {boolean} [options.bindKeyboard=false] キーボードで操作できるようにするかどうか
     * @param {any} [options.showOnlyOnce='.once'] 一度しか表示しないパネルのフィルタセレクタ (例) .once
     * @param {any} [options.controller=null] コントローラ
     * @param {any} [options.marker=null] マーカー
     * @param {any} [options.thumbnail=null] サムネイル
     * @param {boolean} [options.css3=true] ???
     * @param {number} [options.loopCloneLength=null] ループ時のスライド専用 クローンをいくつつくるか
     * @param {Function[]} [options.scenes=[]] ???
     */
    var Psycle = (function (_super) {
        __extends(Psycle, _super);
        function Psycle($el, options) {
            var _this = this;
            _super.call(this, $el);
            /**!
             * 現在表示しているパネル番号
             *
             * @property index
             * @since 0.1.0
             * @public
             * @type number
             * @default 0
             */
            this.index = 0;
            /**!
             * 前に遷移するか次に遷移するか 番号の変化量
             *
             * @property vector
             * @since 0.1.0
             * @public
             * @type number
             * @default 0
             */
            this.vector = 0;
            /**!
             * 現在遷移状態かどうか
             *
             * @property isTransition
             * @since 0.1.0
             * @public
             * @type boolean
             * @default false
             */
            this.isTransition = false;
            /**!
             * 自動再生の一時停止状態かどうか
             *
             * @property isPaused
             * @since 0.1.0
             * @public
             * @type boolean
             * @default false
             */
            this.isPaused = false;
            /**!
             * 現在のクローンパネルの数
             *
             * @property cloneCount
             * @since 0.5.3
             * @public
             * @type number
             * @default 0
             */
            this.cloneCount = 0;
            /**!
             * パネルの遷移回数のログ
             *
             * @property _times
             * @since 0.7.0
             * @private
             * @type number[]
             */
            this._times = [];
            /**!
             * 除外番号
             *
             * @property _ignoreIndexes
             * @since 0.7.0
             * @private
             * @type boolean[]
             */
            this._ignoreIndexes = [];
            var defaults = {
                instanceKey: 'psycle',
                startIndex: 0,
                transition: 'slide',
                duration: 600,
                easing: 'swing',
                delay: 3000,
                auto: true,
                cancel: true,
                repeat: psyborg.PsycleRepeat.RETURN,
                container: '>ul:eq(0)',
                panels: '>li',
                currentClass: 'current',
                delayWhenFire: 0,
                clone: 2,
                cols: 1,
                rows: 1,
                offsetX: 0,
                offsetY: 0,
                nearby: false,
                innerFocus: false,
                noFocus: true,
                resizable: false,
                draggable: false,
                swipeable: false,
                dragBlockVertical: false,
                bindKeyboard: false,
                showOnlyOnce: '.once',
                controller: null,
                marker: null,
                thumbnail: null,
                css3: true,
                loopCloneLength: null,
                scenes: []
            };
            this._config = $.extend(defaults, options);
            // 要素インスタンス
            var $stage = $el;
            var $container = $stage.find(this._config.container);
            var $panels = $container.find(this._config.panels);
            this.panels = new psyborg.PsyclePanelList($panels);
            this.container = new psyborg.PsycleContainer($container);
            this.stage = new psyborg.PsycleStage($stage, this.panels);
            this.transition = psyborg.PsycleTransition.transitions[this._config.transition];
            if (this.transition == null) {
                throw new ReferenceError("'" + this._config.transition + "' is not transition type");
            }
            if (this._config.draggable || this._config.swipeable) {
                if (!(jQuery.fn.hammer || Hammer)) {
                    throw new ReferenceError('"Hammer.js" is required when use "draggable" or "swipeable" options.');
                }
            }
            // オプションの継承
            this.index = +this._config.startIndex || 0;
            this.to = this.index;
            this.from = this.index;
            this.repeat = ('' + this._config.repeat).toLowerCase();
            // プロパティ算出
            this.length = this.panels.length;
            this.progressIndex = this.index;
            // イベントの登録
            this._resizeable();
            // 処理開始
            this._init();
            this._silent();
            // 自動再生
            if (this._config.auto) {
                this.play();
            }
            // パネル内の画像が読み込まれたとき
            this.panels.on('load', function () {
                _this._load();
            });
            // 自身のインスタンスを登録
            $el.data(this._config.instanceKey, this);
            setTimeout(function () {
                _this._initFinished();
            }, 0);
        }
        /**!
         * 自動再生を開始する
         *
         * @method play
         * @version 0.7.1
         * @since 0.1.0
         * @public
         * @return {Psycle} 自身のインスタンス
         */
        Psycle.prototype.play = function () {
            var _this = this;
            var defaultPrevented = this.trigger('play');
            if (defaultPrevented) {
                this._config.auto = true;
                clearTimeout(this.timer);
                this.timer = setTimeout(function () {
                    _this.next();
                }, this._config.delay);
            }
            return this;
        };
        /**!
         * 自動再生を停止する
         *
         * @method stop
         * @since 0.1.0
         * @public
         * @return {Psycle} 自身のインスタンス
         */
        Psycle.prototype.stop = function () {
            clearTimeout(this.timer);
            this.isPaused = true;
            return this;
        };
        /**!
         * 遷移を強制的に停止する
         * 遷移中のスタイルで固定される
         *
         * @method freeze
         * @since 0.3.4
         * @public
         * @return {Psycle} 自身のインスタンス
         */
        Psycle.prototype.freeze = function () {
            if (this.animation) {
                this.animation.stop();
            }
            this.stop();
            return this;
        };
        /**!
         * 指定の番号のパネルへ遷移する
         *
         * @method gotoPanel
         * @version 0.7.0
         * @since 0.1.0
         * @public
         * @param {number} to 遷移させるパネル番号
         * @param {number} [duration] 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
         * @return {Psycle} 自身のインスタンス
         */
        Psycle.prototype.gotoPanel = function (to, duration, direction) {
            if (direction === void 0) { direction = 0; }
            // 遷移中なら何もしない
            if (this.isTransition) {
                return this;
            }
            this.transitionTo(to, duration, direction);
            return this;
        };
        /**!
         * 前のパネルへ遷移する
         *
         * @method prev
         * @version 0.7.0
         * @since 0.1.0
         * @public
         * @param {number} [duration] 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
         * @return {Psycle} 自身のインスタンス
         */
        Psycle.prototype.prev = function (duration) {
            if (this.isTransition) {
                return this;
            }
            var direction = -1;
            this.gotoPanel(this.index - 1, duration, direction);
            return this;
        };
        /**!
         * 次のパネルへ遷移する
         *
         * @method next
         * @version 0.7.0
         * @since 0.1.0
         * @public
         * @param {number} [duration] 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
         * @return {Psycle} 自身のインスタンス
         */
        Psycle.prototype.next = function (duration) {
            if (this.isTransition) {
                return this;
            }
            var direction = +1;
            this.gotoPanel(this.index + 1, duration, direction);
            return this;
        };
        /**!
         * リフロー処理を実行する
         *
         * @method reflow
         * @since 0.3.4
         * @public
         * @param {any} data リフロー処理時に渡す任意のデータ
         * @return {Psycle} 自身のインスタンス
         */
        Psycle.prototype.reflow = function (data) {
            this.transition.reflow.call(this, {
                timing: psyborg.PsycleReflowTiming.REFLOW_METHOD,
                data: data
            });
            return this;
        };
        /**!
         * 現在のパネルが最初のパネルかどうか
         *
         * @method isFirst
         * @since 0.4.0
         * @public
         * @return {boolean} 最初のパネルなら`true`
         */
        Psycle.prototype.isFirst = function () {
            return this._isFirst(this.index);
        };
        /**!
         * 現在のパネルが最後のパネルかどうか
         *
         * @method isLast
         * @since 0.4.0
         * @public
         * @return {boolean} 最後のパネルなら`true`
         */
        Psycle.prototype.isLast = function () {
            return this._isLast(this.index);
        };
        /**!
         * マーカーを生成する
         *
         * @method marker
         * @version 0.8.3
         * @since 0.3.0
         * @public
         * @param {number} [duration] 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
         * @param {string} [currentClassAddionalEventType] カレントクラスを付加するタイミング
         * @return {JQuery} 生成したjQuery要素
         */
        Psycle.prototype.marker = function (duration, currentClassAddionalEventType) {
            var _this = this;
            var $ul = $('<ul />');
            var $li;
            var i = 0;
            var l = this.length;
            // currentClassAddionalEventType引数のデフォルト
            currentClassAddionalEventType = currentClassAddionalEventType || psyborg.PsycleEvent.PANEL_CHANGE_END;
            for (; i < l; i++) {
                $li = $('<li />');
                $li.appendTo($ul);
                if (this.panels.item(i).$el.filter(this._config.showOnlyOnce).length) {
                    $li.addClass(this._config.showOnlyOnce).hide();
                }
            }
            var $lis = $ul.find('li');
            this.on(currentClassAddionalEventType, function (e) {
                $lis.removeClass(_this._config.currentClass);
                $lis.eq(e.data.to).addClass(_this._config.currentClass);
            });
            $lis.eq(this._config.startIndex).addClass(this._config.currentClass);
            $lis.on('click', function (e) {
                _this.gotoPanel($(e.target).index(), duration);
                e.preventDefault();
            });
            return $ul;
        };
        /**!
         * マーカーを設定する
         *
         * @method marked
         * @version 0.7.0
         * @since 0.5.3
         * @public
         * @param {JQuery} $elem 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
         * @param {Object} options オプション
         * @return {JQuery} 生成したjQuery要素
         */
        Psycle.prototype.marked = function ($elem, options) {
            var _this = this;
            var config = $.extend({
                type: 'li',
                duration: null
            });
            var type = '' + config.type;
            var nodeName = $elem[0].nodeName;
            var childTag;
            var $childBase;
            var $child;
            var $children;
            var i = 0;
            var l = this.length;
            if (nodeName === 'UL' || nodeName === 'OL') {
                type = 'li';
            }
            switch (type.toLowerCase()) {
                case 'li':
                case 'list':
                case 'ls':
                case 'ul':
                case 'ol':
                    childTag = 'li';
                    break;
                case 'i':
                case 'in':
                case 'inline':
                case 'span':
                    childTag = 'span';
                    break;
                default:
                    childTag = 'div';
            }
            $childBase = $('<' + childTag + ' />');
            for (; i < l; i++) {
                $child = $childBase.clone();
                $child.appendTo($elem);
                if (this.panels.item(i).$el.filter(this._config.showOnlyOnce).length) {
                    $child.addClass(this._config.showOnlyOnce).hide();
                }
            }
            $children = $elem.find('>' + childTag);
            $children.eq(this._config.startIndex).addClass(this._config.currentClass);
            this.on(psyborg.PsycleEvent.PANEL_CHANGE_END, function (e) {
                $children.removeClass(_this._config.currentClass);
                $children.eq(e.data.index).addClass(_this._config.currentClass);
            });
            $children.on('click', function (e) {
                _this.gotoPanel($(e.target).index(), config.duration);
                e.preventDefault();
            });
        };
        /**!
         * コントローラをバインドする
         *
         * @method controller
         * @version 0.7.0
         * @since 0.4.3
         * @public
         * @param {JQuery} $elem バインドさせるjQuery要素
         * @param {any} options オプション
         */
        Psycle.prototype.controller = function ($elem, options) {
            var _this = this;
            var config = $.extend({
                prev: '.prev',
                next: '.next',
                duration: null,
                ifFirstClass: 'is-first',
                ifLastClass: 'is-last',
                ifIgnoreClass: 'is-ignore'
            }, options);
            var prev = config.prev;
            var next = config.next;
            var $prev = $(prev);
            var $next = $(next);
            $elem.on('click', prev, function (e) {
                _this.prev(config.duration);
                e.preventDefault();
            });
            $elem.on('click', next, function (e) {
                _this.next(config.duration);
                e.preventDefault();
            });
            var addStatus = function () {
                if (_this.isFirst()) {
                    $elem.addClass(config.ifFirstClass);
                }
                else {
                    $elem.removeClass(config.ifFirstClass);
                }
                if (_this.isLast()) {
                    $elem.addClass(config.ifLastClass);
                }
                else {
                    $elem.removeClass(config.ifLastClass);
                }
                if (_this._ignoreIndexes[_this.index]) {
                    $elem.addClass(config.ifIgnoreClass);
                }
                else {
                    $elem.removeClass(config.ifIgnoreClass);
                }
            };
            this.on(psyborg.PsycleEvent.PANEL_CHANGE_END, addStatus);
            addStatus();
            return;
        };
        /**!
         * コントローラをバインドする
         * `controller`のエイリアス
         *
         * @method ctrl
         * @since 0.5.3
         * @public
         * @param {JQuery} $elem バインドさせるjQuery要素
         * @param {any} options オプション
         * @return {JQuery} 生成したjQuery要素
         */
        Psycle.prototype.ctrl = function ($elem, options) {
            this.controller($elem, options);
        };
        /**!
         * 指定の番号のパネルへ遷移する
         *
         * @method transitionTo
         * @version 0.7.0
         * @since 0.6.0
         * @private
         * @param {number} to 遷移させるパネル番号
         * @param {number} [duration] 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
         * @param {number} [direction=0] 方向
         * @param {number} [vector]
         * @param {boolean} [fromHalfway=false] 中途半端な位置からの遷移かどうか
         * @return {Psycle} 自身のインスタンス
         */
        Psycle.prototype.transitionTo = function (to, duration, direction, vector, fromHalfway) {
            var _this = this;
            if (direction === void 0) { direction = 0; }
            if (fromHalfway === void 0) { fromHalfway = false; }
            // アニメーション前 各種数値設定前
            this.before();
            var optimizedVector;
            var distIndex;
            var skipVect;
            //  目的のパネルにshowOnlyOnceのセレクタにマッチしていて、且つ1回以上表示されていたら次の遷移に移る
            optimizedVector = $.isNumeric(vector) ? vector : this._optimizeVector(to, direction);
            distIndex = this._optimizeCounter(this.index + optimizedVector, to);
            if (fromHalfway) {
                if (this._ignoreIndexes[distIndex] && this._times[distIndex] >= 1) {
                    if (this.progressIndex !== distIndex) {
                        this.progressIndex = distIndex;
                        this.transitionTo(to + direction, duration, 0, optimizedVector + direction, fromHalfway);
                    }
                    else {
                        this._finaly();
                    }
                    return this;
                }
                // 中途半端な位置からの遷移の場合
                // 現在の番号と目的の番号が同じなら目的番号差を0にする
                if (this.index === distIndex) {
                    optimizedVector = 0;
                }
            }
            else {
                var limit = 0;
                while (this._ignoreIndexes[distIndex] && this._times[distIndex] >= 1 && limit++ < 50) {
                    // 現在の番号と目的の番号が同じならすべてスキップする
                    optimizedVector = $.isNumeric(vector) ? vector : this._optimizeVector(distIndex + direction, direction);
                    distIndex = this._optimizeCounter(this.index + optimizedVector, distIndex + direction);
                    if (this.progressIndex === distIndex) {
                        this._finaly();
                        return this;
                    }
                    this.progressIndex = distIndex;
                }
                if (this.index === distIndex) {
                    this._finaly();
                    return this;
                }
            }
            this.duration = duration || this._config.duration;
            this.vector = optimizedVector;
            this.from = this.index;
            this.to = distIndex;
            this.progressIndex = distIndex;
            if (this._config.delayWhenFire) {
                clearTimeout(this._delayTimer);
                this._delayTimer = setTimeout(function () {
                    _this._fire();
                }, this._config.delayWhenFire);
            }
            else {
                this._fire();
            }
            // アニメーションが完了したとき
            this.animation.done(function () {
                _this._done();
            });
            // アニメーションが強制的にストップしたとき
            this.animation.fail(function () {
                _this._fail();
            });
            return this;
        };
        /**!
         * 番号の変化量の正規化
         * 一番近いパネルまでの距離(パネル数)を算出する
         *
         * @method _optimizeVector
         * @version 0.7.0
         * @since 0.3.0
         * @private
         * @param {number} to 目的のパネル番号
         * @param {number} direction 方向
         * @return {number} 正規化された変化量
         */
        Psycle.prototype._optimizeVector = function (to, direction) {
            var vector;
            var optTo = (to + this.length) % this.length;
            var dir = (this.index < optTo) ? 1 : -1;
            var dist = Math.abs(this.index - optTo);
            if (this.length - 1 <= this.index && this.index < to) {
                dir = -1;
            }
            else if (to < this.index && this.index <= 0) {
                dir = 1;
            }
            if (this.repeat === psyborg.PsycleRepeat.LOOP) {
                vector = psyborg.Util.getloopSeriesVector(this.index, to, direction, this.length);
            }
            else {
                vector = dist * dir;
            }
            return vector;
        };
        /**!
         * パネル番号の正規化
         *
         * @method _optimizeCounter
         * @version 0.7.0
         * @since 0.1.0
         * @private
         * @param {number} index 正規化するパネル番号
         * @param {number} progressIndex 実際に指定されたパネル番号
         * @return {number} 正規化されたパネル番号
         */
        Psycle.prototype._optimizeCounter = function (index, progressIndex) {
            var maxIndex = this.length - 1;
            var optIndex;
            switch (this.repeat) {
                case psyborg.PsycleRepeat.LOOP:
                    optIndex = psyborg.Util.getloopSeriesNumber(index, this.length);
                    break;
                case psyborg.PsycleRepeat.RETURN:
                    optIndex = (index + this.length) % this.length;
                    break;
                default:
                    optIndex = (progressIndex < 0) ? 0 : progressIndex;
                    optIndex = (optIndex < maxIndex) ? optIndex : maxIndex;
            }
            return optIndex;
        };
        /**!
         * 指定したパネル番号が最初のパネルかどうか
         *
         * @method _isFirst
         * @version 0.7.0
         * @since 0.3.0
         * @private
         * @param {number} index 評価するパネル番号
         * @return {boolean} 最初のパネルなら`true`
         */
        Psycle.prototype._isFirst = function (index) {
            var first = 0;
            while (this._ignoreIndexes[first] && this._times[first] >= 1) {
                first += 1;
            }
            return index === first;
        };
        /**!
         * 指定したパネル番号が最後のパネルかどうか
         *
         * @method _isLast
         * @version 0.7.0
         * @since 0.3.0
         * @private
         * @param {number} index 評価するパネル番号
         * @return {boolean} 最後のパネルなら`true`
         */
        Psycle.prototype._isLast = function (index) {
            var last = this.length - 1;
            while (this._ignoreIndexes[last] && this._times[last] >= 1) {
                last -= 1;
            }
            return index === last;
        };
        /**!
         * リサイズイベントを関連付ける
         *
         * @method _resizeable
         * @since 0.1.0
         * @private
         */
        Psycle.prototype._resizeable = function () {
            var _this = this;
            var resizeEndDelay = 300;
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
        /**!
         * 現在の状態の情報を返す
         *
         * @method _getState
         * @version 0.8.0
         * @since 0.1.0
         * @private
         */
        Psycle.prototype._getState = function () {
            return {
                index: this.index,
                stage: this.stage,
                container: this.container,
                panel: this.panels.item(this.index),
                panels: this.panels,
                stageWidth: this.stageWidth,
                panelWidth: this.panelWidth,
                length: this.length,
                from: this.from,
                to: this.to,
                vector: this.vector,
                isTransition: this.isTransition,
                isPaused: this.isPaused
            };
        };
        /**!
         * パネル内の画像の読み込みが完了した時
         *
         * @method _load
         * @since 0.5.1
         * @private
         */
        Psycle.prototype._load = function () {
            this.transition.reflow.call(this, { timing: psyborg.PsycleReflowTiming.LOAD });
        };
        /**!
         * 初期化処理を実行する
         *
         * @method _init
         * @version 0.8.1
         * @since 0.1.0
         * @private
         */
        Psycle.prototype._init = function () {
            var _this = this;
            // 最初のパネルの表示回数を設定
            this._times[this._config.startIndex] = 1;
            // 除外番号の登録
            this.panels.each(function (i, panel) {
                if (panel.$el.filter(_this._config.showOnlyOnce).length) {
                    _this._ignoreIndexes[i] = true;
                }
                else {
                    _this._ignoreIndexes[i] = false;
                }
            });
            this.transition.init.call(this);
            this.transition.reflow.call(this, { timing: psyborg.PsycleReflowTiming.INIT });
        };
        /**!
         * 初期化処理が終了したときの処理
         *
         * @method _initFinished
         * @version 0.8.1
         * @since 0.8.1
         * @private
         */
        Psycle.prototype._initFinished = function () {
            this.trigger(psyborg.PsycleEvent.INIT, this._getState());
        };
        /**!
         * 非遷移番号移動を実行する
         *
         * @method _silent
         * @since 0.1.0
         * @private
         */
        Psycle.prototype._silent = function () {
            this.transition.silent.call(this);
            this.transition.reflow.call(this, { timing: psyborg.PsycleReflowTiming.TRANSITION_END });
            this.panels.setCurrent(this.index, this._config.currentClass);
        };
        /**!
         * 遷移直前の処理を実行する
         *
         * @method _before
         * @deprecated
         * @since 0.1.0
         * @private
         */
        Psycle.prototype._before = function () {
            this.before();
        };
        /**!
         * 遷移直前の処理を実行する
         *
         * @method before
         * @version 0.8.2
         * @since 0.6.0
         * @public
         */
        Psycle.prototype.before = function () {
            this.transition.before.call(this);
            this.panels.resetCurrent(this._config.currentClass);
            this.trigger(psyborg.PsycleEvent.PANEL_CHANGE_START_BEFORE, this._getState());
        };
        /**!
         * 遷移時の処理を実行する
         *
         * @method _fire
         * @version 0.8.2
         * @since 0.1.0
         * @private
         */
        Psycle.prototype._fire = function () {
            this.isTransition = true;
            this.trigger(psyborg.PsycleEvent.PANEL_CHANGE_START, this._getState());
            this.transition.fire.call(this);
        };
        /**!
         * 遷移キャンセル時の処理を実行する
         *
         * @method _cancel
         * @since 0.1.0
         * @private
         */
        Psycle.prototype._cancel = function () {
            this.transition.cancel.call(this);
        };
        /**!
         * 遷移完了時コールバック関数
         *
         * @method _done
         * @version 0.7.0
         * @since 0.1.0
         * @private
         */
        Psycle.prototype._done = function () {
            this.index = this.to;
            this.progressIndex = this.to;
            this.isTransition = false;
            this._after();
            this._silent();
            this.trigger(psyborg.PsycleEvent.PANEL_CHANGE_END, this._getState());
            this._times[this.to] = this._times[this.to] + 1 || 1;
            this._finaly();
        };
        /**!
         * 遷移後の処理を実行する
         *
         * @method _after
         * @since 0.1.0
         * @private
         */
        Psycle.prototype._after = function () {
            this.transition.after.call(this);
        };
        /**!
         * 遷移未完了で停止した場合のコールバック関数
         *
         * @method _fail
         * @since 0.1.0
         * @private
         */
        Psycle.prototype._fail = function () {
            this.stop();
            this._cancel();
            this.isTransition = false;
            this.trigger(psyborg.PsycleEvent.PANEL_CHANGE_CANCEL, this._getState());
            this._finaly();
        };
        /**!
         * すべての処理の完了後のコールバック関数
         *
         * @method _finaly
         * @version 0.7.0
         * @since 0.7.0
         * @private
         */
        Psycle.prototype._finaly = function () {
            // 自動再生状態なら再生開始する
            if (this._config.auto) {
                // しかしリピートしないで最後のパネルなら自動再生を停止する
                if (this.repeat === psyborg.PsycleRepeat.NONE && this.isLast()) {
                    this.stop();
                }
                else {
                    this.play();
                }
            }
            else {
                this.stop();
            }
        };
        /**!
         * リサイズ中の処理を実行する
         *
         * @method _resize
         * @since 0.1.0
         * @private
         */
        Psycle.prototype._resize = function () {
            this.transition.reflow.call(this, { timing: psyborg.PsycleReflowTiming.RESIZE });
        };
        /**!
         * リサイズ開始時の処理を実行する
         *
         * @method _resizeStart
         * @since 0.1.0
         * @private
         */
        Psycle.prototype._resizeStart = function () {
            this.transition.reflow.call(this, { timing: psyborg.PsycleReflowTiming.RESIZE_START });
            if (this.animation && this.isTransition) {
                this.freeze();
            }
        };
        /**!
         * リサイズ終了時の処理を実行する
         *
         * @method _resizeEnd
         * @since 0.1.0
         * @private
         */
        Psycle.prototype._resizeEnd = function () {
            this.transition.reflow.call(this, { timing: psyborg.PsycleReflowTiming.RESIZE_END });
            if (this.isPaused && this._config.auto) {
                this.gotoPanel(this.to);
            }
        };
        return Psycle;
    })(psyborg.PsyborgElement);
    psyborg.Psycle = Psycle;
})(psyborg || (psyborg = {}));
var psyborg;
(function (psyborg) {
    /* @version 0.8.2 */
    /* @since 0.1.0 */
    var PsycleEvent = (function () {
        function PsycleEvent() {
        }
        PsycleEvent.INIT = 'init';
        PsycleEvent.PANEL_CHANGE_START_BEFORE = 'panelChangeStartBefore';
        PsycleEvent.PANEL_CHANGE_START = 'panelChangeStart';
        PsycleEvent.PANEL_CHANGE_END = 'panelChangeEnd';
        PsycleEvent.PANEL_CHANGE_CANCEL = 'panelChangeCancel';
        PsycleEvent.WAIT_START = 'waitStart';
        PsycleEvent.WAIT_END = 'waitEnd';
        return PsycleEvent;
    })();
    psyborg.PsycleEvent = PsycleEvent;
})(psyborg || (psyborg = {}));
var psyborg;
(function (psyborg) {
    /* v0.1.0 */
    var PsycleRepeat = (function () {
        function PsycleRepeat() {
        }
        PsycleRepeat.NONE = 'none';
        PsycleRepeat.RETURN = 'return';
        PsycleRepeat.LOOP = 'loop';
        return PsycleRepeat;
    })();
    psyborg.PsycleRepeat = PsycleRepeat;
})(psyborg || (psyborg = {}));
var psyborg;
(function (psyborg) {
    /* v0.1.0 */
    var PsycleReflowTiming = (function () {
        function PsycleReflowTiming() {
        }
        PsycleReflowTiming.INIT = 'init';
        PsycleReflowTiming.TRANSITION_END = 'transitionEnd';
        PsycleReflowTiming.RESIZE = 'resize';
        PsycleReflowTiming.RESIZE_START = 'resizeStart';
        PsycleReflowTiming.RESIZE_END = 'resizeEnd';
        PsycleReflowTiming.REFLOW_METHOD = 'reflowMethod';
        PsycleReflowTiming.LOAD = 'load';
        return PsycleReflowTiming;
    })();
    psyborg.PsycleReflowTiming = PsycleReflowTiming;
})(psyborg || (psyborg = {}));
var psyborg;
(function (psyborg) {
    /**!
     * スライドショーパネル要素
     *
     * @class PsyclePanel
     * @since 0.1.0
     * @extends PsyborgElement
     * @constructor
     * @param {JQuery} $el 対象要素
     * @param {number} index パネル番号
     * @param {PsyclePanelList} list パネル要素リスト
     */
    var PsyclePanel = (function (_super) {
        __extends(PsyclePanel, _super);
        function PsyclePanel($el, index, list) {
            _super.call(this, $el);
            /**!
             * パネル内に画像を含むかどうか
             *
             * @property hasImages
             * @since 0.5.1
             * @public
             * @type boolean
             */
            this.hasImages = false;
            /**!
             * パネル内に画像の読み込みが完了したかどうか
             *
             * @property loaded
             * @since 0.5.1
             * @public
             * @type boolean
             */
            this.loaded = false;
            this.index = index;
            this._list = list;
            this._loadImageObserve();
        }
        /**!
         * 要素を表示する
         *
         * @method show
         * @since 0.1.0
         * @public
         * @return {PsyclePanel} 自身
         */
        PsyclePanel.prototype.show = function () {
            this.$el.show();
            return this;
        };
        /**!
         * 要素を隠す
         *
         * @method hide
         * @since 0.1.0
         * @public
         * @return {PsyclePanel} 自身
         */
        PsyclePanel.prototype.hide = function () {
            this.$el.hide();
            return this;
        };
        /**!
         * クローン要素(クラスは異なる)を作る
         * デフォルトではDOMやリストに追加される
         *
         * @method clone
         * @since 0.1.0
         * @public
         * @param {boolean} [addDOM=true] DOMに追加するかどうか
         * @param {boolean} [addList=true] リストに追加するかどうか
         * @return {PsyclePanelClone} 自身のクローン要素
         */
        PsyclePanel.prototype.clone = function (addDOM, addList) {
            if (addDOM === void 0) { addDOM = true; }
            if (addList === void 0) { addList = true; }
            var clone = new psyborg.PsyclePanelClone(this.$el.clone(), this.index, this._list);
            if (addDOM) {
                this.$el.after(clone.$el);
            }
            if (addList) {
                this._list.addClone(clone);
            }
            return clone;
        };
        /**!
         * 画像が読み込まれたかどうか監視する
         * インスタンスの `load` イベントにより通知する
         *
         * @method clone
         * @since 0.5.1
         * @protected
         */
        PsyclePanel.prototype._loadImageObserve = function () {
            var _this = this;
            var $images = this.$el.find('img');
            var onFinishedPromises = [];
            if (!$images.length) {
                return;
            }
            this.hasImages = true;
            $images.each(function (i, img) {
                var dfd = $.Deferred();
                var onload = function () {
                    dfd.resolve();
                };
                var onabort = function () {
                    dfd.resolve();
                };
                var onerror = function () {
                    dfd.resolve();
                };
                img.onload = onload;
                img.onerror = onerror;
                img.onabort = onabort;
                onFinishedPromises.push(dfd.promise());
            });
            $.when.apply($, onFinishedPromises).done(function () {
                _this.loaded = true;
                _this.trigger('load');
            });
        };
        return PsyclePanel;
    })(psyborg.PsyborgElement);
    psyborg.PsyclePanel = PsyclePanel;
})(psyborg || (psyborg = {}));
var psyborg;
(function (psyborg) {
    /**!
     * スライドショーパネルのクローン要素
     *
     * @class PsyclePanel
     * @since 0.1.0
     * @extends PsyclePanel
     * @constructor
     * @param {JQuery} $el 対象要素
     * @param {number} index パネル番号
     * @param {PsyclePanelList} パネル要素リスト
     */
    var PsyclePanelClone = (function (_super) {
        __extends(PsyclePanelClone, _super);
        function PsyclePanelClone($el, index, list) {
            _super.call(this, $el, index, list);
            $el.addClass('-psycle-clone-element');
            $el.attr('data-psycle-clone-element', 'true');
            $el.attr('data-psycle-clone-original-index', '' + index);
        }
        /**!
         * 画像が読み込まれたかどうか監視しない
         *
         * @method clone
         * @since 0.5.1
         * @override
         * @final
         * @protected
         */
        PsyclePanelClone.prototype._loadImageObserve = function () {
        };
        return PsyclePanelClone;
    })(psyborg.PsyclePanel);
    psyborg.PsyclePanelClone = PsyclePanelClone;
})(psyborg || (psyborg = {}));
var psyborg;
(function (psyborg) {
    /**!
     * スライドショーパネル要素リスト
     *
     * @class PsyclePanelList
     * @since 0.1.0
     * @extends PsyborgElement
     * @constructor
     * @param {JQuery} $el 対象要素
     */
    var PsyclePanelList = (function (_super) {
        __extends(PsyclePanelList, _super);
        function PsyclePanelList($el) {
            var _this = this;
            _super.call(this, $el);
            /**!
             * パネル要素のリスト
             *
             * @property _panels
             * @since 0.3.0
             * @private
             * @type PsyclePanel[]
             * @default []
             */
            this._panels = [];
            /**!
             * 【廃止予定】パネルのjQuery要素コレクション
             *
             * `this.$el`が既に存在する
             *
             * @property _$panels
             * @deprecated
             * @since 0.3.1
             * @private
             * @type JQuery
             * @default $()
             */
            this._$panels = $();
            /**!
             * クローン要素のリスト
             *
             * @property _clones
             * @since 0.3.0
             * @private
             * @type PsyclePanelClone[]
             * @default []
             */
            this._clones = [];
            /**!
             * パネル要素の数
             *
             * @property length
             * @since 0.3.0
             * @public
             * @type PsyclePanel[]
             * @default 0
             */
            this.length = 0;
            var i = 0;
            var l = $el.length;
            var $panel;
            for (; i < l; i++) {
                $panel = $($el[i]);
                this.add($panel);
            }
            var onLoadedPromises = [];
            this.each(function (i, panel) {
                var dfd = $.Deferred();
                if (panel.hasImages) {
                    if (panel.loaded) {
                        dfd.resolve();
                    }
                    else {
                        panel.on('load', function () {
                            dfd.resolve();
                        });
                    }
                    onLoadedPromises.push(dfd.promise());
                }
            });
            $.when.apply($, onLoadedPromises).done(function () {
                _this.trigger('load');
            });
        }
        /**!
         * 現在のパネルを設定する
         *
         * @method setCurrent
         * @since 0.3.0
         * @public
         * @param {number} index 現在のパネル番号
         * @param {string} className 現在のパネルに設定するクラス名
         * @return {PsyclePanelList} 自身
         */
        PsyclePanelList.prototype.setCurrent = function (index, className) {
            this.resetCurrent(className);
            this.item(index).$el.addClass(className);
            return this;
        };
        /**!
         * 現在のパネルの設定をリセットする
         *
         * @method resetCurrent
         * @since 0.3.0
         * @public
         * @param {string} className 設定を外すクラス名
         * @return {PsyclePanelList} 自身
         */
        PsyclePanelList.prototype.resetCurrent = function (className) {
            this.$el.removeClass(className);
            return this;
        };
        /**!
         * パネルを追加する
         *
         * @method add
         * @since 0.1.0
         * @public
         * @param {jQuery} $el 追加する要素
         * @return {PsyclePanelList} 自身
         */
        PsyclePanelList.prototype.add = function ($el) {
            var index = this._panels.length;
            var panel = new psyborg.PsyclePanel($el, index, this);
            this._panels.push(panel);
            this.$el = this.$el.add($el);
            this.length += 1;
            return this;
        };
        /**!
         * クローンを追加する
         *
         * @method addClone
         * @since 0.3.0
         * @public
         * @param {jQuery} $el 追加する要素
         * @return {PsyclePanelList} 自身
         */
        PsyclePanelList.prototype.addClone = function (clone) {
            this._clones.push(clone);
            return this;
        };
        /**!
         * 指定数クローンを生成してコンテナの末尾に追加する
         *
         * @method cloneAfter
         * @since 0.5.3
         * @public
         * @param {number} count クローンする数
         * @return {PsyclePanelList} 自身
         */
        PsyclePanelList.prototype.cloneAfter = function (count) {
            return this.clone(count);
        };
        /**!
         * 指定数クローンを生成してコンテナの先頭に追加する
         *
         * @method cloneBefore
         * @since 0.5.3
         * @public
         * @param {number} count クローンする数
         * @return {PsyclePanelList} 自身
         */
        PsyclePanelList.prototype.cloneBefore = function (count) {
            return this.clone(count, true);
        };
        /**!
         * 指定数クローンを生成してDOMに追加する
         *
         * @method _clone
         * @since 0.5.3
         * @public
         * @param {number} count クローンする数
         * @param {boolean} cloneBefore リスト前方にクローンするかどうか
         * @return {PsyclePanelList} 自身
         */
        PsyclePanelList.prototype.clone = function (count, cloneBefore) {
            if (cloneBefore === void 0) { cloneBefore = false; }
            var clone;
            var clones = [];
            var $clone;
            var $clones = $();
            var i = 0;
            var l = count;
            for (i; i < l; i++) {
                this.each(function (index, panel) {
                    clone = panel.clone(false, false);
                    clones.push(clone);
                    $clone = clone.$el;
                    $clones = $clones.add($clone);
                });
            }
            if (cloneBefore) {
                this.$el.eq(0).before($clones);
            }
            else {
                this.$el.eq(-1).after($clones);
            }
            this._clones = this._clones.concat(clones);
            return this;
        };
        /**!
         * パネルを削除する
         *
         * @method remove
         * @since 0.1.0
         * @public
         * @param {number} index 削除するパネルの番号
         * @param {boolean} [removeFromDOMTree=true] DOMツリーから削除するかどうか
         * @return {PsyclePanelList} 自身
         */
        PsyclePanelList.prototype.remove = function (index, removeFromDOMTree) {
            if (removeFromDOMTree === void 0) { removeFromDOMTree = true; }
            if (removeFromDOMTree) {
                this.$el.eq(index).remove();
            }
            this._panels.splice(index, 1);
            this._renumbering();
            this.length -= 1;
            return this;
        };
        /**!
         * 指定の番号のパネルを返す
         *
         * @method item
         * @since 0.1.0
         * @public
         * @param {number} searchIndex パネルの番号
         * @return {PsyclePanel} パネル
         */
        PsyclePanelList.prototype.item = function (searchIndex) {
            var index = this._getRealIndex(searchIndex);
            return this._panels[index];
        };
        /**!
         * パネルごとに処理を行う
         *
         * @method item
         * @since 0.1.0
         * @public
         * @param {Function} callback コールバック関数
         * @return {PsyclePanelList} 自身
         */
        PsyclePanelList.prototype.each = function (callback) {
            var i = 0;
            var l = this._panels.length;
            var panel;
            for (; i < l; i++) {
                panel = this._panels[i];
                callback.call(panel, panel.index, panel);
            }
            return this;
        };
        /**!
         * 要素を表示する
         *
         * @method show
         * @since 0.1.0
         * @public
         * @return {PsyclePanel} 自身
         */
        PsyclePanelList.prototype.show = function () {
            this.$el.show();
            return this;
        };
        /**!
         * 要素を隠す
         *
         * @method hide
         * @since 0.1.0
         * @public
         * @return {PsyclePanel} 自身
         */
        PsyclePanelList.prototype.hide = function () {
            this.$el.hide();
            return this;
        };
        /**!
         * クローンのみを削除する
         *
         * @method removeClone
         * @since 0.1.0
         * @public
         * @deprecated
         * @return {PsyclePanelList} 自身
         */
        PsyclePanelList.prototype.removeClone = function () {
            var i = 0;
            var l = this._clones.length;
            for (; i < l; i++) {
                this._clones[i].$el.remove();
            }
            this._clones = [];
            return this;
        };
        /**!
         * クローンのjQuery要素コレクションを返す
         *
         * @method getClones
         * @version 0.6.2
         * @since 0.6.2
         * @public
         * @deprecated
         * @return {JQuery} 自身
         */
        PsyclePanelList.prototype.getClones = function () {
            var $clones = $();
            var i = 0;
            var l = this._clones.length;
            for (; i < l; i++) {
                $clones = $clones.add(this._clones[i].$el);
            }
            return $clones;
        };
        /**!
         * 検索番号の正規化
         *
         * @method _getRealIndex
         * @since 0.1.0
         * @public
         * @param {number} searchIndex 検索番号
         * @return {number} 結果の番号
         */
        PsyclePanelList.prototype._getRealIndex = function (searchIndex) {
            var length = this._panels.length;
            searchIndex = searchIndex % length; // indexの循環の常套句
            var index = searchIndex < 0 ? length + searchIndex : searchIndex;
            return index;
        };
        /**!
         * パネル番号を整理して正しいものに調整する
         *
         * @method _getRealIndex
         * @since 0.1.0
         * @public
         * @return {number} パネルの数
         */
        PsyclePanelList.prototype._renumbering = function () {
            var i = 0;
            var l = this._panels.length;
            for (; i < l; i++) {
                this._panels[i].index = i;
            }
            return l;
        };
        return PsyclePanelList;
    })(psyborg.PsyborgElement);
    psyborg.PsyclePanelList = PsyclePanelList;
})(psyborg || (psyborg = {}));
var psyborg;
(function (psyborg) {
    /**!
     * スライドショーコンテナ要素
     *
     * @class PsycleContainer
     * @since 0.1.0
     * @extends PsyborgElement
     * @constructor
     */
    var PsycleContainer = (function (_super) {
        __extends(PsycleContainer, _super);
        function PsycleContainer() {
            _super.apply(this, arguments);
        }
        return PsycleContainer;
    })(psyborg.PsyborgElement);
    psyborg.PsycleContainer = PsycleContainer;
})(psyborg || (psyborg = {}));
var psyborg;
(function (psyborg) {
    /**!
     * スライドショーステージ要素
     *
     * @class PsycleStage
     * @since 0.1.0
     * @extends PsyborgElement
     * @constructor
     */
    var PsycleStage = (function (_super) {
        __extends(PsycleStage, _super);
        function PsycleStage($stage, panels) {
            var _this = this;
            _super.call(this, $stage);
            this._panels = panels;
            this._panels.on('load', function () {
                _this.trigger('load');
            });
        }
        return PsycleStage;
    })(psyborg.PsyborgElement);
    psyborg.PsycleStage = PsycleStage;
})(psyborg || (psyborg = {}));
var psyborg;
(function (psyborg) {
    /**!
     * 遷移プロセス管理
     *
     * @class PsycleTransition
     * @since 0.1.0
     * @constructor
     * @param {string} name トランジション名
     * @param {Object} process プロセス
     * @param {Object} process.init 初期処理
     * @param {Object} process.reflow リフロー処理
     * @param {Object} process.silent 非遷移変化処理
     * @param {Object} process.before 遷移前処理
     * @param {Object} process.fire 遷移時処理
     * @param {Object} process.cancel キャンセル処理
     * @param {Object} process.after 遷移後処理
     */
    var PsycleTransition = (function () {
        function PsycleTransition(name, process) {
            this.name = name;
            $.extend(this, process);
        }
        /**!
         * 遷移プロセス生成・登録
         *
         * @method create
         * @since 0.1.0
         * @static
         * @param {Object} processList プロセスリスト
         */
        PsycleTransition.create = function (processList) {
            var transitionName;
            var transition;
            for (transitionName in processList) {
                transition = new PsycleTransition(transitionName, processList[transitionName]);
                PsycleTransition.transitions[transitionName] = transition;
            }
        };
        /**!
         * プロセスリスト
         *
         * @property transitions
         * @since 0.1.0
         * @static
         * @default = {}
         */
        PsycleTransition.transitions = {};
        return PsycleTransition;
    })();
    psyborg.PsycleTransition = PsycleTransition;
})(psyborg || (psyborg = {}));
var psyborg;
(function (psyborg) {
    var Draggable = (function () {
        function Draggable($el, psycle, config) {
            var _this = this;
            this.isDragging = false;
            this.isSwiping = false;
            this.$el = $el.hammer({
                drag_block_horizontal: true,
                tap_always: false,
                swipe_velocity: 0.1 // Swipeの反応する距離
            });
            this.psycle = psycle;
            this.config = config;
            // stop "drag & select" events for draggable elements
            this.$el.find('a, img').hammer({
                drag_block_horizontal: true,
                tap_always: false
            });
            psycle.panels.each(function (i, panel) {
                var href;
                var target;
                var $panel = panel.$el.hammer();
                var $a = $panel.find('a');
                if ($a.length) {
                    $a.on('click', function (e) {
                        e.preventDefault();
                    });
                    href = $a.prop('href');
                    target = $a.prop('target');
                    if (href) {
                        $panel.on('tap', function () {
                            psyborg.Window.linkTo(href, target);
                        });
                    }
                }
            });
            this.$el.on('tap dragstart drag dragend swipeleft swiperight', function (e) {
                switch (e.type) {
                    case 'tap':
                        _this._tap();
                        break;
                    case 'dragstart':
                        _this._dragstart(e);
                        break;
                    case 'drag':
                        _this._drag(e);
                        break;
                    case 'dragend':
                        _this._dragend(e);
                        break;
                    case 'swipeleft':
                        _this._swipeleft(e);
                        break;
                    case 'swiperight':
                        _this._swiperight(e);
                        break;
                }
            });
        }
        Draggable.prototype._tap = function () {
            this.isDragging = false;
        };
        Draggable.prototype._dragstart = function (e) {
            // ドラッグ開始時のタイムスタンプ
            this.dragStartTimestamp = e.timeStamp;
            // パネルの動きをその位置で停止する
            this.psycle.freeze();
            // ドラッグ開始時のコンテナの位置
            this.dragStartPsycleLeftPosition = this.psycle.container.$el.position().left;
            // 現在のインデックス番号
            this.currentIndex = this.psycle.index;
        };
        Draggable.prototype._drag = function (e) {
            // ドラッグ開始からの移動距離
            var x = e.gesture.deltaX;
            // コンテナの位置
            var panelX = this.dragStartPsycleLeftPosition + x;
            this.isDragging = true;
            this.psycle.container.$el.css({
                left: panelX
            });
        };
        Draggable.prototype._dragend = function (e) {
            var BUFFER_DIST_RATIO = 0.25;
            var x = e.gesture.deltaX;
            var pWidth = this.psycle.panelWidth;
            var panelX = this.dragStartPsycleLeftPosition + x;
            var cloneLength = this.psycle.cloneCount * this.psycle.length;
            var cloneWidth = cloneLength * pWidth;
            // 移動領域の余裕
            var bufferDist = pWidth * BUFFER_DIST_RATIO;
            // インデックス基準の相対位置
            var indexicalPosRatio = (panelX / pWidth) * -1;
            var indexicalPosRatioReal = indexicalPosRatio;
            if (this.psycle.repeat === psyborg.PsycleRepeat.LOOP) {
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
            }
            else if (ratioX < 0) {
                if (ratioX < BUFFER_DIST_RATIO * -1) {
                    distIndexicalPosRatio = indexicalPosRatio - BUFFER_DIST_RATIO;
                }
                else {
                    distIndexicalPosRatio = this.psycle.index;
                }
            }
            else {
                return;
            }
            // 目的のインデックスまでのパネル数
            var vector = psyborg.Util.roundUp(distIndexicalPosRatio - this.psycle.index);
            // 目的のインデックスの位置
            var disPos = vector * pWidth;
            // 目的のインデックスまでの距離
            var distance = Math.abs((disPos - cloneWidth) - panelX);
            var direction = (distance === 0 ? 0 : vector > 0 ? 1 : -1) * -1;
            // 距離の変化による移動時間の再計算
            var speed = psyborg.Util.getSpeed(distance, this.config.duration);
            var duration = psyborg.Util.getDuration(distance, speed);
            // 目的のインデックス
            var to = this.psycle.index + vector;
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
        Draggable.prototype._swipeleft = function (e) {
            var swipeDuration = e.timeStamp - this.dragStartTimestamp;
            if (this.config.swipeable) {
                this.isSwiping = true;
                this.psycle.stop();
                this.psycle.next(swipeDuration);
            }
        };
        Draggable.prototype._swiperight = function (e) {
            var swipeDuration = e.timeStamp - this.dragStartTimestamp;
            if (this.config.swipeable) {
                this.isSwiping = true;
                this.psycle.stop();
                this.psycle.prev(swipeDuration);
            }
        };
        return Draggable;
    })();
    psyborg.PsycleTransition.create({
        slide: {
            init: function () {
                // スタイルを設定
                psyborg.StyleSheet.posBase(this.stage.$el);
                psyborg.StyleSheet.posAbs(this.container.$el);
                psyborg.StyleSheet.posBase(this.panels.$el);
                psyborg.StyleSheet.floating(this.panels.$el);
                // 初期のスタイルを保存
                psyborg.StyleSheet.saveCSS(this.panels.$el);
                var $panel = this.panels.$el;
                // 初期化時のインラインスタイルを保持
                if (this._config.draggable) {
                    new Draggable(this.stage.$el, this, this._config);
                }
            },
            reflow: function (info) {
                var distination;
                var containerWidth;
                var distination;
                var stageWidthRatio;
                var panelWidth;
                var panelOuterWidth;
                var addtionalCloneCount = 0;
                var i = 0;
                var l;
                var $panels;
                var $container;
                switch (info.timing) {
                    case psyborg.PsycleReflowTiming.TRANSITION_END:
                        distination = this.panelWidth * this.index * -1 + (this.cloneCount * this.panelWidth * this.length * -1);
                        this.container.$el.css({
                            left: distination
                        });
                        break;
                    case psyborg.PsycleReflowTiming.RESIZE_END:
                        this.cloneCount = 0;
                        this.panels.removeClone();
                    case psyborg.PsycleReflowTiming.RESIZE_START:
                    case psyborg.PsycleReflowTiming.INIT:
                    case psyborg.PsycleReflowTiming.LOAD:
                        $panels = this.panels.$el;
                        $container = this.container.$el;
                        /**
                        * 直接幅を設定してしまうとインラインCSSで設定されるので
                        * 次回取得時にその幅しか取得できない。
                        * 固定の場合は問題ないが相対値の場合は問題となるので
                        * 初期化時のインラインスタイルに戻すことで
                        * 常にオリジナルの幅を取得できるようになる。
                        */
                        // 初期化時のスタイルに戻す
                        psyborg.StyleSheet.cleanCSS($panels);
                        psyborg.StyleSheet.posBase($panels);
                        psyborg.StyleSheet.floating($panels);
                        psyborg.StyleSheet.cleanCSS($container);
                        psyborg.StyleSheet.posAbs($container);
                        // ステージ・パネル 各幅を取得
                        panelWidth = $panels.width(); // 初期化時のスタイルの状態で幅を取得
                        panelOuterWidth = $panels.outerWidth(true);
                        this.panelWidth = panelOuterWidth;
                        this.stageWidth = this.stage.$el.width();
                        // 取得した幅を設定
                        $panels.width(panelWidth);
                        this.panels.getClones().width(panelWidth);
                        // コンテナの幅を計算
                        containerWidth = panelOuterWidth * this.length;
                        // ループの時の処理
                        if (this.repeat === psyborg.PsycleRepeat.LOOP) {
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
                            stageWidthRatio = this.stageWidth / containerWidth;
                            addtionalCloneCount = Math.ceil(stageWidthRatio / 2) + 1;
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
                        distination = this.panelWidth * this.index * -1 + (this.cloneCount * this.panelWidth * this.length * -1);
                        // コンテナの計算値を反映
                        $container.css({
                            width: containerWidth,
                            left: distination
                        });
                        // ステージの高さの再計算
                        if (this._config.resizable) {
                            this.stage.setHeight(this.panels.getHeight());
                        }
                        break;
                }
            },
            silent: function () {
            },
            before: function () {
            },
            fire: function () {
                var distination;
                var duration = this.duration || this._config.duration;
                if (this.animation) {
                    this.animation.stop();
                }
                distination = this.panelWidth * (this.index + this.vector) * -1 + (this.cloneCount * this.panelWidth * this.length * -1);
                this.animation = $.Animation(this.container.$el[0], {
                    left: distination
                }, {
                    duration: duration,
                    easing: this._config.easing
                });
            },
            cancel: function () {
            },
            after: function () {
            }
        }
    });
})(psyborg || (psyborg = {}));
var psyborg;
(function (psyborg) {
    psyborg.PsycleTransition.create({
        fade: {
            init: function () {
                // スタイルを設定
                // StyleSheet.posBase(this.stage.$el);
                psyborg.StyleSheet.posBase(this.container.$el);
                psyborg.StyleSheet.posAbs(this.panels.$el);
                // 初期化時のインラインスタイルを保持
                // var $panel:JQuery = this.panels.$el;
                // $panel.data('originStyle', $panel.attr('style'));
            },
            reflow: function (info) {
                switch (info.timing) {
                    case psyborg.PsycleReflowTiming.TRANSITION_END:
                    case psyborg.PsycleReflowTiming.RESIZE_START:
                    case psyborg.PsycleReflowTiming.RESIZE_END:
                    case psyborg.PsycleReflowTiming.LOAD:
                        if (this._config.resizable) {
                            this.stage.$el.height(this.panels.$el.height());
                        }
                        psyborg.StyleSheet.z(this.panels.$el, 0);
                        psyborg.StyleSheet.z(this.panels.item(this.to).$el, 10);
                        this.panels.$el.css({ opacity: 0 });
                        this.panels.item(this.to).$el.css({ opacity: 1 });
                        break;
                }
            },
            silent: function () {
            },
            before: function () {
            },
            fire: function () {
                this.panels.item(this.to).$el.css({ opacity: 0 });
                psyborg.StyleSheet.z(this.panels.item(this.to).$el, 20);
                if (this.animation) {
                    this.animation.stop();
                }
                this.animation = $.Animation(this.panels.item(this.to).$el[0], {
                    opacity: 1
                }, {
                    duration: this._config.duration
                });
                $.Animation(this.panels.item(this.from).$el[0], {
                    opacity: 0
                }, {
                    duration: this._config.duration
                });
            },
            cancel: function () {
            },
            after: function () {
                this.panels.$el.css({ opacity: 0 });
                this.panels.item(this.to).$el.css({ opacity: 1 });
            }
        }
    });
})(psyborg || (psyborg = {}));
/// <reference path="d.ts/jquery/jquery.d.ts" />
/// <reference path="d.ts/hammerjs/hammerjs.d.ts" />
/// <reference path="psyborg/Util.ts" />
/// <reference path="psyborg/PsyborgEvent.ts" />
/// <reference path="psyborg/PsyborgEventDispacther.ts" />
/// <reference path="psyborg/PsyborgElement.ts" />
/// <reference path="psyborg/Window.ts" />
/// <reference path="psyborg/StyleSheet.ts" />
/// <reference path="psyborg/Psycle/IPsycleConfig.ts" />
/// <reference path="psyborg/Psycle/IPsycleState.ts" />
/// <reference path="psyborg/Psycle/IPsycleReflowInfo.ts" />
/// <reference path="psyborg/Psycle/IPsycleTransitionList.ts" />
/// <reference path="psyborg/Psycle/IPsycleTransitionProcess.ts" />
/// <reference path="psyborg/Psycle/IPsycleTransitionProcessList.ts" />
/// <reference path="psyborg/Psycle/Psycle.ts" />
/// <reference path="psyborg/Psycle/PsycleEvent.ts" />
/// <reference path="psyborg/Psycle/PsycleRepeat.ts" />
/// <reference path="psyborg/Psycle/PsycleReflowTiming.ts" />
/// <reference path="psyborg/Psycle/PsyclePanel.ts" />
/// <reference path="psyborg/Psycle/PsyclePanelClone.ts" />
/// <reference path="psyborg/Psycle/PsyclePanelList.ts" />
/// <reference path="psyborg/Psycle/PsycleContainer.ts" />
/// <reference path="psyborg/Psycle/PsycleStage.ts" />
/// <reference path="psyborg/Psycle/PsycleTransition.ts" />
/// <reference path="psyborg/Psycle/PsycleController.ts" />
/// <reference path="psyborg/Psycle/PsycleTransitionSlide.ts" />
/// <reference path="psyborg/Psycle/PsycleTransitionFade.ts" />
$.fn.psycle = function (config) {
    if (this.length === 0) {
        if (console && console.warn) {
            console.warn('This jQuery object is empty.');
        }
    }
    return this.each(function () {
        new psyborg.Psycle($(this), config);
    });
};
$.Psycle = psyborg.Psycle;
$.PsycleEvent = psyborg.PsycleEvent;
$.PsycleRepeat = psyborg.PsycleRepeat;
$.PsycleReflowTiming = psyborg.PsycleReflowTiming;

}).call(this);