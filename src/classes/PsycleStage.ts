import PsycleElement from './PsycleElement';

import PsyclePanelList from './PsyclePanelList';

/**
 * スライドショーステージ要素
 *
 * @since 0.1.0
 */
export default class PsycleStage extends PsycleElement {

	/**
	 * @since 0.5.1
	 */
	private _panels: PsyclePanelList;

	constructor($stage: JQuery, panels: PsyclePanelList) {
		super($stage);
		this._panels = panels;
		this._panels.on('load', () => {
			this.trigger('load');
		});
	}
}
