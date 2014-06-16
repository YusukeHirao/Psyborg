module psyborg {

	/**!
	 * CSSを変換するラッパー関数郡
	 *
	 * @class StyleSheet
	 * @module psyborg
	 * @since 0.1.0
	 */
	export class StyleSheet {

		/**!
		 * ポジションを絶対位置にする
		 *
		 * @method posAbs
		 * @since 0.1.0
		 * @static
		 * @param {jQuery} $el 対象要素
		 * @param {number} [top=0] 垂直位置(単位:ピクセル)
		 * @param {number} [left=0] 水平位置(単位:ピクセル)
		 * @return {jQuery} 対象要素
		 */
		static posAbs ($el: JQuery, top: number = 0, left: number = 0): JQuery {
			return $el.css({
				position: <string> 'absolute',
				top: <number> top,
				left: <number> left
			});
		}

		/**!
		 * ポジションが 未指定もしくは`static`の場合は`relative`にする
		 *
		 * @method posBase
		 * @since 0.1.0
		 * @static
		 * @param {jQuery} $el 対象要素
		 * @return {jQuery} 対象要素
		 */
		static posBase ($el: JQuery): JQuery {
			var posi: string = $el.css('position');
			if (posi == null || posi === 'static' || posi === '') {
				$el.css({
					position: <string> 'relative'
				});
			}
			return $el;
		}

		/**!
		 * `z-index`を指定する
		 *
		 * @method z
		 * @since 0.3.1
		 * @static
		 * @param {jQuery} $el 対象要素
		 * @param {number} [zIndex=0] Zレイヤー位置
		 * @return {jQuery} 対象要素
		 */
		static z ($el: JQuery, zIndex: number = 0): JQuery {
			$el.css({
				zIndex: <number> zIndex
			});
			return $el;
		}

		/**!
		 * `float`を指定する
		 *
		 * @method floating
		 * @since 0.5.3
		 * @static
		 * @param {jQuery} $el 対象要素
		 * @param {boolean} [floating=true] フロートさせるかどうか
		 * @return {jQuery} 対象要素
		 */
		static floating ($el: JQuery, floating: boolean = true): JQuery {
			$el.css({
				'float': <string> (floating ? 'left' : 'none')
			});
			return $el;
		}

		/**!
		 * `overflow:hidden`かどうか
		 *
		 * @method isOverflowHidden
		 * @since 0.1.0
		 * @static
		 * @param {jQuery} $el 対象要素
		 * @return {boolean} `overflow:hidden`だった場合は`true`、それ以外は`false`
		 */
		static isOverflowHidden ($el: JQuery): boolean {
			return $el.css('overflow').toLowerCase() === 'hidden';
		}

		/**!
		 * CSSを保存する
		 *
		 * @method saveCSS
		 * @since 0.3.4
		 * @static
		 * @param {jQuery} $el 対象要素
		 */
		static saveCSS ($el: JQuery): void {
			$el.each( (i: number, el: Element): void => {
				var $this: JQuery = $(el);
				$this.data('originStyle', $this.attr('style'));
			});
		}

		/**!
		 * 保存したCSSを元に戻す
		 *
		 * @method restoreCSS
		 * @since 0.3.4
		 * @static
		 * @param {jQuery} $el 対象要素
		 */
		static restoreCSS ($el: JQuery): void {
			$el.each( (i: number, el: Element): void => {
				var $this: JQuery = $(el);
				$this.attr('style', $this.data('originStyle'));
			});
		}

		/**!
		 * インラインCSSを削除する
		 *
		 * @method cleanCSS
		 * @since 0.6.1
		 * @static
		 * @param {jQuery} $el 対象要素
		 */
		static cleanCSS ($el: JQuery): void {
			$el.each( (i: number, el: Element): void => {
				var $this: JQuery = $(el);
				$this.attr('style', '');
			});
		}

	}

}