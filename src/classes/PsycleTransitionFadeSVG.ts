import { IPsycleReflowInfo } from './IPsycleReflowInfo';

import StyleSheet from './StyleSheet';

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
			return !document.implementation.hasFeature;
		},
		init (psycle: Psycle) {
			const width = psycle.getWidth();
			const height = psycle.getHeight();
			psycle.container.$el.hide();

			const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			svg.setAttribute('width', `${width}`);
			svg.setAttribute('height', `${height}`);
			$(svg).css('display', 'block');

			const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
			svg.appendChild(g);

			let $panels = $();
			psycle.panels.each( (i: number, panel: PsyclePanel) => {
				const imgSrc = panel.$el.find('img').attr('src');
				if (!imgSrc) {
					return;
				}
				const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
				image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', imgSrc);
				image.setAttribute('width', `${width}`);
				image.setAttribute('height', `${height}`);
				image.setAttribute('visibility', 'visible');
				image.setAttribute('data-index', `${i}`);
				g.appendChild(image);
				$panels = $panels.add($(image));
			});
			psycle.container = new PsycleContainer($(g));
			psycle.panels = new PsyclePanelList($panels);
			psycle.stage.el.appendChild(svg);
		},
		reflow (psycle: Psycle, info: IPsycleReflowInfo) {
			const self: Psycle = psycle;
			switch (info.timing) {
				case PsycleReflowTiming.TRANSITION_END:
				case PsycleReflowTiming.RESIZE_END:
				case PsycleReflowTiming.LOAD: {
					if (psycle.config.resizable) {
						const rect = psycle.stage.el.getBoundingClientRect();
						const width = rect.width;
						let height = rect.height;
						if (originRect.width && originRect.height) {
							height = originRect.height / originRect.width * width;
							originRect.scale = width / originRect.width;
						} else {
							originRect.width = width;
							originRect.height = height;
						}
						const svg = (psycle.container.$el as JQuery<Element>).closest('svg')[0] as SVGSVGElement;
						svg.setAttribute('width', `${width}`);
						svg.setAttribute('height', `${height}`);
						psycle.panels.$el.attr({ width, height });
					}
					const to = psycle.panels.item(psycle.to);
					// 重ね順
					to.$el.appendTo(psycle.container.$el);
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
		silent: () => { /* void */ },
		before: () => { /* void */ },
		fire (psycle: Psycle) {
			const to = psycle.panels.item(psycle.to);
			const from = psycle.panels.item(psycle.from);
			if (psycle.animation) {
				psycle.animation.stop();
			}

			// 重ね順の更新
			to.$el.appendTo(psycle.container.$el);

			// フェード効果
			to.$el.css({ opacity: 0 });
			psycle.animation = to.$el.animate(
				{
					opacity: 1,
				},
				{
					duration: psycle.config.duration,
				},
			);
			if (psycle.config.crossFade) {
				from.$el.animate(
					{
						opacity: 0,
					},
					{
						duration: psycle.config.duration,
					},
				);
			}
		},
		cancel: () => { /* void */ },
		after: () => { /* void */ },
	},
});
