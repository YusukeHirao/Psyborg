import { IPsycleOptions } from './classes/IPsycleConfig';
import _Psycle from './classes/Psycle';
import _PsycleEvent from './classes/PsycleEvent';
import _PsycleReflowTiming from './classes/PsycleReflowTiming';
import _PsycleRepeat from './classes/PsycleRepeat';
import './classes/PsycleTransitionFade';
import './classes/PsycleTransitionFadeSVG';
import './classes/PsycleTransitionSlide';

function psycle (selector: string | Element | NodeListOf<Element>, config?: IPsycleOptions) {
	let nodeList: NodeListOf<Element>;
	if (typeof selector === 'string') {
		nodeList = document.querySelectorAll(selector);
	} else if (selector instanceof Element) {
		return [new _Psycle($(selector), config)];
	} else {
		const list: _Psycle[] = [];
		for (const el of Array.from(selector)) {
			list.push(new _Psycle($(el), config));
		}
		return list;
	}
}

namespace psycle {
	export const version = '@VERSION';
	export const Psycle = _Psycle;
	export const PsycleEvent = _PsycleEvent;
	export const PsycleReflowTiming = _PsycleReflowTiming;
	export const PsycleRepeat = _PsycleRepeat;
}

Object.freeze(psycle);
