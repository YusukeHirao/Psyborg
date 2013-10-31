module psyborg {

	var $:JQueryStatic = jQuery;

	export enum PsycleRepeat {
		NONE,
		RETURN,
		LOOP
	}

	export enum PsycleEvent {
		INIT,
		PANEL_CHANGE_START,
		PANEL_CHANGE_END,
		PANEL_CHANGE_CANCEL,
		WAIT_START,
		WAIT_END
	}

	export enum PsycleReflowTiming {
		INIT,
		TRANSITION_END,
		RESIZE,
		RESIZE_START,
		RESIZE_END
	}

	// ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- //

	interface ICustomEvent {
		type:string;
		data:Object;
		timeStamp:number;
		defaultPrevented:boolean;
	}

	class CustomEvent implements ICustomEvent {
		data:Object;
		timeStamp:number;
		defaultPrevented:boolean = false;
		constructor (public type:string) {
			this.timeStamp = new Date().valueOf();
		}
		preventDefault () {
			this.defaultPrevented = true;
		}
	}

	interface IEventListenerList {
		[index:string]:(e:Event) => any;
	}

	export interface IEventDispatcher {
		on(type:string, listener:(e:Event) => any):void;
		off(type:string, listener:Function):void;
		trigger(type:string, data:Object):boolean;
	}

	export class EventDispacther implements psyborg.IEventDispatcher {
		private _listeners:IEventListenerList = {};
		on (types:string, listener:(e:Event) => any):void {
			var typeList:string[] = types.split(/\s+/);
			var i:number = 0;
			var l:number = typeList.length;
			for (; i < l; i++) {
				this._listeners[typeList[i]] = listener;
			}
		}
		off (types:string, listener?:Function):void {
			var typeList:string[] = types.split(/\s+/);
			var i:number = 0;
			var l:number = typeList.length;
			var type:string;
			for (; i < l; i++) {
				type = typeList[i];
				if (listener == null || this._listeners[type] === listener) {
					delete this._listeners[type];
				}
			}
		}
		trigger (type:string, data:Object = {}, context:any = this):boolean {
			var listener:Function;
			if (listener = this._listeners[type]) {
				var e:CustomEvent = new CustomEvent(type);
				e.data = data;
				listener.call(context, e);
				return !e.defaultPrevented;
			}
			return true;
		}
	}

	// ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- //

	interface IPsycleConfig {
		startIndex:number; // 最初に表示するパネル番号
		transition:string; // トランジションの種類
		duration:number; // アニメーション時間
		easing:string; // トランジションのイージング
		delay:number; // オートプレイの時の待機時間
		auto:boolean; // オートプレイかどうか
		cancel:boolean; // アニメーション中にキャンセル可能かどうか（アニメーション中にパネル選択やパネル送りを上書きできるかどうか）
		repeat:any;// 繰り返しの種類(none: 繰り返ししない, return: 最後まで到達すると最初に戻る, loop: ループしてるかのように最初に戻る（ループに対応しているトランジションのみ））
		container:string; // コンテナを取得するためのセレクタ
		panels:string; // パネルを取得するためのセレクタ（コンテナからのパス）
		cols:number; // カラム(列)の数（カラム対応のトランジションのみ）
		rows:number; // 行の数（行対応のトランジションのみ）
		offsetX:number; // コンテナの横方向のオフセット（コンテナが平行移動するトランジションのみ）
		offsetY:number; // コンテナの縦方向のオフセット（コンテナが平行移動するトランジションのみ）
		// nearby:boolean;
		innerFocus:boolean; // マルチカラムの時のフォーカスの当たり方が内側優先かどうか、noFocusがtrueの場合は無効
		noFocus:boolean; // マルチカラムの時、パネルにフォーカスを当てない、また、indexは先頭の要素だけを指すことになる
		//resizable:boolean; // リサイズによってパネルの大きさが変わる場合はtrueを渡す
		bindKeyboard:boolean;
		showOnlyOnce:string; // オートプレイの時に一度しか表示しないパネルのフィルタセレクタ (例) .once
		controller:any; // コントローラ
		marker:any; // マーカー
		thumbnail:any; // サムネイル
		css3:boolean;
		loopCloneLength:number; // ループ時のスライド専用 クローンをいくつつくるか
		scenes:Function[];//
	}

	export interface IPsycleAttributes {
		index:number;
		isTransition:boolean;
	}

	export interface IPsycleReflowInfo {
		timing:PsycleReflowTiming;
	}

	// ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- //

	export interface IPsycleTransitionList {
		[index:string]:IPsycleTransition;
	}

	export interface IPsycleTransitionProcess {
		init:() => void;
		reflow:(info:IPsycleReflowInfo) => void;
		silent:() => void;
		before:() => void;
		fire:() => any;
		cancel:() => any;
		after:() => void;
	}

	export interface IPsycleTransitionProcessList {
		[index:string]:IPsycleTransitionProcess;
	}

	export interface IPsycleTransition extends IPsycleTransitionProcess {
		name:string;
	}

	export class PsycleTransition implements psyborg.IPsycleTransition {

		static transitions:IPsycleTransitionList = {};

		static create(extend:IPsycleTransitionProcessList):void {
			var transitionName:string;
			var transition:PsycleTransition;
			for (transitionName in extend) {
				transition = new PsycleTransition(transitionName, extend[transitionName]);
				PsycleTransition.transitions[transitionName] = transition;
			}
		}

		name:string;
		init:() => void;
		reflow:(info:IPsycleReflowInfo) => void;
		silent:() => void;
		before:() => void;
		fire:() => any;
		cancel:() => any;
		after:() => void;

		constructor (name:string, process:IPsycleTransitionProcess) {
			this.name = name;
			$.extend(this, process);
		}
	}

	// ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- //

	export interface IPsyclePanel {
		index:number;
		$el:JQuery;
	}

	export class PsyclePanel implements psyborg.IPsyclePanel {

		index:number;
		$el:JQuery;

		private _list:PsyclePanelList;

		constructor ($el:JQuery, index:number, list:PsyclePanelList) {
			this.index = index;
			this.$el = $el;
			this._list = list;
		}

		show ():PsyclePanel {
			this.$el.show();
			return this;
		}

		hide ():PsyclePanel {
			this.$el.hide();
			return this;
		}

		clone ():PsyclePanelClone {
			var clone:PsyclePanelClone = new PsyclePanelClone(this.$el.clone(), this.index, this._list);
			this.$el.after(clone.$el);
			this._list.clones.push(clone);
			return clone;
		}
	}

	// ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- //

	export interface IPsyclePanelClone extends IPsyclePanel {
	}

	export class PsyclePanelClone extends PsyclePanel implements psyborg.IPsyclePanelClone {
		constructor ($el:JQuery, index:number, list:PsyclePanelList) {
			super($el, index, list);
			this.$el.addClass('__psycle_panel_clone__');
		}
	}

	// ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- //

	export interface IPsyclePanelList {
		$el:JQuery;
		el:IPsyclePanel[];
		$clones:JQuery;
		clones:IPsyclePanelClone[];
		length:number;
	}

	export class PsyclePanelList implements psyborg.IPsyclePanelList {

		$el:JQuery;
		el:PsyclePanel[] = [];
		$clones:JQuery;
		clones:PsyclePanelClone[] = [];
		length:number = 0;

		constructor ($el:JQuery) {
			this.$el = $el;
			var i:number = 0;
			var l:number = $el.length;
			var $panel:JQuery;
			for (; i < l; i++) {
				$panel = $($el[i]);
				this.add($panel);
			}
		}

		add ($el:JQuery):PsyclePanelList {
			var index:number = this.el.length;
			var panel:PsyclePanel = new PsyclePanel($el, index, this);
			this.el.push(panel);
			this.length += 1;
			return this;
		}

		remove (index:number, removeFromDOM:boolean = true):PsyclePanelList {
			if (removeFromDOM) {
				this.$el.eq(index).remove();
			}
			this.el.splice(index, 1);
			this._renumbering();
			this.length -= 1;
			return this;
		}

		item (searchIndex:number):PsyclePanel {
			var index:number = this._getRealIndex(searchIndex);
			return this.el[index];
		}

		each (callback:(index:number, panel:PsyclePanel) => void):void {
			var i:number = 0;
			var l:number = this.el.length;
			var panel:PsyclePanel;
			for (; i < l; i++) {
				panel = this.el[i];
				callback.call(panel, panel.index, panel);
			}
		}

		show ():PsyclePanelList {
			this.$el.show();
			return this;
		}

		hide ():PsyclePanelList {
			this.$el.hide();
			return this;
		}

		removeClone ():PsyclePanelList {
			var i:number = 0;
			var l:number = this.clones.length;
			for (; i < l; i++) {
				this.clones[i].$el.remove();
			}
			this.clones = [];
			return this;
		}

		private _getRealIndex (searchIndex:number):number {
			var length:number = this.el.length;
			searchIndex = searchIndex % length; // indexの循環の常套句
			var index:number = searchIndex < 0 ? length + searchIndex : searchIndex;
			return index;
		}

		private _renumbering ():number {
			var i:number = 0;
			var l:number = this.el.length;
			for (; i < l; i++) {
				this.el[i].index = i;
			}
			return l;
		}

	}

	// ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- //

	export interface IPsycleController {
		index:Number;
		$el:JQuery;
	}

	// ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- //

	export interface IPsycleContainer {
		$el:JQuery;
	}

	export class PsycleContainer implements psyborg.IPsycleContainer {

		$el:JQuery;

		constructor ($el:JQuery) {
			this.$el = $el;
		}
	}

	// ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- //

	export interface IPsycleStage {
		$el:JQuery;
	}

	export class PsycleStage implements psyborg.IPsycleStage {

		$el:JQuery;

		constructor ($el:JQuery) {
			this.$el = $el;
		}
	}

	// ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- //

	export interface IPsycle {
		index:number;
		$el:JQuery;
		transition:psyborg.IPsycleTransition;
		stage:psyborg.IPsycleStage;
		container:psyborg.IPsycleContainer;
		panels:psyborg.IPsyclePanelList;
		timer:number;
		stageWidth:number;
		panelWidth:number;
		length:number;
		from:number;
		to:number;
		vector:number; // -1 or 1 only
		isTransition:boolean;
		animation:any;
		isPaused:boolean;
		progressIndex:number;
	}

	export class Psycle extends psyborg.EventDispacther implements psyborg.IPsycle {

		index:number = 0;
		$el:JQuery;
		transition:psyborg.PsycleTransition;
		stage:psyborg.PsycleStage;
		container:psyborg.PsycleContainer;
		panels:psyborg.PsyclePanelList;
		timer:number;
		stageWidth:number;
		panelWidth:number;
		length:number;
		from:number;
		to:number;
		vector:number = 1; // -1 or 1 only
		isTransition:boolean = false;
		animation:any;
		isPaused:boolean = false;
		progressIndex:number;

		private _config:IPsycleConfig;

		constructor ($el:JQuery, options:Object) {

			super();

			var defaults:IPsycleConfig = {
				startIndex:<number> 0, // 最初に表示するパネル番号
				transition:<string> 'slide', // トランジションの種類
				duration:<number> 600, // アニメーション時間
				easing:<string> 'swing', // トランジションのイージング
				delay:<number> 3000, // オートプレイの時の待機時間
				auto:<boolean> true, // オートプレイかどうか
				cancel:<boolean> true, // アニメーション中にキャンセル可能かどうか（アニメーション中にパネル選択やパネル送りを上書きできるかどうか）
				repeat:<any> PsycleRepeat.RETURN,// 繰り返しの種類(none: 繰り返ししない, return: 最後まで到達すると最初に戻る, loop: ループしてるかのように最初に戻る（ループに対応しているトランジションのみ））
				container:<string> '>ul:eq(0)', // コンテナを取得するためのセレクタ
				panels:<string> '>li', // パネルを取得するためのセレクタ（コンテナからのパス）
				cols:<number> 1, // カラム(列)の数（カラム対応のトランジションのみ）
				rows:<number> 1, // 行の数（行対応のトランジションのみ）
				offsetX:<number> 0, // コンテナの横方向のオフセット（コンテナが平行移動するトランジションのみ）
				offsetY:<number> 0, // コンテナの縦方向のオフセット（コンテナが平行移動するトランジションのみ）
				// nearby: false,
				innerFocus:<boolean> false, // マルチカラムの時のフォーカスの当たり方が内側優先かどうか、noFocusがtrueの場合は無効
				noFocus:<boolean> true, // マルチカラムの時、パネルにフォーカスを当てない、また、indexは先頭の要素だけを指すことになる
				//resizable:<boolean> false, // リサイズによってパネルの大きさが変わる場合はtrueを渡す
				bindKeyboard:<boolean> false,
				showOnlyOnce:<any> null, // オートプレイの時に一度しか表示しないパネルのフィルタセレクタ (例) .once
				controller:<any> null, // コントローラ
				marker:<any> null, // マーカー
				thumbnail:<any> null, // サムネイル
				css3:<boolean> true,
				loopCloneLength:<number> null, // ループ時のスライド専用 クローンをいくつつくるか
				scenes:<Function[]> []
			};

			this._config = <IPsycleConfig>$.extend(defaults, options);
			this.$el = $el;

			// 要素インスタンス
			var $stage = $el;
			var $container = $stage.find(this._config.container);
			var $panels = $container.find(this._config.panels);
			this.stage = new PsycleStage($stage);
			this.container = new PsycleContainer($container);
			this.panels = new PsyclePanelList($panels);
			this.transition = PsycleTransition.transitions[this._config.transition];

			// オプションの継承
			this.index = this._config.startIndex;

			// プロパティ算出
			this.length = this.panels.length;
			this.progressIndex = this.index;

			// イベントの登録
			this._bind();

			// 処理開始
			this._init();
			this._silent();

			if (this._config.auto) {
				this.play();
			}

			$el.data('psyborg.Psycle', this);

		}

		play ():Psycle {
			var defaultPrevented:boolean = this.trigger('play');
			if (defaultPrevented) {
				this.timer = setTimeout(() => {
					this.next();
				}, this._config.delay);
			}
			return this;
		}

		stop ():Psycle {
			clearTimeout(this.timer);
			return this;
		}

		gotoPanel (to:number):Psycle {
			if (this.isTransition) {
				return this;
			}
			this.stop();
			this.isPaused = false;
			this.from = this.index;
			this.to = to;
			this.progressIndex = to;
			this._before();
			this.isTransition = true;
			this._fire();
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

		prev ():Psycle {
			if (this.isTransition) {
				return this;
			}
			this.vector = -1;
			var to:number = this._optimizeCounter(this.index - 1);
			this.gotoPanel(to);
			return this;
		}

		next ():Psycle {
			if (this.isTransition) {
				return this;
			}
			this.vector = 1;
			var to:number = this._optimizeCounter(this.index + 1);
			this.gotoPanel(to);
			return this;
		}

		private _done ():void {
			this.index = this.to;
			this.isTransition = false;
			this._after();
			this._silent();
			if (this._config.auto) {
				this.play();
			}
		}

		private _fail ():void {
			this.stop();
			this._cancel();
			this.isPaused = true;
		}

		private _optimizeCounter (index:number):number {
			var maxIndex:number = this.length - 1;
			switch (this._config.repeat) {
			case PsycleRepeat.LOOP:
			case PsycleRepeat.RETURN:
				index = index < 0 ? maxIndex + (index % maxIndex) + 1 : index;
				index = index < maxIndex ? index : index % (maxIndex + 1);
				break;
			default:
				index = index < 0 ? 0 : index;
				index = index < maxIndex ? index : maxIndex;
				if (this._isMin(index) || this._isMax(index)) {
					this.stop();
				}
			}
			return index;
		}

		private _isMax (index:number):boolean {
			return index === this.length - 1;
		}

		private _isMin (index:number):boolean {
			return index === 0;
		}

		private _bind ():void {
			var resizeEndDelay:number = 1200;
			var resizeTimer:number;
			var resizing:boolean = false;
			$(window).on('resize', (e:JQueryEventObject) => {
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

		private _init ():void {
			this.transition.init.call(this);
			this.transition.reflow.call(this, { timing: PsycleReflowTiming.INIT });
		}

		private _silent ():void {
			this.transition.silent.call(this);
			this.transition.reflow.call(this, { timing: PsycleReflowTiming.TRANSITION_END });
		}

		private _before ():void {
			this.transition.before.call(this);
		}

		private _fire ():void {
			this.transition.fire.call(this);
		}

		private _cancel ():void {
			this.transition.cancel.call(this);
		}

		private _after ():void {
			this.transition.after.call(this);
		}

		private _resize ():void {
			this.transition.reflow.call(this, { timing: PsycleReflowTiming.RESIZE });
		}

		private _resizeStart ():void {
			this.transition.reflow.call(this, { timing: PsycleReflowTiming.RESIZE_START });
			if (this.animation && this.isTransition) {
				this.animation.stop(); // => this._fail()
				this.stop();
			}
		}

		private _resizeEnd ():void {
			this.transition.reflow.call(this, { timing: PsycleReflowTiming.RESIZE_END });
			if (this.isPaused && this.isTransition) {
				this.gotoPanel(this.to);
			}
		}

	}

	// ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- //

	export class PsyborgCSS {
		static posAbs ($el:JQuery, top:number = 0, left:number = 0) {
			$el.css({
				position:<string> 'absolute',
				top:<number> top,
				left:<number> left
			});
		}
		static posBase ($el:JQuery) {
			var posi:string = $el.css('position');
			if (posi == null || posi === 'static' || posi === '') {
				$el.css({
					position:<string> 'relative'
				});
			}
		}
		static isOverflowHidden ($el:JQuery) {
			return $el.css('overflow').toLowerCase() === 'hidden';
		}
	}

	// ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- //

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

	// ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- //

	$.fn.psycle = function (options:Object) {
		var psycle:psyborg.Psycle = new psyborg.Psycle(this, options);
		return psycle.$el;
	};

}
