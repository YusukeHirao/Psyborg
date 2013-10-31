PsycleTransition.create({

	slide: {
		init: function ():void {
			PsyborgCSS.posBase(this.stage.$el);
			PsyborgCSS.posAbs(this.container.$el);
			PsyborgCSS.posAbs(this.panels.$el);

			var $panel:JQuery = this.panels.$el;

			// 初期化時のインラインスタイルを保持
			$panel.data('originStyle', $panel.attr('style'));
		},
		reflow: function (info:IPsycleReflowInfo):void {

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

			var l:number = Math.floor((this.length + 2) / 2);
			var i:number = l * -1;

			this.panels.removeClone();

			var panel:PsyclePanel;
			var clone:PsyclePanelClone;
			for (; i <= l; i++) {
				panel = this.panels.item(i + this.index);
				if (0 <= i) {
					panel.show();
					panel.$el.css({ left:<number> this.panelWidth * i });
				} else {
					clone = panel.clone();
					clone.show()
					clone.$el.css({ left:<number> this.panelWidth * i });
				}
			}

		},
		silent: function ():void {
			this.container.$el.css({
				left:<number> 0
			});
			this.panels.hide();
		},
		before: function ():void {
		},
		fire: function ():any {
			console.log(this.animation);
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