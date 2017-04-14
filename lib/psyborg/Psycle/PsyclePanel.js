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
/**
 * スライドショーパネル要素
 *
 * @since 0.1.0
 * @param $el 対象要素
 * @param index パネル番号
 * @param list パネル要素リスト
 */
var PsyclePanel = (function (_super) {
    __extends(PsyclePanel, _super);
    function PsyclePanel($el, index, list) {
        var _this = _super.call(this, $el) || this;
        /**
         * パネル内に画像を含むかどうか
         *
         * @since 0.5.1
         */
        _this.hasImages = false;
        /**
         * パネル内に画像の読み込みが完了したかどうか
         *
         * @since 0.5.1
         */
        _this.loaded = false;
        _this.index = index;
        _this._list = list;
        _this._loadImageObserve();
        return _this;
    }
    /**
     * 要素を表示する
     *
     * @since 0.1.0
     * @return 自身
     */
    PsyclePanel.prototype.show = function () {
        this.$el.show();
        return this;
    };
    /**
     * 要素を隠す
     *
     * @since 0.1.0
     * @return 自身
     */
    PsyclePanel.prototype.hide = function () {
        this.$el.hide();
        return this;
    };
    /**
     * クローン要素(クラスは異なる)を作る
     * デフォルトではDOMやリストに追加される
     *
     * @since 0.1.0
     * @param addDOM DOMに追加するかどうか
     * @param addList リストに追加するかどうか
     * @return 自身のクローン要素
     */
    PsyclePanel.prototype.clone = function (addDOM, addList) {
        if (addDOM === void 0) { addDOM = true; }
        if (addList === void 0) { addList = true; }
        var clone = new PsyclePanelClone(this.$el.clone(), this.index, this._list);
        if (addDOM) {
            this.$el.after(clone.$el);
        }
        if (addList) {
            this._list.addClone(clone);
        }
        return clone;
    };
    /**
     * 画像が読み込まれたかどうか監視する
     * インスタンスの `load` イベントにより通知する
     *
     * @since 0.5.1
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
}(PsyborgElement_1.default));
exports.default = PsyclePanel;
/**
 * スライドショーパネルのクローン要素
 *
 * @since 0.1.0
 * @param $el 対象要素
 * @param index パネル番号
 * @param パネル要素リスト
 */
var PsyclePanelClone = (function (_super) {
    __extends(PsyclePanelClone, _super);
    function PsyclePanelClone($el, index, list) {
        var _this = _super.call(this, $el, index, list) || this;
        $el.addClass('-psycle-clone-element');
        $el.attr('data-psycle-clone-element', 'true');
        $el.attr('data-psycle-clone-original-index', "" + index);
        return _this;
    }
    /**
     * 画像が読み込まれたかどうか監視しない
     *
     * @since 0.5.1
     */
    PsyclePanelClone.prototype._loadImageObserve = function () {
        // void
    };
    return PsyclePanelClone;
}(PsyclePanel));
exports.PsyclePanelClone = PsyclePanelClone;
