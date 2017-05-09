import PsycleContainer from './PsycleContainer';
import PsyclePanel from './PsyclePanel';
import PsyclePanelList from './PsyclePanelList';
import PsycleStage from './PsycleStage';
export interface IPsycleState {
    index: number;
    stage: PsycleStage;
    container: PsycleContainer;
    panel: PsyclePanel;
    panels: PsyclePanelList;
    stageWidth: number;
    panelWidth: number;
    length: number;
    from: number;
    to: number;
    vector: number;
    isTransition: boolean;
    isPaused: boolean;
}
