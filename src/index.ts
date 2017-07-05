import { IPsycleConfig } from './psyborg/Psycle/IPsycleConfig';
import Psycle from './psyborg/Psycle/Psycle';
import PsycleReflowTiming from './psyborg/Psycle/PsycleReflowTiming';
import PsycleRepeat from './psyborg/Psycle/PsycleRepeat';
import './psyborg/Psycle/PsycleTransitionFade';
import './psyborg/Psycle/PsycleTransitionFadeSVG';
import './psyborg/Psycle/PsycleTransitionSlide';
import PsycleEvent from './psyborg/PsycleEvent';

$.fn['psycle'] = function (this: JQuery, config: IPsycleConfig) { // tslint:disable-line:no-string-literal
	if (this.length === 0) {
		if (console && console.warn) {
			console.warn('This jQuery object is empty.');
		}
	}
	return this.each(function () {
		new Psycle($(this), config);
	});
};

$['Psycle'] = Psycle; // tslint:disable-line:no-string-literal
$['PsycleEvent'] = PsycleEvent; // tslint:disable-line:no-string-literal
$['PsycleRepeat'] = PsycleRepeat; // tslint:disable-line:no-string-literal
$['PsycleReflowTiming'] = PsycleReflowTiming; // tslint:disable-line:no-string-literal
