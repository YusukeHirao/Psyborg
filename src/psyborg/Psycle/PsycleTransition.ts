module psyborg {

	/**!
	 * 遷移プロセス管理
	 *
	 * @class PsycleTransition
	 * @since 0.1.0
	 * @constructor
	 * @param {string} name トランジション名
	 * @param {Object} process プロセス
	 * @param {Object} process.init 初期処理
	 * @param {Object} process.reflow リフロー処理
	 * @param {Object} process.silent 非遷移変化処理
	 * @param {Object} process.before 遷移前処理
	 * @param {Object} process.fire 遷移時処理
	 * @param {Object} process.cancel キャンセル処理
	 * @param {Object} process.after 遷移後処理
	 */
	export class PsycleTransition {

		constructor (name:string, process:IPsycleTransitionProcess) {
			this.name = name;
			$.extend(this, process);
		}

		/**!
		 * トランジション名
		 *
		 * @property name
		 * @since 0.1.0
		 * @public
		 * @type string
		 */
		public name:string;

		/**!
		 * 初期処理
		 *
		 * @method init
		 * @since 0.1.0
		 * @public
		 */
		public init:() => void;

		/**!
		 * リフロー処理
		 *
		 * @method reflow
		 * @since 0.1.0
		 * @public
		 */
		public reflow:(info:IPsycleReflowInfo) => void;

		/**!
		 * 非遷移変化処理
		 *
		 * @method silent
		 * @since 0.1.0
		 * @public
		 */
		public silent:() => void;

		/**!
		 * 遷移前処理
		 *
		 * @method before
		 * @since 0.1.0
		 * @public
		 */
		public before:() => void;

		/**!
		 * 遷移時処理
		 *
		 * @method fire
		 * @since 0.1.0
		 * @public
		 */
		public fire:() => any;

		/**!
		 * キャンセル処理
		 *
		 * @method cancel
		 * @since 0.1.0
		 * @public
		 */
		public cancel:() => any;

		/**!
		 * 遷移後処理
		 *
		 * @method after
		 * @since 0.1.0
		 * @public
		 */
		public after:() => void;

		/**!
		 * プロセスリスト
		 *
		 * @property transitions
		 * @since 0.1.0
		 * @static
		 * @default = {}
		 */
		static transitions:IPsycleTransitionList = {};

		/**!
		 * 遷移プロセス生成・登録
		 *
		 * @method create
		 * @since 0.1.0
		 * @static
		 * @param {Object} processList プロセスリスト
		 */
		static create(processList:IPsycleTransitionProcessList):void {
			var transitionName:string;
			var transition:PsycleTransition;
			for (transitionName in processList) {
				transition = new PsycleTransition(transitionName, processList[transitionName]);
				PsycleTransition.transitions[transitionName] = transition;
			}
		}

	}

}