module psyborg {

	/**!
	 * スライドショーパネル要素
	 *
	 * @class PsyclePanel
	 * @since 0.1.0
	 * @extends PsyborgElement
	 * @constructor
	 * @param {JQuery} $el 対象要素
	 * @param {number} index パネル番号
	 * @param {PsyclePanelList} list パネル要素リスト
	 */
	export class PsyclePanel extends PsyborgElement {

		constructor ($el:JQuery, index:number, list:PsyclePanelList) {
			super($el);
			this.index = index;
			this._list = list;

			this._loadImageObserve();
		}

		/**!
		 * 自身のパネル番号
		 *
		 * @property index
		 * @since 0.1.0
		 * @public
		 * @type number
		 */
		public index:number;

		/**!
		 * スライドショーパネル要素リスト
		 *
		 * @property _list
		 * @since 0.1.0
		 * @public
		 * @type PsyclePanelList
		 */
		private _list:PsyclePanelList;

		/**!
		 * パネル内に画像を含むかどうか
		 *
		 * @property hasImages
		 * @since 0.5.1
		 * @public
		 * @type boolean
		 */
		public hasImages:boolean = false;

		/**!
		 * パネル内に画像の読み込みが完了したかどうか
		 *
		 * @property loaded
		 * @since 0.5.1
		 * @public
		 * @type boolean
		 */
		public loaded:boolean = false;

		/**!
		 * 要素を表示する
		 *
		 * @method show
		 * @since 0.1.0
		 * @public
		 * @return {PsyclePanel} 自身
		 */
		public show ():PsyclePanel {
			this.$el.show();
			return this;
		}

		/**!
		 * 要素を隠す
		 *
		 * @method hide
		 * @since 0.1.0
		 * @public
		 * @return {PsyclePanel} 自身
		 */
		public hide ():PsyclePanel {
			this.$el.hide();
			return this;
		}

		/**!
		 * クローン要素(クラスは異なる)を作る
		 *
		 * @method clone
		 * @since 0.1.0
		 * @public
		 * @return {PsyclePanelClone} 自身のクローン要素
		 */
		public clone ():PsyclePanelClone {
			var clone:PsyclePanelClone = new PsyclePanelClone(this.$el.clone(), this.index, this._list);
			this.$el.after(clone.$el);
			this._list.addClone(clone);
			return clone;
		}

		/**!
		 * 画像が読み込まれたかどうか監視する
		 *
		 * @method clone
		 * @since 0.5.1
		 * @protected
		 */
		public _loadImageObserve ():void {

			var $images = this.$el.find('img');
			var onFinishedPromises = [];

			if (!$images.length) {
				return;
			}

			this.hasImages = true;
			$images.each((i:number, img:HTMLElement) => {
				var dfd = $.Deferred();
				var onload = () => {
					dfd.resolve();
				};
				var onabort = () => {
					dfd.resolve();
				};
				var onerror = () => {
					dfd.resolve();
				};
				img.onload = onload;
				img.onerror = onerror;
				img.onabort = onabort;
				onFinishedPromises.push(dfd.promise());
			});

			$.when.apply($, onFinishedPromises).done(() => {
				this.loaded = true;
				this.trigger('load');
			});

		}

	}

}