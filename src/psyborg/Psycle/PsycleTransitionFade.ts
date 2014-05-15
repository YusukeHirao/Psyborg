module psyborg {

	PsycleTransition.create({

		fade: {
			init: function ():void {
				// スタイルを設定
				// StyleSheet.posBase(this.stage.$el);
				StyleSheet.posBase(this.container.$el);
				StyleSheet.posAbs(this.panels.$el);
				// 初期化時のインラインスタイルを保持
				// var $panel:JQuery = this.panels.$el;
				// $panel.data('originStyle', $panel.attr('style'));
			},
			reflow: function (info:IPsycleReflowInfo):void {
				switch (info.timing) {
					case PsycleReflowTiming.TRANSITION_END:
					case PsycleReflowTiming.RESIZE_START:
					case PsycleReflowTiming.RESIZE_END:
					case PsycleReflowTiming.LOAD:
						if (this._config.resizable) {
							this.stage.$el.height(this.panels.$el.height());
						}
						StyleSheet.z(this.panels.$el, 0);
						StyleSheet.z(this.panels.item(this.to).$el, 10);
						break;
				}
			},
			silent: function ():void {},
			before: function ():void {},
			fire: function ():any {
				this.panels.item(this.to).$el.css({ opacity:<number> 0 });
				StyleSheet.z(this.panels.item(this.to).$el, 20);
				if (this.animation) {
					this.animation.stop();
				}
				this.animation = $.Animation(
					this.panels.item(this.to).$el[0],
					{
						opacity:<number> 1
					},
					{
						duration:<number> this._config.duration
					}
				);
			},
			cancel: function ():void {},
			after: function ():void {}
		}

	});

}