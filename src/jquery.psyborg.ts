/**
* jQueryの拡張
*
* @class jQuery
*/
interface JQuery {
	psycle(config:any):JQuery;
}

jQuery.fn.psycle = function(config:any):JQuery {
	if (this.length === 0) {
		if (console && console.warn) {
			console.warn('This jQuery object is empty.');
		}
	}
	return this.each(function () {
		new psyborg.Psycle($(this), config);
	});
};

interface JQueryStatic {
	Psycle: Function;
	PsycleEvent: psyborg.PsycleEvent;
	PsycleReflowTiming: psyborg.PsycleReflowTiming;
	PsycleRepeat: psyborg.PsycleRepeat;
}

jQuery.Psycle = psyborg.Psycle;
jQuery.PsycleEvent = psyborg.PsycleEvent;
jQuery.PsycleRepeat = psyborg.PsycleRepeat;
jQuery.PsycleReflowTiming = psyborg.PsycleReflowTiming;