module psyborg {

	/**!
	 * Psyborgで取り扱うイベントディスパッチャ
	 *
	 * @class PsyborgEventDispacther
	 * @since 0.1.0
	 * @constructor
	 */
	export class PsyborgEventDispacther {

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
		private _listeners:any = {};

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
				if (!this._listeners[typeList[i]]) {
					this._listeners[typeList[i]] = [];
				}
				this._listeners[typeList[i]].push(listener);
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
			var i:number = 0;
			var l:number;
			if (this._listeners[type]) {
				l = this._listeners[type].length;
				for (; i < l; i++) {
					listener = this._listeners[type][i];
					var e:PsyborgEvent = new PsyborgEvent(type);
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

}