import PsycleRepeat from './PsycleRepeat';
export interface IPsycleConfig {
    /**
     * `data`メソッドで取得できるインスタンスのキー文字列
     */
    instanceKey: string;
    /**
     * 最初に表示するパネル番号
     */
    startIndex: number;
    /**
     * トランジションの種類
     */
    transition: string;
    /**
     * アニメーション時間
     */
    duration: number;
    /**
     * トランジションのイージング
     */
    easing: string;
    /**
     * オートプレイの時の待機時間
     */
    delay: number;
    /**
     * オートプレイかどうか
     */
    auto: boolean;
    /**
     * アニメーション中にキャンセル可能かどうか（アニメーション中にパネル選択やパネル送りを上書きできるかどうか）
     */
    delayWhenFire: number;
    /**
     * 繰り返しの種類(NONE: 繰り返ししない, RETURN: 最後まで到達すると最初に戻る, LOOP: ループしてるかのように最初に戻る（ループに対応しているトランジションのみ））
     */
    cancel: boolean;
    /**
     * コンテナを取得するためのセレクタ
     */
    repeat: PsycleRepeat;
    /**
     * パネルを取得するためのセレクタ（コンテナからのパス）
     */
    container: string;
    /**
     * 現在のパネルに設定されるクラス名
     */
    panels: string;
    /**
     * 遷移処理が発生する(`before`関数から`fire`関数)までの遅延時間(ミリ秒)
     */
    currentClass: string;
    /**
     * ループリピートにしたときの各要素に対してのクローン要素の数
     */
    clone: number;
    /**
     * カラム(列)の数（カラム対応のトランジションのみ）
     */
    cols: number;
    /**
     * 行の数（行対応のトランジションのみ）
     */
    rows: number;
    /**
     * コンテナの横方向のオフセット（コンテナが平行移動するトランジションのみ）
     */
    offsetX: number;
    /**
     * コンテナの縦方向のオフセット（コンテナが平行移動するトランジションのみ）
     */
    offsetY: number;
    /**
     * ???
     */
    nearby: boolean;
    /**
     * マルチカラムの時のフォーカスの当たり方が内側優先かどうか、noFocusがtrueの場合は無効
     */
    innerFocus: boolean;
    /**
     * マルチカラムの時、パネルにフォーカスを当てない、また、indexは先頭の要素だけを指すことになる
     */
    noFocus: boolean;
    /**
     * リサイズによってパネルの大きさが変わる場合はtrueを渡す
     */
    resizable: boolean;
    /**
     * ドラッグによって遷移をコントロールさせる場合はtrueを渡す
     */
    draggable: boolean;
    /**
     * スワイプによって遷移をコントロールさせる場合はtrueを渡す
     */
    swipeable: boolean;
    /**
     * ドラッグの上下を抑制させる(タッチデバイスのスクロールも抑制される)場合はtrueを渡す
     */
    dragBlockVertical: boolean;
    /**
     * キーボードで操作できるようにするかどうか
     */
    bindKeyboard: boolean;
    /**
     * 一度しか表示しないパネルのフィルタセレクタ (例) .once
     */
    showOnlyOnce: string;
    /**
     * コントローラ
     */
    controller: string | Element | JQuery | null;
    /**
     * マーカー
     */
    marker: string | Element | JQuery | null;
    /**
     * サムネイル
     */
    thumbnail: string | Element | JQuery | null;
    /**
     * ???
     */
    css3: boolean;
    /**
     * ループ時のスライド専用 クローンをいくつつくるか
     */
    loopCloneLength: number | null;
    /**
     * ???
     */
    scenes: Function[];
    /**
     * 幅・高さを揃える基準
     */
    dimension: string;
    /**
     * クロスフェード
     *
     * `transition: "fede"` のときのみ有効
     * デフォルト有効
     */
    crossFade: boolean;
}
export declare type IPsycleOptions = {
    [P in keyof IPsycleConfig]?: IPsycleConfig[P];
};
