"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* @version 0.8.2 */
/* @since 0.1.0 */
var PsycleEvent = (function () {
    function PsycleEvent() {
    }
    return PsycleEvent;
}());
PsycleEvent.INIT = 'init';
PsycleEvent.PANEL_CHANGE_START_BEFORE = 'panelChangeStartBefore';
PsycleEvent.PANEL_CHANGE_START = 'panelChangeStart';
PsycleEvent.PANEL_CHANGE_END = 'panelChangeEnd';
PsycleEvent.PANEL_CHANGE_CANCEL = 'panelChangeCancel';
PsycleEvent.WAIT_START = 'waitStart';
PsycleEvent.WAIT_END = 'waitEnd';
PsycleEvent.RESIZE_START = 'resizeStart';
PsycleEvent.RESIZE_END = 'resizeEnd';
exports.default = PsycleEvent;