/// <reference path="d.ts/jquery/jquery.d.ts" />
/// <reference path="d.ts/hammerjs/hammerjs.d.ts" />
/// <reference path="psyborg/Util.ts" />
/// <reference path="psyborg/PsyborgEvent.ts" />
/// <reference path="psyborg/PsyborgEventDispacther.ts" />
/// <reference path="psyborg/PsyborgElement.ts" />
/// <reference path="psyborg/Window.ts" />
/// <reference path="psyborg/StyleSheet.ts" />
/// <reference path="psyborg/Psycle/IPsycleConfig.ts" />
/// <reference path="psyborg/Psycle/IPsycleState.ts" />
/// <reference path="psyborg/Psycle/IPsycleReflowInfo.ts" />
/// <reference path="psyborg/Psycle/IPsycleTransitionList.ts" />
/// <reference path="psyborg/Psycle/IPsycleTransitionProcess.ts" />
/// <reference path="psyborg/Psycle/IPsycleTransitionProcessList.ts" />
/// <reference path="psyborg/Psycle/Psycle.ts" />
/// <reference path="psyborg/Psycle/PsycleEvent.ts" />
/// <reference path="psyborg/Psycle/PsycleRepeat.ts" />
/// <reference path="psyborg/Psycle/PsycleReflowTiming.ts" />
/// <reference path="psyborg/Psycle/PsyclePanel.ts" />
/// <reference path="psyborg/Psycle/PsyclePanelClone.ts" />
/// <reference path="psyborg/Psycle/PsyclePanelList.ts" />
/// <reference path="psyborg/Psycle/PsycleContainer.ts" />
/// <reference path="psyborg/Psycle/PsycleStage.ts" />
/// <reference path="psyborg/Psycle/PsycleTransition.ts" />
/// <reference path="psyborg/Psycle/PsycleController.ts" />
/// <reference path="psyborg/Psycle/PsycleTransitionSlide.ts" />
/// <reference path="psyborg/Psycle/PsycleTransitionFade.ts" />

interface JQueryStatic {
	Animation: any;
	Psycle: Function;
	PsycleEvent: psyborg.PsycleEvent;
	PsycleReflowTiming: psyborg.PsycleReflowTiming;
	PsycleRepeat: psyborg.PsycleRepeat;
}

interface JQuery {
	psycle(config:any):JQuery;
}

$.fn.psycle = function(config:any):JQuery {
	if (this.length === 0) {
		if (console && console.warn) {
			console.warn('This jQuery object is empty.');
		}
	}
	return this.each(function () {
		new psyborg.Psycle($(this), config);
	});
};

$.Psycle = psyborg.Psycle;
$.PsycleEvent = psyborg.PsycleEvent;
$.PsycleRepeat = psyborg.PsycleRepeat;
$.PsycleReflowTiming = psyborg.PsycleReflowTiming;