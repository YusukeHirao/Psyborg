/**
 * Psycleで取り扱うイベントデータ
 *
 * @since 0.1.0
 * @param type イベントの種類
 */
export default class PsycleEvent<D extends Object = {}> {
    static INIT: string;
    static PANEL_CHANGE_START_BEFORE: string;
    static PANEL_CHANGE_START: string;
    static PANEL_CHANGE_END: string;
    static PANEL_CHANGE_CANCEL: string;
    static WAIT_START: string;
    static WAIT_END: string;
    static RESIZE_START: string;
    static RESIZE_END: string;
    /**
     * イベントの種類
     *
     * @since 0.1.0
     */
    type: string;
    /**
     * イベントに渡されるハッシュデータ
     *
     * @since 0.1.0
     */
    data: D | null;
    /**
     * イベントが発生した時のタイムスタンプ
     *
     * @since 0.1.0
     */
    timeStamp: number;
    /**
     * デフォルトのイベントの発火を抑制するフラグ
     *
     * @since 0.1.0
     * @default false
     */
    defaultPrevented: boolean;
    constructor(type: string);
    /**
     * デフォルトのイベントの発火を抑制する
     *
     * @method preventDefault
     * @since 0.1.0
     */
    preventDefault(): void;
}
