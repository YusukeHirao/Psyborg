module psyborg {

	/**!
	 * 遷移プロセス管理
	 *
	 * @since 0.1.0
	 * @param name トランジション名
	 * @param process プロセス
	 */
	export class PsycleTransition {

		constructor (name: string, process: IPsycleTransitionProcess) {
			this.name = name;
			$.extend(this, process);
		}

		/**!
		 * トランジション名
		 *
		 * @since 0.1.0
		 */
		public name:string;

		/**!
		 * 初期処理
		 *
		 * @since 0.1.0
		 */
		public init: () => void;

		/**!
		 * リフロー処理
		 *
		 * @since 0.1.0
		 */
		public reflow: (info: IPsycleReflowInfo) => void;

		/**!
		 * 非遷移変化処理
		 *
		 * @since 0.1.0
		 */
		public silent: () => void;

		/**!
		 * 遷移前処理
		 *
		 * @since 0.1.0
		 */
		public before: () => void;

		/**!
		 * 遷移時処理
		 *
		 * @since 0.1.0
		 */
		public fire: () => any;

		/**!
		 * キャンセル処理
		 *
		 * @since 0.1.0
		 */
		public cancel: () => any;

		/**!
		 * 遷移後処理
		 *
		 * @since 0.1.0
		 */
		public after: () => void;

		/**!
		 * プロセスリスト
		 *
		 * @since 0.1.0
		 * @default = {}
		 */
		static transitions: IPsycleTransitionList = {};

		/**!
		 * 遷移プロセス生成・登録
		 *
		 * @since 0.1.0
		 * @param processList プロセスリスト
		 */
		static create (processList: IPsycleTransitionProcessList): void {
			for (const transitionName in processList) {
				const transition = new PsycleTransition(transitionName, processList[transitionName]);
				PsycleTransition.transitions[transitionName] = transition;
			}
		}

	}

}