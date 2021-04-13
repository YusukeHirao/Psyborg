import { default as PsyclePanel, PsyclePanelClone } from './PsyclePanel';
import PsyborgElement from '../PsyborgElement';

/**
 * スライドショーパネル要素リスト
 *
 * @since 0.1.0
 * @param $el 対象要素
 */
export default class PsyclePanelList extends PsyborgElement {
	/**
	 * パネル要素の数
	 *
	 * @since 0.3.0
	 * @default 0
	 */
	public length = 0;

	/**
	 * パネル要素のリスト
	 *
	 * @since 0.3.0
	 * @default []
	 */
	private _panels: PsyclePanel[] = [];

	/**
	 * クローン要素のリスト
	 *
	 * @since 0.3.0
	 * @default []
	 */
	private _clones: PsyclePanelClone[] = [];

	constructor($el: JQuery) {
		super($el);

		let $panel: JQuery;
		for (let i = 0, l = $el.length; i < l; i++) {
			$panel = $($el[i]);
			this.add($panel);
		}

		const onLoadedPromises: JQuery.Promise<void>[] = [];
		this.each((i: number, panel: PsyclePanel) => {
			const dfd: JQuery.Deferred<void> = $.Deferred<void>();
			if (panel.hasImages) {
				if (panel.loaded) {
					dfd.resolve();
				} else {
					panel.on('load', (): void => {
						dfd.resolve();
					});
				}
				onLoadedPromises.push(dfd.promise());
			}
		});

		$.when.apply($, onLoadedPromises).done((): void => {
			this.trigger('load');
		});
	}

	/**
	 * 現在のパネルを設定する
	 *
	 * @since 0.3.0
	 * @param index 現在のパネル番号
	 * @param className 現在のパネルに設定するクラス名
	 * @return 自身
	 */
	public setCurrent(index: number, className: string): PsyclePanelList {
		this.resetCurrent(className);
		this.item(index).$el.addClass(className);
		this.item(index).$el.prop('inert', false);
		return this;
	}

	/**
	 * 現在のパネルの設定をリセットする
	 *
	 * @since 0.3.0
	 * @param className 設定を外すクラス名
	 * @return 自身
	 */
	public resetCurrent(className: string): PsyclePanelList {
		this.$el.removeClass(className);
		this.$el.prop('inert', true);
		this.getClones().removeClass(className);
		return this;
	}

	/**
	 * パネルを追加する
	 *
	 * @since 0.1.0
	 * @param $el 追加する要素
	 * @return 自身
	 */
	public add($el: JQuery): PsyclePanelList {
		const index: number = this._panels.length;
		const panel: PsyclePanel = new PsyclePanel($el, index, this);
		this._panels.push(panel);
		this.$el = this.$el.add($el);
		this.length += 1;
		return this;
	}

	/**
	 * クローンを追加する
	 *
	 * @since 0.3.0
	 * @param $el 追加する要素
	 * @return 自身
	 */
	public addClone(clone: PsyclePanelClone): PsyclePanelList {
		this._clones.push(clone);
		return this;
	}

	/**
	 * 指定数クローンを生成してコンテナの末尾に追加する
	 *
	 * @since 0.5.3
	 * @param count クローンする数
	 * @return 自身
	 */
	public cloneAfter(count: number) {
		return this.clone(count);
	}

	/**
	 * 指定数クローンを生成してコンテナの先頭に追加する
	 *
	 * @since 0.5.3
	 * @param count クローンする数
	 * @return 自身
	 */
	public cloneBefore(count: number) {
		return this.clone(count, true);
	}

	/**
	 * 指定数クローンを生成してDOMに追加する
	 *
	 * @since 0.5.3
	 * @param count クローンする数
	 * @param cloneBefore リスト前方にクローンするかどうか
	 * @return 自身
	 */
	public clone(count: number, cloneBefore: boolean = false): PsyclePanelList {
		const clones: PsyclePanelClone[] = [];
		let $clones: JQuery = $();
		for (let i = 0, l = count; i < l; i++) {
			this.each((index: number, panel: PsyclePanel): void => {
				const clone: PsyclePanelClone = panel.clone(false, false);
				clones.push(clone);
				const $clone: JQuery = clone.$el;
				$clones = $clones.add($clone);
			});
		}
		if (cloneBefore) {
			this.$el.eq(0).before($clones);
		} else {
			this.$el.eq(-1).after($clones);
		}
		this._clones = this._clones.concat(clones);
		return this;
	}

	/**
	 * パネルを削除する
	 *
	 * @since 0.1.0
	 * @param index 削除するパネルの番号
	 * @param removeFromDOMTree DOMツリーから削除するかどうか
	 * @return 自身
	 */
	public remove(index: number, removeFromDOMTree: boolean = true): PsyclePanelList {
		if (removeFromDOMTree) {
			this.$el.eq(index).remove();
		}
		this._panels.splice(index, 1);
		this._renumbering();
		this.length -= 1;
		return this;
	}

	/**
	 * 指定の番号のパネルを返す
	 *
	 * @since 0.1.0
	 * @param searchIndex パネルの番号
	 * @return パネル
	 */
	public item(searchIndex: number): PsyclePanel {
		const index: number = this._getRealIndex(searchIndex);
		return this._panels[index];
	}

	/**
	 * パネルごとに処理を行う
	 *
	 * @since 0.1.0
	 * @param callback コールバック関数
	 * @return 自身
	 */
	public each(callback: (index: number, panel: PsyclePanel) => void): PsyclePanelList {
		for (let i = 0, l = this._panels.length; i < l; i++) {
			const panel: PsyclePanel = this._panels[i];
			callback.call(panel, panel.index, panel);
		}
		return this;
	}

	/**
	 * 要素を表示する
	 *
	 * @since 0.1.0
	 * @return 自身
	 */
	public show(): PsyclePanelList {
		this.$el.show();
		return this;
	}

	/**
	 * 要素を隠す
	 *
	 * @since 0.1.0
	 * @return 自身
	 */
	public hide(): PsyclePanelList {
		this.$el.hide();
		return this;
	}

	/**
	 * クローンのみを削除する
	 *
	 * @since 0.1.0
	 * @deprecated
	 * @return 自身
	 */
	public removeClone(): PsyclePanelList {
		for (let i = 0, l = this._clones.length; i < l; i++) {
			this._clones[i].$el.remove();
		}
		this._clones = [];
		return this;
	}

	/**
	 * クローンのjQuery要素コレクションを返す
	 *
	 * @version 0.6.2
	 * @since 0.6.2
	 * @deprecated
	 * @return クローンのjQuery要素コレクション
	 */
	public getClones(): JQuery {
		let $clones: JQuery = $();
		for (let i = 0, l = this._clones.length; i < l; i++) {
			$clones = $clones.add(this._clones[i].$el);
		}
		return $clones;
	}

	/**
	 * 検索番号の正規化
	 *
	 * @since 0.1.0
	 * @param searchIndex 検索番号
	 * @return 結果の番号
	 */
	private _getRealIndex(searchIndex: number): number {
		const length: number = this._panels.length;
		searchIndex = searchIndex % length; // indexの循環の常套句
		const index: number = searchIndex < 0 ? length + searchIndex : searchIndex;
		return index;
	}

	/**
	 * パネル番号を整理して正しいものに調整する
	 *
	 * @since 0.1.0
	 * @return パネルの数
	 */
	private _renumbering(): number {
		const l: number = this._panels.length;
		for (let i = 0; i < l; i++) {
			this._panels[i].index = i;
		}
		return l;
	}
}
