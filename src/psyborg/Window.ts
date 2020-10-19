/**
 * ウィンドウ・ブラウザ/ユーザエージェントに関する操作をあつかう
 *
 * @since 0.4.3
 */
export default class PsyborgWindow {
	/**
	 * ポジションを絶対位置にする
	 *
	 * @since 0.4.3
	 * @param href リンク先URLおよびパス
	 * @param target ターゲットフレーム
	 */
	public static linkTo(href: string, target: string = ''): void {
		switch (target) {
			case '_blank': {
				window.open(href);
				break;
			}
			default: {
				location.href = href;
			}
		}
	}
}
