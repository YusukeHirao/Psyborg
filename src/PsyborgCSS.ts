/**!
 * CSSを変換するラッパー関数郡
 *
 * @class PsyborgCSS
 * @since 0.1.0
 */
class PsyborgCSS {

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
	static posAbs ($el:JQuery, top:number = 0, left:number = 0):JQuery {
		return $el.css({
			position:<string> 'absolute',
			top:<number> top,
			left:<number> left
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
	static posBase ($el:JQuery):JQuery {
		var posi:string = $el.css('position');
		if (posi == null || posi === 'static' || posi === '') {
			$el.css({
				position:<string> 'relative'
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
	 * @param {number} [zIndex=0] 対象要素
	 * @return {jQuery} 対象要素
	 */
	static z ($el:JQuery, zIndex:number = 0):JQuery {
		$el.css({ zIndex: zIndex });
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
	static isOverflowHidden ($el:JQuery):boolean {
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
	static saveCSS ($el:JQuery):void {
		$el.each( (i:number, el:Element) => {
			var $this:JQuery = $(el);
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
	static restoreCSS ($el:JQuery):void {
		$el.each( (i:number, el:Element) => {
			var $this:JQuery = $(el);
			$this.attr('style', $this.data('originStyle'));
		});
	}
}


/**!
 * ユーティリティ関数郡
 *
 * @class PsyborgUtil
 * @since 0.3.4
 */
class PsyborgUtil {

	/**!
	 * 距離(px)と継続時間(ms)から速度(px/ms)を得る
	 *
	 * @method getSpeed
	 * @since 0.3.4
	 * @static
	 * @param {number} distance 距離(px)
	 * @param {number} duration 継続時間(ms)
	 * @return {number} 速度(px/ms)
	 */
	static getSpeed (distance:number, duration:number):number {
		return distance / duration;
	}

	/**!
	 * 距離(px)と速度(px/ms)から継続時間(ms)を得る
	 *
	 * @method getDuration
	 * @since 0.3.4
	 * @static
	 * @param {number} distance 距離(px)
	 * @param {number} speed 速度(px/ms)
	 * @return {number} 継続時間(ms)
	 */
	static getDuration (distance:number, speed:number):number {
		return distance / speed;
	}

	/**!
	 * 継続時間(ms)と速度(px/ms)から距離(px)を得る
	 *
	 * @method getDistance
	 * @since 0.3.4
	 * @static
	 * @param {number} duration 継続時間(ms)
	 * @param {number} speed 速度(px/ms)
	 * @return {number} 距離(px)
	 */
	static getDistance (duration:number, speed:number):number {
		return duration * speed;
	}
}