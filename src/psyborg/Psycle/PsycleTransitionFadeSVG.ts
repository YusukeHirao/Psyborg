import { IPsycleReflowInfo } from './IPsycleReflowInfo';
import Psycle from './Psycle';
import PsycleContainer from './PsycleContainer';
import PsyclePanel from './PsyclePanel';
import PsyclePanelList from './PsyclePanelList';
import PsycleReflowTiming from './PsycleReflowTiming';
import PsycleTransition from './PsycleTransition';

const originRect: {
	width: number;
	height: number;
	scale: number;
} = {
	width: 0,
	height: 0,
	scale: 1,
};

PsycleTransition.create({
	fadeSVG: {
		fallback: 'fade',
		fallbackFilter: () => {
			return !document.implementation.hasFeature();
		},
		init: function (this: Psycle): void {
			const width = this.getWidth();
			const height = this.getHeight();
			this.container.$el.hide();

			const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			svg.setAttribute('width', `${width}`);
			svg.setAttribute('height', `${height}`);
			$(svg).css('display', 'block');

			const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
			svg.appendChild(g);

			let $panels = $();
			this.panels.each((i: number, panel: PsyclePanel): void => {
				const imgSrc: string = panel.$el.find('img').attr('src') || '';
				const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
				image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', imgSrc);
				image.setAttribute('width', `${width}`);
				image.setAttribute('height', `${height}`);
				image.setAttribute('visibility', 'visible');
				image.setAttribute('data-index', `${i}`);
				g.appendChild(image);
				// @ts-ignore
				$panels = $panels.add($(image));
			});
			// @ts-ignore
			this.container = new PsycleContainer($(g));
			this.panels = new PsyclePanelList($panels);
			this.stage.el.appendChild(svg);
		},
		reflow: function (this: Psycle, info: IPsycleReflowInfo): void {
			switch (info.timing) {
				case PsycleReflowTiming.TRANSITION_END:
				case PsycleReflowTiming.RESIZE_END:
				case PsycleReflowTiming.LOAD: {
					if (this.config.resizable) {
						const rect = this.stage.el.getBoundingClientRect();
						const width = rect.width;
						let height = rect.height;
						if (originRect.width && originRect.height) {
							height = (originRect.height / originRect.width) * width;
							originRect.scale = width / originRect.width;
						} else {
							originRect.width = width;
							originRect.height = height;
						}
						// @ts-ignore
						const svg = this.container.$el.closest('svg')[0] as SVGSVGElement;
						svg.setAttribute('width', `${width}`);
						svg.setAttribute('height', `${height}`);
						this.panels.$el.attr({ width, height });
					}
					const to = this.panels.item(this.to);
					// 重ね順
					to.$el.appendTo(this.container.$el);
					// 不透明度
					to.$el.css({ opacity: 1 });
					break;
				}
				case PsycleReflowTiming.RESIZE_START: {
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
			const to = this.panels.item(this.to);
			const from = this.panels.item(this.from);
			if (this.animation) {
				this.animation.stop(false);
			}

			// 重ね順の更新
			to.$el.appendTo(this.container.$el);

			// フェード効果
			to.$el.css({ opacity: 0 });
			this.animation = $.Animation(
				to.$el[0],
				{
					opacity: 1,
				},
				{
					duration: this.config.duration,
				},
			);
			if (this.config.crossFade) {
				$.Animation(
					from.$el[0],
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
		after: () => {
			/* void */
		},
	},
});
