import { IPsycleReflowInfo } from './IPsycleReflowInfo';

import StyleSheet from './StyleSheet';

import Psycle from './Psycle';
import PsycleReflowTiming from './PsycleReflowTiming';
import PsycleTransition from './PsycleTransition';

PsycleTransition.create({

	fade: {
		init (psycle: Psycle) {
			// スタイルを設定
			StyleSheet.posBase(psycle.container.$el);
			StyleSheet.posAbs(psycle.panels.$el);
		},
		reflow (psycle: Psycle, info: IPsycleReflowInfo) {
			switch (info.timing) {
				case PsycleReflowTiming.TRANSITION_END:
				case PsycleReflowTiming.RESIZE_START:
				case PsycleReflowTiming.RESIZE_END:
				case PsycleReflowTiming.LOAD: {
					if (psycle.config.resizable) {
						psycle.stage.$el.height(psycle.panels.$el.height() || 0);
					}
					StyleSheet.z(psycle.panels.$el, 0);
					StyleSheet.z(psycle.panels.item(psycle.to).$el, 10);
					psycle.panels.$el.css({ opacity: 0 });
					psycle.panels.item(psycle.to).$el.css({ opacity: 1 });
					break;
				}
				default:
					// never
			}
		},
		silent: () => { /* void */},
		before: () => { /* void */},
		fire (psycle: Psycle) {
			psycle.panels.item(psycle.to).$el.css({ opacity: 0 });
			StyleSheet.z(psycle.panels.item(psycle.to).$el, 20);
			if (psycle.animation) {
				psycle.animation.stop();
			}
			psycle.animation = psycle.panels.item(psycle.to).$el.animate(
				{
					opacity: 1,
				},
				{
					duration: psycle.config.duration,
				},
			);
			if (psycle.config.crossFade) {
				psycle.panels.item(psycle.from).$el.animate(
					{
						opacity: 0,
					},
					{
						duration: psycle.config.duration,
					},
				);
			}
		},
		cancel: () => { /* void */},
		after (psycle: Psycle) {
			psycle.panels.$el.css({ opacity: 0 });
			psycle.panels.item(psycle.to).$el.css({ opacity: 1 });
		},
	},
});
