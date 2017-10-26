import { IPsycleConfig, IPsycleOptions } from './IPsycleConfig';
import PsycleElement from './PsycleElement';
import PsycleContainer from './PsycleContainer';
import PsyclePanelList from './PsyclePanelList';
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
export default class Psycle extends PsycleElement {
    /**
     * 現在表示しているパネル番号
     *
     * @since 0.1.0
     * @default 0
     */
    index: number;
    /**
     * 内部的に制御する遷移先を管理するパネル番号
     *
     * @since 0.1.0
     */
    progressIndex: number;
    /**
     * 設定されているトランジションオブジェクト
     *
     * @since 0.1.0
     */
    transition: PsycleTransition;
    /**
     * スライドショーステージ要素
     *
     * @since 0.1.0
     */
    stage: PsycleStage;
    /**
     * スライドショーコンテナ要素
     *
     * @since 0.1.0
     */
    container: PsycleContainer;
    /**
     * スライドショーパネル要素リスト
     *
     * @since 0.1.0
     */
    panels: PsyclePanelList;
    /**
     * 自動再生タイマー
     *
     * @since 0.1.0
     */
    timer: number;
    /**
     * ステージの幅
     *
     * @since 0.1.0
     */
    stageWidth: number;
    /**
     * パネル個々の幅
     *
     * @since 0.1.0
     */
    panelWidth: number;
    /**
     * パネルの数
     *
     * @since 0.1.0
     */
    length: number;
    /**
     * 遷移前のパネル番号
     *
     * @since 0.1.0
     */
    from: number;
    /**
     * 遷移後のパネル番号
     *
     * @since 0.1.0
     */
    to: number;
    /**
     * 前に遷移するか次に遷移するか 番号の変化量
     *
     * @since 0.1.0
     * @default 0
     */
    vector: number;
    /**
     * 現在遷移状態かどうか
     *
     * @since 0.1.0
     * @default false
     */
    isTransition: boolean;
    /**
     * 遷移アニメーションを制御する`jQueryAnimation`インスタンス
     *
     * @since 0.1.0
     */
    animation: JQuery;
    /**
     * リピート方法
     *
     * @since 0.3.0
     */
    repeat: PsycleRepeat;
    /**
     * 自動再生の一時停止状態かどうか
     *
     * @since 0.1.0
     * @default false
     */
    isPaused: boolean;
    /**
     * 現在のクローンパネルの数
     *
     * @since 0.5.3
     * @default 0
     */
    cloneCount: number;
    /**
     * オプション
     *
     * @since 0.9.0
     */
    config: IPsycleConfig;
    /**
     * 今回処理する遷移の継続時間
     *
     * @since 0.6.0
     */
    duration: number;
    /**
     * オプション
     *
     * @deprecated
     * @since 0.1.0
     */
    private _config;
    /**
     * 今回処理する遷移の継続時間
     *
     * @deprecated
     * @since 0.3.4
     */
    private _duration;
    /**
     * 遅延処理時の内部タイマー(setTimeoutの管理ID)
     *
     * @since 0.4.3
     */
    private _delayTimer;
    /**
     * パネルの遷移回数のログ
     *
     * @since 0.7.0
     */
    private _times;
    /**
     * 除外番号
     *
     * @since 0.7.0
     */
    private _ignoreIndexes;
    constructor($el: JQuery, options?: IPsycleOptions);
    /**
     * 自動再生を開始する
     *
     * @version 0.7.1
     * @since 0.1.0
     */
    play(): this;
    /**
     * 自動再生を停止する
     *
     * @since 0.1.0
     */
    stop(): this;
    /**
     * 遷移を強制的に停止する
     * 遷移中のスタイルで固定される
     *
     * @since 0.3.4
     */
    freeze(): this;
    /**
     * 指定の番号のパネルへ遷移する
     *
     * @version 0.7.0
     * @since 0.1.0
     * @param to 遷移させるパネル番号
     * @param duration 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
     * @param direction
     */
    gotoPanel(to: number, duration?: number, direction?: number): this;
    /**
     * 前のパネルへ遷移する
     *
     * @version 0.7.0
     * @since 0.1.0
     * @param duration 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
     */
    prev(duration?: number): this;
    /**
     * 次のパネルへ遷移する
     *
     * @version 0.7.0
     * @since 0.1.0
     * @param duration 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
     */
    next(duration?: number): this;
    /**
     * リフロー処理を実行する
     *
     * @since 0.3.4
     * @param data リフロー処理時に渡す任意のデータ
     */
    reflow(data?: any): this;
    /**
     * 現在のパネルが最初のパネルかどうか
     *
     * @since 0.4.0
     */
    isFirst(): boolean;
    /**
     * 現在のパネルが最後のパネルかどうか
     *
     * @since 0.4.0
     */
    isLast(): boolean;
    /**
     * マーカーを生成する
     *
     * @version 1.0.0
     * @since 0.3.0
     * @param duration 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
     * @param currentClassAddionalEventType カレントクラスを付加するタイミング
     */
    marker(duration?: number, currentClassAddionalEventType?: string): JQuery<HTMLElement>;
    /**
     * マーカーを設定する
     *
     * @version 1.0.0
     * @since 0.5.3
     * @param $elem 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
     * @param options オプション
     */
    marked($elem: JQuery, options: {
        type?: string;
        duration?: number;
    }): void;
    /**
     * コントローラをバインドする
     *
     * @version 0.7.0
     * @since 0.4.3
     * @param $elem バインドさせるjQuery要素
     * @param options オプション
     */
    controller($elem: JQuery, options: {
        prev?: string;
        next?: string;
        duration?: number;
        ifFirstClass?: string;
        ifLastClass?: string;
        ifIgnoreClass?: string;
    }): void;
    /**
     * コントローラをバインドする
     * `controller`のエイリアス
     *
     * @since 0.5.3
     * @param {JQuery} $elem バインドさせるjQuery要素
     * @param options オプション
     * @return {JQuery} 生成したjQuery要素
     */
    ctrl($elem: JQuery, options: {
        prev?: string;
        next?: string;
        duration?: number;
        ifFirstClass?: string;
        ifLastClass?: string;
        ifIgnoreClass?: string;
    }): void;
    /**
     * 指定の番号のパネルへ遷移する
     *
     * @version 1.0.0
     * @since 0.6.0
     * @param to 遷移させるパネル番号
     * @param duration 任意のアニメーション時間 省略すると自動再生時と同じ時間になる
     * @param direction 方向
     * @param vector]
     * @param fromHalfway 中途半端な位置からの遷移かどうか
     */
    transitionTo(to: number, duration?: number, direction?: number, vector?: number, fromHalfway?: boolean): this;
    /**
     * 遷移直前の処理を実行する
     *
     * @version 0.8.2
     * @since 0.6.0
     */
    before(): void;
    /**
     * 番号の変化量の正規化
     * 一番近いパネルまでの距離(パネル数)を算出する
     *
     * @version 0.7.0
     * @since 0.3.0
     * @param to 目的のパネル番号
     * @param direction 方向
     */
    private _optimizeVector(to, direction);
    /**
     * パネル番号の正規化
     *
     * @version 0.7.0
     * @since 0.1.0
     * @param index 正規化するパネル番号
     * @param progressIndex 実際に指定されたパネル番号
     */
    private _optimizeCounter(index, progressIndex);
    /**
     * 指定したパネル番号が最初のパネルかどうか
     *
     * @version 0.7.0
     * @since 0.3.0
     * @param index 評価するパネル番号
     */
    private _isFirst(index);
    /**
     * 指定したパネル番号が最後のパネルかどうか
     *
     * @version 0.7.0
     * @since 0.3.0
     * @param index 評価するパネル番号
     */
    private _isLast(index);
    /**
     * リサイズイベントを関連付ける
     *
     * @since 0.1.0
     */
    private _resizeable();
    /**
     * 現在の状態の情報を返す
     *
     * @version 1.0.0
     * @since 0.1.0
     */
    private _getState();
    /**
     * パネル内の画像の読み込みが完了した時
     *
     * @version 1.0.0
     * @since 0.5.1
     */
    private _load();
    /**
     * 初期化処理を実行する
     *
     * @version 1.0.0
     * @since 0.1.0
     */
    private _init();
    /**
     * 初期化処理が終了したときの処理
     *
     * @version 1.0.0
     * @since 0.8.1
     */
    private _initFinished();
    /**
     * 非遷移番号移動を実行する
     *
     * @version 1.0.0
     * @since 0.1.0
     */
    private _silent();
    /**
     * 遷移時の処理を実行する
     *
     * @version 1.0.0
     * @since 0.1.0
     */
    private _fire();
    /**
     * 遷移キャンセル時の処理を実行する
     *
     * @version 1.0.0
     * @since 0.1.0
     */
    private _cancel();
    /**
     * 遷移完了時コールバック関数
     *
     * @version 0.7.0
     * @since 0.1.0
     */
    private _done();
    /**
     * 遷移後の処理を実行する
     *
     * @version 1.0.0
     * @since 0.1.0
     */
    private _after();
    /**
     * 遷移未完了で停止した場合のコールバック関数
     *
     * @since 0.1.0
     */
    private _fail();
    /**
     * すべての処理の完了後のコールバック関数
     *
     * @version 0.7.0
     * @since 0.7.0
     */
    private _finaly();
    /**
     * リサイズ中の処理を実行する
     *
     * @version 1.0.0
     * @since 0.1.0
     */
    private _resize();
    /**
     * リサイズ開始時の処理を実行する
     *
     * @since 0.9.0
     */
    private _resizeStart();
    /**
     * リサイズ終了時の処理を実行する
     *
     * @since 0.9.0
     */
    private _resizeEnd();
}
