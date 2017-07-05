/**
 * Psycleで取り扱うイベントデータ
 *
 * @since 0.1.0
 * @param type イベントの種類
 */
export default class PsycleEvent {

	public static INIT = 'init';
	public static PANEL_CHANGE_START_BEFORE = 'panelChangeStartBefore';
	public static PANEL_CHANGE_START = 'panelChangeStart';
	public static PANEL_CHANGE_END = 'panelChangeEnd';
	public static PANEL_CHANGE_CANCEL = 'panelChangeCancel';
	public static WAIT_START = 'waitStart';
	public static WAIT_END = 'waitEnd';
	public static RESIZE_START = 'resizeStart';
	public static RESIZE_END = 'resizeEnd';

	/**
	 * イベントの種類
	 *
	 * @since 0.1.0
	 */
	public type: string;

	/**
	 * イベントに渡されるハッシュデータ
	 *
	 * @since 0.1.0
	 */
	public data;

	/**
	 * イベントが発生した時のタイムスタンプ
	 *
	 * @since 0.1.0
	 */
	public timeStamp: number;

	/**
	 * デフォルトのイベントの発火を抑制するフラグ
	 *
	 * @since 0.1.0
	 * @default false
	 */
	public defaultPrevented = false;

	constructor (type: string) {
		this.type = type;
		this.timeStamp = new Date().valueOf();
	}

	/**
	 * デフォルトのイベントの発火を抑制する
	 *
	 * @method preventDefault
	 * @since 0.1.0
	 */
	public preventDefault (): void {
		this.defaultPrevented = true;
	}
}
