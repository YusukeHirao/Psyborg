module psyborg {

	/**
	 * Psyborgで取り扱うイベントデータ
	 *
	 * @since 0.1.0
	 * @param type イベントの種類
	 */
	export class PsyborgEvent {

		constructor (type: string) {
			this.type = type;
			this.timeStamp = new Date().valueOf();
		}

		/**
		 * イベントの種類
		 *
		 * @since 0.1.0
		 */
		public type: string;

		/**
		 * イベントに渡されるハッシュデータ
		 *
		 * @since 0.1.0
		 */
		public data: any;

		/**
		 * イベントが発生した時のタイムスタンプ
		 *
		 * @since 0.1.0
		 */
		public timeStamp: number;

		/**
		 * デフォルトのイベントの発火を抑制するフラグ
		 *
		 * @since 0.1.0
		 * @default false
		 */
		public defaultPrevented: boolean = false;

		/**
		 * デフォルトのイベントの発火を抑制する
		 *
		 * @method preventDefault
		 * @since 0.1.0
		 */
		public preventDefault (): void {
			this.defaultPrevented = true;
		}

	}

}