"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * CSSを変換するラッパー関数郡
 *
 * @since 0.1.0
 */
var StyleSheet = /** @class */ (function () {
    function StyleSheet() {
    }
    /**
     * ポジションを絶対位置にする
     *
     * @since 0.1.0
     * @param $el 対象要素
     * @param top 垂直位置(単位:ピクセル)
     * @param left 水平位置(単位:ピクセル)
     * @return 対象要素
     */
    StyleSheet.posAbs = function ($el, top, left) {
        if (top === void 0) { top = 0; }
        if (left === void 0) { left = 0; }
        return $el.css({
            position: 'absolute',
            top: top,
            left: left,
        });
    };
    /**
     * ポジションが 未指定もしくは`static`の場合は`relative`にする
     *
     * @since 0.1.0
     * @param $el 対象要素
     * @return 対象要素
     */
    StyleSheet.posBase = function ($el) {
        var posi = $el.css('position');
        if (posi == null || posi === 'static' || posi === '') {
            $el.css({
                position: 'relative',
            });
        }
        return $el;
    };
    /**
     * `z-index`を指定する
     *
     * @since 0.3.1
     * @param $el 対象要素
     * @param zIndex Zレイヤー位置
     * @return 対象要素
     */
    StyleSheet.z = function ($el, zIndex) {
        if (zIndex === void 0) { zIndex = 0; }
        $el.css({
            zIndex: zIndex,
        });
        return $el;
    };
    /**
     * `float`を指定する
     *
     * @since 0.5.3
     * @param $el 対象要素
     * @param floating フロートさせるかどうか
     * @return 対象要素
     */
    StyleSheet.floating = function ($el, floating) {
        if (floating === void 0) { floating = true; }
        $el.css({
            float: (floating ? 'left' : 'none'),
        });
        return $el;
    };
    /**
     * `overflow:hidden`かどうか
     *
     * @since 0.1.0
     * @param $el 対象要素
     * @return `overflow:hidden`だった場合は`true`、それ以外は`false`
     */
    StyleSheet.isOverflowHidden = function ($el) {
        return $el.css('overflow').toLowerCase() === 'hidden';
    };
    /**
     * CSSを保存する
     *
     * @since 0.3.4
     * @param $el 対象要素
     */
    StyleSheet.saveCSS = function ($el) {
        $el.each(function (i, el) {
            var $this = $(el);
            $this.data('originStyle', $this.attr('style'));
        });
    };
    /**
     * 保存したCSSを元に戻す
     *
     * @since 0.3.4
     * @param $el 対象要素
     */
    StyleSheet.restoreCSS = function ($el) {
        $el.each(function (i, el) {
            var $this = $(el);
            var originStyle = "" + $this.data('originStyle');
            $this.attr('style', originStyle);
        });
    };
    /**
     * インラインCSSを削除する
     *
     * @since 0.6.1
     * @param $el 対象要素
     */
    StyleSheet.cleanCSS = function ($el) {
        $el.each(function (i, el) {
            var $this = $(el);
            $this.attr('style', '');
        });
    };
    return StyleSheet;
}());
exports.default = StyleSheet;
