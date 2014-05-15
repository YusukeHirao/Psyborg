module psyborg {

	/**!
	 * ウィンドウ・ブラウザ/ユーザエージェントに関する操作をあつかう
	 *
	 * @class Window
	 * @since 0.4.3
	 */
	export class Window {

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

}