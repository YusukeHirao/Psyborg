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
			var isDragging:boolean;
			var dragStartPsycleLeft:number;
			var $touchable:JQuery;
			var distance:number;
			var currentIndex:number;
			var newIndex:number;
			if (this._config.draggable) {
				isDragging = false;
				$touchable = this.stage.$el.hammer({
					// drag_block_vertical:<boolean> this._config.dragBlockVertical,
					drag_block_horizontal: true,
					tap_always: false
				});
				// stop "drag & select" events for draggable elements
				$touchable.find('a, img').hammer({
					drag_block_horizontal: true,
					tap_always: false
				});
				$touchable.on('tap dragstart drag dragend', (e:JQueryHammerEventObject) => {
					switch (e.type) {
						case 'tap': () => {
							isDragging = false;
						}();
						break;
						case 'dragstart': () => {
							// ドラッグ開始時のパネルの位置
							dragStartPsycleLeft = this.container.$el.position().left;
							// 現在のインデックス番号
							currentIndex = this.index;
						}();
						break;
						case 'drag': () => {
							// ドラッグ開始からの移動距離
							var x:number = e.gesture.deltaX;
							// 現在のインデックス番号
							var index:number = currentIndex;
							// パネルの位置
							var panelX = dragStartPsycleLeft + x;
							this.freeze();
							isDragging = true;
							this.container.$el.css({
								left:<number> panelX
							});
						}();
						break;
						case 'dragend': () => {
							var x:number = e.gesture.deltaX;
							var panelX = dragStartPsycleLeft + x;
							var distDistance:number = this.panelWidth % distance;
							var speed:number = PsyborgUtil.getSpeed(this.panelWidth, this._duration);
							var newIndex:number = Math.round(panelX / this.panelWidth) * -1 + this.index;
							var dev:number = panelX % this.panelWidth;
							this.setIndex(newIndex, true, true);
							this._before();
							this._transitionTo(newIndex, PsyborgUtil.getDuration(distDistance, speed));
							isDragging = false;
							this.isTransition = false;
						}();
						break;
					}
				});
				// $touchable.find('a').on('click', (e) => {
				// 	if (isDragging) {
				// 		e.preventDefault();
				// 		isDragging = false;
				// 	}
				// });
			}
			if (this._config.swipeable) {
				$touchable = this.stage.$el.hammer({
					drag_block_vertical:<boolean> this._config.dragBlockVertical
				});
				$touchable.on('swipeleft', (e:JQueryHammerEventObject) => {
					this.stop();
					this.next();
				});
				$touchable.on('swiperight', (e:JQueryHammerEventObject) => {
					this.stop();
					this.prev();
				});
			}
		},
		reflow: function (info:IPsycleReflowInfo):void {
			switch (info.timing) {
				case PsycleReflowTiming.TRANSITION_END:
				case PsycleReflowTiming.RESIZE_START:
				case PsycleReflowTiming.RESIZE_END: () => {
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
				}();
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