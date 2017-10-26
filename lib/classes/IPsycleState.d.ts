import PsycleContainer from './PsycleContainer';
import PsyclePanel from './PsyclePanel';
import PsyclePanelList from './PsyclePanelList';
import PsycleStage from './PsycleStage';
export interface IPsycleState {
    readonly index: number;
    readonly stage: PsycleStage;
    readonly container: PsycleContainer;
    readonly panel: PsyclePanel;
    readonly panels: PsyclePanelList;
    readonly stageWidth: number;
    readonly panelWidth: number;
    readonly length: number;
    readonly from: number;
    readonly to: number;
    readonly vector: number;
    readonly isTransition: boolean;
    readonly isPaused: boolean;
}
