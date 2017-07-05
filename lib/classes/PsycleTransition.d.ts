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
    static transitions: IPsycleTransitionList;
    /**
     * 遷移プロセス生成・登録
     *
     * @since 0.1.0
     * @param processList プロセスリスト
     */
    static create(processList: IPsycleTransitionProcessList): void;
    /**
     * トランジション名
     *
     * @since 0.1.0
     */
    name: string;
    /**
     * フォールバック用のトランジション名
     *
     * @since 0.9.0
     */
    fallback: string;
    /**
     * フォールバック用のチェックフィルター
     *
     * @since 0.9.0
     */
    fallbackFilter: () => boolean;
    /**
     * 初期処理
     *
     * @since 0.1.0
     */
    init: () => void;
    /**
     * リフロー処理
     *
     * @since 0.1.0
     */
    reflow: (info: IPsycleReflowInfo) => void;
    /**
     * 非遷移変化処理
     *
     * @since 0.1.0
     */
    silent: () => void;
    /**
     * 遷移前処理
     *
     * @since 0.1.0
     */
    before: () => void;
    /**
     * 遷移時処理
     *
     * @since 0.1.0
     */
    fire: () => boolean | void;
    /**
     * キャンセル処理
     *
     * @since 0.1.0
     */
    cancel: () => boolean | void;
    /**
     * 遷移後処理
     *
     * @since 0.1.0
     */
    after: () => void;
    constructor(name: string, process: IPsycleTransitionProcess);
}
