import PsyborgElement from '../PsyborgElement';

import PsyclePanelList from './PsyclePanelList';

/**
 * スライドショーパネル要素
 *
 * @since 0.1.0
 * @param $el 対象要素
 * @param index パネル番号
 * @param list パネル要素リスト
 */
export default class PsyclePanel extends PsyborgElement {
	/**
	 * 自身のパネル番号
	 *
	 * @since 0.1.0
	 */
	public index: number;

	/**
	 * パネル内に画像を含むかどうか
	 *
	 * @since 0.5.1
	 */
	public hasImages = false;

	/**
	 * パネル内に画像の読み込みが完了したかどうか
	 *
	 * @since 0.5.1
	 */
	public loaded = false;

	/**
	 * スライドショーパネル要素リスト
	 *
	 * @since 0.1.0
	 */
	private _list: PsyclePanelList;

	constructor($el: JQuery, index: number, list: PsyclePanelList, onFocus: ((index: number) => void) | null) {
		super($el);
		this.index = index;
		this._list = list;
		this._loadImageObserve();

		$el.attr('tabindex', 0);
		$el.on('focus', () => onFocus && onFocus(index));
	}

	/**
	 * 要素を表示する
	 *
	 * @since 0.1.0
	 * @return 自身
	 */
	public show(): PsyclePanel {
		this.$el.show();
		return this;
	}

	/**
	 * 要素を隠す
	 *
	 * @since 0.1.0
	 * @return 自身
	 */
	public hide(): PsyclePanel {
		this.$el.hide();
		return this;
	}

	/**
	 * クローン要素(クラスは異なる)を作る
	 * デフォルトではDOMやリストに追加される
	 *
	 * @since 0.1.0
	 * @param addDOM DOMに追加するかどうか
	 * @param addList リストに追加するかどうか
	 * @return 自身のクローン要素
	 */
	public clone(addDOM: boolean = true, addList: boolean = true): PsyclePanelClone {
		const clone: PsyclePanelClone = new PsyclePanelClone(this.$el.clone(), this.index, this._list);
		if (addDOM) {
			this.$el.after(clone.$el);
		}
		if (addList) {
			this._list.addClone(clone);
		}
		return clone;
	}

	/**
	 * 画像が読み込まれたかどうか監視する
	 * インスタンスの `load` イベントにより通知する
	 *
	 * @since 0.5.1
	 */
	protected _loadImageObserve(): void {
		const $images: JQuery = this.$el.find('img');
		const onFinishedPromises: JQuery.Promise<void>[] = [];

		if (!$images.length) {
			return;
		}

		this.hasImages = true;
		$images.each((i: number, img: HTMLElement): void => {
			const dfd: JQuery.Deferred<void> = $.Deferred<void>();
			const onload: (e: Event) => void = (): void => {
				dfd.resolve();
			};
			const onabort: (e: UIEvent) => void = (): void => {
				dfd.resolve();
			};
			const onerror: (e: Event) => void = (): void => {
				dfd.resolve();
			};
			img.onload = onload;
			img.onerror = onerror;
			img.onabort = onabort;
			onFinishedPromises.push(dfd.promise());
		});

		$.when.apply($, onFinishedPromises).done((): void => {
			this.loaded = true;
			this.trigger('load');
		});
	}
}

/**
 * スライドショーパネルのクローン要素
 *
 * @since 0.1.0
 * @param $el 対象要素
 * @param index パネル番号
 * @param パネル要素リスト
 */
export class PsyclePanelClone extends PsyclePanel {
	constructor($el: JQuery, index: number, list: PsyclePanelList) {
		super($el, index, list, null);
		$el.addClass('-psycle-clone-element');
		$el.attr('data-psycle-clone-element', 'true');
		$el.attr('data-psycle-clone-original-index', `${index}`);
		$el.attr('aria-hidden', 'true');
		$el.attr('tabindex', -1);
	}

	/**
	 * 画像が読み込まれたかどうか監視しない
	 *
	 * @since 0.5.1
	 */
	protected _loadImageObserve(): void {
		// void
	}
}
