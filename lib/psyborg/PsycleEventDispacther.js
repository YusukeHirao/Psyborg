"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PsycleEvent_1 = require("./PsycleEvent");
/**
 * Psycleで取り扱うイベントディスパッチャ
 *
 * @since 0.1.0
 */
var PsycleEventDispacther = (function () {
    function PsycleEventDispacther() {
        /**
         * イベントの種類
         *
         * @since 0.1.0
         */
        this._listeners = {};
    }
    /**
     * イベントを登録する
     *
     * @since 0.8.1
     * @since 0.1.0
     * @param types イベントの種類(スペース区切りで複数可)
     * @param listener リスナー関数
     */
    PsycleEventDispacther.prototype.on = function (types, listener) {
        var typeList;
        if (typeof types === 'string') {
            typeList = types.split(/\s+/);
        }
        else {
            typeList = types;
        }
        for (var i = 0, l = typeList.length; i < l; i++) {
            if (!this._listeners[typeList[i]]) {
                this._listeners[typeList[i]] = [];
            }
            this._listeners[typeList[i]].push(listener);
        }
    };
    /**
     * イベントを削除する
     *
     * @since 0.1.0
     * @param types イベントの種類(スペース区切りで複数可)
     * @param listener リスナー関数
     */
    PsycleEventDispacther.prototype.off = function (types, listener) {
        var typeList = types.split(/\s+/);
        for (var i = 0, l = typeList.length; i < l; i++) {
            var type = typeList[i];
            if (listener == null || this._listeners[type] === listener) {
                delete this._listeners[type];
            }
        }
    };
    /**
     * イベントを任意に発火させる
     *
     * @since 0.1.0
     * @param type イベントの種類
     * @param data 発火と同時にリスナー関数に渡すハッシュデータ
     * @param context リスナー関数の`this`コンテクスト
     * @return デフォルトのイベントの抑制がされていないかどうか
     */
    PsycleEventDispacther.prototype.trigger = function (type, data, context) {
        if (data === void 0) { data = {}; }
        if (context === void 0) { context = this; }
        if (this._listeners[type]) {
            var l = this._listeners[type].length;
            for (var i = 0; i < l; i++) {
                var listener = this._listeners[type][i];
                var e = new PsycleEvent_1.default(type);
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
    return PsycleEventDispacther;
}());
exports.default = PsycleEventDispacther;
