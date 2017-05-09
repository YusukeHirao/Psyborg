/// <reference types="jquery" />
import PsyborgEventDispacther from './PsyborgEventDispacther';
/**
 * Psyborgで取り扱うDOM要素
 *
 * @since 0.9.0
 * @param $el インスタンス化する要素
 */
export default class PsyborgElement extends PsyborgEventDispacther {
    /**
     * 内包するjQuery要素
     *
     * @since 0.1.0
     */
    $el: JQuery;
    /**
     * 内包するDOM要素
     *
     * @since 0.9.0
     */
    el: Element;
    constructor($el: JQuery);
    /**
     * イベントを任意に発火させる 要素にバインドされているイベントも同時に発火する
     *
     * @since 0.3.0
     * @override
     * @param type イベントの種類
     * @param data 発火と同時にリスナー関数に渡すハッシュデータ
     * @param context リスナー関数の`this`コンテクスト
     * @return デフォルトのイベントの抑制がされていないかどうか
     */
    trigger(type: string, data?: {}, context?: this): boolean;
    /**
     * 要素の幅を取得
     *
     * @since 0.4.3
     * @return 要素の幅
     */
    getWidth(): number;
    /**
     * 要素の高さを取得
     *
     * @since 0.4.3
     * @return 要素の高さ
     */
    getHeight(): number;
    /**
     * 要素から最大の高さを取得
     *
     * @since 0.9.1
     * @return 要素の高さ
     */
    getMaxHeight(): number;
    /**
     * 要素から最小の高さを取得
     *
     * @since 0.9.1
     * @return 要素の高さ
     */
    getMinHeight(): number;
    /**
     * 要素の幅を設定
     *
     * @since 0.4.3
     * @param value 指定の値
     * @return 自身
     */
    setWidth(value: number): PsyborgElement;
    /**
     * 要素の高さを設定
     *
     * @since 0.4.3
     * @param value 指定の値
     * @return 自身
     */
    setHeight(value: number): PsyborgElement;
}
