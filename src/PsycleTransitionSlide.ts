PsycleTransition.create({

	slide: {
		init: function ():void {
			// スタイルを設定
			PsyborgCSS.posBase(this.stage.$el);
			PsyborgCSS.posAbs(this.container.$el);
			PsyborgCSS.posAbs(this.panels.$el);
			// 初期化時のインラインスタイルを保持
			var $panel:JQuery = this.panels.$el;
			$panel.data('originStyle', $panel.attr('style'));
		},
		reflow: function (info:IPsycleReflowInfo):void {
			switch (info.timing) {
				case PsycleReflowTiming.TRANSITION_END:
				case PsycleReflowTiming.RESIZE_START:
				case PsycleReflowTiming.RESIZE_END:
					this.container.$el.css({
						left:<number> 0
					});
					this.panels.hide();
					var $panel:JQuery = this.panels.$el;
					/**
					* 直接幅を設定してしまうとインラインCSSで設定されるので
					* 次回取得時にその幅しか取得できない。
					* 固定の場合は問題ないが相対値の場合は問題となるので
					* 初期化時のインラインスタイルに戻すことで
					* 常にオリジナルの幅を取得できるようになる。
					*/
					// 初期化時のスタイルに戻る
					$panel.attr('style', $panel.data('originStyle'));
					// 初期化時のスタイルの状態で幅を取得
					this.panelWidth = $panel.width();
					// 取得した幅を設定
					$panel.width(this.panelWidth);
					this.stageWidth = this.stage.$el.width();
					var i:number = 0;
					var l:number = this.length;
					this.panels.removeClone();
					var panel:PsyclePanel;
					var cloneBefore:PsyclePanelClone;
					var cloneAfter:PsyclePanelClone;
					var i2:number;
					var l2:number = this._config.clone;
					for (; i < l; i++) {
						panel = this.panels.item(i + this.index);
						panel.show();
						if (this.repeat === PsycleRepeat.LOOP) {
							panel.$el.css({ left:<number> this.panelWidth * i });
							i2 = 1;
							for (; i2 < l2; i2++) {
								// cloneBefore = panel.clone();
								// cloneBefore.show();
								// cloneBefore.$el.css({ left:<number> this.panelWidth * (i - this.length * i2)});
								// cloneBefore.$el.addClass('__BEFORE__');
								// if (i2 !== 1) {
								cloneAfter = panel.clone();
								cloneAfter.show();
								cloneAfter.$el.css({ left:<number> this.panelWidth * (i + this.length * i2)});
								cloneAfter.$el.addClass('__AFTER__');
								// }
							}
						} else {
							if (this.index <= panel.index) {
								panel.$el.css({ left:<number> this.panelWidth * i });
							} else {
								panel.$el.css({ left:<number> this.panelWidth * (i - this.length) });
							}
						}
					}
					break;
			}
		},
		silent: function ():void {},
		before: function ():void {},
		fire: function ():any {
			if (this.animation) {
				this.animation.stop();
			}
			this.animation = $.Animation(
				this.container.$el[0],
				{
					left:<number> this.panelWidth * -1 * this.vector
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