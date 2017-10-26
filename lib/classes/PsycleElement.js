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
var PsycleEventDispacther_1 = require("./PsycleEventDispacther");
/**
 * Psycleで取り扱うDOM要素
 *
 * @since 0.9.0
 * @param $el インスタンス化する要素
 */
var PsycleElement = /** @class */ (function (_super) {
    __extends(PsycleElement, _super);
    function PsycleElement($el) {
        var _this = _super.call(this) || this;
        if (!$el.length) {
            throw new ReferenceError('This jQuery object is empty.');
        }
        _this.$el = $el;
        _this.el = $el[0];
        return _this;
    }
    /**
     * イベントを任意に発火させる 要素にバインドされているイベントも同時に発火する
     *
     * @since 0.3.0
     * @override
     * @param type イベントの種類
     * @param data 発火と同時にリスナー関数に渡すハッシュデータ
     * @param context リスナー関数の`this`コンテクスト
     * @return デフォルトのイベントの抑制がされていないかどうか
     */
    PsycleElement.prototype.trigger = function (type, data, context) {
        if (data === void 0) { data = {}; }
        if (context === void 0) { context = this; }
        var defaultPrevented = _super.prototype.trigger.call(this, type, data, context);
        if (defaultPrevented) {
            this.$el.trigger(type, data);
        }
        return defaultPrevented;
    };
    /**
     * 要素の幅を取得
     *
     * @since 0.4.3
     * @return 要素の幅
     */
    PsycleElement.prototype.getWidth = function () {
        return this.$el.width() || 0;
    };
    /**
     * 要素の高さを取得
     *
     * @since 0.4.3
     * @return 要素の高さ
     */
    PsycleElement.prototype.getHeight = function () {
        return this.$el.height() || 0;
    };
    /**
     * 要素から最大の高さを取得
     *
     * @since 0.9.1
     * @return 要素の高さ
     */
    PsycleElement.prototype.getMaxHeight = function () {
        var height = 0;
        this.$el.each(function (i, el) {
            height = Math.max($(el).height() || 0, height);
        });
        return height;
    };
    /**
     * 要素から最小の高さを取得
     *
     * @since 0.9.1
     * @return 要素の高さ
     */
    PsycleElement.prototype.getMinHeight = function () {
        var height = Infinity;
        this.$el.each(function (i, el) {
            height = Math.min($(el).height() || 0, height);
        });
        if (height === Infinity) {
            height = NaN;
        }
        return height;
    };
    /**
     * 要素の幅を設定
     *
     * @since 0.4.3
     * @param value 指定の値
     * @return 自身
     */
    PsycleElement.prototype.setWidth = function (value) {
        this.$el.width(value);
        return this;
    };
    /**
     * 要素の高さを設定
     *
     * @since 0.4.3
     * @param value 指定の値
     * @return 自身
     */
    PsycleElement.prototype.setHeight = function (value) {
        this.$el.height(value);
        return this;
    };
    return PsycleElement;
}(PsycleEventDispacther_1.default));
exports.default = PsycleElement;
