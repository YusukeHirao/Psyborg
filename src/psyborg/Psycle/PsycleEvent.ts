module psyborg {

	/* @version 0.8.2 */
	/* @since 0.1.0 */
	export class PsycleEvent {
		static INIT:string = 'init';
		static PANEL_CHANGE_START_BEFORE:string = 'panelChangeStartBefore';
		static PANEL_CHANGE_START:string = 'panelChangeStart';
		static PANEL_CHANGE_END:string = 'panelChangeEnd';
		static PANEL_CHANGE_CANCEL:string = 'panelChangeCancel';
		static WAIT_START:string = 'waitStart';
		static WAIT_END:string = 'waitEnd';
	}

}
