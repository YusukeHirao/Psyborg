module psyborg {

	/**
	 * Psyborgで取り扱うDOM要素
	 *
	 * @since 0.9.0
	 * @param $el インスタンス化する要素
	 */
	export class PsyborgElement extends PsyborgEventDispacther {

		constructor ($el: JQuery) {
			super();
			if (!$el.length) {
				throw new ReferenceError('This jQuery object is empty. Selector "' + $el.selector + '" doesn\'t exist.');
			}
			this.$el = $el;
			this.el = $el[0];
		}

		/**
		 * 内包するjQuery要素
		 *
		 * @since 0.1.0
		 */
		public $el: JQuery;
		
		/**
		 * 内包するDOM要素
		 *
		 * @since 0.9.0
		 */
		public el: Element;
		
		/**
		 * イベントを任意に発火させる 要素にバインドされているイベントも同時に発火する
		 *
		 * @since 0.3.0
		 * @override
		 * @param type イベントの種類
		 * @param data 発火と同時にリスナー関数に渡すハッシュデータ
		 * @param context リスナー関数の`this`コンテクスト
		 * @return デフォルトのイベントの抑制がされていないかどうか
		 */
		public trigger (type: string, data: any = {}, context: any = this): boolean {
			const defaultPrevented: boolean = super.trigger(type, data, context);
			if (defaultPrevented) {
				this.$el.trigger(type, data, context);
			}
			return defaultPrevented;
		}

		/**
		 * 要素の幅を取得
		 *
		 * @since 0.4.3
		 * @return 要素の幅
		 */
		public getWidth (): number {
			return this.$el.width();
		}

		/**
		 * 要素の高さを取得
		 *
		 * @since 0.4.3
		 * @return 要素の高さ
		 */
		public getHeight (): number {
			return this.$el.height();
		}

		/**
		 * 要素の幅を設定
		 *
		 * @since 0.4.3
		 * @param value 指定の値
		 * @return 自身
		 */
		public setWidth (value: number): PsyborgElement {
			this.$el.width(value);
			return this;
		}

		/**
		 * 要素の高さを設定
		 *
		 * @since 0.4.3
		 * @param value 指定の値
		 * @return 自身
		 */
		public setHeight (value: number): PsyborgElement {
			this.$el.height(value);
			return this;
		}

	}

}