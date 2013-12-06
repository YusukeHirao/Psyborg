PsycleTransition.create({

	slide: {
		init: function ():void {
			// スタイルを設定
			PsyborgCSS.posBase(this.stage.$el);
			PsyborgCSS.posAbs(this.container.$el);
			PsyborgCSS.posAbs(this.panels.$el);
			// 初期化時のインラインスタイルを保持
			var $panel:JQuery = this.panels.$el;
			PsyborgCSS.saveCSS($panel);
			// var isDragging:boolean;
			// var dragStartPsycleLeft:number;
			var $touchable:JQuery;
			// var distance:number;
			// var currentIndex:number;
			// var newIndex:number;
			// if (this._config.draggable || this._config.swipeable) {
			// 	isDragging = false;
			// 	$touchable = this.stage.$el.hammer({
			// 		drag_block_vertical:<boolean> true
			// 	});
			// 	// stop "drag & select" events for draggable elements
			// 	$touchable.find('a, img').hammer();
			// 	$touchable.on('tap dragstart drag dragend', (e:JQueryHammerEventObject) => {
			// 		switch (e.type) {
			// 			case 'tap':
			// 				isDragging = false;
			// 				break;
			// 			case 'dragstart':
			// 				dragStartPsycleLeft = this.container.$el.position().left;
			// 				currentIndex = this.index;
			// 			case 'drag':
			// 				this.freeze();
			// 				isDragging = true;
			// 				distance = (dragStartPsycleLeft + e.gesture.deltaX) % (this.panelWidth * this.length) - (this.panelWidth * this.length);
			// 				var vector:number = Math.floor(distance / this.panelWidth) * -1;
			// 				newIndex = this._optimizeCounter(currentIndex + vector - 1);
			// 				this.setIndex(newIndex);
			// 				this.container.$el.css({
			// 					left:<number> distance
			// 				});
			// 				this.reflow({ distance: (distance) % this.panelWidth });
			// 				break;
			// 			case 'dragend':
			// 				var distDistance:number = this.panelWidth % distance;
			// 				var speed:number = PsyborgUtil.getSpeed(this.panelWidth, this._duration);
			// 				this.isTransition = false;
			// 				this.next(PsyborgUtil.getDuration(distDistance, speed));
			// 				break;
			// 		}
			// 	});
			// 	$touchable.find('a').on('click', (e) => {
			// 		if (isDragging) {
			// 			e.preventDefault();
			// 			isDragging = false;
			// 		}
			// 	});
			// }
			if (this._config.swipeable) {
				$touchable = this.stage.$el.hammer({
					drag_block_vertical:<boolean> true
				});
				$touchable.on('swipeleft', (e:JQueryHammerEventObject) => {
					this.next();
				});
				$touchable.on('swiperight', (e:JQueryHammerEventObject) => {
					this.prev();
				});
			}
		},
		reflow: function (info:IPsycleReflowInfo):void {
			switch (info.timing) {
				case PsycleReflowTiming.TRANSITION_END:
				case PsycleReflowTiming.RESIZE_START:
				case PsycleReflowTiming.RESIZE_END:
				case PsycleReflowTiming.REFLOW_METHOD:
					var offset:number = 0;
					if (info.timing === PsycleReflowTiming.REFLOW_METHOD) {
						offset = info.data.distance;
					}
					this.container.$el.css({
						left:<number> 0 + offset
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
					PsyborgCSS.restoreCSS($panel);
					// 初期化時のスタイルの状態で幅を取得
					this.panelWidth = $panel.outerWidth(true);
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
								cloneBefore = panel.clone();
								cloneBefore.show();
								cloneBefore.$el.css({ left:<number> this.panelWidth * (i - this.length * i2)});
								cloneAfter = panel.clone();
								cloneAfter.show();
								cloneAfter.$el.css({ left:<number> this.panelWidth * (i + this.length * i2)});
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
			var duration:number = this._duration || this._config.duration;
			var distination:number;
			if (this.animation) {
				this.animation.stop();
			}
			distination = this.panelWidth * -1 * this.vector;
			this.animation = $.Animation(
				this.container.$el[0],
				{
					left:<number> distination
				},
				{
					duration:<number> duration,
					easing:<string> this._config.easing
				}
			);
		},
		cancel: function ():void {},
		after: function ():void {}
	}

});