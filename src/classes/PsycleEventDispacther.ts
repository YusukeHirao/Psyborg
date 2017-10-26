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
	private _listeners: {[listenerName: string]: ((e: PsycleEvent) => void)[]} = {};

	/**
	 * イベントを登録する
	 *
	 * @since 0.8.1
	 * @since 0.1.0
	 * @param types イベントの種類(スペース区切りで複数可)
	 * @param listener リスナー関数
	 */
	public on (types: string | string[], listener: (e: PsycleEvent) => void) {
		let typeList: string[];
		if (typeof types === 'string') {
			typeList = types.split(/\s+/);
		} else {
			typeList = types;
		}
		for (const type of typeList) {
			if (!this._listeners[type]) {
				this._listeners[type] = [];
			}
			this._listeners[type].push(listener);
		}
	}

	/**
	 * イベントをすべて削除する
	 *
	 * @since 1.0.0
	 */
	public cleaer () {
		this._listeners = {};
	}

	/**
	 * イベントを任意に発火させる
	 *
	 * @since 0.1.0
	 * @param type イベントの種類
	 * @param data 発火と同時にリスナー関数に渡すハッシュデータ
	 * @param context リスナー関数の`this`コンテクスト
	 * @return デフォルトのイベントの抑制がされていないかどうか
	 */
	public trigger (type: string, data = {}, context = this) {
		if (this._listeners[type]) {
			const l: number = this._listeners[type].length;
			for (let i = 0; i < l; i++) {
				const listener = this._listeners[type][i];
				const e = new PsycleEvent(type);
				e.data = data;
				listener.call(context, e);
				// preventDefaultされていたら以後のイベントを発火させない
				if (e.defaultPrevented) {
					return false;
				}
			}
		}
		return true;
	}
}
