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