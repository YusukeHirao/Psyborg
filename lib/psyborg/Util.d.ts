/**
 * ユーティリティ関数郡
 *
 * @since 0.3.4
 */
export default class Util {
    /**
     * 距離(px)と継続時間(ms)から速度(px/ms)を得る
     *
     * @since 0.3.4
     * @param distance 距離(px)
     * @param duration 継続時間(ms)
     * @return 速度(px/ms)
     */
    static getSpeed(distance: number, duration: number): number;
    /**
     * 距離(px)と速度(px/ms)から継続時間(ms)を得る
     *
     * @since 0.3.4
     * @param distance 距離(px)
     * @param speed 速度(px/ms)
     * @return 継続時間(ms)
     */
    static getDuration(distance: number, speed: number): number;
    /**
     * 継続時間(ms)と速度(px/ms)から距離(px)を得る
     *
     * @since 0.3.4
     * @param duration 継続時間(ms)
     * @param speed 速度(px/ms)
     * @return 距離(px)
     */
    static getDistance(duration: number, speed: number): number;
    /**
     *
     * @test test/util.html
     */
    static getloopSeriesNumber(n: number, length: number): number;
    /**
     *
     * @param direction 0 or 1 or -1 0は一番近い数字を算出する
     * @test test/util2.getloopSeriesVector.js
     */
    static getloopSeriesVector(from: number, to: number, direction: number, length: number): number;
    /**
     * 小数点切り捨て(0に近づける)
     *
     * @param num 対象の数値
     */
    static roundDown(num: number): number;
    /**
     * 小数点切り上げ(0から遠ざける)
     *
     * @param num 対象の数値
     */
    static roundUp(num: number): number;
}
