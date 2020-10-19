"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var PsyborgElement_1 = require("../PsyborgElement");
var PsyclePanel_1 = require("./PsyclePanel");
/**
 * スライドショーパネル要素リスト
 *
 * @since 0.1.0
 * @param $el 対象要素
 */
var PsyclePanelList = /** @class */ (function (_super) {
    __extends(PsyclePanelList, _super);
    function PsyclePanelList($el) {
        var _this = _super.call(this, $el) || this;
        /**
         * パネル要素の数
         *
         * @since 0.3.0
         * @default 0
         */
        _this.length = 0;
        /**
         * パネル要素のリスト
         *
         * @since 0.3.0
         * @default []
         */
        _this._panels = [];
        /**
         * クローン要素のリスト
         *
         * @since 0.3.0
         * @default []
         */
        _this._clones = [];
        var $panel;
        for (var i = 0, l = $el.length; i < l; i++) {
            $panel = $($el[i]);
            _this.add($panel);
        }
        var onLoadedPromises = [];
        _this.each(function (i, panel) {
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
        return _this;
    }
    /**
     * 現在のパネルを設定する
     *
     * @since 0.3.0
     * @param index 現在のパネル番号
     * @param className 現在のパネルに設定するクラス名
     * @return 自身
     */
    PsyclePanelList.prototype.setCurrent = function (index, className) {
        this.resetCurrent(className);
        this.item(index).$el.addClass(className);
        return this;
    };
    /**
     * 現在のパネルの設定をリセットする
     *
     * @since 0.3.0
     * @param className 設定を外すクラス名
     * @return 自身
     */
    PsyclePanelList.prototype.resetCurrent = function (className) {
        this.$el.removeClass(className);
        this.getClones().removeClass(className);
        return this;
    };
    /**
     * パネルを追加する
     *
     * @since 0.1.0
     * @param $el 追加する要素
     * @return 自身
     */
    PsyclePanelList.prototype.add = function ($el) {
        var index = this._panels.length;
        var panel = new PsyclePanel_1.default($el, index, this);
        this._panels.push(panel);
        this.$el = this.$el.add($el);
        this.length += 1;
        return this;
    };
    /**
     * クローンを追加する
     *
     * @since 0.3.0
     * @param $el 追加する要素
     * @return 自身
     */
    PsyclePanelList.prototype.addClone = function (clone) {
        this._clones.push(clone);
        return this;
    };
    /**
     * 指定数クローンを生成してコンテナの末尾に追加する
     *
     * @since 0.5.3
     * @param count クローンする数
     * @return 自身
     */
    PsyclePanelList.prototype.cloneAfter = function (count) {
        return this.clone(count);
    };
    /**
     * 指定数クローンを生成してコンテナの先頭に追加する
     *
     * @since 0.5.3
     * @param count クローンする数
     * @return 自身
     */
    PsyclePanelList.prototype.cloneBefore = function (count) {
        return this.clone(count, true);
    };
    /**
     * 指定数クローンを生成してDOMに追加する
     *
     * @since 0.5.3
     * @param count クローンする数
     * @param cloneBefore リスト前方にクローンするかどうか
     * @return 自身
     */
    PsyclePanelList.prototype.clone = function (count, cloneBefore) {
        if (cloneBefore === void 0) { cloneBefore = false; }
        var clones = [];
        var $clones = $();
        for (var i = 0, l = count; i < l; i++) {
            this.each(function (index, panel) {
                var clone = panel.clone(false, false);
                clones.push(clone);
                var $clone = clone.$el;
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
    /**
     * パネルを削除する
     *
     * @since 0.1.0
     * @param index 削除するパネルの番号
     * @param removeFromDOMTree DOMツリーから削除するかどうか
     * @return 自身
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
    /**
     * 指定の番号のパネルを返す
     *
     * @since 0.1.0
     * @param searchIndex パネルの番号
     * @return パネル
     */
    PsyclePanelList.prototype.item = function (searchIndex) {
        var index = this._getRealIndex(searchIndex);
        return this._panels[index];
    };
    /**
     * パネルごとに処理を行う
     *
     * @since 0.1.0
     * @param callback コールバック関数
     * @return 自身
     */
    PsyclePanelList.prototype.each = function (callback) {
        for (var i = 0, l = this._panels.length; i < l; i++) {
            var panel = this._panels[i];
            callback.call(panel, panel.index, panel);
        }
        return this;
    };
    /**
     * 要素を表示する
     *
     * @since 0.1.0
     * @return 自身
     */
    PsyclePanelList.prototype.show = function () {
        this.$el.show();
        return this;
    };
    /**
     * 要素を隠す
     *
     * @since 0.1.0
     * @return 自身
     */
    PsyclePanelList.prototype.hide = function () {
        this.$el.hide();
        return this;
    };
    /**
     * クローンのみを削除する
     *
     * @since 0.1.0
     * @deprecated
     * @return 自身
     */
    PsyclePanelList.prototype.removeClone = function () {
        for (var i = 0, l = this._clones.length; i < l; i++) {
            this._clones[i].$el.remove();
        }
        this._clones = [];
        return this;
    };
    /**
     * クローンのjQuery要素コレクションを返す
     *
     * @version 0.6.2
     * @since 0.6.2
     * @deprecated
     * @return クローンのjQuery要素コレクション
     */
    PsyclePanelList.prototype.getClones = function () {
        var $clones = $();
        for (var i = 0, l = this._clones.length; i < l; i++) {
            $clones = $clones.add(this._clones[i].$el);
        }
        return $clones;
    };
    /**
     * 検索番号の正規化
     *
     * @since 0.1.0
     * @param searchIndex 検索番号
     * @return 結果の番号
     */
    PsyclePanelList.prototype._getRealIndex = function (searchIndex) {
        var length = this._panels.length;
        searchIndex = searchIndex % length; // indexの循環の常套句
        var index = searchIndex < 0 ? length + searchIndex : searchIndex;
        return index;
    };
    /**
     * パネル番号を整理して正しいものに調整する
     *
     * @since 0.1.0
     * @return パネルの数
     */
    PsyclePanelList.prototype._renumbering = function () {
        var l = this._panels.length;
        for (var i = 0; i < l; i++) {
            this._panels[i].index = i;
        }
        return l;
    };
    return PsyclePanelList;
}(PsyborgElement_1.default));
exports.default = PsyclePanelList;
