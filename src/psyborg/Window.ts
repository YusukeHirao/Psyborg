module psyborg {

	/**
	 * ウィンドウ・ブラウザ/ユーザエージェントに関する操作をあつかう
	 *
	 * @since 0.4.3
	 */
	export class Window {

		/**
		 * ポジションを絶対位置にする
		 *
		 * @since 0.4.3
		 * @param href リンク先URLおよびパス
		 * @param target ターゲットフレーム
		 */
		static linkTo (href: string, target: string = ''): void {
			switch (target) {
				case '_blank': {
					window.open(href, null);
					break;
				}
				default: {
					location.href = href;
				}
			}
		}

	}

}