module psyborg {

	PsycleTransition.create({

		fade: {
			init: function (): void {
				const self: Psycle = this;
				// スタイルを設定
				StyleSheet.posBase(self.container.$el);
				StyleSheet.posAbs(self.panels.$el);
			},
			reflow: function (info: IPsycleReflowInfo): void {
				const self: Psycle = this;
				switch (info.timing) {
					case PsycleReflowTiming.TRANSITION_END:
					case PsycleReflowTiming.RESIZE_START:
					case PsycleReflowTiming.RESIZE_END:
					case PsycleReflowTiming.LOAD: {
						if (self.config.resizable) {
							self.stage.$el.height(self.panels.$el.height());
						}
						StyleSheet.z(self.panels.$el, 0);
						StyleSheet.z(self.panels.item(self.to).$el, 10);
						self.panels.$el.css({ opacity: 0 });
						self.panels.item(self.to).$el.css({ opacity: 1 });
						break;
					}
				}
			},
			silent: function (): void {},
			before: function (): void {},
			fire: function ():any {
				const self: Psycle = this;
				self.panels.item(self.to).$el.css({ opacity: 0 });
				StyleSheet.z(self.panels.item(self.to).$el, 20);
				if (self.animation) {
					self.animation.stop();
				}
				self.animation = $.Animation(
					self.panels.item(self.to).$el[0],
					{
						opacity: 1
					},
					{
						duration: self.config.duration
					}
				);
				$.Animation(
					self.panels.item(self.from).$el[0],
					{
						opacity: 0
					},
					{
						duration: self.config.duration
					}
				);
			},
			cancel: function (): void {},
			after: function (): void {
				const self: Psycle = this;
				self.panels.$el.css({ opacity: 0 });
				self.panels.item(self.to).$el.css({ opacity: 1 });
			}
		}

	});

}