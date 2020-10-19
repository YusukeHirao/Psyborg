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
/**
 * スライドショーステージ要素
 *
 * @since 0.1.0
 */
var PsycleStage = /** @class */ (function (_super) {
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
}(PsyborgElement_1.default));
exports.default = PsycleStage;
