module psyborg {
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
}