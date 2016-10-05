module psyborg {

	const originRect: {
		width: number;
		height: number;
		scale: number;
	} = {
		width: 0,
		height: 0,
		scale: 1
	};

	PsycleTransition.create({

		fadeSVG: {
			fallback: 'fade',
			fallbackFilter: function (): boolean {
				return !document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
			},
			init: function (): void {
				const self: Psycle = this;
				const width = self.getWidth();
				const height = self.getHeight();
				self.container.$el.hide();

				const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
				svg.setAttribute('width', `${width}`);
				svg.setAttribute('height', `${height}`);
				$(svg).css('display', 'block');

				const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
				svg.appendChild(g);

				let $panels = $();
				self.panels.each( (i: number, panel: PsyclePanel): void => {
					const imgSrc: string = panel.$el.find('img').attr('src');
					const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
					image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', imgSrc);
					image.setAttribute('width', `${width}`);
					image.setAttribute('height', `${height}`);
					image.setAttribute('visibility', 'visible');
					image.setAttribute('data-index', `${i}`);
					g.appendChild(image);
					$panels = $panels.add($(image));
				});
				self.container = new PsycleContainer($(g));
				self.panels = new PsyclePanelList($panels);
				self.stage.el.appendChild(svg);
			},
			reflow: function (info: IPsycleReflowInfo): void {
				const self: Psycle = this;
				switch (info.timing) {
					case PsycleReflowTiming.TRANSITION_END:
					case PsycleReflowTiming.RESIZE_END:
					case PsycleReflowTiming.LOAD: {
						if (self.config.resizable) {
							let { width, height } = self.stage.el.getBoundingClientRect();
							if (originRect.width && originRect.height) {
								height = originRect.height / originRect.width * width;
								originRect.scale = width / originRect.width;
							} else {
								originRect.width = width;
								originRect.height = height;
							}
							const svg: SVGSVGElement = <any> self.container.$el.closest('svg')[0];
							svg.setAttribute('width', `${width}`);
							svg.setAttribute('height', `${height}`);
							self.panels.$el.attr({ width, height });
						}
						const to = self.panels.item(self.to);
						// 重ね順
						to.$el.appendTo(self.container.$el);
						// 不透明度
						to.$el.css({ opacity: 1 });
						break;
					}
					case PsycleReflowTiming.RESIZE_START: {
						break;
					}
				}
			},
			silent: function (): void {},
			before: function (): void {},
			fire: function ():any {
				const self: Psycle = this;
				const to = self.panels.item(self.to);
				const from = self.panels.item(self.from);
				if (self.animation) {
					self.animation.stop();
				}

				// 重ね順の更新
				to.$el.appendTo(self.container.$el);

				// フェード効果
				to.$el.css({ opacity: 0 });
				self.animation = $.Animation(
					to.$el[0],
					{
						opacity: 1
					},
					{
						duration: self.config.duration
					}
				);
				if (self.config.crossFade) {
					$.Animation(
						from.$el[0],
						{
							opacity: 0
						},
						{
							duration: self.config.duration
						}
					);
				}
			},
			cancel: function (): void {},
			after: function (): void {}
		}

	});

}