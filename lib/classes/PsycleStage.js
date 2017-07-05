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
var PsycleElement_1 = require("./PsycleElement");
/**
 * スライドショーステージ要素
 *
 * @since 0.1.0
 */
var PsycleStage = (function (_super) {
    __extends(PsycleStage, _super);
    function PsycleStage($stage, panels) {
        var _this = _super.call(this, $stage) || this;
        _this._panels = panels;
        _this._panels.on('load', function () {
            _this.trigger('load');
        });
        return _this;
    }
    return PsycleStage;
}(PsycleElement_1.default));
exports.default = PsycleStage;