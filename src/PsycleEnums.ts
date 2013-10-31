enum PsycleRepeat {
	NONE,
	RETURN,
	LOOP
}

class PsycleEvent {
	static INIT:string = 'init';
	static PANEL_CHANGE_START:string = 'panelChangeStart';
	static PANEL_CHANGE_END:string = 'panelChangeEnd';
	static PANEL_CHANGE_CANCEL:string = 'panelChangeCancel';
	static WAIT_START:string = 'waitStart';
	static WAIT_END:string = 'waitEnd';
}

enum PsycleReflowTiming {
	INIT,
	TRANSITION_END,
	RESIZE,
	RESIZE_START,
	RESIZE_END
}
