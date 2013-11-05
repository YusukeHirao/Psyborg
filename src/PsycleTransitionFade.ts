// 未実装

// PsycleTransition.create({

// 	fade: {
// 		init: function ():void {
// 			// スタイルを設定
// 			PsyborgCSS.posBase(this.stage.$el);
// 			PsyborgCSS.posAbs(this.container.$el);
// 			PsyborgCSS.posAbs(this.panels.$el);
// 			// 初期化時のインラインスタイルを保持
// 			// var $panel:JQuery = this.panels.$el;
// 			// $panel.data('originStyle', $panel.attr('style'));
// 		},
// 		reflow: function (info:IPsycleReflowInfo):void {
// 			switch (info.timing) {
// 				case PsycleReflowTiming.TRANSITION_END:
// 				case PsycleReflowTiming.RESIZE_START:
// 				case PsycleReflowTiming.RESIZE_END:
// 					console.log(this.panels);
// 					PsyborgCSS.z(this.panels.$el, 0);
// 					PsyborgCSS.z(this.panels.item(this.to).$el, 10);
// 					break;
// 			}
// 		},
// 		silent: function ():void {},
// 		before: function ():void {
// 			this.panels.item(this.to).$el.css({ opacity:<number> 0 });
// 		},
// 		fire: function ():any {
// 			if (this.animation) {
// 				this.animation.stop();
// 			}
// 			this.animation = $.Animation(
// 				this.panels.item(this.to).$el[0],
// 				{
// 					opacity:<number> 1
// 				},
// 				{
// 					duration:<number> this._config.duration
// 				}
// 			);
// 		},
// 		cancel: function ():void {},
// 		after: function ():void {}
// 	}

// });