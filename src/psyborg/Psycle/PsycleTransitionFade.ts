import { IPsycleReflowInfo } from './IPsycleReflowInfo';
import Psycle from './Psycle';
import PsycleReflowTiming from './PsycleReflowTiming';
import PsycleTransition from './PsycleTransition';
import StyleSheet from '../StyleSheet';

PsycleTransition.create({
	fade: {
		init: function (this: Psycle): void {
			// スタイルを設定
			StyleSheet.posBase(this.container.$el);
			StyleSheet.posAbs(this.panels.$el);
		},
		reflow: function (this: Psycle, info: IPsycleReflowInfo): void {
			switch (info.timing) {
				case PsycleReflowTiming.TRANSITION_END:
				case PsycleReflowTiming.RESIZE_START:
				case PsycleReflowTiming.RESIZE_END:
				case PsycleReflowTiming.LOAD: {
					if (this.config.resizable) {
						this.stage.$el.height(this.panels.$el.height() || 0);
					}
					StyleSheet.z(this.panels.$el, 0);
					StyleSheet.z(this.panels.item(this.to).$el, 10);
					this.panels.$el.css({ opacity: 0 });
					this.panels.item(this.to).$el.css({ opacity: 1 });
					break;
				}
				default:
				// never
			}
		},
		silent: () => {
			/* void */
		},
		before: () => {
			/* void */
		},
		fire: function (this: Psycle) {
			this.panels.item(this.to).$el.css({ opacity: 0 });
			StyleSheet.z(this.panels.item(this.to).$el, 20);
			if (this.animation) {
				this.animation.stop(false);
			}
			this.animation = $.Animation(
				this.panels.item(this.to).$el[0],
				{
					opacity: 1,
				},
				{
					duration: this.config.duration,
				},
			);
			if (this.config.crossFade) {
				$.Animation(
					this.panels.item(this.from).$el[0],
					{
						opacity: 0,
					},
					{
						duration: this.config.duration,
					},
				);
			}
		},
		cancel: () => {
			/* void */
		},
		after: function (): void {
			this.panels.$el.css({ opacity: 0 });
			this.panels.item(this.to).$el.css({ opacity: 1 });
		},
	},
});
