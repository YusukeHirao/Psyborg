module psyborg {

	/**!
	 * スライドショーパネルのクローン要素
	 *
	 * @class PsyclePanel
	 * @since 0.1.0
	 * @extends PsyclePanel
	 * @constructor
	 * @param {JQuery} $el 対象要素
	 * @param {number} index パネル番号
	 * @param {PsyclePanelList} パネル要素リスト
	 */
	export class PsyclePanelClone extends PsyclePanel {
		constructor ($el: JQuery, index: number, list: PsyclePanelList) {
			super($el, index, list);
			$el.addClass('-psycle-clone-element');
			$el.attr('data-psycle-clone-element', 'true');
			$el.attr('data-psycle-clone-original-index', <string> '' + index);
		}

		/**!
		 * 画像が読み込まれたかどうか監視しない
		 *
		 * @method clone
		 * @since 0.5.1
		 * @override
		 * @final
		 * @protected
		 */
		public _loadImageObserve (): void {
		}

	}

}