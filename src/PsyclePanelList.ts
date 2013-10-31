/**!
 * スライドショーパネル要素リスト
 *
 * @class PsyclePanelList
 * @since 0.1.0
 * @extends PsyborgElement
 * @constructor
 * @param {JQuery} $el 対象要素
 */
class PsyclePanelList extends PsyborgElement {

	constructor ($el:JQuery) {
		super($el);
		var i:number = 0;
		var l:number = $el.length;
		var $panel:JQuery;
		for (; i < l; i++) {
			$panel = $($el[i]);
			this.add($panel);
		}
	}

	/**!
	 * パネル要素のリスト
	 *
	 * @property _panels
	 * @since 0.3.0
	 * @private
	 * @type PsyclePanel[]
	 * @default []
	 */
	private _panels:PsyclePanel[] = [];

	/**!
	 * クローン要素のリスト
	 *
	 * @property _clones
	 * @since 0.3.0
	 * @private
	 * @type PsyclePanelClone[]
	 * @default []
	 */
	private _clones:PsyclePanelClone[] = [];

	/**!
	 * パネル要素の数
	 *
	 * @property length
	 * @since 0.3.0
	 * @public
	 * @type PsyclePanel[]
	 * @default 0
	 */
	public length:number = 0;

	/**!
	 * 現在のパネルを設定する
	 *
	 * @method setCurrent
	 * @since 0.3.0
	 * @public
	 * @param {number} index 現在のパネル番号
	 * @param {string} className 現在のパネルに設定するクラス名
	 * @return {PsyclePanelList} 自身
	 */
	public setCurrent (index:number, className:string):PsyclePanelList {
		this.resetCurrent(className);
		this.item(index).$el.addClass(className);
		return this;
	}

	/**!
	 * 現在のパネルの設定をリセットする
	 *
	 * @method resetCurrent
	 * @since 0.3.0
	 * @public
	 * @param {string} className 設定を外すクラス名
	 * @return {PsyclePanelList} 自身
	 */
	public resetCurrent (className:string):PsyclePanelList {
		this.each((panelIndex:number, panel:PsyclePanel)=> {
			panel.$el.removeClass(className);
		});
		return this;
	}

	/**!
	 * パネルを追加する
	 *
	 * @method add
	 * @since 0.1.0
	 * @public
	 * @param {jQuery} $el 追加する要素
	 * @return {PsyclePanelList} 自身
	 */
	public add ($el:JQuery):PsyclePanelList {
		var index:number = this._panels.length;
		var panel:PsyclePanel = new PsyclePanel($el, index, this);
		this._panels.push(panel);
		this.length += 1;
		return this;
	}

	/**!
	 * クローンを追加する
	 *
	 * @method addClone
	 * @since 0.3.0
	 * @public
	 * @param {jQuery} $el 追加する要素
	 * @return {PsyclePanelList} 自身
	 */
	public addClone (clone:PsyclePanelClone):PsyclePanelList {
		this._clones.push(clone);
		return this;
	}

	/**!
	 * パネルを削除する
	 *
	 * @method remove
	 * @since 0.1.0
	 * @public
	 * @param {number} index 削除するパネルの番号
	 * @param {boolean} [removeFromDOMTree=true] DOMツリーから削除するかどうか
	 * @return {PsyclePanelList} 自身
	 */
	public remove (index:number, removeFromDOMTree:boolean = true):PsyclePanelList {
		if (removeFromDOMTree) {
			this.$el.eq(index).remove();
		}
		this._panels.splice(index, 1);
		this._renumbering();
		this.length -= 1;
		return this;
	}

	/**!
	 * 指定の番号のパネルを返す
	 *
	 * @method item
	 * @since 0.1.0
	 * @public
	 * @param {number} searchIndex パネルの番号
	 * @return {PsyclePanelList} パネル
	 */
	public item (searchIndex:number):PsyclePanel {
		var index:number = this._getRealIndex(searchIndex);
		return this._panels[index];
	}

	/**!
	 * パネルごとに処理を行う
	 *
	 * @method item
	 * @since 0.1.0
	 * @public
	 * @param {Function} callback コールバック関数
	 * @return {PsyclePanelList} 自身
	 */
	public each (callback:(index:number, panel:PsyclePanel) => void):PsyclePanelList {
		var i:number = 0;
		var l:number = this._panels.length;
		var panel:PsyclePanel;
		for (; i < l; i++) {
			panel = this._panels[i];
			callback.call(panel, panel.index, panel);
		}
		return this;
	}

	/**!
	 * 要素を表示する
	 *
	 * @method show
	 * @since 0.1.0
	 * @public
	 * @return {PsyclePanel} 自身
	 */
	public show ():PsyclePanelList {
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
	public hide ():PsyclePanelList {
		this.$el.hide();
		return this;
	}

	/**!
	 * クローンのみを削除する
	 *
	 * @method item
	 * @since 0.1.0
	 * @public
	 * @deprecated
	 * @return {PsyclePanelList} 自身
	 */
	public removeClone ():PsyclePanelList {
		var i:number = 0;
		var l:number = this._clones.length;
		for (; i < l; i++) {
			this._clones[i].$el.remove();
		}
		this._clones = [];
		return this;
	}

	/**!
	 * 検索番号の正規化
	 *
	 * @method _getRealIndex
	 * @since 0.1.0
	 * @public
	 * @param {number} searchIndex 検索番号
	 * @return {number} 結果の番号
	 */
	private _getRealIndex (searchIndex:number):number {
		var length:number = this._panels.length;
		searchIndex = searchIndex % length; // indexの循環の常套句
		var index:number = searchIndex < 0 ? length + searchIndex : searchIndex;
		return index;
	}

	/**!
	 * パネル番号を整理して正しいものに調整する
	 *
	 * @method _getRealIndex
	 * @since 0.1.0
	 * @public
	 * @return {number} パネルの数
	 */
	private _renumbering ():number {
		var i:number = 0;
		var l:number = this._panels.length;
		for (; i < l; i++) {
			this._panels[i].index = i;
		}
		return l;
	}

}