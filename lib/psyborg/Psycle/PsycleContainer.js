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
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PsycleContainer;
}(PsyborgElement_1.default));
exports.default = PsycleContainer;
