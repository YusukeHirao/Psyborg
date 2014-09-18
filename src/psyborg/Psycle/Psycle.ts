module psyborg {
	/**!
	 * スライド要素を生成・管理するクラス
	 *
	 * @class Psycle
	 * @since 0.1.0
	 * @extends PsyborgElement
	 * @constructor
	 * @param {jQuery} $el インスタンス化する要素
	 * @param {any} options
	 * @param {string} [options.instanceKey='psycle'] `data`メソッドで取得できるインスタンスのキー文字列
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
	 * @param {number} [options.clone=2] ループリピートにしたときの各要素に対してのクローン要素の数
	 * @param {number} [options.cols=1] カラム(列)の数（カラム対応のトランジションのみ）
	 * @param {number} [options.rows=1] 行の数（行対応のトランジションのみ）
	 * @param {number} [options.offsetX=0] コンテナの横方向のオフセット（コンテナが平行移動するトランジションのみ）
	 * @param {number} [options.offsetY=0] コンテナの縦方向のオフセット（コンテナが平行移動するトランジションのみ）
	 * @param {boolean} [options.nearby=false] ???
	 * @param {boolean} [options.innerFocus=false] マルチカラムの時のフォーカスの当たり方が内側優先かどうか、noFocusがtrueの場合は無効
	 * @param {boolean} [options.noFocus=true] マルチカラムの時、パネルにフォーカスを当てない、また、indexは先頭の要素だけを指すことになる
	 * @param {boolean} [options.resizable=false] リサイズによってパネルの大きさが変わる場合はtrueを渡す
	 * @param {boolean} [options.draggable=false] ドラッグによって遷移をコントロールさせる場合はtrueを渡す
	 * @param {boolean} [options.swipeable=false] スワイプによって遷移をコントロールさせる場合はtrueを渡す
	 * @param {boolean} [options.dragBlockVertical=false] ドラッグの上下を抑制させる(タッチデバイスのスクロールも抑制される)場合はtrueを渡す
	 * @param {boolean} [options.bindKeyboard=false] キーボードで操作できるようにするかどうか
	 * @param {any} [options.showOnlyOnce=null] オートプレイの時に一度しか表示しないパネルのフィルタセレクタ (例) .once
	 * @param {any} [options.controller=null] コントローラ
	 * @param {any} [options.marker=null] マーカー
	 * @param {any} [options.thumbnail=null] サムネイル
	 * @param {boolean} [options.css3=true] ???
	 * @param {number} [options.loopCloneLength=null] ループ時のスライド専用 クローンをいくつつくるか
	 * @param {Function[]} [options.scenes=[]] ???
	 */
	export class Psycle extends PsyborgElement {

		constructor ($el:JQuery, options:any) {
			super($el);
			var defaults:IPsycleConfig = {
				instanceKey:<string> 'psycle',
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
				clone:<number> 2,
				cols:<number> 1,
				rows:<number> 1,
				offsetX:<number> 0,
				offsetY:<number> 0,
				nearby:<boolean> false,
				innerFocus:<boolean> false,
				noFocus:<boolean> true,
				resizable:<boolean> false,
				draggable:<boolean> false,
				swipeable:<boolean> false,
				dragBlockVertical:<boolean> false,
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
			this.panels = new PsyclePanelList($panels);
			this.container = new PsycleContainer($container);
			this.stage = new PsycleStage($stage, this.panels);
			this.transition = PsycleTransition.transitions[this._config.transition];

			if (this.transition == null) {
				throw new ReferenceError("'" + this._config.transition + "' is not transition type");
			}

			if (this._config.draggable || this._config.swipeable) {
				if (!(jQuery.fn.hammer || Hammer)) {
					throw new ReferenceError('"Hammer.js" is required when use "draggable" or "swipeable" options.');
				}
			}

			// オプションの継承
			this.index = +this._config.startIndex || 0;
			this.to = this.index;
			this.from = this.index;
			this.repeat = ('' + this._config.repeat).toLowerCase();

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

			// パネル内の画像が読み込まれたとき
			this.panels.on('load', () => {
				this._load();
			});

			// 自身のインスタンスを登録
			$el.data(this._config.instanceKey, this);
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
		public index: number = 0;

		/**!
		 * 内部的に制御する遷移先を管理するパネル番号
		 *
		 * @property progressIndex
		 * @since 0.1.0
		 * @public
		 * @type number
		 */
		public progressIndex: number;

		/**!
		 * 設定されているトランジションオブジェクト
		 *
		 * @property transition
		 * @since 0.1.0
		 * @public
		 * @type PsycleTransition
		 */
		public transition: PsycleTransition;

		/**!
		 * スライドショーステージ要素
		 *
		 * @property stage
		 * @since 0.1.0
		 * @public
		 * @type PsycleStage
		 */
		public stage: PsycleStage;

		/**!
		 * スライドショーコンテナ要素
		 *
		 * @property container
		 * @since 0.1.0
		 * @public
		 * @type PsycleContainer
		 */
		public container: PsycleContainer;

		/**!
		 * スライドショーパネル要素リスト
		 *
		 * @property panels
		 * @since 0.1.0
		 * @public
		 * @type PsyclePanelList
		 */
		public panels: PsyclePanelList;

		/**!
		 * 自動再生タイマー
		 *
		 * @property timer
		 * @since 0.1.0
		 * @public
		 * @type number
		 */
		public timer: number;

		/**!
		 * ステージの幅
		 *
		 * @property stageWidth
		 * @since 0.1.0
		 * @public
		 * @type number
		 */
		public stageWidth: number;

		/**!
		 * パネル個々の幅
		 *
		 * @property panelWidth
		 * @since 0.1.0
		 * @public
		 * @type number
		 */
		public panelWidth: number;

		/**!
		 * パネルの数
		 *
		 * @property length
		 * @since 0.1.0
		 * @public
		 * @type number
		 */
		public length: number;

		/**!
		 * 遷移前のパネル番号
		 *
		 * @property from
		 * @since 0.1.0
		 * @public
		 * @type number
		 */
		public from: number;

		/**!
		 * 遷移後のパネル番号
		 *
		 * @property to
		 * @since 0.1.0
		 * @public
		 * @type number
		 */
		public to: number;

		/**!
		 * 前に遷移するか次に遷移するか 番号の変化量
		 *
		 * @property vector
		 * @since 0.1.0
		 * @public
		 * @type number
		 * @default 0
		 */
		public vector: number = 0;

		/**!
		 * 現在遷移状態かどうか
		 *
		 * @property isTransition
		 * @since 0.1.0
		 * @public
		 * @type boolean
		 * @default false
		 */
		public isTransition: boolean = false;

		/**!
		 * 遷移アニメーションを制御する`jQueryAnimation`インスタンス
		 *
		 * @property animation
		 * @since 0.1.0
		 * @public
		 * @type jQueryAnimation
		 */
		public animation: any;

		/**!
		 * リピート方法
		 *
		 * @property repeat
		 * @since 0.3.0
		 * @public
		 * @type PsycleRepeat
		 */
		public repeat: PsycleRepeat;

		/**!
		 * 自動再生の一時停止状態かどうか
		 *
		 * @property isPaused
		 * @since 0.1.0
		 * @public
		 * @type boolean
		 * @default false
		 */
		public isPaused: boolean = false;

		/**!
		 * 現在のクローンパネルの数
		 *
		 * @property cloneCount
		 * @since 0.5.3
		 * @public
		 * @type number
		 * @default 0
		 */
		public cloneCount: number = 0;

		/**!
		 * オプション
		 *
		 * @property _config
		 * @since 0.1.0
		 * @private
		 * @type IPsycleConfig
		 */
		private _config: IPsycleConfig;

		/**!
		 * 今回処理する遷移の継続時間
		 *
		 * @property duration
		 * @deprecated
		 * @since 0.3.4
		 * @private
		 * @type number
		 */
		private _duration: number;

		/**!
		 * 今回処理する遷移の継続時間
		 *
		 * @property duration
		 * @since 0.6.0
		 * @public
		 * @type number
		 */
		public duration: number;

		/**!
		 * 遅延処理時の内部タイマー(setTimeoutの管理ID)
		 *
		 * @property _delayTimer
		 * @since 0.4.3
		 * @private
		 * @type number
		 */
		private _delayTimer: number;

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
				clearTimeout(this.timer);
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
			this.isPaused = true;
			return this;
		}

		/**!
		 * 遷移を強制的に停止する
		 * 遷移中のスタイルで固定される
		 *
		 * @method freeze
		 * @since 0.3.4
		 * @public
		 * @return {Psycle} 自身のインスタンス
		 */
		public freeze ():Psycle {
			if (this.animation) {
				this.animation.stop();
			}
			this.stop();
			return this;
		}

		/**!
		 * 指定の番号のパネルへ遷移する
		 *
		 * @method gotoPanel
		 * @version 0.7.0
		 * @since 0.1.0
		 * @public
		 * @param {number} to 遷移させるパネル番号
		 * @param {number} [duration] 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
		 * @return {Psycle} 自身のインスタンス
		 */
		public gotoPanel (to: number, duration?: number, direction: number = 0): Psycle {
			// 遷移中なら何もしない
			if (this.isTransition) {
				return this;
			}
			this.transitionTo(to, duration, direction);
			return this;
		}

		/**!
		 * 前のパネルへ遷移する
		 *
		 * @method prev
		 * @version 0.6.1
		 * @since 0.1.0
		 * @public
		 * @param {number} [duration] 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
		 * @return {Psycle} 自身のインスタンス
		 */
		public prev (duration?: number): Psycle {
			if (this.isTransition) {
				return this;
			}
			var direction: number = 0;
			if (this._config.repeat === PsycleRepeat.LOOP) {
				direction = -1;
			}
			this.gotoPanel(this.index - 1, duration, direction);
			return this;
		}

		/**!
		 * 次のパネルへ遷移する
		 *
		 * @method next
		 * @version 0.6.1
		 * @since 0.1.0
		 * @public
		 * @param {number} [duration] 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
		 * @return {Psycle} 自身のインスタンス
		 */
		public next (duration?: number): Psycle {
			if (this.isTransition) {
				return this;
			}
			var direction: number = 0;
			if (this._config.repeat === PsycleRepeat.LOOP) {
				direction = +1;
			}
			this.gotoPanel(this.index + 1, duration, direction);
			return this;
		}

		/**!
		 * リフロー処理を実行する
		 *
		 * @method reflow
		 * @since 0.3.4
		 * @public
		 * @param {any} data リフロー処理時に渡す任意のデータ
		 * @return {Psycle} 自身のインスタンス
		 */
		public reflow (data?:any):Psycle {
			this.transition.reflow.call(this, {
				timing: PsycleReflowTiming.REFLOW_METHOD,
				data: data
			});
			return this;
		}

		/**!
		 * 現在のパネルが最初のパネルかどうか
		 *
		 * @method isFirst
		 * @since 0.4.0
		 * @public
		 * @return {boolean} 最初のパネルなら`true`
		 */
		public isFirst (): boolean {
			return this._isFirst(this.index);
		}

		/**!
		 * 現在のパネルが最後のパネルかどうか
		 *
		 * @method isLast
		 * @since 0.4.0
		 * @public
		 * @return {boolean} 最後のパネルなら`true`
		 */
		public isLast (): boolean {
			return this._isLast(this.index);
		}

		/**!
		 * マーカーを生成する
		 *
		 * @method marker
		 * @since 0.3.0
		 * @public
		 * @param {number} [duration] 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
		 * @return {JQuery} 生成したjQuery要素
		 */
		public marker(duration?:number):JQuery {
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
			$lis.eq(this._config.startIndex).addClass(this._config.currentClass);
			$lis.on('click', (e:JQueryEventObject) => {
				this.gotoPanel($(e.target).index(), duration);
				e.preventDefault();
			});
			return $ul;
		}
		/**!
		 * マーカーを設定する
		 *
		 * @method marked
		 * @since 0.5.3
		 * @public
		 * @param {JQuery} $elem 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
		 * @param {Object} options オプション
		 * @return {JQuery} 生成したjQuery要素
		 */
		public marked ($elem: JQuery, options: any): void {
			var config: any = $.extend({
				type: <string> 'li',
				duration: <number> null
			});
			var type: string = '' + config.type;
			var nodeName: string = $elem[0].nodeName;
			var childTag: string;
			var $child: JQuery;
			var $children: JQuery;
			var i: number = 0;
			var l: number = this.length;

			if (nodeName === 'UL' || nodeName === 'OL') {
				type = 'li';
			}

			switch (type.toLowerCase()) {
				case 'li':
				case 'list':
				case 'ls':
				case 'ul':
				case 'ol':
					childTag = 'li';
					break;
				case 'i':
				case 'in':
				case 'inline':
				case 'span':
					childTag = 'span';
					break;
				/*
				case 'b':
				case 'block':
				case 'div': */
				default:
					childTag = 'div';
			}
			$child = $('<' + childTag + ' />');

			for (; i < l; i++) {
				$child.clone().appendTo($elem);
			}

			$children = $elem.find('>' + childTag);

			$children.eq(this._config.startIndex).addClass(this._config.currentClass);

			this.on(PsycleEvent.PANEL_CHANGE_END, (e: PsyborgEvent): void => {
				$children.removeClass(this._config.currentClass);
				$children.eq(e.data.index).addClass(this._config.currentClass);
			});

			$children.on('click', (e: JQueryEventObject) :void => {
				this.gotoPanel($(e.target).index(), config.duration);
				e.preventDefault();
			});
		}

		/**!
		 * コントローラをバインドする
		 *
		 * @method controller
		 * @version 0.7.0
		 * @since 0.4.3
		 * @public
		 * @param {JQuery} $elem バインドさせるjQuery要素
		 * @param {any} options オプション
		 */
		public controller ($elem: JQuery, options: any): void {
			var config: any = $.extend({
				prev: <string> '.prev',
				next: <string> '.next',
				duration: <number> null,
				ifFirstClass: '--is-first',
				ifLastClass: '--is-last'
			}, options);
			var prev: string = config.prev;
			var next: string = config.next;
			var $prev: JQuery = $(prev);
			var $next: JQuery = $(next);
			$elem.on('click', prev, (e: JQueryEventObject): void => {
				this.prev(config.duration);
				e.preventDefault();
			});
			$elem.on('click', next, (e: JQueryEventObject): void => {
				this.next(config.duration);
				e.preventDefault();
			});

			var addStatus = (): void => {
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
			};

			this.on(PsycleEvent.PANEL_CHANGE_END, addStatus);

			addStatus();

			return;
		}

		/**!
		 * コントローラをバインドする
		 * `controller`のエイリアス
		 *
		 * @method ctrl
		 * @since 0.5.3
		 * @public
		 * @param {JQuery} $elem バインドさせるjQuery要素
		 * @param {any} options オプション
		 * @return {JQuery} 生成したjQuery要素
		 */
		public ctrl ($elem: JQuery, options: any): void {
			this.controller($elem, options);
		}

		/**!
		 * 指定の番号のパネルへ遷移する
		 *
		 * @method transitionTo
		 * @version 0.7.0
		 * @since 0.6.0
		 * @private
		 * @param {number} to 遷移させるパネル番号
		 * @param {number} [duration] 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
		 * @param {number} [direction=0] 方向
		 * @param {number} [vector]
		 * @param {boolean} [fromHalfway=false] 中途半端な位置からの遷移かどうか
		 * @return {Psycle} 自身のインスタンス
		 */
		public transitionTo (to: number, duration?: number, direction: number = 0, vector?: number, fromHalfway: boolean = false): Psycle {
			// アニメーション前 各種数値設定前
			this.before();

			var optimizedVector: number = $.isNumeric(vector) ? vector : this._optimizeVector(to, direction);
			var distIndex: number = this._optimizeCounter(this.index + optimizedVector, to);

			if (fromHalfway) {
				// 中途半端な位置からの遷移の場合
				// 現在の番号と目的の番号が同じなら目的番号差を0にする
				if (this.index === distIndex) {
					optimizedVector = 0;
				}
			} else {
				// 現在の番号と目的の番号が同じなら何もしない
				if (this.index === distIndex) {
					return this;
				}
			}

			this.duration = duration || this._config.duration;
			this.progressIndex = to;
			this.vector = optimizedVector;
			this.from = this.index;
			this.to = distIndex;

			if (this._config.delayWhenFire) {
				clearTimeout(this._delayTimer);
				this._delayTimer = setTimeout(() => {
					this._fire();
				}, this._config.delayWhenFire);
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

		/**!
		 * 番号の変化量の正規化
		 * 一番近いパネルまでの距離(パネル数)を算出する
		 *
		 * @method _optimizeVector
		 * @version 0.7.0
		 * @since 0.3.0
		 * @private
		 * @param {number} to 目的のパネル番号
		 * @param {number} direction 方向
		 * @return {number} 正規化された変化量
		 */
		private _optimizeVector (to: number, direction: number): number {
			var vector: number;
			var optTo: number = (to + this.length) % this.length;
			var dir: number = (this.index < optTo) ? 1 : -1;
			var dist: number = Math.abs(this.index - optTo);
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

		/**!
		 * パネル番号の正規化
		 *
		 * @method _optimizeCounter
		 * @version 0.6.1
		 * @since 0.1.0
		 * @private
		 * @param {number} index 正規化するパネル番号
		 * @param {number} progressIndex 実際に指定されたパネル番号
		 * @return {number} 正規化されたパネル番号
		 */
		private _optimizeCounter (index: number, progressIndex: number): number {
			var maxIndex: number = this.length - 1;
			var optIndex: number;
			switch (this.repeat) {
				case PsycleRepeat.LOOP:
					optIndex = Util.getloopSeriesNumber(index, this.length);
					break;
				case PsycleRepeat.RETURN:
					optIndex = (index + this.length) % this.length;
					break;
				default:
					optIndex = (progressIndex < 0) ? 0 : progressIndex;
					optIndex = (optIndex < maxIndex) ? optIndex : maxIndex;
			}
			return optIndex;
		}

		/**!
		 * 指定したパネル番号が最初のパネルかどうか
		 *
		 * @method _isFirst
		 * @since 0.3.0
		 * @private
		 * @param {number} index 評価するパネル番号
		 * @return {boolean} 最初のパネルなら`true`
		 */
		private _isFirst (index: number): boolean {
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
		private _isLast (index: number): boolean {
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
			var resizeEndDelay:number = 300;
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
		 * パネル内の画像の読み込みが完了した時
		 *
		 * @method _load
		 * @since 0.5.1
		 * @private
		 */
		private _load ():void {
			this.transition.reflow.call(this, { timing: PsycleReflowTiming.LOAD });
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
		 * @deprecated
		 * @since 0.1.0
		 * @private
		 */
		private _before ():void {
			this.before();
		}

		/**!
		 * 遷移直前の処理を実行する
		 *
		 * @method before
		 * @since 0.6.0
		 * @public
		 */
		public before ():void {
			this.transition.before.call(this);
			this.panels.resetCurrent(this._config.currentClass);
			this.trigger(PsycleEvent.PANEL_CHANGE_START, this._getState());
		}

		/**!
		 * 遷移時の処理を実行する
		 *
		 * @method _fire
		 * @version 0.7.0
		 * @since 0.1.0
		 * @private
		 */
		private _fire ():void {
			this.isTransition = true;
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
		 * @version 0.7.0
		 * @since 0.1.0
		 * @private
		 */
		private _done (): void {
			this.index = this.to;
			this.isTransition = false;
			this._after();
			this._silent();
			this.trigger(PsycleEvent.PANEL_CHANGE_END, this._getState());
			// 自動再生状態なら再生開始する
			if (this._config.auto) {
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
			this.isTransition = false;
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
				this.freeze();
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
			if (this.isPaused && this._config.auto) {
				this.gotoPanel(this.to);
			}
		}

	}

}