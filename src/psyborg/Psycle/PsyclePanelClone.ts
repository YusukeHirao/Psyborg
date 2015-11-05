module psyborg {

	/**
	 * スライドショーパネルのクローン要素
	 *
	 * @since 0.1.0
	 * @param $el 対象要素
	 * @param index パネル番号
	 * @param パネル要素リスト
	 */
	export class PsyclePanelClone extends PsyclePanel {
		constructor ($el: JQuery, index: number, list: PsyclePanelList) {
			super($el, index, list);
			$el.addClass('-psycle-clone-element');
			$el.attr('data-psycle-clone-element', 'true');
			$el.attr('data-psycle-clone-original-index', <string> '' + index);
		}

		/**
		 * 画像が読み込まれたかどうか監視しない
		 *
		 * @since 0.5.1
		 */
		protected _loadImageObserve (): void {
		}

	}

}