module psyborg {

	class Draggable {

		public isDragging: boolean = false;
		public isSwiping: boolean = false;
		public dragStartPsycleLeftPosition: number;
		public dragStartTimestamp: number;
		public distance:number;
		public currentIndex:number;
		public newIndex:number;

		public $el: JQuery;
		public psycle: Psycle;
		public config: IPsycleConfig;

		constructor ($el: JQuery, psycle: Psycle, config: IPsycleConfig) {

			this.$el = $el.hammer({
				drag_block_horizontal: true,
				tap_always: false,
				swipe_velocity: 0.1 // Swipeの反応する距離
			});

			this.psycle = psycle;
			this.config = config;

			// stop "drag & select" events for draggable elements
			this.$el.find('a, img').hammer({
				drag_block_horizontal: true,
				tap_always: false
			});

			psycle.panels.each( (i: number, panel: PsyclePanel): void => {
				var href:string;
				var target:string;
				var $panel: JQuery = panel.$el.hammer();
				var $a: JQuery = $panel.find('a');
				if ($a.length) {
					$a.on('click', (e: JQueryEventObject): void => {
						e.preventDefault();
					});
					href = $a.prop('href');
					target = $a.prop('target');
					if (href) {
						$panel.on('tap', (): void => {
							Window.linkTo(href, target);
						});
					}
				}
			});

			this.$el.on('tap dragstart drag dragend swipeleft swiperight', (e:JQueryHammerEventObject): void => {
				switch (e.type) {
					case 'tap':
						this._tap();
						break;
					case 'dragstart':
						this._dragstart(e);
						break;
					case 'drag':
						this._drag(e);
						break;
					case 'dragend':
						this._dragend(e);
						break;
					case 'swipeleft':
						this._swipeleft(e);
						break;
					case 'swiperight':
						this._swiperight(e);
						break;
				}
			});

		}

		private _tap (): void {
			this.isDragging = false;
		}

		private _dragstart (e: JQueryHammerEventObject): void {
			// ドラッグ開始時のタイムスタンプ
			this.dragStartTimestamp = e.timeStamp;
			// パネルの動きをその位置で停止する
			this.psycle.freeze();
			// ドラッグ開始時のコンテナの位置
			this.dragStartPsycleLeftPosition = this.psycle.container.$el.position().left;
			// 現在のインデックス番号
			this.currentIndex = this.psycle.index;
		}

		private _drag (e: JQueryHammerEventObject): void {
			// ドラッグ開始からの移動距離
			var x: number = e.gesture.deltaX;
			// コンテナの位置
			var panelX: number = this.dragStartPsycleLeftPosition + x;

			this.isDragging = true;

			this.psycle.container.$el.css({
				left: <number> panelX
			});

		}

		private _dragend (e: JQueryHammerEventObject): void {
			var BUFFER_DIST_RATIO: number = 0.25;

			var x: number = e.gesture.deltaX;
			var pWidth: number = this.psycle.panelWidth;
			var panelX: number = this.dragStartPsycleLeftPosition + x;

			var cloneLength: number = this.psycle.cloneCount * this.psycle.length;
			var cloneWidth: number = cloneLength * pWidth;

			// 移動領域の余裕
			var bufferDist: number = pWidth * BUFFER_DIST_RATIO;

			// インデックス基準の相対位置
			var indexicalPosRatio: number = (panelX / pWidth) * -1;
			var indexicalPosRatioReal: number = indexicalPosRatio;
			if (this.psycle.repeat === PsycleRepeat.LOOP) {
				indexicalPosRatio -= cloneLength;
			}
			var ratioX: number = indexicalPosRatio - this.psycle.index;

			// バッファ距離からのインデックス基準の相対位置
			var distIndexicalPosRatio: number = 0;

			// →方向
			if (0 < ratioX) {
				if (BUFFER_DIST_RATIO < ratioX) {
					distIndexicalPosRatio = indexicalPosRatio - BUFFER_DIST_RATIO;
				} else {
					distIndexicalPosRatio = this.psycle.index;
				}
			// ←方向
			} else if (ratioX < 0) {
				if (ratioX < BUFFER_DIST_RATIO * -1) {
					distIndexicalPosRatio = indexicalPosRatio - BUFFER_DIST_RATIO;
				} else {
					distIndexicalPosRatio = this.psycle.index;
				}
			// 移動なし
			} else {
				return;
			}

			// 目的のインデックスまでのパネル数
			var vector: number = Util.roundUp(distIndexicalPosRatio - this.psycle.index);

			// 目的のインデックスの位置
			var disPos: number = vector * pWidth;

			// 目的のインデックスまでの距離
			var distance: number = Math.abs((disPos - cloneWidth) - panelX);

			// 距離の変化による移動時間の再計算
			var speed: number = Util.getSpeed(distance, this.config.duration);
			var duration: number = Util.getDuration(distance, speed);

			// 目的のインデックス
			var to: number = this.psycle.index + vector;

			if (!this.isSwiping) {
				// swipeイベントが発火していた場合は処理をしない。
				// イベントは dragstart → drag → swipe → dragend の順番に発火する
				this.psycle.transitionTo(to, duration, null, vector);
			}

			this.isSwiping = false;
			this.isDragging = false;
			this.psycle.isTransition = false;

		}

		private _swipeleft (e: JQueryHammerEventObject): void {
			var swipeDuration: number = e.timeStamp - this.dragStartTimestamp;
			if (this.config.swipeable) {
				this.isSwiping = true;
				this.psycle.stop();
				this.psycle.next(swipeDuration);
			}
		}

		private _swiperight (e: JQueryHammerEventObject): void {
			var swipeDuration: number = e.timeStamp - this.dragStartTimestamp;
			if (this.config.swipeable) {
				this.isSwiping = true;
				this.psycle.stop();
				this.psycle.prev(swipeDuration);
			}
		}

	}

	PsycleTransition.create({

		slide: <IPsycleTransitionProcess> {
			init: <Function> function (): void {
				// スタイルを設定
				StyleSheet.posBase(this.stage.$el);
				StyleSheet.posAbs(this.container.$el);
				StyleSheet.posBase(this.panels.$el);
				StyleSheet.floating(this.panels.$el);
				var $panel: JQuery = this.panels.$el;
				// 初期化時のインラインスタイルを保持
				if (this._config.draggable) {
					new Draggable(this.stage.$el, this, this._config);
				}
			},
			reflow: <Function> function (info: IPsycleReflowInfo): void {
				var distination: number;
				var containerWidth: number;
				var distination: number;
				var stageWidthRatio: number;
				var addtionalCloneCount: number = 0;
				var i: number = 0;
				var l: number;
				var $panel: JQuery;
				switch (info.timing) {
					case PsycleReflowTiming.TRANSITION_END:
						distination = this.panelWidth * this.index * -1 + (this.cloneCount * this.panelWidth * this.length * -1);
						this.container.$el.css({
							left: <number> distination
						});
						break;
					case PsycleReflowTiming.INIT:
					case PsycleReflowTiming.LOAD:
					case PsycleReflowTiming.RESIZE_START:
					case PsycleReflowTiming.RESIZE_END:
						$panel = this.panels.$el;
						/**
						* 直接幅を設定してしまうとインラインCSSで設定されるので
						* 次回取得時にその幅しか取得できない。
						* 固定の場合は問題ないが相対値の場合は問題となるので
						* 初期化時のインラインスタイルに戻すことで
						* 常にオリジナルの幅を取得できるようになる。
						*/
						// 初期化時のスタイルに戻す
						StyleSheet.restoreCSS($panel);
						// ステージ・パネル 各幅を取得
						this.panelWidth = $panel.outerWidth(true); // 初期化時のスタイルの状態で幅を取得
						this.stageWidth = this.stage.$el.width();
						// 取得した幅を設定
						$panel.width(this.panelWidth);
						// コンテナの幅を計算
						containerWidth = this.panelWidth * this.length;
						// ループの時の処理
						if (this.repeat === PsycleRepeat.LOOP) {
							/*
							 * ステージがコンテナに対して何倍大きいか
							 *
							 * ステージがコンテナの0倍から2倍まではパネルは3つにする 前後に1ずつクローンパネルをappendする
							 * ステージがコンテナの2倍から3倍まではパネルは5つにする 前後に2ずつクローンパネルをappendする
							 * ステージがコンテナの3倍から5倍まではパネルは7つにする 前後に3ずつクローンパネルをappendする
							 * ステージがコンテナの5倍から7倍まではパネルは8つにする 前後に4ずつクローンパネルをappendする
							 * ステージがコンテナの7倍から9倍まではパネルは11つにする 前後に5ずつクローンパネルをappendする
							 *  ・
							 *  ・
							 *  ・
							 *
							 */
							stageWidthRatio = this.stageWidth / containerWidth;
							addtionalCloneCount = Math.ceil(stageWidthRatio / 2) + 1;
							// クローン数が多くなった時に以下実行
							if (this.cloneCount < addtionalCloneCount) {
								// クローンを前方後方に生成追加
								this.panels.removeClone();
								this.panels.cloneBefore(addtionalCloneCount);
								this.panels.cloneAfter(addtionalCloneCount);
								// クローンの数を更新
								this.cloneCount = addtionalCloneCount;
							}
						}
						// クローンを作った分幅を再計算して広げる
						containerWidth = this.panelWidth * this.length * (this.cloneCount * 2 + 1);

						// コンテナの位置を計算
						distination = this.panelWidth * this.index * -1+ (this.cloneCount * this.panelWidth * this.length * -1);
						// コンテナの計算値を反映
						this.container.$el.css({
							width: <number> containerWidth,
							left: <number> distination
						});
						// ステージの高さの再計算
						if (this._config.resizable) {
							this.stage.setHeight(this.panels.getHeight());
						}
						break;
				}
			},
			silent: <Function> function (): void {},
			before: <Function> function (): void {},
			fire: <Function> function (): any {
				var distination: number;
				var duration: number = this.duration || this._config.duration;
				if (this.animation) {
					this.animation.stop();
				}
				distination = this.panelWidth * (this.index + this.vector) * -1 + (this.cloneCount * this.panelWidth * this.length * -1);
				this.animation = $.Animation(
					this.container.$el[0],
					{
						left: <number> distination
					},
					{
						duration: <number> duration,
						easing: <string> this._config.easing
					}
				);
			},
			cancel: <Function> function (): void {},
			after: <Function> function (): void {}
		}

	});

}