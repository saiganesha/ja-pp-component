// 通信の無音を見張る時間。サーバは鑑定の生成中も 20 秒ごとに keepalive を送り、
// Heroku の router は最初のバイトまで 30 秒・無音 55 秒で接続を切る。
// 75 秒なにも届かないのは通信が死んでいるときだけ（iOS Safari は画面を離れたり電波が切れたりしても、
// 通信が切れたことを知らせずに待ち続けることがある）。
export const IDLE_TIMEOUT_MS = 75000;

// 期限がこれ以上遅れて来たら、ページが止まっていた（タイマーが動けなかった）とみなす
const RESUMED_LATENESS_MS = 1000;

export interface IdleWatchdog {
  // 何か届いたら呼ぶ。75 秒を数え直す
  reset: () => void;
  // 通信が終わったら必ず呼ぶ（成功・失敗・中断・画面を閉じたとき）。以後 reset() しても動かない
  stop: () => void;
}

// 作った時点から数え始め、reset() されないまま 75 秒たったら onIdle を 1 回だけ呼ぶ。
//
// iOS Safari は画面を離れるとページごと止め、戻ったときに、止まっている間に期限の過ぎたタイマーを
// その間に届いていた通信より先に動かすことがある。そのまま打ち切ると、生きている（もう終わっている
// こともある）鑑定を「途切れた」と知らせてしまう。そこで:
//  - 画面が隠れている間に期限が来ても打ち切らず、数え直す
//  - 画面に戻ったとき（visibilitychange で visible になったとき・pageshow）も数え直す
//  - 期限が予定より大きく遅れて来たら、ページごと止まっていて今戻ったところなので、これも数え直す
//    （visibilitychange が届くより先にタイマーが走る順番でも取りこぼさない）
//  - 画面が見えている間に期限が来たら、打ち切るのを 1 タスク遅らせ、その間に何か届いて
//    reset() されたら打ち切らない（待っていた通信を先に読ませる）
export const watchIdle = (onIdle: () => void): IdleWatchdog => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let stopped = false;
  let armedAt = 0;

  const onVisibilityChange = () => {
    if (document.visibilityState === 'visible') reset();
  };

  const stop = () => {
    stopped = true;
    clearTimeout(timer);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('pageshow', reset);
  };

  const expire = () => {
    if (document.visibilityState === 'hidden' || Date.now() - armedAt > IDLE_TIMEOUT_MS + RESUMED_LATENESS_MS) {
      reset();
      return;
    }
    // reset() と stop() はこのタイマーも止める
    timer = setTimeout(() => {
      stop();
      onIdle();
    }, 0);
  };

  const reset = () => {
    if (stopped) return;
    clearTimeout(timer);
    armedAt = Date.now();
    timer = setTimeout(expire, IDLE_TIMEOUT_MS);
  };

  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('pageshow', reset);
  reset();
  return { reset, stop };
};
