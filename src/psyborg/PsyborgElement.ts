module psyborg {

	/**!
	 * Psyborgで取り扱うDOM要素
	 *
	 * @class PsyborgElement
	 * @since 0.1.0
	 * @extends PsyborgEventDispacther
	 * @constructor
	 * @param {jQuery} $el インスタンス化する要素
	 */
	export class PsyborgElement extends PsyborgEventDispacther {

		constructor ($el:JQuery) {
			super();
			if (!$el.length) {
				throw new ReferenceError('This jQuery object is empty. Selector "' + $el.selector + '" doesn\'t exist.');
			}
			this.$el = $el;
		}

		/**!
		 * 内包するjQuery要素
		 *
		 * @property $el
		 * @since 0.1.0
		 * @public
		 * @type jQuery
		 */
		public $el:JQuery;

		/**!
		 * イベントを任意に発火させる 要素にバインドされているイベントも同時に発火する
		 *
		 * @method trigger
		 * @since 0.3.0
		 * @public
		 * @override
		 * @param {string} type イベントの種類
		 * @param {any} [data={}] 発火と同時にリスナー関数に渡すハッシュデータ
		 * @param {any} [context=this] リスナー関数の`this`コンテクスト
		 * @return {boolean} デフォルトのイベントの抑制がされていないかどうか
		 */
		public trigger (type:string, data:any = {}, context:any = this):boolean {
			var defaultPrevented:boolean = super.trigger(type, data, context);
			if (defaultPrevented) {
				this.$el.trigger(type, data, context);
			}
			return defaultPrevented;
		}

		/**!
		 * 要素の幅を取得
		 *
		 * @method getWidth
		 * @since 0.4.3
		 * @public
		 * @return {number} 要素の幅
		 */
		public getWidth () {
			return this.$el.width();
		}

		/**!
		 * 要素の高さを取得
		 *
		 * @method getHeight
		 * @since 0.4.3
		 * @public
		 * @return {number} 要素の高さ
		 */
		public getHeight () {
			return this.$el.height();
		}

		/**!
		 * 要素の幅を設定
		 *
		 * @method setWidth
		 * @since 0.4.3
		 * @public
		 * @chainable
		 * @param {number} value 指定の値
		 * @return {PsyborgElement} 自身
		 */
		public setWidth (value:number) {
			this.$el.width(value);
			return this;
		}

		/**!
		 * 要素の高さを設定
		 *
		 * @method setHeight
		 * @since 0.4.3
		 * @public
		 * @chainable
		 * @param {number} value 指定の値
		 * @return {PsyborgElement} 自身
		 */
		public setHeight (value:number) {
			this.$el.height(value);
			return this;
		}

	}

}