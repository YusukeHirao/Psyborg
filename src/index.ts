import { IPsycleConfig } from './classes/IPsycleConfig';
import Psycle from './classes/Psycle';
import PsycleEvent from './classes/PsycleEvent';
import PsycleReflowTiming from './classes/PsycleReflowTiming';
import PsycleRepeat from './classes/PsycleRepeat';
import './classes/PsycleTransitionFade';
import './classes/PsycleTransitionFadeSVG';
import './classes/PsycleTransitionSlide';

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
