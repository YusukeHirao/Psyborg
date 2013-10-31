var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../d.ts/jquery.d.ts" />
/// <reference path="../d.ts/hammerjs.d.ts" />
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
    /**!
    * イベントを登録する
    *
    * @method on
    * @since 0.1.0
    * @public
    * @param {string} types イベントの種類(スペース区切りで複数可)
    * @param {Function} listener リスナー関数
    */
    PsyborgEventDispacther.prototype.on = function (types, listener) {
        var typeList = types.split(/\s+/);
        var i = 0;
        var l = typeList.length;
        for (; i < l; i++) {
            this._listeners[typeList[i]] = listener;
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
        if (typeof data === "undefined") { data = {}; }
        if (typeof context === "undefined") { context = this; }
        var listener;
        if (listener = this._listeners[type]) {
            var e = new PsyborgEvent(type);
            e.data = data;
            listener.call(context, e);
            return !e.defaultPrevented;
        }
        return true;
    };
    return PsyborgEventDispacther;
})();

/**!
* CSSを変換するラッパー関数郡
*
* @class PsyborgCSS
* @since 0.1.0
*/
var PsyborgCSS = (function () {
    function PsyborgCSS() {
    }
    PsyborgCSS.posAbs = /**!
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
    function ($el, top, left) {
        if (typeof top === "undefined") { top = 0; }
        if (typeof left === "undefined") { left = 0; }
        return $el.css({
            position: 'absolute',
            top: top,
            left: left
        });
    };

    PsyborgCSS.posBase = /**!
    * ポジションが 未指定もしくは`static`の場合は`relative`にする
    *
    * @method posBase
    * @since 0.1.0
    * @static
    * @param {jQuery} $el 対象要素
    * @return {jQuery} 対象要素
    */
    function ($el) {
        var posi = $el.css('position');
        if (posi == null || posi === 'static' || posi === '') {
            $el.css({
                position: 'relative'
            });
        }
        return $el;
    };

    PsyborgCSS.isOverflowHidden = /**!
    * `overflow:hidden`かどうか
    *
    * @method isOverflowHidden
    * @since 0.1.0
    * @static
    * @param {jQuery} $el 対象要素
    * @return {boolean} `overflow:hidden`だった場合は`true`、それ以外は`false`
    */
    function ($el) {
        return $el.css('overflow').toLowerCase() === 'hidden';
    };
    return PsyborgCSS;
})();

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
        this.$el = $el;
    }
    return PsyborgElement;
})(PsyborgEventDispacther);
var PsycleRepeat;
(function (PsycleRepeat) {
    PsycleRepeat[PsycleRepeat["NONE"] = 0] = "NONE";
    PsycleRepeat[PsycleRepeat["RETURN"] = 1] = "RETURN";
    PsycleRepeat[PsycleRepeat["LOOP"] = 2] = "LOOP";
})(PsycleRepeat || (PsycleRepeat = {}));

var PsycleEvent;
(function (PsycleEvent) {
    PsycleEvent[PsycleEvent["INIT"] = 0] = "INIT";
    PsycleEvent[PsycleEvent["PANEL_CHANGE_START"] = 1] = "PANEL_CHANGE_START";
    PsycleEvent[PsycleEvent["PANEL_CHANGE_END"] = 2] = "PANEL_CHANGE_END";
    PsycleEvent[PsycleEvent["PANEL_CHANGE_CANCEL"] = 3] = "PANEL_CHANGE_CANCEL";
    PsycleEvent[PsycleEvent["WAIT_START"] = 4] = "WAIT_START";
    PsycleEvent[PsycleEvent["WAIT_END"] = 5] = "WAIT_END";
})(PsycleEvent || (PsycleEvent = {}));

var PsycleReflowTiming;
(function (PsycleReflowTiming) {
    PsycleReflowTiming[PsycleReflowTiming["INIT"] = 0] = "INIT";
    PsycleReflowTiming[PsycleReflowTiming["TRANSITION_END"] = 1] = "TRANSITION_END";
    PsycleReflowTiming[PsycleReflowTiming["RESIZE"] = 2] = "RESIZE";
    PsycleReflowTiming[PsycleReflowTiming["RESIZE_START"] = 3] = "RESIZE_START";
    PsycleReflowTiming[PsycleReflowTiming["RESIZE_END"] = 4] = "RESIZE_END";
})(PsycleReflowTiming || (PsycleReflowTiming = {}));

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
        this.index = index;
        this._list = list;
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
    *
    * @method clone
    * @since 0.1.0
    * @public
    * @return {PsyclePanelClone} 自身のクローン要素
    */
    PsyclePanel.prototype.clone = function () {
        var clone = new PsyclePanelClone(this.$el.clone(), this.index, this._list);
        this.$el.after(clone.$el);
        this._list.clones.push(clone);
        return clone;
    };
    return PsyclePanel;
})(PsyborgElement);

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
        this.$el.addClass('__psycle_panel_clone__');
    }
    return PsyclePanelClone;
})(PsyclePanel);

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
        _super.call(this, $el);
        /**!
        * パネル要素のリスト
        *
        * @property panels
        * @since 0.3.0
        * @public
        * @type PsyclePanel[]
        * @default []
        */
        this.panels = [];
        /**!
        * クローン要素のリスト
        *
        * @property clones
        * @since 0.3.0
        * @public
        * @type PsyclePanelClone[]
        * @default []
        */
        this.clones = [];
        /**!
        * パネル要素の数
        *
        * @property panels
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
    }
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
        var index = this.panels.length;
        var panel = new PsyclePanel($el, index, this);
        this.panels.push(panel);
        this.length += 1;
        return this;
    };

    /**!
    * パネルを削除する
    *
    * @method add
    * @since 0.1.0
    * @public
    * @param {number} index 削除するパネルの番号
    * @param {boolean} [removeFromDOMTree=true] DOMツリーから削除するかどうか
    * @return {PsyclePanelList} 自身
    */
    PsyclePanelList.prototype.remove = function (index, removeFromDOMTree) {
        if (typeof removeFromDOMTree === "undefined") { removeFromDOMTree = true; }
        if (removeFromDOMTree) {
            this.$el.eq(index).remove();
        }
        this.panels.splice(index, 1);
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
    * @return {PsyclePanelList} パネル
    */
    PsyclePanelList.prototype.item = function (searchIndex) {
        var index = this._getRealIndex(searchIndex);
        return this.panels[index];
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
        var l = this.panels.length;
        var panel;
        for (; i < l; i++) {
            panel = this.panels[i];
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
    * @method item
    * @since 0.1.0
    * @public
    * @deprecated
    * @return {PsyclePanelList} 自身
    */
    PsyclePanelList.prototype.removeClone = function () {
        var i = 0;
        var l = this.clones.length;
        for (; i < l; i++) {
            this.clones[i].$el.remove();
        }
        this.clones = [];
        return this;
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
        var length = this.panels.length;
        searchIndex = searchIndex % length;
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
        var l = this.panels.length;
        for (; i < l; i++) {
            this.panels[i].index = i;
        }
        return l;
    };
    return PsyclePanelList;
})(PsyborgElement);

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
})(PsyborgElement);

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
    function PsycleStage() {
        _super.apply(this, arguments);
    }
    return PsycleStage;
})(PsyborgElement);

var PsycleTransition = (function () {
    function PsycleTransition(name, process) {
        this.name = name;
        $.extend(this, process);
    }
    PsycleTransition.create = function (processList) {
        var transitionName;
        var transition;
        for (transitionName in processList) {
            transition = new PsycleTransition(transitionName, processList[transitionName]);
            PsycleTransition.transitions[transitionName] = transition;
        }
    };
    PsycleTransition.transitions = {};
    return PsycleTransition;
})();
PsycleTransition.create({
    slide: {
        init: function () {
            PsyborgCSS.posBase(this.stage.$el);
            PsyborgCSS.posAbs(this.container.$el);
            PsyborgCSS.posAbs(this.panels.$el);

            var $panel = this.panels.$el;

            // 初期化時のインラインスタイルを保持
            $panel.data('originStyle', $panel.attr('style'));
        },
        reflow: function (info) {
            var $panel = this.panels.$el;

            /**
            * 直接幅を設定してしまうとインラインCSSで設定されるので
            * 次回取得時にその幅しか取得できない。
            * 固定の場合は問題ないが相対値の場合は問題となるので
            * 初期化時のインラインスタイルに戻すことで
            * 常にオリジナルの幅を取得できるようになる。
            */
            // 初期化時のスタイルに戻る
            $panel.attr('style', $panel.data('originStyle'));

            // 初期化時のスタイルの状態で幅を取得
            this.panelWidth = $panel.width();

            // 取得した幅を設定
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

/**!
* スライド要素を生成・管理するクラス
*
* @class Psycle
* @since 0.1.0
* @extends PsyborgElement
* @constructor
* @param {jQuery} $el インスタンス化する要素
* @param {any} options
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
* @param {number} [options.cols=1] カラム(列)の数（カラム対応のトランジションのみ）
* @param {number} [options.rows=1] 行の数（行対応のトランジションのみ）
* @param {number} [options.offsetX=0] コンテナの横方向のオフセット（コンテナが平行移動するトランジションのみ）
* @param {number} [options.offsetY=0] コンテナの縦方向のオフセット（コンテナが平行移動するトランジションのみ）
* @param {boolean} [options.nearby=false] ???
* @param {boolean} [options.innerFocus=false] マルチカラムの時のフォーカスの当たり方が内側優先かどうか、noFocusがtrueの場合は無効
* @param {boolean} [options.noFocus=true] マルチカラムの時、パネルにフォーカスを当てない、また、indexは先頭の要素だけを指すことになる
* @param {boolean} [options.resizable=false] リサイズによってパネルの大きさが変わる場合はtrueを渡す
* @param {boolean} [options.bindKeyboard=false] キーボードで操作できるようにするかどうか
* @param {any} [options.showOnlyOnce=null] オートプレイの時に一度しか表示しないパネルのフィルタセレクタ (例) .once
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
        * 前に遷移するか次に遷移するか 番号の変化量 `1`もしくは`-1`のみ
        *
        * @property vector
        * @since 0.1.0
        * @public
        * @type number
        * @default 1
        */
        this.vector = 1;
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
            nearby: false,
            innerFocus: false,
            noFocus: true,
            resizable: false,
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

        // 要素インスタンス
        var $stage = $el;
        var $container = $stage.find(this._config.container);
        var $panels = $container.find(this._config.panels);
        this.stage = new PsycleStage($stage);
        this.container = new PsycleContainer($container);
        this.panels = new PsyclePanelList($panels);
        this.transition = PsycleTransition.transitions[this._config.transition];

        // オプションの継承
        this.index = this._config.startIndex;

        // プロパティ算出
        this.length = this.panels.length;
        this.progressIndex = this.index;

        // イベントの登録
        this._resizeable();

        // 処理開始
        this._init();
        this._silent();

        if (this._config.auto) {
            this.play();
        }

        // 自身のインスタンスを登録
        $el.data('Psycle', this);
    }
    /**!
    * 自動再生を開始する
    *
    * @method play
    * @since 0.1.0
    * @public
    * @return {Psycle} 自身のインスタンス
    */
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
        return this;
    };

    /**!
    * 指定の番号のパネルへ遷移する
    *
    * @method gotoPanel
    * @since 0.1.0
    * @public
    * @param {number} to 遷移させるパネル番号
    * @return {Psycle} 自身のインスタンス
    */
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
    * 前のパネルへ遷移する
    *
    * @method prev
    * @since 0.1.0
    * @public
    * @return {Psycle} 自身のインスタンス
    */
    Psycle.prototype.prev = function () {
        if (this.isTransition) {
            return this;
        }
        this.vector = -1;
        var to = this._optimizeCounter(this.index - 1);
        this.gotoPanel(to);
        return this;
    };

    /**!
    * 次のパネルへ遷移する
    *
    * @method prev
    * @since 0.1.0
    * @public
    * @return {Psycle} 自身のインスタンス
    */
    Psycle.prototype.next = function () {
        if (this.isTransition) {
            return this;
        }
        this.vector = 1;
        var to = this._optimizeCounter(this.index + 1);
        this.gotoPanel(to);
        return this;
    };

    /**!
    * 遷移完了時コールバック関数
    *
    * @method _done
    * @since 0.1.0
    * @private
    */
    Psycle.prototype._done = function () {
        this.index = this.to;
        this.isTransition = false;
        this._after();
        this._silent();

        if (this._config.auto) {
            this.play();
        }
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
        this.isPaused = true;
    };

    /**!
    * パネル番号の正規化
    *
    * @method _optimizeCounter
    * @since 0.1.0
    * @private
    * @param {number} index 正規化するパネル番号
    * @return {number} 正規化されたパネル番号
    */
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
                if (this._isFirst(index) || this._isLast(index)) {
                    this.stop();
                }
        }
        return index;
    };

    /**!
    * 指定したパネル番号が最初のパネルかどうか
    *
    * @method _isLast
    * @since 0.3.0
    * @private
    * @param {number} index 評価するパネル番号
    * @return {boolean} 最初のパネルなら`true`
    */
    Psycle.prototype._isFirst = function (index) {
        return index === 0;
    };

    /**!
    * 指定したパネル番号が最後のパネルかどうか
    *
    * @method _isLast
    * @since 0.3.0
    * @private
    * @param {number} index 評価するパネル番号
    * @return {boolean} 最後のパネルなら`true`
    */
    Psycle.prototype._isLast = function (index) {
        return index === this.length - 1;
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

    /**!
    * 初期化処理を実行する
    *
    * @method _init
    * @since 0.1.0
    * @private
    */
    Psycle.prototype._init = function () {
        this.transition.init.call(this);
        this.transition.reflow.call(this, { timing: PsycleReflowTiming.INIT });
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
        this.transition.reflow.call(this, { timing: PsycleReflowTiming.TRANSITION_END });
    };

    /**!
    * 遷移直前の処理を実行する
    *
    * @method _before
    * @since 0.1.0
    * @private
    */
    Psycle.prototype._before = function () {
        this.transition.before.call(this);
    };

    /**!
    * 遷移時の処理を実行する
    *
    * @method _fire
    * @since 0.1.0
    * @private
    */
    Psycle.prototype._fire = function () {
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
    * リサイズ中の処理を実行する
    *
    * @method _resize
    * @since 0.1.0
    * @private
    */
    Psycle.prototype._resize = function () {
        this.transition.reflow.call(this, { timing: PsycleReflowTiming.RESIZE });
    };

    /**!
    * リサイズ開始時の処理を実行する
    *
    * @method _resizeStart
    * @since 0.1.0
    * @private
    */
    Psycle.prototype._resizeStart = function () {
        this.transition.reflow.call(this, { timing: PsycleReflowTiming.RESIZE_START });
        if (this.animation && this.isTransition) {
            this.animation.stop();
            this.stop();
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
        this.transition.reflow.call(this, { timing: PsycleReflowTiming.RESIZE_END });
        if (this.isPaused && this.isTransition) {
            this.gotoPanel(this.to);
        }
    };
    return Psycle;
})(PsyborgElement);

jQuery.fn.psycle = function (config) {
};