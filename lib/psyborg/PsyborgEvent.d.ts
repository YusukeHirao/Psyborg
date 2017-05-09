/**
 * Psyborgで取り扱うイベントデータ
 *
 * @since 0.1.0
 * @param type イベントの種類
 */
export default class PsyborgEvent {
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
    data: any;
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
