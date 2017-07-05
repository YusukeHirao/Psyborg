import PsycleEvent from './PsycleEvent';
/**
 * Psycleで取り扱うイベントディスパッチャ
 *
 * @since 0.1.0
 */
export default class PsycleEventDispacther {
    /**
     * イベントの種類
     *
     * @since 0.1.0
     */
    private _listeners;
    /**
     * イベントを登録する
     *
     * @since 0.8.1
     * @since 0.1.0
     * @param types イベントの種類(スペース区切りで複数可)
     * @param listener リスナー関数
     */
    on(types: string | string[], listener: (e: PsycleEvent) => void): void;
    /**
     * イベントを削除する
     *
     * @since 0.1.0
     * @param types イベントの種類(スペース区切りで複数可)
     * @param listener リスナー関数
     */
    off(types: string, listener?: Function): void;
    /**
     * イベントを任意に発火させる
     *
     * @since 0.1.0
     * @param type イベントの種類
     * @param data 発火と同時にリスナー関数に渡すハッシュデータ
     * @param context リスナー関数の`this`コンテクスト
     * @return デフォルトのイベントの抑制がされていないかどうか
     */
    trigger(type: string, data?: {}, context?: this): boolean;
}