"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var PsyborgElement_1 = require("../PsyborgElement");
var Util_1 = require("../Util");
var PsycleContainer_1 = require("./PsycleContainer");
var PsycleEvent_1 = require("./PsycleEvent");
var PsyclePanelList_1 = require("./PsyclePanelList");
var PsycleReflowTiming_1 = require("./PsycleReflowTiming");
var PsycleRepeat_1 = require("./PsycleRepeat");
var PsycleStage_1 = require("./PsycleStage");
var PsycleTransition_1 = require("./PsycleTransition");
/**
 * スライド要素を生成・管理するクラス
 *
 * @since 0.9.1
 * @param $el インスタンス化する要素
 * @param options
 */
var Psycle = (function (_super) {
    __extends(Psycle, _super);
    function Psycle($el, options) {
        var _this = _super.call(this, $el) || this;
        /**
         * 現在表示しているパネル番号
         *
         * @since 0.1.0
         * @default 0
         */
        _this.index = 0;
        /**
         * 前に遷移するか次に遷移するか 番号の変化量
         *
         * @since 0.1.0
         * @default 0
         */
        _this.vector = 0;
        /**
         * 現在遷移状態かどうか
         *
         * @since 0.1.0
         * @default false
         */
        _this.isTransition = false;
        /**
         * 現在のクローンパネルの数
         *
         * @since 0.5.3
         * @default 0
         */
        _this.cloneCount = 0;
        /**
         * パネルの遷移回数のログ
         *
         * @since 0.7.0
         */
        _this._times = [];
        /**
         * 除外番号
         *
         * @since 0.7.0
         */
        _this._ignoreIndexes = [];
        var defaults = {
            instanceKey: 'psycle',
            startIndex: 0,
            transition: 'slide',
            duration: 600,
            easing: 'swing',
            delay: 3000,
            auto: true,
            cancel: true,
            repeat: PsycleRepeat_1.default.RETURN,
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
            scenes: [],
            dimension: 'auto',
            crossFade: true,
        };
        _this.config = $.extend(defaults, options);
        // 要素インスタンス
        var $stage = $el;
        var $container = $stage.find(_this.config.container);
        var $panels = $container.find(_this.config.panels);
        _this.panels = new PsyclePanelList_1.default($panels);
        _this.container = new PsycleContainer_1.default($container);
        _this.stage = new PsycleStage_1.default($stage, _this.panels);
        _this.transition = PsycleTransition_1.default.transitions[_this.config.transition];
        if (_this.transition == null) {
            throw new ReferenceError("'" + _this.config.transition + "' is not transition type.");
        }
        if (_this.transition.fallback && _this.transition.fallbackFilter && _this.transition.fallbackFilter()) {
            _this.transition = PsycleTransition_1.default.transitions[_this.transition.fallback];
            if (_this.transition == null) {
                throw new ReferenceError("'" + _this.config.transition + "' is not transition type.");
            }
        }
        if (_this.config.draggable || _this.config.swipeable) {
            if (!(jQuery.fn.hammer || Hammer)) {
                throw new ReferenceError('"Hammer.js" is required when use "draggable" or "swipeable" options.');
            }
        }
        // オプションの継承
        _this.index = +_this.config.startIndex || 0;
        _this.to = _this.index;
        _this.from = _this.index;
        _this.repeat = _this.config.repeat;
        // プロパティ算出
        _this.length = _this.panels.length;
        _this.progressIndex = _this.index;
        // イベントの登録
        _this._resizeable();
        // 処理開始
        _this._init();
        _this._silent();
        // パネル内の画像が読み込まれたとき
        _this.panels.on('load', function () {
            _this._load();
        });
        // 自身のインスタンスを登録
        $el.data(_this.config.instanceKey, _this);
        setTimeout(function () {
            _this._initFinished();
            // 自動再生
            if (_this.config.auto) {
                _this.play();
            }
        }, 0);
        return _this;
    }
    /**
     * 自動再生を開始する
     *
     * @version 0.7.1
     * @since 0.1.0
     * @return 自身のインスタンス
     */
    Psycle.prototype.play = function () {
        var _this = this;
        var defaultPrevented = this.trigger('play');
        if (defaultPrevented) {
            this.config.auto = true;
            clearTimeout(this.timer);
            this.timer = setTimeout(function () {
                _this.next();
            }, this.config.delay);
        }
        return this;
    };
    /**
     * 自動再生を停止する
     *
     * @since 0.1.0
     * @return 自身のインスタンス
     */
    Psycle.prototype.stop = function () {
        clearTimeout(this.timer);
        this.config.auto = false;
        return this;
    };
    /**
     * 遷移を強制的に停止する
     * 遷移中のスタイルで固定される
     *
     * @since 0.3.4
     * @return 自身のインスタンス
     */
    Psycle.prototype.freeze = function () {
        if (this.animation) {
            this.animation.stop();
        }
        return this;
    };
    /**
     * 指定の番号のパネルへ遷移する
     *
     * @version 0.7.0
     * @since 0.1.0
     * @param to 遷移させるパネル番号
     * @param [duration] 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
     * @return 自身のインスタンス
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
    /**
     * 前のパネルへ遷移する
     *
     * @version 0.7.0
     * @since 0.1.0
     * @param [duration] 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
     * @return 自身のインスタンス
     */
    Psycle.prototype.prev = function (duration) {
        if (this.isTransition) {
            return this;
        }
        var direction = -1;
        this.gotoPanel(this.index - 1, duration, direction);
        return this;
    };
    /**
     * 次のパネルへ遷移する
     *
     * @version 0.7.0
     * @since 0.1.0
     * @param [duration] 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
     * @return 自身のインスタンス
     */
    Psycle.prototype.next = function (duration) {
        if (this.isTransition) {
            return this;
        }
        var direction = +1;
        this.gotoPanel(this.index + 1, duration, direction);
        return this;
    };
    /**
     * リフロー処理を実行する
     *
     * @since 0.3.4
     * @param data リフロー処理時に渡す任意のデータ
     * @return 自身のインスタンス
     */
    Psycle.prototype.reflow = function (data) {
        this.transition.reflow.call(this, {
            timing: PsycleReflowTiming_1.default.REFLOW_METHOD,
            data: data,
        });
        return this;
    };
    /**
     * 現在のパネルが最初のパネルかどうか
     *
     * @since 0.4.0
     * @return {boolean} 最初のパネルなら`true`
     */
    Psycle.prototype.isFirst = function () {
        return this._isFirst(this.index);
    };
    /**
     * 現在のパネルが最後のパネルかどうか
     *
     * @since 0.4.0
     * @return {boolean} 最後のパネルなら`true`
     */
    Psycle.prototype.isLast = function () {
        return this._isLast(this.index);
    };
    /**
     * マーカーを生成する
     *
     * @version 0.8.3
     * @since 0.3.0
     * @param [duration] 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
     * @param {string} [currentClassAddionalEventType] カレントクラスを付加するタイミング
     * @return {JQuery} 生成したjQuery要素
     */
    Psycle.prototype.marker = function (duration, currentClassAddionalEventType) {
        var _this = this;
        var $ul = $('<ul />');
        // currentClassAddionalEventType引数のデフォルト
        currentClassAddionalEventType = currentClassAddionalEventType || PsycleEvent_1.default.PANEL_CHANGE_END;
        for (var i = 0, l = this.length; i < l; i++) {
            var $li = $('<li />');
            $li.appendTo($ul);
            if (this.panels.item(i).$el.filter(this.config.showOnlyOnce).length) {
                $li.addClass(this.config.showOnlyOnce).hide();
            }
        }
        var $lis = $ul.find('li');
        this.on(currentClassAddionalEventType, function (e) {
            $lis.removeClass(_this.config.currentClass);
            $lis.eq(e.data.to).addClass(_this.config.currentClass);
        });
        $lis.eq(this.config.startIndex).addClass(this.config.currentClass);
        $lis.on('click', function (e) {
            _this.gotoPanel($(e.target).index(), duration);
            e.preventDefault();
        });
        return $ul;
    };
    /**
     * マーカーを設定する
     *
     * @version 0.7.0
     * @since 0.5.3
     * @param $elem 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
     * @param options オプション
     * @return 生成したjQuery要素
     */
    Psycle.prototype.marked = function ($elem, options) {
        var _this = this;
        var config = $.extend({
            type: 'li',
            duration: null,
        });
        var nodeName = $elem[0].nodeName;
        var type = "" + config.type;
        if (nodeName === 'UL' || nodeName === 'OL') {
            type = 'li';
        }
        var childTag;
        switch (type.toLowerCase()) {
            case 'li':
            case 'list':
            case 'ls':
            case 'ul':
            case 'ol': {
                childTag = 'li';
                break;
            }
            case 'i':
            case 'in':
            case 'inline':
            case 'span': {
                childTag = 'span';
                break;
            }
            // case 'b':
            // case 'block':
            // case 'div':
            default: {
                childTag = 'div';
            }
        }
        var $childBase = $('<' + childTag + ' />');
        for (var i = 0, l = this.length; i < l; i++) {
            var $child = $childBase.clone();
            $child.appendTo($elem);
            if (this.panels.item(i).$el.filter(this.config.showOnlyOnce).length) {
                $child.addClass(this.config.showOnlyOnce).hide();
            }
        }
        var $children = $elem.find('>' + childTag);
        $children.eq(this.config.startIndex).addClass(this.config.currentClass);
        this.on(PsycleEvent_1.default.PANEL_CHANGE_END, function (e) {
            $children.removeClass(_this.config.currentClass);
            $children.eq(e.data.index).addClass(_this.config.currentClass);
        });
        $children.on('click', function (e) {
            _this.gotoPanel($(e.target).index(), config.duration);
            e.preventDefault();
        });
    };
    /**
     * コントローラをバインドする
     *
     * @version 0.7.0
     * @since 0.4.3
     * @param $elem バインドさせるjQuery要素
     * @param options オプション
     */
    Psycle.prototype.controller = function ($elem, options) {
        var _this = this;
        var config = $.extend({
            prev: '.prev',
            next: '.next',
            duration: null,
            ifFirstClass: 'is-first',
            ifLastClass: 'is-last',
            ifIgnoreClass: 'is-ignore',
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
        this.on(PsycleEvent_1.default.PANEL_CHANGE_END, addStatus);
        addStatus();
        return;
    };
    /**
     * コントローラをバインドする
     * `controller`のエイリアス
     *
     * @since 0.5.3
     * @param {JQuery} $elem バインドさせるjQuery要素
     * @param options オプション
     * @return {JQuery} 生成したjQuery要素
     */
    Psycle.prototype.ctrl = function ($elem, options) {
        this.controller($elem, options);
    };
    /**
     * 指定の番号のパネルへ遷移する
     *
     * @version 0.7.0
     * @since 0.6.0
     * @param to 遷移させるパネル番号
     * @param [duration] 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
     * @param [direction=0] 方向
     * @param [vector]
     * @param {boolean} [fromHalfway=false] 中途半端な位置からの遷移かどうか
     * @return 自身のインスタンス
     */
    Psycle.prototype.transitionTo = function (to, duration, direction, vector, fromHalfway) {
        var _this = this;
        if (direction === void 0) { direction = 0; }
        if (fromHalfway === void 0) { fromHalfway = false; }
        // アニメーション前 各種数値設定前
        this.before();
        //  目的のパネルにshowOnlyOnceのセレクタにマッチしていて、且つ1回以上表示されていたら次の遷移に移る
        var optimizedVector = vector && $.isNumeric(vector) ? vector : this._optimizeVector(to, direction);
        var distIndex = this._optimizeCounter(this.index + optimizedVector, to);
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
                optimizedVector = vector && $.isNumeric(vector) ? vector : this._optimizeVector(distIndex + direction, direction);
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
        this.duration = duration || this.config.duration;
        this.vector = optimizedVector;
        this.from = this.index;
        this.to = distIndex;
        this.progressIndex = distIndex;
        if (this.config.delayWhenFire) {
            clearTimeout(this._delayTimer);
            this._delayTimer = setTimeout(function () {
                _this._fire();
            }, this.config.delayWhenFire);
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
    /**
     * 遷移直前の処理を実行する
     *
     * @version 0.8.2
     * @since 0.6.0
     */
    Psycle.prototype.before = function () {
        this.transition.before.call(this);
        this.panels.resetCurrent(this.config.currentClass);
        this.trigger(PsycleEvent_1.default.PANEL_CHANGE_START_BEFORE, this._getState());
    };
    Object.defineProperty(Psycle.prototype, "isPaused", {
        /**
         * 自動再生の一時停止状態かどうか
         *
         * @since 0.1.0
         * @default false
         */
        get: function () {
            return !this.config.auto;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 番号の変化量の正規化
     * 一番近いパネルまでの距離(パネル数)を算出する
     *
     * @version 0.7.0
     * @since 0.3.0
     * @param to 目的のパネル番号
     * @param direction 方向
     * @return 正規化された変化量
     */
    Psycle.prototype._optimizeVector = function (to, direction) {
        var optTo = (to + this.length) % this.length;
        var dist = Math.abs(this.index - optTo);
        var vector;
        var dir = (this.index < optTo) ? 1 : -1;
        if (this.length - 1 <= this.index && this.index < to) {
            dir = -1;
        }
        else if (to < this.index && this.index <= 0) {
            dir = 1;
        }
        if (this.repeat === PsycleRepeat_1.default.LOOP) {
            vector = Util_1.default.getloopSeriesVector(this.index, to, direction, this.length);
        }
        else {
            vector = dist * dir;
        }
        return vector;
    };
    /**
     * パネル番号の正規化
     *
     * @version 0.7.0
     * @since 0.1.0
     * @param index 正規化するパネル番号
     * @param progressIndex 実際に指定されたパネル番号
     * @return 正規化されたパネル番号
     */
    Psycle.prototype._optimizeCounter = function (index, progressIndex) {
        var optIndex;
        switch (this.repeat) {
            case PsycleRepeat_1.default.LOOP: {
                optIndex = Util_1.default.getloopSeriesNumber(index, this.length);
                break;
            }
            case PsycleRepeat_1.default.RETURN: {
                optIndex = (index + this.length) % this.length;
                break;
            }
            default: {
                var maxIndex = this.length - 1;
                optIndex = (progressIndex < 0) ? 0 : progressIndex;
                optIndex = (optIndex < maxIndex) ? optIndex : maxIndex;
            }
        }
        return optIndex;
    };
    /**
     * 指定したパネル番号が最初のパネルかどうか
     *
     * @version 0.7.0
     * @since 0.3.0
     * @param index 評価するパネル番号
     * @return {boolean} 最初のパネルなら`true`
     */
    Psycle.prototype._isFirst = function (index) {
        var first = 0;
        while (this._ignoreIndexes[first] && this._times[first] >= 1) {
            first += 1;
        }
        return index === first;
    };
    /**
     * 指定したパネル番号が最後のパネルかどうか
     *
     * @version 0.7.0
     * @since 0.3.0
     * @param index 評価するパネル番号
     * @return {boolean} 最後のパネルなら`true`
     */
    Psycle.prototype._isLast = function (index) {
        var last = this.length - 1;
        while (this._ignoreIndexes[last] && this._times[last] >= 1) {
            last -= 1;
        }
        return index === last;
    };
    /**
     * リサイズイベントを関連付ける
     *
     * @since 0.1.0
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
    /**
     * 現在の状態の情報を返す
     *
     * @version 0.8.0
     * @since 0.1.0
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
            isPaused: this.isPaused,
        };
    };
    /**
     * パネル内の画像の読み込みが完了した時
     *
     * @since 0.5.1
     */
    Psycle.prototype._load = function () {
        this.transition.reflow.call(this, { timing: PsycleReflowTiming_1.default.LOAD });
    };
    /**
     * 初期化処理を実行する
     *
     * @version 0.8.1
     * @since 0.1.0
     */
    Psycle.prototype._init = function () {
        var _this = this;
        // 最初のパネルの表示回数を設定
        this._times[this.config.startIndex] = 1;
        // 除外番号の登録
        this.panels.each(function (i, panel) {
            if (panel.$el.filter(_this.config.showOnlyOnce).length) {
                _this._ignoreIndexes[i] = true;
            }
            else {
                _this._ignoreIndexes[i] = false;
            }
        });
        this.transition.init.call(this);
        this.transition.reflow.call(this, { timing: PsycleReflowTiming_1.default.INIT });
    };
    /**
     * 初期化処理が終了したときの処理
     *
     * @version 0.8.1
     * @since 0.8.1
     */
    Psycle.prototype._initFinished = function () {
        this.trigger(PsycleEvent_1.default.INIT, this._getState());
    };
    /**
     * 非遷移番号移動を実行する
     *
     * @since 0.1.0
     */
    Psycle.prototype._silent = function () {
        this.transition.silent.call(this);
        this.transition.reflow.call(this, { timing: PsycleReflowTiming_1.default.TRANSITION_END });
        this.panels.setCurrent(this.index, this.config.currentClass);
    };
    /**
     * 遷移直前の処理を実行する
     *
     * @deprecated
     * @since 0.1.0
     */
    Psycle.prototype._before = function () {
        this.before();
    };
    /**
     * 遷移時の処理を実行する
     *
     * @version 0.8.2
     * @since 0.1.0
     */
    Psycle.prototype._fire = function () {
        this.isTransition = true;
        this.trigger(PsycleEvent_1.default.PANEL_CHANGE_START, this._getState());
        this.transition.fire.call(this);
    };
    /**
     * 遷移キャンセル時の処理を実行する
     *
     * @since 0.1.0
     */
    Psycle.prototype._cancel = function () {
        this.transition.cancel.call(this);
    };
    /**
     * 遷移完了時コールバック関数
     *
     * @version 0.7.0
     * @since 0.1.0
     */
    Psycle.prototype._done = function () {
        this.index = this.to;
        this.progressIndex = this.to;
        this.isTransition = false;
        this._after();
        this._silent();
        this.trigger(PsycleEvent_1.default.PANEL_CHANGE_END, this._getState());
        this._times[this.to] = this._times[this.to] + 1 || 1;
        this._finaly();
    };
    /**
     * 遷移後の処理を実行する
     *
     * @since 0.1.0
     */
    Psycle.prototype._after = function () {
        this.transition.after.call(this);
    };
    /**
     * 遷移未完了で停止した場合のコールバック関数
     *
     * @since 0.1.0
     */
    Psycle.prototype._fail = function () {
        this._cancel();
        this.isTransition = false;
        this.trigger(PsycleEvent_1.default.PANEL_CHANGE_CANCEL, this._getState());
        this._finaly();
    };
    /**
     * すべての処理の完了後のコールバック関数
     *
     * @version 0.7.0
     * @since 0.7.0
     */
    Psycle.prototype._finaly = function () {
        // 自動再生状態なら再生開始する
        if (this.config.auto) {
            // しかしリピートしないで最後のパネルなら自動再生を停止する
            if (this.repeat === PsycleRepeat_1.default.NONE && this.isLast()) {
                return;
            }
            this.play();
        }
    };
    /**
     * リサイズ中の処理を実行する
     *
     * @since 0.1.0
     */
    Psycle.prototype._resize = function () {
        this.transition.reflow.call(this, { timing: PsycleReflowTiming_1.default.RESIZE });
    };
    /**
     * リサイズ開始時の処理を実行する
     *
     * @since 0.9.0
     */
    Psycle.prototype._resizeStart = function () {
        this.transition.reflow.call(this, { timing: PsycleReflowTiming_1.default.RESIZE_START });
        this.trigger(PsycleEvent_1.default.RESIZE_START, this._getState());
        if (this.animation && this.isTransition) {
            this.freeze();
        }
    };
    /**
     * リサイズ終了時の処理を実行する
     *
     * @since 0.9.0
     */
    Psycle.prototype._resizeEnd = function () {
        this.transition.reflow.call(this, { timing: PsycleReflowTiming_1.default.RESIZE_END });
        this.trigger(PsycleEvent_1.default.RESIZE_END, this._getState());
        if (this.isPaused && this.config.auto) {
            this.gotoPanel(this.to);
        }
    };
    return Psycle;
}(PsyborgElement_1.default));
exports.default = Psycle;
