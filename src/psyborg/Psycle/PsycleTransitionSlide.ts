module psyborg {

	PsycleTransition.create({

		slide: {
			init: function ():void {
				// スタイルを設定
				StyleSheet.posBase(this.stage.$el);
				StyleSheet.posAbs(this.container.$el);
				StyleSheet.posAbs(this.panels.$el);
				var $panel:JQuery = this.panels.$el;
				// 初期化時のインラインスタイルを保持
				StyleSheet.saveCSS($panel);
				var isDragging:boolean = false;
				var isSwiping:boolean = false;
				var dragStartPsycleLeft:number;
				var dragStartTimestamp:number;
				var $touchable:JQuery;
				var distance:number;
				var currentIndex:number;
				var newIndex:number;
				if (this._config.draggable) {
					$touchable = this.stage.$el.hammer({
						drag_block_horizontal: true,
						tap_always: false,
						swipe_velocity: 0.1 // Swipeの反応する距離
					});
					// stop "drag & select" events for draggable elements
					$touchable.find('a, img').hammer({
						drag_block_horizontal: true,
						tap_always: false
					});
					// aタグを含む場合、クリックイベントを抑制してtapイベントに任せる
					this.panels.each((i:number, panel:PsyclePanel) => {
						var href:string;
						var target:string;
						var $panel:JQuery = panel.$el.hammer();
						var $a:JQuery = $panel.find('a');
						if ($a.length) {
							$a.on('click', (e:JQueryEventObject) => {
								e.preventDefault();
							});
							href = $a.prop('href');
							target = $a.prop('target');
							$panel.on('tap', () => {
								if (href) {
									Window.linkTo(href, target);
								}
							});
						}
					});
					$touchable.on('tap dragstart drag dragend', (e:JQueryHammerEventObject) => {
						switch (e.type) {
							case 'tap': (() => {
								isDragging = false;
							})();
							break;
							case 'dragstart': (() => {
								// ドラッグ開始時のパネルの位置
								dragStartPsycleLeft = this.container.$el.position().left;
								// 現在のインデックス番号
								currentIndex = this.index;
							})();
							break;
							case 'drag': (() => {
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
							})();
							break;
							case 'dragend': (() => {
								var x:number = e.gesture.deltaX;
								var pWidth:number = this.panelWidth;
								var panelX = dragStartPsycleLeft + x;
								var distDistance:number = this.panelWidth % distance;
								var speed:number = Util.getSpeed(this.panelWidth, this._duration);
								// AREA_FACTORが2なら1/4移動させただけで次の領域に移る
								// AREA_FACTORが0.5なら3/4まで移動させないと移らない
								// 現段階では固定値としておく
								var AREA_FACTOR:number = 2;
								var newIndex:number = this.index - Math.round((panelX * AREA_FACTOR) / pWidth);
								var direction:number = 0 < x ? -1 : 1;
								if (newIndex === this.index) {
									direction = 0;
								}
								// console.log({
								// 	x: x,
								// 	pWidth: pWidth,
								// 	panelX: panelX,
								// 	speed: speed
								// });
								console.log({
									newIndex: newIndex,
									curIndex: this.index,
									direction: direction
								});
								if (!isSwiping) {
									/**
									* swipeイベントが発火していた場合は処理をしない。
									* イベントは dragstart → drag → swipe → dragend の順番に発火する
									*/
									this._before();
									this._transitionTo(newIndex, Util.getDuration(distDistance, speed), direction);
								}
								isSwiping = false;
								isDragging = false;
								this.isTransition = false;
							})();
							break;
						}
					});
					if (this._config.swipeable) {
						$touchable = this.stage.$el.hammer({
							drag_block_vertical:<boolean> this._config.dragBlockVertical
						});
						$touchable.on('dragstart', (e:JQueryHammerEventObject) => {
							dragStartTimestamp = e.timeStamp;
						});
						$touchable.on('swipeleft', (e:JQueryHammerEventObject) => {
							var swipeDuration:number = e.timeStamp - dragStartTimestamp;
							if (!this.isLast()) {
								isSwiping = true;
								this.stop();
								this.next(swipeDuration, +1);
							}
						});
						$touchable.on('swiperight', (e:JQueryHammerEventObject) => {
							var swipeDuration:number = e.timeStamp - dragStartTimestamp;
							if (!this.isFirst()) {
								isSwiping = true;
								this.stop();
								this.prev(swipeDuration, -1);
							}
						});
					}
				}
			},
			reflow: function (info:IPsycleReflowInfo):void {
				switch (info.timing) {
					case PsycleReflowTiming.TRANSITION_END:
					case PsycleReflowTiming.RESIZE_START:
					case PsycleReflowTiming.RESIZE_END:
					case PsycleReflowTiming.LOAD: (() => {
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
						StyleSheet.restoreCSS($panel);
						// 初期化時のスタイルの状態で幅を取得
						this.panelWidth = $panel.outerWidth(true);
						// 取得した幅を設定
						$panel.width(this.panelWidth);
						this.stageWidth = this.stage.$el.width();
						if (this._config.resizable) {
							this.stage.setHeight(this.panels.getHeight());
						}
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
					})();
					break;
				}
			},
			silent: function ():void {},
			before: function ():void {},
			fire: function ():any {
				var distination:number;
				var duration:number = this._duration || this._config.duration;
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

}