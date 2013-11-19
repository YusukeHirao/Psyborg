/**!
 * Psyborgで取り扱うDOM要素
 *
 * @class PsyborgElement
 * @since 0.1.0
 * @extends PsyborgEventDispacther
 * @constructor
 * @param {jQuery} $el インスタンス化する要素
 */
class PsyborgElement extends PsyborgEventDispacther {

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
}