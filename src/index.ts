import './psyborg/Psycle/PsycleTransitionFade';
import './psyborg/Psycle/PsycleTransitionFadeSVG';
import './psyborg/Psycle/PsycleTransitionSlide';
import { IPsycleConfig } from './psyborg/Psycle/IPsycleConfig';
import Psycle from './psyborg/Psycle/Psycle';
import PsycleEvent from './psyborg/Psycle/PsycleEvent';
import PsycleReflowTiming from './psyborg/Psycle/PsycleReflowTiming';
import PsycleRepeat from './psyborg/Psycle/PsycleRepeat';

// @ts-ignore
$.fn.psycle = function (this: JQuery, config: IPsycleConfig) {
	if (this.length === 0) {
		// tslint:disable-line:no-invalid-this
		if (console && console.warn) {
			console.warn('This jQuery object is empty.');
		}
	}
	return this.each(function () {
		// tslint:disable-line:no-invalid-this
		new Psycle($(this), config); // tslint:disable-line:no-invalid-this no-unused-expression
	});
};

$['Psycle'] = Psycle; // tslint:disable-line:no-string-literal
$['PsycleEvent'] = PsycleEvent; // tslint:disable-line:no-string-literal
$['PsycleRepeat'] = PsycleRepeat; // tslint:disable-line:no-string-literal
$['PsycleReflowTiming'] = PsycleReflowTiming; // tslint:disable-line:no-string-literal
