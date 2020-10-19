import { IPsycleReflowInfo } from './IPsycleReflowInfo';
import { IPsycleTransitionList } from './IPsycleTransitionList';
import { IPsycleTransitionProcess } from './IPsycleTransitionProcess';
import { IPsycleTransitionProcessList } from './IPsycleTransitionProcessList';

/**
 * 遷移プロセス管理
 *
 * @since 0.1.0
 * @param name トランジション名
 * @param process プロセス
 */
export default class PsycleTransition {
	/**
	 * プロセスリスト
	 *
	 * @since 0.1.0
	 * @default = {}
	 */
	public static transitions: IPsycleTransitionList = {};

	/**
	 * 遷移プロセス生成・登録
	 *
	 * @since 0.1.0
	 * @param processList プロセスリスト
	 */
	public static create(processList: IPsycleTransitionProcessList): void {
		for (const transitionName in processList) {
			if (processList.hasOwnProperty(transitionName)) {
				const transition = new PsycleTransition(transitionName, processList[transitionName]);
				PsycleTransition.transitions[transitionName] = transition;
			}
		}
	}

	/**
	 * トランジション名
	 *
	 * @since 0.1.0
	 */
	public name: string;

	/**
	 * フォールバック用のトランジション名
	 *
	 * @since 0.9.0
	 */
	public fallback: string;

	/**
	 * フォールバック用のチェックフィルター
	 *
	 * @since 0.9.0
	 */
	public fallbackFilter: () => boolean;

	/**
	 * 初期処理
	 *
	 * @since 0.1.0
	 */
	public init: () => void;

	/**
	 * リフロー処理
	 *
	 * @since 0.1.0
	 */
	public reflow: (info: IPsycleReflowInfo) => void;

	/**
	 * 非遷移変化処理
	 *
	 * @since 0.1.0
	 */
	public silent: () => void;

	/**
	 * 遷移前処理
	 *
	 * @since 0.1.0
	 */
	public before: () => void;

	/**
	 * 遷移時処理
	 *
	 * @since 0.1.0
	 */
	public fire: () => boolean | void;

	/**
	 * キャンセル処理
	 *
	 * @since 0.1.0
	 */
	public cancel: () => boolean | void;

	/**
	 * 遷移後処理
	 *
	 * @since 0.1.0
	 */
	public after: () => void;

	constructor(name: string, process: IPsycleTransitionProcess) {
		this.name = name;
		$.extend(this, process);
	}
}
