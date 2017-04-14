"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Psyborgで取り扱うイベントデータ
 *
 * @since 0.1.0
 * @param type イベントの種類
 */
var PsyborgEvent = (function () {
    function PsyborgEvent(type) {
        /**
         * デフォルトのイベントの発火を抑制するフラグ
         *
         * @since 0.1.0
         * @default false
         */
        this.defaultPrevented = false;
        this.type = type;
        this.timeStamp = new Date().valueOf();
    }
    /**
     * デフォルトのイベントの発火を抑制する
     *
     * @method preventDefault
     * @since 0.1.0
     */
    PsyborgEvent.prototype.preventDefault = function () {
        this.defaultPrevented = true;
    };
    return PsyborgEvent;
}());
exports.default = PsyborgEvent;
