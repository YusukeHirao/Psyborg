/// <reference types="jquery" />
import PsycleElement from './PsycleElement';
import { default as PsyclePanel, PsyclePanelClone } from './PsyclePanel';
/**
 * スライドショーパネル要素リスト
 *
 * @since 0.1.0
 * @param $el 対象要素
 */
export default class PsyclePanelList extends PsycleElement {
    /**
     * パネル要素の数
     *
     * @since 0.3.0
     * @default 0
     */
    length: number;
    /**
     * パネル要素のリスト
     *
     * @since 0.3.0
     * @default []
     */
    private _panels;
    /**
     * クローン要素のリスト
     *
     * @since 0.3.0
     * @default []
     */
    private _clones;
    constructor($el: JQuery);
    /**
     * 現在のパネルを設定する
     *
     * @since 0.3.0
     * @param index 現在のパネル番号
     * @param className 現在のパネルに設定するクラス名
     * @return 自身
     */
    setCurrent(index: number, className: string): PsyclePanelList;
    /**
     * 現在のパネルの設定をリセットする
     *
     * @since 0.3.0
     * @param className 設定を外すクラス名
     * @return 自身
     */
    resetCurrent(className: string): PsyclePanelList;
    /**
     * パネルを追加する
     *
     * @since 0.1.0
     * @param $el 追加する要素
     * @return 自身
     */
    add($el: JQuery): PsyclePanelList;
    /**
     * クローンを追加する
     *
     * @since 0.3.0
     * @param $el 追加する要素
     * @return 自身
     */
    addClone(clone: PsyclePanelClone): PsyclePanelList;
    /**
     * 指定数クローンを生成してコンテナの末尾に追加する
     *
     * @since 0.5.3
     * @param count クローンする数
     * @return 自身
     */
    cloneAfter(count: number): PsyclePanelList;
    /**
     * 指定数クローンを生成してコンテナの先頭に追加する
     *
     * @since 0.5.3
     * @param count クローンする数
     * @return 自身
     */
    cloneBefore(count: number): PsyclePanelList;
    /**
     * 指定数クローンを生成してDOMに追加する
     *
     * @since 0.5.3
     * @param count クローンする数
     * @param cloneBefore リスト前方にクローンするかどうか
     * @return 自身
     */
    clone(count: number, cloneBefore?: boolean): PsyclePanelList;
    /**
     * パネルを削除する
     *
     * @since 0.1.0
     * @param index 削除するパネルの番号
     * @param removeFromDOMTree DOMツリーから削除するかどうか
     * @return 自身
     */
    remove(index: number, removeFromDOMTree?: boolean): PsyclePanelList;
    /**
     * 指定の番号のパネルを返す
     *
     * @since 0.1.0
     * @param searchIndex パネルの番号
     * @return パネル
     */
    item(searchIndex: number): PsyclePanel;
    /**
     * パネルごとに処理を行う
     *
     * @since 0.1.0
     * @param callback コールバック関数
     * @return 自身
     */
    each(callback: (index: number, panel: PsyclePanel) => void): PsyclePanelList;
    /**
     * 要素を表示する
     *
     * @since 0.1.0
     * @return 自身
     */
    show(): PsyclePanelList;
    /**
     * 要素を隠す
     *
     * @since 0.1.0
     * @return 自身
     */
    hide(): PsyclePanelList;
    /**
     * クローンのみを削除する
     *
     * @since 0.1.0
     * @deprecated
     * @return 自身
     */
    removeClone(): PsyclePanelList;
    /**
     * クローンのjQuery要素コレクションを返す
     *
     * @version 0.6.2
     * @since 0.6.2
     * @deprecated
     * @return クローンのjQuery要素コレクション
     */
    getClones(): JQuery;
    /**
     * 検索番号の正規化
     *
     * @since 0.1.0
     * @param searchIndex 検索番号
     * @return 結果の番号
     */
    private _getRealIndex(searchIndex);
    /**
     * パネル番号を整理して正しいものに調整する
     *
     * @since 0.1.0
     * @return パネルの数
     */
    private _renumbering();
}
