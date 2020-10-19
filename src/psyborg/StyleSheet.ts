/**
 * CSSを変換するラッパー関数郡
 *
 * @module psyborg
 * @since 0.1.0
 */
export default class StyleSheet {
	/**
	 * ポジションを絶対位置にする
	 *
	 * @since 0.1.0
	 * @param $el 対象要素
	 * @param top 垂直位置(単位:ピクセル)
	 * @param left 水平位置(単位:ピクセル)
	 * @return 対象要素
	 */
	public static posAbs($el: JQuery, top: number = 0, left: number = 0): JQuery {
		return $el.css({
			position: 'absolute',
			top,
			left,
		});
	}

	/**
	 * ポジションが 未指定もしくは`static`の場合は`relative`にする
	 *
	 * @since 0.1.0
	 * @param $el 対象要素
	 * @return 対象要素
	 */
	public static posBase($el: JQuery): JQuery {
		const posi: string = $el.css('position');
		if (posi == null || posi === 'static' || posi === '') {
			$el.css({
				position: 'relative',
			});
		}
		return $el;
	}

	/**
	 * `z-index`を指定する
	 *
	 * @since 0.3.1
	 * @param $el 対象要素
	 * @param zIndex Zレイヤー位置
	 * @return 対象要素
	 */
	public static z($el: JQuery, zIndex: number = 0): JQuery {
		$el.css({
			zIndex,
		});
		return $el;
	}

	/**
	 * `float`を指定する
	 *
	 * @since 0.5.3
	 * @param $el 対象要素
	 * @param floating フロートさせるかどうか
	 * @return 対象要素
	 */
	public static floating($el: JQuery, floating: boolean = true): JQuery {
		$el.css({
			float: floating ? 'left' : 'none',
		});
		return $el;
	}

	/**
	 * `overflow:hidden`かどうか
	 *
	 * @since 0.1.0
	 * @param $el 対象要素
	 * @return `overflow:hidden`だった場合は`true`、それ以外は`false`
	 */
	public static isOverflowHidden($el: JQuery): boolean {
		return $el.css('overflow').toLowerCase() === 'hidden';
	}

	/**
	 * CSSを保存する
	 *
	 * @since 0.3.4
	 * @param $el 対象要素
	 */
	public static saveCSS($el: JQuery): void {
		$el.each((i: number, el: Element): void => {
			const $this: JQuery = $(el);
			$this.data('originStyle', $this.attr('style'));
		});
	}

	/**
	 * 保存したCSSを元に戻す
	 *
	 * @since 0.3.4
	 * @param $el 対象要素
	 */
	public static restoreCSS($el: JQuery): void {
		$el.each((i: number, el: Element): void => {
			const $this: JQuery = $(el);
			const originStyle = `${$this.data('originStyle')}`;
			$this.attr('style', originStyle);
		});
	}

	/**
	 * インラインCSSを削除する
	 *
	 * @since 0.6.1
	 * @param $el 対象要素
	 */
	public static cleanCSS($el: JQuery): void {
		$el.each((i: number, el: Element): void => {
			const $this: JQuery = $(el);
			$this.attr('style', '');
		});
	}
}
