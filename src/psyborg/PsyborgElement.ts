import PsyborgEventDispacther from './PsyborgEventDispacther';

/**
 * Psyborgで取り扱うDOM要素
 *
 * @since 0.9.0
 * @param $el インスタンス化する要素
 */
export default class PsyborgElement extends PsyborgEventDispacther {
	/**
	 * 内包するjQuery要素
	 *
	 * @since 0.1.0
	 */
	public $el: JQuery;

	/**
	 * 内包するDOM要素
	 *
	 * @since 0.9.0
	 */
	public el: Element;

	constructor($el: JQuery) {
		super();
		if (!$el.length) {
			throw new ReferenceError('This jQuery object is empty.');
		}
		this.$el = $el;
		this.el = $el[0];
	}

	/**
	 * イベントを任意に発火させる 要素にバインドされているイベントも同時に発火する
	 *
	 * @since 0.3.0
	 * @override
	 * @param type イベントの種類
	 * @param data 発火と同時にリスナー関数に渡すハッシュデータ
	 * @param context リスナー関数の`this`コンテクスト
	 * @return デフォルトのイベントの抑制がされていないかどうか
	 */
	public trigger(type: string, data = {}, context = this): boolean {
		const defaultPrevented: boolean = super.trigger(type, data, context);
		if (defaultPrevented) {
			this.$el.trigger(type, data);
		}
		return defaultPrevented;
	}

	/**
	 * 要素の幅を取得
	 *
	 * @since 0.4.3
	 * @return 要素の幅
	 */
	public getWidth(): number {
		return this.$el.width() || 0;
	}

	/**
	 * 要素の高さを取得
	 *
	 * @since 0.4.3
	 * @return 要素の高さ
	 */
	public getHeight(): number {
		return this.$el.height() || 0;
	}

	/**
	 * 要素から最大の高さを取得
	 *
	 * @since 0.9.1
	 * @return 要素の高さ
	 */
	public getMaxHeight(): number {
		let height = 0;
		this.$el.each((i: number, el: Element) => {
			height = Math.max($(el).height() || 0, height);
		});
		return height;
	}

	/**
	 * 要素から最小の高さを取得
	 *
	 * @since 0.9.1
	 * @return 要素の高さ
	 */
	public getMinHeight(): number {
		let height: number = Infinity;
		this.$el.each((i: number, el: Element) => {
			height = Math.min($(el).height() || 0, height);
		});
		if (height === Infinity) {
			height = NaN;
		}
		return height;
	}

	/**
	 * 要素の幅を設定
	 *
	 * @since 0.4.3
	 * @param value 指定の値
	 * @return 自身
	 */
	public setWidth(value: number): PsyborgElement {
		this.$el.width(value);
		return this;
	}

	/**
	 * 要素の高さを設定
	 *
	 * @since 0.4.3
	 * @param value 指定の値
	 * @return 自身
	 */
	public setHeight(value: number): PsyborgElement {
		this.$el.height(value);
		return this;
	}
}
