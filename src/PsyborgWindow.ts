/**!
 * ウィンドウ・ブラウザ/ユーザエージェントに関する操作をあつかう
 *
 * @class PsyborgWindow
 * @since 0.4.3
 */
class PsyborgWindow {

	/**!
	 * ポジションを絶対位置にする
	 *
	 * @method linkTo
	 * @since 0.4.3
	 * @static
	 * @param {string} href リンク先URLおよびパス
	 * @param {string} [target=''] ターゲットフレーム
	 */
	static linkTo (href:string, target:string = ''):void {
		switch (target) {
			case '_blank':
				window.open(href, null);
				break;
			default:
				location.href = href;
		}
	}

}