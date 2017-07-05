/// <reference types="jquery" />
/**
 * CSSを変換するラッパー関数郡
 *
 * @since 0.1.0
 */
export default class StyleSheet {
    /**
     * ポジションを絶対位置にする
     *
     * @since 0.1.0
     * @param $el 対象要素
     * @param top 垂直位置(単位:ピクセル)
     * @param left 水平位置(単位:ピクセル)
     * @return 対象要素
     */
    static posAbs($el: JQuery, top?: number, left?: number): JQuery;
    /**
     * ポジションが 未指定もしくは`static`の場合は`relative`にする
     *
     * @since 0.1.0
     * @param $el 対象要素
     * @return 対象要素
     */
    static posBase($el: JQuery): JQuery;
    /**
     * `z-index`を指定する
     *
     * @since 0.3.1
     * @param $el 対象要素
     * @param zIndex Zレイヤー位置
     * @return 対象要素
     */
    static z($el: JQuery, zIndex?: number): JQuery;
    /**
     * `float`を指定する
     *
     * @since 0.5.3
     * @param $el 対象要素
     * @param floating フロートさせるかどうか
     * @return 対象要素
     */
    static floating($el: JQuery, floating?: boolean): JQuery;
    /**
     * `overflow:hidden`かどうか
     *
     * @since 0.1.0
     * @param $el 対象要素
     * @return `overflow:hidden`だった場合は`true`、それ以外は`false`
     */
    static isOverflowHidden($el: JQuery): boolean;
    /**
     * CSSを保存する
     *
     * @since 0.3.4
     * @param $el 対象要素
     */
    static saveCSS($el: JQuery): void;
    /**
     * 保存したCSSを元に戻す
     *
     * @since 0.3.4
     * @param $el 対象要素
     */
    static restoreCSS($el: JQuery): void;
    /**
     * インラインCSSを削除する
     *
     * @since 0.6.1
     * @param $el 対象要素
     */
    static cleanCSS($el: JQuery): void;
}
