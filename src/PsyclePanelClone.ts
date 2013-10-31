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
class PsyclePanelClone extends PsyclePanel {
	constructor ($el:JQuery, index:number, list:PsyclePanelList) {
		super($el, index, list);
		this.$el.addClass('__psycle_panel_clone__');
	}
}