/// <reference types="jquery" />
import PsycleElement from '../PsycleElement';
import PsyclePanelList from './PsyclePanelList';
/**
 * スライドショーステージ要素
 *
 * @since 0.1.0
 */
export default class PsycleStage extends PsycleElement {
    /**
     * @since 0.5.1
     */
    private _panels;
    constructor($stage: JQuery, panels: PsyclePanelList);
}
