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
}