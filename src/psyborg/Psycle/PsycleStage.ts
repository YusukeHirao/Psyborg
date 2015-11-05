module psyborg {

	/**
	 * スライドショーステージ要素
	 *
	 * @since 0.1.0
	 */
	export class PsycleStage extends PsyborgElement {
		constructor($stage:JQuery, panels:PsyclePanelList) {
			super($stage);
			this._panels = panels;
			this._panels.on('load', () => {
				this.trigger('load');
			});
		}

		/**
		 * @since 0.5.1
		 */
		private _panels:PsyclePanelList;
	}
}