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
	private _listeners = {};

	/**
	 * イベントを登録する
	 *
	 * @since 0.8.1
	 * @since 0.1.0
	 * @param types イベントの種類(スペース区切りで複数可)
	 * @param listener リスナー関数
	 */
	public on (types: string | string[], listener: (e: PsycleEvent) => void): void {
		let typeList: string[];
		if (typeof types === 'string') {
			typeList = types.split(/\s+/);
		} else {
			typeList = types;
		}
		for (let i = 0, l = typeList.length; i < l; i++) {
			if (!this._listeners[typeList[i]]) {
				this._listeners[typeList[i]] = [];
			}
			this._listeners[typeList[i]].push(listener);
		}
	}

	/**
	 * イベントを削除する
	 *
	 * @since 0.1.0
	 * @param types イベントの種類(スペース区切りで複数可)
	 * @param listener リスナー関数
	 */
	public off (types: string, listener?: Function): void {
		const typeList: string[] = types.split(/\s+/);
		for (let i = 0, l = typeList.length; i < l; i++) {
			const type: string = typeList[i];
			if (listener == null || this._listeners[type] === listener) {
				delete this._listeners[type];
			}
		}
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
	public trigger (type: string, data = {}, context = this): boolean {
		if (this._listeners[type]) {
			const l: number = this._listeners[type].length;
			for (let i = 0; i < l; i++) {
				const listener: Function = this._listeners[type][i];
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
