"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ウィンドウ・ブラウザ/ユーザエージェントに関する操作をあつかう
 *
 * @since 0.4.3
 */
var PsyborgWindow = (function () {
    function PsyborgWindow() {
    }
    /**
     * ポジションを絶対位置にする
     *
     * @since 0.4.3
     * @param href リンク先URLおよびパス
     * @param target ターゲットフレーム
     */
    PsyborgWindow.linkTo = function (href, target) {
        if (target === void 0) { target = ''; }
        switch (target) {
            case '_blank': {
                window.open(href);
                break;
            }
            default: {
                location.href = href;
            }
        }
    };
    return PsyborgWindow;
}());
exports.default = PsyborgWindow;
