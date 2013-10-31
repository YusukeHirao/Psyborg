/// <reference path="../d.ts/jquery.d.ts" />
/// <reference path="../d.ts/hammerjs.d.ts" />
/**!
 * Psyborgで取り扱うイベントデータ
 *
 * @class PsyborgEvent
 * @since 0.1.0
 * @constructor
 * @param {string} type イベントの種類
 */
class PsyborgEvent {

	constructor (type:string) {
		this.type = type;
		this.timeStamp = new Date().valueOf();
	}

	/**!
	 * イベントの種類
	 *
	 * @property type
	 * @since 0.1.0
	 * @public
	 * @type string
	 */
	public type:string

	/**!
	 * イベントに渡されるハッシュデータ
	 *
	 * @property data
	 * @since 0.1.0
	 * @public
	 * @type any
	 */
	public data:any;

	/**!
	 * イベントが発生した時のタイムスタンプ
	 *
	 * @property timeStamp
	 * @since 0.1.0
	 * @public
	 * @type number
	 */
	public timeStamp:number;

	/**!
	 * デフォルトのイベントの発火を抑制するフラグ
	 *
	 * @property defaultPrevented
	 * @since 0.1.0
	 * @public
	 * @type boolean
	 * @default false
	 */
	public defaultPrevented:boolean = false;

	/**!
	 * デフォルトのイベントの発火を抑制する
	 *
	 * @method preventDefault
	 * @since 0.1.0
	 * @public
	 */
	public preventDefault ():void {
		this.defaultPrevented = true;
	}
}
/**!
 * Psyborgで取り扱うイベントディスパッチャ
 *
 * @class PsyborgEventDispacther
 * @since 0.1.0
 * @constructor
 */
class PsyborgEventDispacther {

	constructor () {
	}

	/**!
	 * イベントの種類
	 *
	 * @property _listeners
	 * @since 0.1.0
	 * @private
	 * @type Object
	 */
	private _listeners:IEventListenerList = {};

	/**!
	 * イベントを登録する
	 *
	 * @method on
	 * @since 0.1.0
	 * @public
	 * @param {string} types イベントの種類(スペース区切りで複数可)
	 * @param {Function} listener リスナー関数
	 */
	public on (types:string, listener:(e:PsyborgEvent) => any):void {
		var typeList:string[] = types.split(/\s+/);
		var i:number = 0;
		var l:number = typeList.length;
		for (; i < l; i++) {
			this._listeners[typeList[i]] = listener;
		}
	}

	/**!
	 * イベントを削除する
	 *
	 * @method off
	 * @since 0.1.0
	 * @public
	 * @param {string} types イベントの種類(スペース区切りで複数可)
	 * @param {Function} [listener] リスナー関数
	 */
	public off (types:string, listener?:Function):void {
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

	/**!
	 * イベントを任意に発火させる
	 *
	 * @method trigger
	 * @since 0.1.0
	 * @public
	 * @param {string} type イベントの種類
	 * @param {any} [data={}] 発火と同時にリスナー関数に渡すハッシュデータ
	 * @param {any} [context=this] リスナー関数の`this`コンテクスト
	 * @return {boolean} デフォルトのイベントの抑制がされていないかどうか
	 */
	public trigger (type:string, data:any = {}, context:any = this):boolean {
		var listener:Function;
		if (listener = this._listeners[type]) {
			var e:PsyborgEvent = new PsyborgEvent(type);
			e.data = data;
			listener.call(context, e);
			return !e.defaultPrevented;
		}
		return true;
	}
}

interface IEventListenerList {
	[index:string]:(e:PsyborgEvent) => any;
}
/**!
 * CSSを変換するラッパー関数郡
 *
 * @class PsyborgCSS
 * @since 0.1.0
 */
class PsyborgCSS {

	/**!
	 * ポジションを絶対位置にする
	 *
	 * @method posAbs
	 * @since 0.1.0
	 * @static
	 * @param {jQuery} $el 対象要素
	 * @param {number} [top=0] 垂直位置(単位:ピクセル)
	 * @param {number} [left=0] 水平位置(単位:ピクセル)
	 * @return {jQuery} 対象要素
	 */
	static posAbs ($el:JQuery, top:number = 0, left:number = 0):JQuery {
		return $el.css({
			position:<string> 'absolute',
			top:<number> top,
			left:<number> left
		});
	}

	/**!
	 * ポジションが 未指定もしくは`static`の場合は`relative`にする
	 *
	 * @method posBase
	 * @since 0.1.0
	 * @static
	 * @param {jQuery} $el 対象要素
	 * @return {jQuery} 対象要素
	 */
	static posBase ($el:JQuery):JQuery {
		var posi:string = $el.css('position');
		if (posi == null || posi === 'static' || posi === '') {
			$el.css({
				position:<string> 'relative'
			});
		}
		return $el;
	}

	/**!
	 * `overflow:hidden`かどうか
	 *
	 * @method isOverflowHidden
	 * @since 0.1.0
	 * @static
	 * @param {jQuery} $el 対象要素
	 * @return {boolean} `overflow:hidden`だった場合は`true`、それ以外は`false`
	 */
	static isOverflowHidden ($el:JQuery):boolean {
		return $el.css('overflow').toLowerCase() === 'hidden';
	}
}
/**!
 * Psyborgで取り扱うDOM要素
 *
 * @class PsyborgElement
 * @since 0.1.0
 * @extends PsyborgEventDispacther
 * @constructor
 * @param {jQuery} $el インスタンス化する要素
 */
class PsyborgElement extends PsyborgEventDispacther {

	constructor ($el:JQuery) {
		super();
		this.$el = $el;
	}

	/**!
	 * 内包するjQuery要素
	 *
	 * @property $el
	 * @since 0.1.0
	 * @public
	 * @type jQuery
	 */
	public $el:JQuery;
}
enum PsycleRepeat {
	NONE,
	RETURN,
	LOOP
}

enum PsycleEvent {
	INIT,
	PANEL_CHANGE_START,
	PANEL_CHANGE_END,
	PANEL_CHANGE_CANCEL,
	WAIT_START,
	WAIT_END
}

enum PsycleReflowTiming {
	INIT,
	TRANSITION_END,
	RESIZE,
	RESIZE_START,
	RESIZE_END
}

/**!
 * スライドショーパネル要素
 *
 * @class PsyclePanel
 * @since 0.1.0
 * @extends PsyborgElement
 * @constructor
 * @param {JQuery} $el 対象要素
 * @param {number} index パネル番号
 * @param {PsyclePanelList} list パネル要素リスト
 */
class PsyclePanel extends PsyborgElement {

	constructor ($el:JQuery, index:number, list:PsyclePanelList) {
		super($el);
		this.index = index;
		this._list = list;
	}

	/**!
	 * 自身のパネル番号
	 *
	 * @property index
	 * @since 0.1.0
	 * @public
	 * @type number
	 */
	public index:number;

	/**!
	 * スライドショーパネル要素リスト
	 *
	 * @property panels
	 * @since 0.1.0
	 * @public
	 * @type PsyclePanelList
	 */
	private _list:PsyclePanelList;

	/**!
	 * 要素を表示する
	 *
	 * @method show
	 * @since 0.1.0
	 * @public
	 * @return {PsyclePanel} 自身
	 */
	public show ():PsyclePanel {
		this.$el.show();
		return this;
	}

	/**!
	 * 要素を隠す
	 *
	 * @method hide
	 * @since 0.1.0
	 * @public
	 * @return {PsyclePanel} 自身
	 */
	public hide ():PsyclePanel {
		this.$el.hide();
		return this;
	}

	/**!
	 * クローン要素(クラスは異なる)を作る
	 *
	 * @method clone
	 * @since 0.1.0
	 * @public
	 * @return {PsyclePanelClone} 自身のクローン要素
	 */
	public clone ():PsyclePanelClone {
		var clone:PsyclePanelClone = new PsyclePanelClone(this.$el.clone(), this.index, this._list);
		this.$el.after(clone.$el);
		this._list.addClone(clone);
		return clone;
	}
}
/**!
 * スライドショーパネルのクローン要素
 *
 * @class PsyclePanel
 * @since 0.1.0
 * @extends PsyclePanel
 * @constructor
 * @param {JQuery} $el 対象要素
 * @param {number} index パネル番号
 * @param {PsyclePanelList} パネル要素リスト
 */
class PsyclePanelClone extends PsyclePanel {
	constructor ($el:JQuery, index:number, list:PsyclePanelList) {
		super($el, index, list);
		this.$el.addClass('__psycle_panel_clone__');
	}
}
/**!
 * スライドショーパネル要素リスト
 *
 * @class PsyclePanelList
 * @since 0.1.0
 * @extends PsyborgElement
 * @constructor
 * @param {JQuery} $el 対象要素
 */
class PsyclePanelList extends PsyborgElement {

	constructor ($el:JQuery) {
		super($el);
		var i:number = 0;
		var l:number = $el.length;
		var $panel:JQuery;
		for (; i < l; i++) {
			$panel = $($el[i]);
			this.add($panel);
		}
	}

	/**!
	 * パネル要素のリスト
	 *
	 * @property _panels
	 * @since 0.3.0
	 * @private
	 * @type PsyclePanel[]
	 * @default []
	 */
	private _panels:PsyclePanel[] = [];

	/**!
	 * クローン要素のリスト
	 *
	 * @property _clones
	 * @since 0.3.0
	 * @private
	 * @type PsyclePanelClone[]
	 * @default []
	 */
	private _clones:PsyclePanelClone[] = [];

	/**!
	 * パネル要素の数
	 *
	 * @property length
	 * @since 0.3.0
	 * @public
	 * @type PsyclePanel[]
	 * @default 0
	 */
	public length:number = 0;

	/**!
	 * 現在のパネルを設定する
	 *
	 * @method setCurrent
	 * @since 0.3.0
	 * @public
	 * @param {number} index 現在のパネル番号
	 * @param {string} className 現在のパネルに設定するクラス名
	 * @return {PsyclePanelList} 自身
	 */
	public setCurrent (index:number, className:string):PsyclePanelList {
		this.resetCurrent(className);
		this.item(index).$el.addClass(className);
		return this;
	}

	/**!
	 * 現在のパネルの設定をリセットする
	 *
	 * @method resetCurrent
	 * @since 0.3.0
	 * @public
	 * @param {string} className 設定を外すクラス名
	 * @return {PsyclePanelList} 自身
	 */
	public resetCurrent (className:string):PsyclePanelList {
		this.each((panelIndex:number, panel:PsyclePanel)=> {
			panel.$el.removeClass(className);
		});
		return this;
	}

	/**!
	 * パネルを追加する
	 *
	 * @method add
	 * @since 0.1.0
	 * @public
	 * @param {jQuery} $el 追加する要素
	 * @return {PsyclePanelList} 自身
	 */
	public add ($el:JQuery):PsyclePanelList {
		var index:number = this._panels.length;
		var panel:PsyclePanel = new PsyclePanel($el, index, this);
		this._panels.push(panel);
		this.length += 1;
		return this;
	}

	/**!
	 * クローンを追加する
	 *
	 * @method addClone
	 * @since 0.3.0
	 * @public
	 * @param {jQuery} $el 追加する要素
	 * @return {PsyclePanelList} 自身
	 */
	public addClone (clone:PsyclePanelClone):PsyclePanelList {
		this._clones.push(clone);
		return this;
	}

	/**!
	 * パネルを削除する
	 *
	 * @method remove
	 * @since 0.1.0
	 * @public
	 * @param {number} index 削除するパネルの番号
	 * @param {boolean} [removeFromDOMTree=true] DOMツリーから削除するかどうか
	 * @return {PsyclePanelList} 自身
	 */
	public remove (index:number, removeFromDOMTree:boolean = true):PsyclePanelList {
		if (removeFromDOMTree) {
			this.$el.eq(index).remove();
		}
		this._panels.splice(index, 1);
		this._renumbering();
		this.length -= 1;
		return this;
	}

	/**!
	 * 指定の番号のパネルを返す
	 *
	 * @method item
	 * @since 0.1.0
	 * @public
	 * @param {number} searchIndex パネルの番号
	 * @return {PsyclePanelList} パネル
	 */
	public item (searchIndex:number):PsyclePanel {
		var index:number = this._getRealIndex(searchIndex);
		return this._panels[index];
	}

	/**!
	 * パネルごとに処理を行う
	 *
	 * @method item
	 * @since 0.1.0
	 * @public
	 * @param {Function} callback コールバック関数
	 * @return {PsyclePanelList} 自身
	 */
	public each (callback:(index:number, panel:PsyclePanel) => void):PsyclePanelList {
		var i:number = 0;
		var l:number = this._panels.length;
		var panel:PsyclePanel;
		for (; i < l; i++) {
			panel = this._panels[i];
			callback.call(panel, panel.index, panel);
		}
		return this;
	}

	/**!
	 * 要素を表示する
	 *
	 * @method show
	 * @since 0.1.0
	 * @public
	 * @return {PsyclePanel} 自身
	 */
	public show ():PsyclePanelList {
		this.$el.show();
		return this;
	}

	/**!
	 * 要素を隠す
	 *
	 * @method hide
	 * @since 0.1.0
	 * @public
	 * @return {PsyclePanel} 自身
	 */
	public hide ():PsyclePanelList {
		this.$el.hide();
		return this;
	}

	/**!
	 * クローンのみを削除する
	 *
	 * @method item
	 * @since 0.1.0
	 * @public
	 * @deprecated
	 * @return {PsyclePanelList} 自身
	 */
	public removeClone ():PsyclePanelList {
		var i:number = 0;
		var l:number = this._clones.length;
		for (; i < l; i++) {
			this._clones[i].$el.remove();
		}
		this._clones = [];
		return this;
	}

	/**!
	 * 検索番号の正規化
	 *
	 * @method _getRealIndex
	 * @since 0.1.0
	 * @public
	 * @param {number} searchIndex 検索番号
	 * @return {number} 結果の番号
	 */
	private _getRealIndex (searchIndex:number):number {
		var length:number = this._panels.length;
		searchIndex = searchIndex % length; // indexの循環の常套句
		var index:number = searchIndex < 0 ? length + searchIndex : searchIndex;
		return index;
	}

	/**!
	 * パネル番号を整理して正しいものに調整する
	 *
	 * @method _getRealIndex
	 * @since 0.1.0
	 * @public
	 * @return {number} パネルの数
	 */
	private _renumbering ():number {
		var i:number = 0;
		var l:number = this._panels.length;
		for (; i < l; i++) {
			this._panels[i].index = i;
		}
		return l;
	}

}
/**!
 * スライドショーコンテナ要素
 *
 * @class PsycleContainer
 * @since 0.1.0
 * @extends PsyborgElement
 * @constructor
 */
class PsycleContainer extends PsyborgElement {
}
/**!
 * スライドショーステージ要素
 *
 * @class PsycleStage
 * @since 0.1.0
 * @extends PsyborgElement
 * @constructor
 */
class PsycleStage extends PsyborgElement {
}
interface IPsycleReflowInfo {
	timing:PsycleReflowTiming;
}

interface IPsycleTransitionList {
	[index:string]:PsycleTransition;
}

interface IPsycleTransitionProcess {
	init:() => void;
	reflow:(info:IPsycleReflowInfo) => void;
	silent:() => void;
	before:() => void;
	fire:() => any;
	cancel:() => any;
	after:() => void;
}

interface IPsycleTransitionProcessList {
	[index:string]:IPsycleTransitionProcess;
}

class PsycleTransition {

	static transitions:IPsycleTransitionList = {};

	static create(processList:IPsycleTransitionProcessList):void {
		var transitionName:string;
		var transition:PsycleTransition;
		for (transitionName in processList) {
			transition = new PsycleTransition(transitionName, processList[transitionName]);
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
		this.stop();
		this.isPaused = false;
		this.from = this.index;
		this.to = to;
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
		var to:number = this._optimizeCounter(this.index - 1);
		this.gotoPanel(to);
		return this;
	}

	/**!
	 * 次のパネルへ遷移する
	 *
	 * @method prev
	 * @since 0.1.0
	 * @public
	 * @return {Psycle} 自身のインスタンス
	 */
	public next ():Psycle {
		if (this.isTransition) {
			return this;
		}
		this.vector = 1;
		var to:number = this._optimizeCounter(this.index + 1);
		this.gotoPanel(to);
		return this;
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
		this.panels.setCurrent(this.index, this._config.currentClass);
		this._after();
		this._silent();
		// 自動再生状態なら再生開始する
		if (this._config.auto) {
			this.play();
		}
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
				index = index < 0 ? maxIndex + (index % maxIndex) + 1 : index;
				index = index < maxIndex ? index : index % (maxIndex + 1);
				break;
			default:
				index = index < 0 ? 0 : index;
				index = index < maxIndex ? index : maxIndex;
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
	 * 初期化処理を実行する
	 *
	 * @method _init
	 * @since 0.1.0
	 * @private
	 */
	private _init ():void {
		this.transition.init.call(this);
		this.transition.reflow.call(this, { timing: PsycleReflowTiming.INIT });
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

/**
* jQueryの拡張
*
* @class jQuery
*/
interface JQuery {
	psycle(config:any):JQuery;
}

jQuery.fn.psycle = function(config:any):JQuery {
	new Psycle(this, config);
	return this;
};
