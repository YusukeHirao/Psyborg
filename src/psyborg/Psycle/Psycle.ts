import { IPsycleConfig } from './IPsycleConfig';
import { IPsycleState } from './IPsycleState';

import PsyborgElement from '../PsyborgElement';
import PsyborgEvent from '../PsyborgEvent';
import Util from '../Util';

import PsycleContainer from './PsycleContainer';
import PsycleEvent from './PsycleEvent';
import PsyclePanel from './PsyclePanel';
import PsyclePanelList from './PsyclePanelList';
import PsycleReflowTiming from './PsycleReflowTiming';
import PsycleRepeat from './PsycleRepeat';
import PsycleStage from './PsycleStage';
import PsycleTransition from './PsycleTransition';

/**
 * スライド要素を生成・管理するクラス
 *
 * @since 0.9.1
 * @param $el インスタンス化する要素
 * @param options
 */
export default class Psycle extends PsyborgElement {

	/**
	 * 現在表示しているパネル番号
	 *
	 * @since 0.1.0
	 * @default 0
	 */
	public index = 0;

	/**
	 * 内部的に制御する遷移先を管理するパネル番号
	 *
	 * @since 0.1.0
	 */
	public progressIndex: number;

	/**
	 * 設定されているトランジションオブジェクト
	 *
	 * @since 0.1.0
	 */
	public transition: PsycleTransition;

	/**
	 * スライドショーステージ要素
	 *
	 * @since 0.1.0
	 */
	public stage: PsycleStage;

	/**
	 * スライドショーコンテナ要素
	 *
	 * @since 0.1.0
	 */
	public container: PsycleContainer;

	/**
	 * スライドショーパネル要素リスト
	 *
	 * @since 0.1.0
	 */
	public panels: PsyclePanelList;

	/**
	 * 自動再生タイマー
	 *
	 * @since 0.1.0
	 */
	public timer: number;

	/**
	 * ステージの幅
	 *
	 * @since 0.1.0
	 */
	public stageWidth: number;

	/**
	 * パネル個々の幅
	 *
	 * @since 0.1.0
	 */
	public panelWidth: number;

	/**
	 * パネルの数
	 *
	 * @since 0.1.0
	 */
	public length: number;

	/**
	 * 遷移前のパネル番号
	 *
	 * @since 0.1.0
	 */
	public from: number;

	/**
	 * 遷移後のパネル番号
	 *
	 * @since 0.1.0
	 */
	public to: number;

	/**
	 * 前に遷移するか次に遷移するか 番号の変化量
	 *
	 * @since 0.1.0
	 * @default 0
	 */
	public vector = 0;

	/**
	 * 現在遷移状態かどうか
	 *
	 * @since 0.1.0
	 * @default false
	 */
	public isTransition = false;

	/**
	 * 遷移アニメーションを制御する`jQueryAnimation`インスタンス
	 *
	 * @since 0.1.0
	 */
	public animation: JQuery;

	/**
	 * リピート方法
	 *
	 * @since 0.3.0
	 */
	public repeat: PsycleRepeat;

	/**
	 * 自動再生の一時停止状態かどうか
	 *
	 * @since 0.1.0
	 * @default false
	 */
	public isPaused = false;

	/**
	 * 現在のクローンパネルの数
	 *
	 * @since 0.5.3
	 * @default 0
	 */
	public cloneCount = 0;

	/**
	 * オプション
	 *
	 * @since 0.9.0
	 */
	public config: IPsycleConfig;

	/**
	 * 今回処理する遷移の継続時間
	 *
	 * @since 0.6.0
	 */
	public duration: number;

	/**
	 * オプション
	 *
	 * @deprecated
	 * @since 0.1.0
	 */
	private _config: IPsycleConfig;

	/**
	 * 今回処理する遷移の継続時間
	 *
	 * @deprecated
	 * @since 0.3.4
	 */
	private _duration: number;

	/**
	 * 遅延処理時の内部タイマー(setTimeoutの管理ID)
	 *
	 * @since 0.4.3
	 */
	private _delayTimer: number;

	/**
	 * パネルの遷移回数のログ
	 *
	 * @since 0.7.0
	 */
	private _times: number[] = [];

	/**
	 * 除外番号
	 *
	 * @since 0.7.0
	 */
	private _ignoreIndexes: boolean[] = [];

	constructor ($el: JQuery, options: IPsycleConfig) {
		super($el);
		const defaults: IPsycleConfig = {
			instanceKey: 'psycle',
			startIndex: 0,
			transition: 'slide',
			duration: 600,
			easing: 'swing',
			delay: 3000,
			auto: true,
			cancel: true,
			repeat: PsycleRepeat.RETURN,
			container: '>ul:eq(0)',
			panels: '>li',
			currentClass: 'current',
			delayWhenFire: 0,
			clone: 2,
			cols: 1,
			rows: 1,
			offsetX: 0,
			offsetY: 0,
			nearby: false,
			innerFocus: false,
			noFocus: true,
			resizable: false,
			draggable: false,
			swipeable: false,
			dragBlockVertical: false,
			bindKeyboard: false,
			showOnlyOnce: '.once',
			controller: null,
			marker: null,
			thumbnail: null,
			css3: true,
			loopCloneLength: null,
			scenes: [],
			dimension: 'auto',
			crossFade: true,
		};
		this.config = $.extend(defaults, options) as IPsycleConfig;

		// 要素インスタンス
		const $stage = $el;
		const $container = $stage.find(this.config.container);
		const $panels = $container.find(this.config.panels);
		this.panels = new PsyclePanelList($panels);
		this.container = new PsycleContainer($container);
		this.stage = new PsycleStage($stage, this.panels);
		this.transition = PsycleTransition.transitions[this.config.transition];

		if (this.transition == null) {
			throw new ReferenceError(`'${this.config.transition}' is not transition type.`);
		}

		if (this.transition.fallback && this.transition.fallbackFilter && this.transition.fallbackFilter()) {
			this.transition = PsycleTransition.transitions[this.transition.fallback];
			if (this.transition == null) {
				throw new ReferenceError(`'${this.config.transition}' is not transition type.`);
			}
		}

		if (this.config.draggable || this.config.swipeable) {
			if (!(jQuery.fn.hammer || Hammer)) {
				throw new ReferenceError('"Hammer.js" is required when use "draggable" or "swipeable" options.');
			}
		}

		// オプションの継承
		this.index = +this.config.startIndex || 0;
		this.to = this.index;
		this.from = this.index;
		this.repeat = this.config.repeat;

		// プロパティ算出
		this.length = this.panels.length;
		this.progressIndex = this.index;

		// イベントの登録
		this._resizeable();

		// 処理開始
		this._init();
		this._silent();

		// パネル内の画像が読み込まれたとき
		this.panels.on('load', () => {
			this._load();
		});

		// 自身のインスタンスを登録
		$el.data(this.config.instanceKey, this);

		setTimeout( () => {
			this._initFinished();

			// 自動再生
			if (this.config.auto) {
				this.play();
			}
		}, 0);
	}

	/**
	 * 自動再生を開始する
	 *
	 * @version 0.7.1
	 * @since 0.1.0
	 * @return 自身のインスタンス
	 */
	public play (): Psycle {
		const defaultPrevented: boolean = this.trigger('play');
		if (defaultPrevented) {
			this.config.auto = true;
			clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.next();
			}, this.config.delay);
		}
		return this;
	}

	/**
	 * 自動再生を停止する
	 *
	 * @since 0.1.0
	 * @return 自身のインスタンス
	 */
	public stop (): Psycle {
		clearTimeout(this.timer);
		this.isPaused = true;
		return this;
	}

	/**
	 * 遷移を強制的に停止する
	 * 遷移中のスタイルで固定される
	 *
	 * @since 0.3.4
	 * @return 自身のインスタンス
	 */
	public freeze (): Psycle {
		if (this.animation) {
			this.animation.stop();
		}
		this.stop();
		return this;
	}

	/**
	 * 指定の番号のパネルへ遷移する
	 *
	 * @version 0.7.0
	 * @since 0.1.0
	 * @param to 遷移させるパネル番号
	 * @param [duration] 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
	 * @return 自身のインスタンス
	 */
	public gotoPanel (to: number, duration?: number, direction: number = 0): Psycle {
		// 遷移中なら何もしない
		if (this.isTransition) {
			return this;
		}
		this.transitionTo(to, duration, direction);
		return this;
	}

	/**
	 * 前のパネルへ遷移する
	 *
	 * @version 0.7.0
	 * @since 0.1.0
	 * @param [duration] 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
	 * @return 自身のインスタンス
	 */
	public prev (duration?: number): Psycle {
		if (this.isTransition) {
			return this;
		}
		const direction: number = -1;
		this.gotoPanel(this.index - 1, duration, direction);
		return this;
	}

	/**
	 * 次のパネルへ遷移する
	 *
	 * @version 0.7.0
	 * @since 0.1.0
	 * @param [duration] 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
	 * @return 自身のインスタンス
	 */
	public next (duration?: number): Psycle {
		if (this.isTransition) {
			return this;
		}
		const direction: number = +1;
		this.gotoPanel(this.index + 1, duration, direction);
		return this;
	}

	/**
	 * リフロー処理を実行する
	 *
	 * @since 0.3.4
	 * @param data リフロー処理時に渡す任意のデータ
	 * @return 自身のインスタンス
	 */
	public reflow (data?): Psycle {
		this.transition.reflow.call(this, {
			timing: PsycleReflowTiming.REFLOW_METHOD,
			data,
		});
		return this;
	}

	/**
	 * 現在のパネルが最初のパネルかどうか
	 *
	 * @since 0.4.0
	 * @return {boolean} 最初のパネルなら`true`
	 */
	public isFirst (): boolean {
		return this._isFirst(this.index);
	}

	/**
	 * 現在のパネルが最後のパネルかどうか
	 *
	 * @since 0.4.0
	 * @return {boolean} 最後のパネルなら`true`
	 */
	public isLast (): boolean {
		return this._isLast(this.index);
	}

	/**
	 * マーカーを生成する
	 *
	 * @version 0.8.3
	 * @since 0.3.0
	 * @param [duration] 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
	 * @param {string} [currentClassAddionalEventType] カレントクラスを付加するタイミング
	 * @return {JQuery} 生成したjQuery要素
	 */
	public marker (duration?: number, currentClassAddionalEventType?: string): JQuery {
		const $ul: JQuery = $('<ul />');
		// currentClassAddionalEventType引数のデフォルト
		currentClassAddionalEventType = currentClassAddionalEventType || PsycleEvent.PANEL_CHANGE_END;
		for (let i = 0, l = this.length; i < l; i++) {
			const $li = $('<li />');
			$li.appendTo($ul);
			if (this.panels.item(i).$el.filter(this.config.showOnlyOnce).length) {
				$li.addClass(this.config.showOnlyOnce).hide();
			}
		}
		const $lis: JQuery = $ul.find('li');
		this.on(currentClassAddionalEventType, (e: PsyborgEvent) => {
			$lis.removeClass(this.config.currentClass);
			$lis.eq(e.data.to).addClass(this.config.currentClass);
		});
		$lis.eq(this.config.startIndex).addClass(this.config.currentClass);
		$lis.on('click', (e: JQueryEventObject) => {
			this.gotoPanel($(e.target).index(), duration);
			e.preventDefault();
		});
		return $ul;
	}

	/**
	 * マーカーを設定する
	 *
	 * @version 0.7.0
	 * @since 0.5.3
	 * @param $elem 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
	 * @param options オプション
	 * @return 生成したjQuery要素
	 */
	public marked ($elem: JQuery, options?): void {
		const config = $.extend({
			type: 'li',
			duration: null,
		});
		const nodeName: string = $elem[0].nodeName;

		let type = `${config.type}`;
		if (nodeName === 'UL' || nodeName === 'OL') {
			type = 'li';
		}

		let childTag: string;
		switch (type.toLowerCase()) {
			case 'li':
			case 'list':
			case 'ls':
			case 'ul':
			case 'ol': {
				childTag = 'li';
				break;
			}
			case 'i':
			case 'in':
			case 'inline':
			case 'span': {
				childTag = 'span';
				break;
			}
			// case 'b':
			// case 'block':
			// case 'div':
			default: {
				childTag = 'div';
			}
		}
		const $childBase = $('<' + childTag + ' />');

		for (let i = 0, l = this.length; i < l; i++) {
			let $child = $childBase.clone();
			$child.appendTo($elem);
			if (this.panels.item(i).$el.filter(this.config.showOnlyOnce).length) {
				$child.addClass(this.config.showOnlyOnce).hide();
			}
		}

		const $children = $elem.find('>' + childTag);

		$children.eq(this.config.startIndex).addClass(this.config.currentClass);

		this.on(PsycleEvent.PANEL_CHANGE_END, (e: PsyborgEvent): void => {
			$children.removeClass(this.config.currentClass);
			$children.eq(e.data.index).addClass(this.config.currentClass);
		});

		$children.on('click', (e: JQueryEventObject): void => {
			this.gotoPanel($(e.target).index(), config.duration);
			e.preventDefault();
		});
	}

	/**
	 * コントローラをバインドする
	 *
	 * @version 0.7.0
	 * @since 0.4.3
	 * @param $elem バインドさせるjQuery要素
	 * @param options オプション
	 */
	public controller ($elem: JQuery, options?): void {
		const config = $.extend(
			{
			prev: '.prev',
			next: '.next',
			duration: null,
			ifFirstClass: 'is-first',
			ifLastClass: 'is-last',
			ifIgnoreClass: 'is-ignore',
			},
			options,
		);
		const prev: string = config.prev;
		const next: string = config.next;
		const $prev: JQuery = $(prev);
		const $next: JQuery = $(next);
		$elem.on('click', prev, (e: JQueryEventObject): void => {
			this.prev(config.duration);
			e.preventDefault();
		});
		$elem.on('click', next, (e: JQueryEventObject): void => {
			this.next(config.duration);
			e.preventDefault();
		});

		const addStatus = (): void => {
			if (this.isFirst()) {
				$elem.addClass(config.ifFirstClass);
			} else {
				$elem.removeClass(config.ifFirstClass);
			}
			if (this.isLast()) {
				$elem.addClass(config.ifLastClass);
			} else {
				$elem.removeClass(config.ifLastClass);
			}
			if (this._ignoreIndexes[this.index]) {
				$elem.addClass(config.ifIgnoreClass);
			} else {
				$elem.removeClass(config.ifIgnoreClass);
			}
		};

		this.on(PsycleEvent.PANEL_CHANGE_END, addStatus);

		addStatus();

		return;
	}

	/**
	 * コントローラをバインドする
	 * `controller`のエイリアス
	 *
	 * @since 0.5.3
	 * @param {JQuery} $elem バインドさせるjQuery要素
	 * @param options オプション
	 * @return {JQuery} 生成したjQuery要素
	 */
	public ctrl ($elem: JQuery, options): void {
		this.controller($elem, options);
	}

	/**
	 * 指定の番号のパネルへ遷移する
	 *
	 * @version 0.7.0
	 * @since 0.6.0
	 * @param to 遷移させるパネル番号
	 * @param [duration] 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
	 * @param [direction=0] 方向
	 * @param [vector]
	 * @param {boolean} [fromHalfway=false] 中途半端な位置からの遷移かどうか
	 * @return 自身のインスタンス
	 */
	public transitionTo (to: number, duration?: number, direction: number = 0, vector?: number, fromHalfway: boolean = false): Psycle {
		// アニメーション前 各種数値設定前
		this.before();

		//  目的のパネルにshowOnlyOnceのセレクタにマッチしていて、且つ1回以上表示されていたら次の遷移に移る
		let optimizedVector: number = vector && $.isNumeric(vector) ? vector : this._optimizeVector(to, direction);
		let distIndex: number = this._optimizeCounter(this.index + optimizedVector, to);
		if (fromHalfway) {
			if (this._ignoreIndexes[distIndex] && this._times[distIndex] >= 1) {
				if (this.progressIndex !== distIndex) {
					this.progressIndex = distIndex;
					this.transitionTo(to + direction, duration, 0, optimizedVector + direction, fromHalfway);
				} else {
					this._finaly();
				}
				return this;
			}
			// 中途半端な位置からの遷移の場合
			// 現在の番号と目的の番号が同じなら目的番号差を0にする
			if (this.index === distIndex) {
				optimizedVector = 0;
			}
		} else {
			let limit = 0;
			while (this._ignoreIndexes[distIndex] && this._times[distIndex] >= 1 && limit++ < 50) {
				// 現在の番号と目的の番号が同じならすべてスキップする
				optimizedVector = vector && $.isNumeric(vector) ? vector : this._optimizeVector(distIndex + direction, direction);
				distIndex = this._optimizeCounter(this.index + optimizedVector, distIndex + direction);
				if (this.progressIndex === distIndex) {
					this._finaly();
					return this;
				}
				this.progressIndex = distIndex;
			}
			if (this.index === distIndex) {
				this._finaly();
				return this;
			}
		}

		this.duration = duration || this.config.duration;
		this.vector = optimizedVector;
		this.from = this.index;
		this.to = distIndex;
		this.progressIndex = distIndex;

		if (this.config.delayWhenFire) {
			clearTimeout(this._delayTimer);
			this._delayTimer = setTimeout(() => {
				this._fire();
			}, this.config.delayWhenFire);
		} else {
			this._fire();
		}

		// アニメーションが完了したとき
		this.animation.done(() => {
			this._done();
		});
		// アニメーションが強制的にストップしたとき
		this.animation.fail(() => {
			this._fail();
		});
		return this;
	}

	/**
	 * 遷移直前の処理を実行する
	 *
	 * @version 0.8.2
	 * @since 0.6.0
	 */
	public before (): void {
		this.transition.before.call(this);
		this.panels.resetCurrent(this.config.currentClass);
		this.trigger(PsycleEvent.PANEL_CHANGE_START_BEFORE, this._getState());
	}

	/**
	 * 番号の変化量の正規化
	 * 一番近いパネルまでの距離(パネル数)を算出する
	 *
	 * @version 0.7.0
	 * @since 0.3.0
	 * @param to 目的のパネル番号
	 * @param direction 方向
	 * @return 正規化された変化量
	 */
	private _optimizeVector (to: number, direction: number): number {
		const optTo: number = (to + this.length) % this.length;
		const dist: number = Math.abs(this.index - optTo);
		let vector: number;
		let dir: number = (this.index < optTo) ? 1 : -1;
		if (this.length - 1 <= this.index && this.index < to) {
			dir = -1;
		} else if (to < this.index && this.index <= 0) {
			dir = 1;
		}
		if (this.repeat === PsycleRepeat.LOOP) {
			vector = Util.getloopSeriesVector(this.index, to, direction, this.length);
		} else {
			vector = dist * dir;
		}
		return vector;
	}

	/**
	 * パネル番号の正規化
	 *
	 * @version 0.7.0
	 * @since 0.1.0
	 * @param index 正規化するパネル番号
	 * @param progressIndex 実際に指定されたパネル番号
	 * @return 正規化されたパネル番号
	 */
	private _optimizeCounter (index: number, progressIndex: number): number {
		let optIndex: number;
		switch (this.repeat) {
			case PsycleRepeat.LOOP: {
				optIndex = Util.getloopSeriesNumber(index, this.length);
				break;
			}
			case PsycleRepeat.RETURN: {
				optIndex = (index + this.length) % this.length;
				break;
			}
			default: {
				const maxIndex: number = this.length - 1;
				optIndex = (progressIndex < 0) ? 0 : progressIndex;
				optIndex = (optIndex < maxIndex) ? optIndex : maxIndex;
			}
		}
		return optIndex;
	}

	/**
	 * 指定したパネル番号が最初のパネルかどうか
	 *
	 * @version 0.7.0
	 * @since 0.3.0
	 * @param index 評価するパネル番号
	 * @return {boolean} 最初のパネルなら`true`
	 */
	private _isFirst (index: number): boolean {
		let first = 0;
		while (this._ignoreIndexes[first] && this._times[first] >= 1) {
			first += 1;
		}
		return index === first;
	}

	/**
	 * 指定したパネル番号が最後のパネルかどうか
	 *
	 * @version 0.7.0
	 * @since 0.3.0
	 * @param index 評価するパネル番号
	 * @return {boolean} 最後のパネルなら`true`
	 */
	private _isLast (index: number): boolean {
		let last: number = this.length - 1;
		while (this._ignoreIndexes[last] && this._times[last] >= 1) {
			last -= 1;
		}
		return index === last;
	}

	/**
	 * リサイズイベントを関連付ける
	 *
	 * @since 0.1.0
	 */
	private _resizeable (): void {
		const resizeEndDelay = 300;
		let resizeTimer: number;
		let resizing = false;
		$(window).on('resize', (e: JQueryEventObject) => {
			if (!resizing) {
				resizing = true;
				this._resizeStart();
			}
			clearTimeout(resizeTimer);
			this._resize();
			resizeTimer = setTimeout(() => {
				this._resizeEnd();
				resizing = false;
			}, resizeEndDelay);
		});
	}

	/**
	 * 現在の状態の情報を返す
	 *
	 * @version 0.8.0
	 * @since 0.1.0
	 */
	private _getState (): IPsycleState {
		return {
			index: this.index,
			stage: this.stage,
			container: this.container,
			panel: this.panels.item(this.index),
			panels: this.panels,
			stageWidth: this.stageWidth,
			panelWidth: this.panelWidth,
			length: this.length,
			from: this.from,
			to: this.to,
			vector: this.vector,
			isTransition: this.isTransition,
			isPaused: this.isPaused,
		};
	}

	/**
	 * パネル内の画像の読み込みが完了した時
	 *
	 * @since 0.5.1
	 */
	private _load (): void {
		this.transition.reflow.call(this, { timing: PsycleReflowTiming.LOAD });
	}

	/**
	 * 初期化処理を実行する
	 *
	 * @version 0.8.1
	 * @since 0.1.0
	 */
	private _init (): void {
		// 最初のパネルの表示回数を設定
		this._times[this.config.startIndex] = 1;
		// 除外番号の登録
		this.panels.each((i: number, panel: PsyclePanel): void => {
			if (panel.$el.filter(this.config.showOnlyOnce).length) {
				this._ignoreIndexes[i] = true;
			} else {
				this._ignoreIndexes[i] = false;
			}
		});
		this.transition.init.call(this);
		this.transition.reflow.call(this, { timing: PsycleReflowTiming.INIT });
	}

	/**
	 * 初期化処理が終了したときの処理
	 *
	 * @version 0.8.1
	 * @since 0.8.1
	 */
	private _initFinished (): void {
		this.trigger(PsycleEvent.INIT, this._getState());
	}

	/**
	 * 非遷移番号移動を実行する
	 *
	 * @since 0.1.0
	 */
	private _silent (): void {
		this.transition.silent.call(this);
		this.transition.reflow.call(this, { timing: PsycleReflowTiming.TRANSITION_END });
		this.panels.setCurrent(this.index, this.config.currentClass);
	}

	/**
	 * 遷移直前の処理を実行する
	 *
	 * @deprecated
	 * @since 0.1.0
	 */
	private _before (): void {
		this.before();
	}

	/**
	 * 遷移時の処理を実行する
	 *
	 * @version 0.8.2
	 * @since 0.1.0
	 */
	private _fire (): void {
		this.isTransition = true;
		this.trigger(PsycleEvent.PANEL_CHANGE_START, this._getState());
		this.transition.fire.call(this);
	}

	/**
	 * 遷移キャンセル時の処理を実行する
	 *
	 * @since 0.1.0
	 */
	private _cancel (): void {
		this.transition.cancel.call(this);
	}

	/**
	 * 遷移完了時コールバック関数
	 *
	 * @version 0.7.0
	 * @since 0.1.0
	 */
	private _done (): void {
		this.index = this.to;
		this.progressIndex = this.to;
		this.isTransition = false;
		this._after();
		this._silent();
		this.trigger(PsycleEvent.PANEL_CHANGE_END, this._getState());
		this._times[this.to] = this._times[this.to] + 1 || 1;
		this._finaly();
	}

	/**
	 * 遷移後の処理を実行する
	 *
	 * @since 0.1.0
	 */
	private _after (): void {
		this.transition.after.call(this);
	}

	/**
	 * 遷移未完了で停止した場合のコールバック関数
	 *
	 * @since 0.1.0
	 */
	private _fail (): void {
		this.stop();
		this._cancel();
		this.isTransition = false;
		this.trigger(PsycleEvent.PANEL_CHANGE_CANCEL, this._getState());
		this._finaly();
	}

	/**
	 * すべての処理の完了後のコールバック関数
	 *
	 * @version 0.7.0
	 * @since 0.7.0
	 */
	private _finaly (): void {
		// 自動再生状態なら再生開始する
		if (this.config.auto) {
			// しかしリピートしないで最後のパネルなら自動再生を停止する
			if (this.repeat === PsycleRepeat.NONE && this.isLast()) {
				this.stop();
			} else {
				this.play();
			}
		} else {
			this.stop();
		}
	}

	/**
	 * リサイズ中の処理を実行する
	 *
	 * @since 0.1.0
	 */
	private _resize (): void {
		this.transition.reflow.call(this, { timing: PsycleReflowTiming.RESIZE });
	}

	/**
	 * リサイズ開始時の処理を実行する
	 *
	 * @since 0.9.0
	 */
	private _resizeStart (): void {
		this.transition.reflow.call(this, { timing: PsycleReflowTiming.RESIZE_START });
		this.trigger(PsycleEvent.RESIZE_START, this._getState());
		if (this.animation && this.isTransition) {
			this.freeze();
		}
	}

	/**
	 * リサイズ終了時の処理を実行する
	 *
	 * @since 0.9.0
	 */
	private _resizeEnd (): void {
		this.transition.reflow.call(this, { timing: PsycleReflowTiming.RESIZE_END });
		this.trigger(PsycleEvent.RESIZE_END, this._getState());
		if (this.isPaused && this.config.auto) {
			this.gotoPanel(this.to);
		}
	}

}
