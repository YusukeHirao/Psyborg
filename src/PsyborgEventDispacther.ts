/**!
 * Psyborgで取り扱うイベントディスパッチャ
 *
 * @class PsyborgEventDispacther
 * @since 0.1.0
 * @constructor
 */
class PsyborgEventDispacther {

	constructor () {
	}

	/**!
	 * イベントの種類
	 *
	 * @property _listeners
	 * @since 0.1.0
	 * @private
	 * @type Object
	 */
	private _listeners:IEventListenerList = {};

	/**!
	 * イベントを登録する
	 *
	 * @method on
	 * @since 0.1.0
	 * @public
	 * @param {string} types イベントの種類(スペース区切りで複数可)
	 * @param {Function} listener リスナー関数
	 */
	public on (types:string, listener:(e:PsyborgEvent) => any):void {
		var typeList:string[] = types.split(/\s+/);
		var i:number = 0;
		var l:number = typeList.length;
		for (; i < l; i++) {
			this._listeners[typeList[i]] = listener;
		}
	}

	/**!
	 * イベントを削除する
	 *
	 * @method off
	 * @since 0.1.0
	 * @public
	 * @param {string} types イベントの種類(スペース区切りで複数可)
	 * @param {Function} [listener] リスナー関数
	 */
	public off (types:string, listener?:Function):void {
		var typeList:string[] = types.split(/\s+/);
		var i:number = 0;
		var l:number = typeList.length;
		var type:string;
		for (; i < l; i++) {
			type = typeList[i];
			if (listener == null || this._listeners[type] === listener) {
				delete this._listeners[type];
			}
		}
	}

	/**!
	 * イベントを任意に発火させる
	 *
	 * @method trigger
	 * @since 0.1.0
	 * @public
	 * @param {string} type イベントの種類
	 * @param {any} [data={}] 発火と同時にリスナー関数に渡すハッシュデータ
	 * @param {any} [context=this] リスナー関数の`this`コンテクスト
	 * @return {boolean} デフォルトのイベントの抑制がされていないかどうか
	 */
	public trigger (type:string, data:any = {}, context:any = this):boolean {
		var listener:Function;
		if (listener = this._listeners[type]) {
			var e:PsyborgEvent = new PsyborgEvent(type);
			e.data = data;
			listener.call(context, e);
			return !e.defaultPrevented;
		}
		return true;
	}
}

interface IEventListenerList {
	[index:string]:(e:PsyborgEvent) => any;
}