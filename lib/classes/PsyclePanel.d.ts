/// <reference types="jquery" />
import PsycleElement from './PsycleElement';
import PsyclePanelList from './PsyclePanelList';
/**
 * スライドショーパネル要素
 *
 * @since 0.1.0
 * @param $el 対象要素
 * @param index パネル番号
 * @param list パネル要素リスト
 */
export default class PsyclePanel extends PsycleElement {
    /**
     * 自身のパネル番号
     *
     * @since 0.1.0
     */
    index: number;
    /**
     * パネル内に画像を含むかどうか
     *
     * @since 0.5.1
     */
    hasImages: boolean;
    /**
     * パネル内に画像の読み込みが完了したかどうか
     *
     * @since 0.5.1
     */
    loaded: boolean;
    /**
     * スライドショーパネル要素リスト
     *
     * @since 0.1.0
     */
    private _list;
    constructor($el: JQuery, index: number, list: PsyclePanelList);
    /**
     * 要素を表示する
     *
     * @since 0.1.0
     * @return 自身
     */
    show(): PsyclePanel;
    /**
     * 要素を隠す
     *
     * @since 0.1.0
     * @return 自身
     */
    hide(): PsyclePanel;
    /**
     * クローン要素(クラスは異なる)を作る
     * デフォルトではDOMやリストに追加される
     *
     * @since 0.1.0
     * @param addDOM DOMに追加するかどうか
     * @param addList リストに追加するかどうか
     * @return 自身のクローン要素
     */
    clone(addDOM?: boolean, addList?: boolean): PsyclePanelClone;
    /**
     * 画像が読み込まれたかどうか監視する
     * インスタンスの `load` イベントにより通知する
     *
     * @since 0.5.1
     */
    protected _loadImageObserve(): void;
}
/**
 * スライドショーパネルのクローン要素
 *
 * @since 0.1.0
 * @param $el 対象要素
 * @param index パネル番号
 * @param パネル要素リスト
 */
export declare class PsyclePanelClone extends PsyclePanel {
    constructor($el: JQuery, index: number, list: PsyclePanelList);
    /**
     * 画像が読み込まれたかどうか監視しない
     *
     * @since 0.5.1
     */
    protected _loadImageObserve(): void;
}
