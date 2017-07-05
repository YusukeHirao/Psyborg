"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Psycleで取り扱うイベントデータ
 *
 * @since 0.1.0
 * @param type イベントの種類
 */
var PsycleEvent = (function () {
    function PsycleEvent(type) {
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
    PsycleEvent.prototype.preventDefault = function () {
        this.defaultPrevented = true;
    };
    PsycleEvent.INIT = 'init';
    PsycleEvent.PANEL_CHANGE_START_BEFORE = 'panelChangeStartBefore';
    PsycleEvent.PANEL_CHANGE_START = 'panelChangeStart';
    PsycleEvent.PANEL_CHANGE_END = 'panelChangeEnd';
    PsycleEvent.PANEL_CHANGE_CANCEL = 'panelChangeCancel';
    PsycleEvent.WAIT_START = 'waitStart';
    PsycleEvent.WAIT_END = 'waitEnd';
    PsycleEvent.RESIZE_START = 'resizeStart';
    PsycleEvent.RESIZE_END = 'resizeEnd';
    return PsycleEvent;
}());
exports.default = PsycleEvent;
