import { IPsycleConfig } from './IPsycleConfig';
import { IPsycleReflowInfo } from './IPsycleReflowInfo';
import { IPsycleTransitionProcess } from './IPsycleTransitionProcess';

import StyleSheet from '../StyleSheet';
import Util from '../Util';
import Window from '../Window';

import Psycle from './Psycle';
import PsycleContainer from './PsycleContainer';
import PsyclePanel from './PsyclePanel';
import PsyclePanelList from './PsyclePanelList';
import PsycleReflowTiming from './PsycleReflowTiming';
import PsycleRepeat from './PsycleRepeat';
import PsycleTransition from './PsycleTransition';

// tslint:disable-next-line:interface-name
interface JQueryHammerEventObject extends JQueryEventObject {
	gesture: {
		deltaX: number;
	};
}

class Draggable {

	public isDragging = false;
	public isSwiping = false;
	public dragStartPsycleLeftPosition: number;
	public dragStartTimestamp: number;
	public distance: number;
	public currentIndex: number;
	public newIndex: number;

	public $el: JQuery;
	public psycle: Psycle;
	public config: IPsycleConfig;

	constructor ($el: JQuery, psycle: Psycle, config: IPsycleConfig) {

		this.$el = $el.hammer({
			drag_block_horizontal: true,
			tap_always: false,
			swipe_velocity: 0.1, // Swipeの反応する距離
		});

		this.psycle = psycle;
		this.config = config;

		// stop "drag & select" events for draggable elements
		this.$el.find('a, img').hammer({
			drag_block_horizontal: true,
			tap_always: false,
		});

		psycle.panels.each( (i: number, panel: PsyclePanel): void => {
			const $panel: JQuery = panel.$el.hammer();
			const $a: JQuery = $panel.find('a');
			if ($a.length) {
				$a.on('click', (e: JQueryEventObject): void => {
					e.preventDefault();
				});
				const href: string = $a.prop('href');
				const target: string = $a.prop('target');
				if (href) {
					$panel.on('tap', (): void => {
						Window.linkTo(href, target);
					});
				}
			}
		});

		this.$el.on('tap dragstart drag dragend swipeleft swiperight', (e: JQueryHammerEventObject): void => {
			switch (e.type) {
				case 'tap': {
					this._tap();
					break;
				}
				case 'dragstart': {
					this._dragstart(e);
					break;
				}
				case 'drag': {
					this._drag(e);
					break;
				}
				case 'dragend': {
					this._dragend(e);
					break;
				}
				case 'swipeleft': {
					this._swipeleft(e);
					break;
				}
				case 'swiperight': {
					this._swiperight(e);
					break;
				}
				default:
					// void
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
		const x: number = e.gesture.deltaX;
		// コンテナの位置
		const panelX: number = this.dragStartPsycleLeftPosition + x;

		this.isDragging = true;

		this.psycle.container.$el.css({
			left: panelX,
		});

	}

	private _dragend (e: JQueryHammerEventObject): void {
		const BUFFER_DIST_RATIO = 0.25;

		const x: number = e.gesture.deltaX;
		const pWidth: number = this.psycle.panelWidth;
		const panelX: number = this.dragStartPsycleLeftPosition + x;

		const cloneLength: number = this.psycle.cloneCount * this.psycle.length;
		const cloneWidth: number = cloneLength * pWidth;

		// 移動領域の余裕
		const bufferDist: number = pWidth * BUFFER_DIST_RATIO;

		// インデックス基準の相対位置
		let indexicalPosRatio: number = (panelX / pWidth) * -1;
		const indexicalPosRatioReal: number = indexicalPosRatio;
		if (this.psycle.repeat === PsycleRepeat.LOOP) {
			indexicalPosRatio -= cloneLength;
		}
		const ratioX: number = indexicalPosRatio - this.psycle.index;

		// バッファ距離からのインデックス基準の相対位置
		let distIndexicalPosRatio = 0;

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
		const vector: number = Util.roundUp(distIndexicalPosRatio - this.psycle.index);

		// 目的のインデックスの位置
		const disPos: number = vector * pWidth;

		// 目的のインデックスまでの距離
		const distance: number = Math.abs((disPos - cloneWidth) - panelX);

		const direction: number = (distance === 0 ? 0 : vector > 0 ? 1 : -1) * -1;

		// 距離の変化による移動時間の再計算
		const speed: number = Util.getSpeed(distance, this.config.duration);
		const duration: number = Util.getDuration(distance, speed);

		// 目的のインデックス
		const to: number = this.psycle.index + vector;

		if (!this.isSwiping && distance !== 0) {
			// swipeイベントが発火していた場合は処理をしない。
			// イベントは dragstart → drag → swipe → dragend の順番に発火する
			// 目的のインデックスまでの距離が0のときも処理しない
			// 中途半端な位置からの遷移として第5引数にtrueを渡す
			this.psycle.transitionTo(to, duration, direction, vector, true);
		}

		this.isSwiping = false;
		this.isDragging = false;
		this.psycle.isTransition = false;

	}

	private _swipeleft (e: JQueryHammerEventObject): void {
		if (this.config.swipeable) {
			this.isSwiping = true;
			this.psycle.stop();
			const swipeDuration: number = e.timeStamp - this.dragStartTimestamp;
			this.psycle.next(swipeDuration);
		}
	}

	private _swiperight (e: JQueryHammerEventObject): void {
		if (this.config.swipeable) {
			this.isSwiping = true;
			this.psycle.stop();
			const swipeDuration: number = e.timeStamp - this.dragStartTimestamp;
			this.psycle.prev(swipeDuration);
		}
	}

}

/**
 *
 * @version 0.9.1
 * @since 0.1.0
 */
PsycleTransition.create({

	slide: {
		init: function (this: Psycle) {
			// スタイルを設定
			StyleSheet.posBase(this.stage.$el);
			StyleSheet.posAbs(this.container.$el);
			StyleSheet.posBase(this.panels.$el);
			StyleSheet.floating(this.panels.$el);
			// 初期のスタイルを保存
			StyleSheet.saveCSS(this.panels.$el);
			// 初期化時のインラインスタイルを保持
			if (this.config.draggable) {
				new Draggable(this.stage.$el, this, this.config);
			}
		},
		reflow: function (this: Psycle, info: IPsycleReflowInfo): void {
			switch (info.timing) {
				case PsycleReflowTiming.TRANSITION_END: {
					const distination: number = this.panelWidth * this.index * -1 + (this.cloneCount * this.panelWidth * this.length * -1);
					this.container.$el.css({
						left: distination,
					});
					break;
				}
				case PsycleReflowTiming.RESIZE_END:
				case PsycleReflowTiming.RESIZE_START:
				case PsycleReflowTiming.INIT:
				case PsycleReflowTiming.LOAD: {
					if (info.timing === PsycleReflowTiming.RESIZE_END) {
						this.cloneCount = 0;
						this.panels.removeClone();
					}
					const $panels: JQuery = this.panels.$el;
					const $container: JQuery = this.container.$el;
					/**
					 * 直接幅を設定してしまうとインラインCSSで設定されるので
					 * 次回取得時にその幅しか取得できない。
					 * 固定の場合は問題ないが相対値の場合は問題となるので
					 * 初期化時のインラインスタイルに戻すことで
					 * 常にオリジナルの幅を取得できるようになる。
					 */
					// 初期化時のスタイルに戻す
					StyleSheet.cleanCSS($panels);
					StyleSheet.posBase($panels);
					StyleSheet.floating($panels);
					StyleSheet.cleanCSS($container);
					StyleSheet.posAbs($container);
					// ステージ・パネル 各幅を取得
					const panelWidth: number = $panels.width(); // 初期化時のスタイルの状態で幅を取得
					const panelOuterWidth: number = $panels.outerWidth(true);
					this.panelWidth = panelOuterWidth;
					this.stageWidth = this.stage.$el.width();
					// 取得した幅を設定
					$panels.width(panelWidth);
					this.panels.getClones().width(panelWidth);
					// コンテナの幅を計算
					let containerWidth: number = panelOuterWidth * this.length;
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
						const stageWidthRatio: number = this.stageWidth / containerWidth;
						let addtionalCloneCount: number = Math.ceil(stageWidthRatio / 2) + 1;
						// 幅が取れないタイミングでは addtionalCloneCount が Infinity になる場合がある
						if (addtionalCloneCount === Infinity) {
							addtionalCloneCount = this.cloneCount + 1;
						}
						// クローン数が多くなった時に以下実行
						if (this.cloneCount < addtionalCloneCount) {
							// クローンを前方後方に生成追加
							this.panels.removeClone();
							this.panels.cloneBefore(addtionalCloneCount);
							this.panels.cloneAfter(addtionalCloneCount);
							// クローンの数を更新
							this.cloneCount = addtionalCloneCount;
						}
						// クローンを作った分幅を再計算して広げる
						containerWidth = this.panelWidth * this.length * (this.cloneCount * 2 + 1);
					}

					// コンテナの位置を計算
					const distination: number = this.panelWidth * this.index * -1 + (this.cloneCount * this.panelWidth * this.length * -1);
					// コンテナの計算値を反映
					$container.css({
						width: containerWidth,
						left: distination,
					});
					// ステージの高さの再計算
					if (this.config.resizable) {
						let height: number;
						switch (this.config.dimension) {
							case 'max': {
								height = this.panels.getMaxHeight();
								break;
							}
							case 'min': {
								height = this.panels.getMinHeight();
								break;
							}
							default: {
								height = this.panels.getHeight();
							}
						}
						this.stage.setHeight(height);
					}
					break;
				}
				default:
					// never
			}
		},
		silent: () => { /* void */ },
		before: () => { /* void */ },
		fire: function (this: Psycle) {
			if (this.animation) {
				this.animation.stop();
			}
			const duration: number = this.duration || this.config.duration;
			const distination: number = this.panelWidth * (this.index + this.vector) * -1 + (this.cloneCount * this.panelWidth * this.length * -1);
			this.animation = $.Animation(
				this.container.$el[0],
				{
					left: distination,
				},
				{
					duration,
					easing: this.config.easing,
				},
			);
		},
		cancel: () => { /* void */ },
		after: () => { /* void */ },
	},
});
