/**!
 * スライド要素を生成・管理するクラス
 *
 * @class Psycle
 * @since 0.1.0
 * @extends PsyborgElement
 * @constructor
 * @param {jQuery} $el インスタンス化する要素
 * @param {any} options
 * @param {number} [options.startIndex=0] 最初に表示するパネル番号
 * @param {string} [options.transition='slide'] トランジションの種類
 * @param {number} [options.duration=600] アニメーション時間
 * @param {string} [options.easing='swing'] トランジションのイージング
 * @param {number} [options.delay=3000] オートプレイの時の待機時間
 * @param {boolean} [options.auto=true] オートプレイかどうか
 * @param {boolean} [options.cancel=true] アニメーション中にキャンセル可能かどうか（アニメーション中にパネル選択やパネル送りを上書きできるかどうか）
 * @param {any} [options.repeat=PsycleRepeat.RETURN] 繰り返しの種類(NONE: 繰り返ししない, RETURN: 最後まで到達すると最初に戻る, LOOP: ループしてるかのように最初に戻る（ループに対応しているトランジションのみ））
 * @param {string} [options.container='>ul:eq(0)'] コンテナを取得するためのセレクタ
 * @param {string} [options.panels='>li'] パネルを取得するためのセレクタ（コンテナからのパス）
 * @param {string} [options.currentClass='current'] 現在のパネルに設定されるクラス名
 * @param {string} [options.delayWhenFire=0] 遷移処理が発生する(`before`関数から`fire`関数)までの遅延時間(ミリ秒)
 * @param {number} [options.cols=1] カラム(列)の数（カラム対応のトランジションのみ）
 * @param {number} [options.rows=1] 行の数（行対応のトランジションのみ）
 * @param {number} [options.offsetX=0] コンテナの横方向のオフセット（コンテナが平行移動するトランジションのみ）
 * @param {number} [options.offsetY=0] コンテナの縦方向のオフセット（コンテナが平行移動するトランジションのみ）
 * @param {boolean} [options.nearby=false] ???
 * @param {boolean} [options.innerFocus=false] マルチカラムの時のフォーカスの当たり方が内側優先かどうか、noFocusがtrueの場合は無効
 * @param {boolean} [options.noFocus=true] マルチカラムの時、パネルにフォーカスを当てない、また、indexは先頭の要素だけを指すことになる
 * @param {boolean} [options.resizable=false] リサイズによってパネルの大きさが変わる場合はtrueを渡す
 * @param {boolean} [options.bindKeyboard=false] キーボードで操作できるようにするかどうか
 * @param {any} [options.showOnlyOnce=null] オートプレイの時に一度しか表示しないパネルのフィルタセレクタ (例) .once
 * @param {any} [options.controller=null] コントローラ
 * @param {any} [options.marker=null] マーカー
 * @param {any} [options.thumbnail=null] サムネイル
 * @param {boolean} [options.css3=true] ???
 * @param {number} [options.loopCloneLength=null] ループ時のスライド専用 クローンをいくつつくるか
 * @param {Function[]} [options.scenes=[]] ???
 */
class Psycle extends PsyborgElement {

	constructor ($el:JQuery, options:any) {
		super($el);
		var defaults:IPsycleConfig = {
			startIndex:<number> 0,
			transition:<string> 'slide',
			duration:<number> 600,
			easing:<string> 'swing',
			delay:<number> 3000,
			auto:<boolean> true,
			cancel:<boolean> true,
			repeat:<any> PsycleRepeat.RETURN,
			container:<string> '>ul:eq(0)',
			panels:<string> '>li',
			currentClass:<string> 'current',
			delayWhenFire:<number> 0,
			cols:<number> 1,
			rows:<number> 1,
			offsetX:<number> 0,
			offsetY:<number> 0,
			nearby:<boolean> false,
			innerFocus:<boolean> false,
			noFocus:<boolean> true,
			resizable:<boolean> false,
			bindKeyboard:<boolean> false,
			showOnlyOnce:<any> null,
			controller:<any> null,
			marker:<any> null,
			thumbnail:<any> null,
			css3:<boolean> true,
			loopCloneLength:<number> null,
			scenes:<Function[]> []
		};
		this._config = <IPsycleConfig>$.extend(defaults, options);

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
		this._resizeable();

		// 処理開始
		this._init();
		this._silent();

		// 自動再生
		if (this._config.auto) {
			this.play();
		}

		// 自身のインスタンスを登録
		$el.data('psycle', this);
	}

	/**!
	 * 現在表示しているパネル番号
	 *
	 * @property index
	 * @since 0.1.0
	 * @public
	 * @type number
	 * @default 0
	 */
	public index:number = 0;

	/**!
	 * 内部的に制御する遷移先を管理するパネル番号
	 *
	 * @property progressIndex
	 * @since 0.1.0
	 * @public
	 * @type number
	 */
	public progressIndex:number;

	/**!
	 * 設定されているトランジションオブジェクト
	 *
	 * @property transition
	 * @since 0.1.0
	 * @public
	 * @type PsycleTransition
	 */
	public transition:PsycleTransition;

	/**!
	 * スライドショーステージ要素
	 *
	 * @property stage
	 * @since 0.1.0
	 * @public
	 * @type PsycleStage
	 */
	public stage:PsycleStage;

	/**!
	 * スライドショーコンテナ要素
	 *
	 * @property container
	 * @since 0.1.0
	 * @public
	 * @type PsycleContainer
	 */
	public container:PsycleContainer;

	/**!
	 * スライドショーパネル要素リスト
	 *
	 * @property panels
	 * @since 0.1.0
	 * @public
	 * @type PsyclePanelList
	 */
	public panels:PsyclePanelList;

	/**!
	 * 自動再生タイマー
	 *
	 * @property timer
	 * @since 0.1.0
	 * @public
	 * @type number
	 */
	public timer:number;

	/**!
	 * ステージの幅
	 *
	 * @property stageWidth
	 * @since 0.1.0
	 * @public
	 * @type number
	 */
	public stageWidth:number;

	/**!
	 * パネル個々の幅
	 *
	 * @property panelWidth
	 * @since 0.1.0
	 * @public
	 * @type number
	 */
	public panelWidth:number;

	/**!
	 * パネルの数
	 *
	 * @property length
	 * @since 0.1.0
	 * @public
	 * @type number
	 */
	public length:number;

	/**!
	 * 遷移前のパネル番号
	 *
	 * @property from
	 * @since 0.1.0
	 * @public
	 * @type number
	 */
	public from:number;

	/**!
	 * 遷移後のパネル番号
	 *
	 * @property to
	 * @since 0.1.0
	 * @public
	 * @type number
	 */
	public to:number;

	/**!
	 * 前に遷移するか次に遷移するか 番号の変化量 `1`もしくは`-1`のみ
	 *
	 * @property vector
	 * @since 0.1.0
	 * @public
	 * @type number
	 * @default 1
	 */
	public vector:number = 1;

	/**!
	 * 現在遷移状態かどうか
	 *
	 * @property isTransition
	 * @since 0.1.0
	 * @public
	 * @type boolean
	 * @default false
	 */
	public isTransition:boolean = false;

	/**!
	 * 遷移アニメーションを制御する`jQueryAnimation`インスタンス
	 *
	 * @property animation
	 * @since 0.1.0
	 * @public
	 * @type jQueryAnimation
	 */
	public animation:any;

	/**!
	 * 自動再生の一時停止状態かどうか
	 *
	 * @property isPaused
	 * @since 0.1.0
	 * @public
	 * @type boolean
	 * @default false
	 */
	public isPaused:boolean = false;

	/**!
	 * オプション
	 *
	 * @property _config
	 * @since 0.1.0
	 * @private
	 * @type IPsycleConfig
	 */
	private _config:IPsycleConfig;

	/**!
	 * 自動再生を開始する
	 *
	 * @method play
	 * @since 0.1.0
	 * @public
	 * @return {Psycle} 自身のインスタンス
	 */
	public play ():Psycle {
		var defaultPrevented:boolean = this.trigger('play');
		if (defaultPrevented) {
			this.timer = setTimeout(() => {
				this.next();
			}, this._config.delay);
		}
		return this;
	}

	/**!
	 * 自動再生を停止する
	 *
	 * @method stop
	 * @since 0.1.0
	 * @public
	 * @return {Psycle} 自身のインスタンス
	 */
	public stop ():Psycle {
		clearTimeout(this.timer);
		return this;
	}

	/**!
	 * 指定の番号のパネルへ遷移する
	 *
	 * @method gotoPanel
	 * @since 0.1.0
	 * @public
	 * @param {number} to 遷移させるパネル番号
	 * @return {Psycle} 自身のインスタンス
	 */
	public gotoPanel (to:number):Psycle {
		if (this.isTransition) {
			return this;
		}
		var optTo:number = this._optimizeCounter(to);
		if (optTo === this.index) {
			return this;
		}
		this.vector = this._optimizeVector(to);
		this.stop();
		this.isPaused = false;
		this.from = this.index;
		this.to = optTo;
		this.progressIndex = to;
		this._before();
		setTimeout(() => {
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
		}, this._config.delayWhenFire);
		return this;
	}

	/**!
	 * 前のパネルへ遷移する
	 *
	 * @method prev
	 * @since 0.1.0
	 * @public
	 * @return {Psycle} 自身のインスタンス
	 */
	public prev ():Psycle {
		if (this.isTransition) {
			return this;
		}
		this.vector = -1;
		this.gotoPanel(this.index - 1);
		return this;
	}

	/**!
	 * 次のパネルへ遷移する
	 *
	 * @method next
	 * @since 0.1.0
	 * @public
	 * @return {Psycle} 自身のインスタンス
	 */
	public next ():Psycle {
		if (this.isTransition) {
			return this;
		}
		this.vector = 1;
		this.gotoPanel(this.index + 1);
		return this;
	}

	/**!
	 * マーカーを生成する
	 *
	 * @method marker
	 * @since 0.3.0
	 * @public
	 * @return {JQuery} 生成したjQuery要素
	 */
	public marker():JQuery {
		var _this:Psycle = this;
		var $ul:JQuery = $('<ul />');
		var $li:JQuery;
		var i:number = 0;
		var l:number = this.length;
		for (; i < l; i++) {
			$li = $('<li />');
			$li.appendTo($ul);
		}
		var $lis = $ul.find('li');
		this.on(PsycleEvent.PANEL_CHANGE_END, (e:PsyborgEvent) => {
			$lis.removeClass(this._config.currentClass);
			$lis.eq(e.data.index).addClass(this._config.currentClass);
		});
		$lis.on('click', function () {
			_this.gotoPanel($(this).index());
		});
		return $ul;
	}

	/**!
	 * 番号の変化量の正規化
	 *
	 * @method _optimizeVector
	 * @since 0.3.0
	 * @private
	 * @param {number} to 目的のパネル番号
	 * @return {number} 正規化された変化量
	 */
	private _optimizeVector (to:number):number {
		to = this._optimizeCounter(to);
		var vector:number;
		var negativeTo:number = to - this.length;
		var positiveTo:number = to + this.length;
		var dist:number = Math.abs(this.index - to);
		var negativeDist:number = Math.abs(this.index - negativeTo);
		var positiveDist:number = Math.abs(this.index - positiveTo);
		console.log('---\n' + this.index + 'から' + to + 'へ 差は' + dist + '\n' + this.index + 'から' + negativeTo + 'へ 差は' + negativeDist + '\n' + this.index + 'から' + positiveTo + 'へ 差は' + positiveDist);
		// 一番小さい値の時の結果をハッシュに登録 キーを利用した条件分岐
		var hash:any = {};
		hash[negativeDist] = -1;
		hash[positiveDist] = 1;
		hash[dist] = (this.index < to) ? 1 : -1;
		vector = hash[Math.min(dist, positiveDist, negativeDist)];
		return vector;
	}

	/**!
	 * パネル番号の正規化
	 *
	 * @method _optimizeCounter
	 * @since 0.1.0
	 * @private
	 * @param {number} index 正規化するパネル番号
	 * @return {number} 正規化されたパネル番号
	 */
	private _optimizeCounter (index:number):number {
		var maxIndex:number = this.length - 1;
		switch (this._config.repeat) {
			case PsycleRepeat.LOOP:
			case PsycleRepeat.RETURN:
				index = (index < 0) ? (maxIndex + (index % maxIndex) + 1) : index;
				index = (index < maxIndex) ? index : (index % (maxIndex + 1));
				break;
			default:
				index = (index < 0) ? 0 : index;
				index = (index < maxIndex) ? index : maxIndex;
				if (this._isFirst(index) || this._isLast(index)) {
					this.stop();
				}
		}
		return index;
	}

	/**!
	 * 指定したパネル番号が最初のパネルかどうか
	 *
	 * @method _isLast
	 * @since 0.3.0
	 * @private
	 * @param {number} index 評価するパネル番号
	 * @return {boolean} 最初のパネルなら`true`
	 */
	private _isFirst (index:number):boolean {
		return index === 0;
	}

	/**!
	 * 指定したパネル番号が最後のパネルかどうか
	 *
	 * @method _isLast
	 * @since 0.3.0
	 * @private
	 * @param {number} index 評価するパネル番号
	 * @return {boolean} 最後のパネルなら`true`
	 */
	private _isLast (index:number):boolean {
		return index === this.length - 1;
	}

	/**!
	 * リサイズイベントを関連付ける
	 *
	 * @method _resizeable
	 * @since 0.1.0
	 * @private
	 */
	private _resizeable ():void {
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

	/**!
	 * 現在の状態の情報を返す
	 *
	 * @method _getState
	 * @since 0.1.0
	 * @private
	 */
	private _getState ():IPsycleState {
		return <IPsycleState>{
			index:<number> this.index,
			stage:<PsycleStage> this.stage,
			container:<PsycleContainer> this.container,
			panels:<PsyclePanelList> this.panels,
			stageWidth:<number> this.stageWidth,
			panelWidth:<number> this.panelWidth,
			length:<number> this.length,
			from:<number> this.from,
			to:<number> this.to,
			vector:<number> this.vector,
			isTransition:<boolean> this.isTransition,
			isPaused:<boolean> this.isPaused
		};
	}

	/**!
	 * 初期化処理を実行する
	 *
	 * @method _init
	 * @since 0.1.0
	 * @private
	 */
	private _init ():void {
		this.transition.init.call(this);
		this.transition.reflow.call(this, { timing: PsycleReflowTiming.INIT });
		this.trigger(PsycleEvent.INIT, this._getState());
	}

	/**!
	 * 非遷移番号移動を実行する
	 *
	 * @method _silent
	 * @since 0.1.0
	 * @private
	 */
	private _silent ():void {
		this.transition.silent.call(this);
		this.transition.reflow.call(this, { timing: PsycleReflowTiming.TRANSITION_END });
		this.panels.setCurrent(this.index, this._config.currentClass);
	}

	/**!
	 * 遷移直前の処理を実行する
	 *
	 * @method _before
	 * @since 0.1.0
	 * @private
	 */
	private _before ():void {
		this.transition.before.call(this);
		this.panels.resetCurrent(this._config.currentClass);
		this.trigger(PsycleEvent.PANEL_CHANGE_START, this._getState());
	}

	/**!
	 * 遷移時の処理を実行する
	 *
	 * @method _fire
	 * @since 0.1.0
	 * @private
	 */
	private _fire ():void {
		this.transition.fire.call(this);
	}

	/**!
	 * 遷移キャンセル時の処理を実行する
	 *
	 * @method _cancel
	 * @since 0.1.0
	 * @private
	 */
	private _cancel ():void {
		this.transition.cancel.call(this);
	}

	/**!
	 * 遷移完了時コールバック関数
	 *
	 * @method _done
	 * @since 0.1.0
	 * @private
	 */
	private _done ():void {
		this.index = this.to;
		this.isTransition = false;
		this._after();
		this._silent();
		this.trigger(PsycleEvent.PANEL_CHANGE_END, this._getState());
		// 自動再生状態なら再生開始する
		if (this._config.auto) {
			this.play();
		}
	}

	/**!
	 * 遷移後の処理を実行する
	 *
	 * @method _after
	 * @since 0.1.0
	 * @private
	 */
	private _after ():void {
		this.transition.after.call(this);
	}

	/**!
	 * 遷移未完了で停止した場合のコールバック関数
	 *
	 * @method _fail
	 * @since 0.1.0
	 * @private
	 */
	private _fail ():void {
		this.stop();
		this._cancel();
		this.isPaused = true;
		this.trigger(PsycleEvent.PANEL_CHANGE_CANCEL, this._getState());
	}

	/**!
	 * リサイズ中の処理を実行する
	 *
	 * @method _resize
	 * @since 0.1.0
	 * @private
	 */
	private _resize ():void {
		this.transition.reflow.call(this, { timing: PsycleReflowTiming.RESIZE });
	}

	/**!
	 * リサイズ開始時の処理を実行する
	 *
	 * @method _resizeStart
	 * @since 0.1.0
	 * @private
	 */
	private _resizeStart ():void {
		this.transition.reflow.call(this, { timing: PsycleReflowTiming.RESIZE_START });
		if (this.animation && this.isTransition) {
			this.animation.stop();
			this.stop();
		}
	}

	/**!
	 * リサイズ終了時の処理を実行する
	 *
	 * @method _resizeEnd
	 * @since 0.1.0
	 * @private
	 */
	private _resizeEnd ():void {
		this.transition.reflow.call(this, { timing: PsycleReflowTiming.RESIZE_END });
		if (this.isPaused && this.isTransition) {
			this.gotoPanel(this.to);
		}
	}

}


interface IPsycleConfig {
	startIndex:number;
	transition:string;
	duration:number;
	easing:string;
	delay:number;
	auto:boolean;
	delayWhenFire:number;
	cancel:boolean;
	repeat:any;
	container:string;
	panels:string;
	currentClass:string;
	cols:number;
	rows:number;
	offsetX:number;
	offsetY:number;
	nearby:boolean;
	innerFocus:boolean;
	noFocus:boolean;
	resizable:boolean;
	bindKeyboard:boolean;
	showOnlyOnce:string;
	controller:any;
	marker:any;
	thumbnail:any;
	css3:boolean;
	loopCloneLength:number;
	scenes:Function[];
}

interface IPsycleState {
	index:number;
	stage:PsycleStage;
	container:PsycleContainer;
	panels:PsyclePanelList;
	stageWidth:number;
	panelWidth:number;
	length:number;
	from:number;
	to:number;
	vector:number;
	isTransition:boolean;
	isPaused:boolean;
}
