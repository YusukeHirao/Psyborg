/// <reference types="jquery" />
import PsyborgElement from '../PsyborgElement';
import PsyclePanelList from './PsyclePanelList';
/**
 * スライドショーステージ要素
 *
 * @since 0.1.0
 */
export default class PsycleStage extends PsyborgElement {
    /**
     * @since 0.5.1
     */
    private _panels;
    constructor($stage: JQuery, panels: PsyclePanelList);
}
