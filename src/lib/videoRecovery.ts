export interface VideoPlaybackSnapshot {
  currentTime: number;
  playing: boolean;
  volume: number;
  muted: boolean;
  playbackRate: number;
}

export function captureVideoPlayback(video: HTMLVideoElement): VideoPlaybackSnapshot {
  return {
    currentTime: Number.isFinite(video.currentTime) ? video.currentTime : 0,
    playing: !video.paused && !video.ended,
    volume: video.volume,
    muted: video.muted,
    playbackRate: video.playbackRate,
  };
}

/** Apply after metadata is available on the replacement media element. */
export async function restoreVideoPlayback(video: HTMLVideoElement, saved: VideoPlaybackSnapshot) {
  video.volume = saved.volume;
  video.muted = saved.muted;
  video.playbackRate = saved.playbackRate;
  const end = Number.isFinite(video.duration) ? Math.max(0, video.duration - .05) : saved.currentTime;
  video.currentTime = Math.max(0, Math.min(saved.currentTime, end));
  if (saved.playing) await video.play();
}

/** A bounded probe on return, not a continuous polling loop or a blind reload. */
export function watchVideoReturn(
  video: HTMLVideoElement,
  onMissingFrames: () => void,
  page: Document = document,
  host: Window = window,
) {
  if (typeof video.requestVideoFrameCallback !== 'function') return () => {};
  let timer: ReturnType<typeof setTimeout> | undefined;
  let frame: number | undefined;
  const cancel = () => {
    clearTimeout(timer);
    if (frame !== undefined) video.cancelVideoFrameCallback(frame);
    timer = undefined;
    frame = undefined;
  };
  const eligible = () => {
    const rect = video.getBoundingClientRect();
    return !page.hidden && video.isConnected && !video.paused && !video.ended && !video.seeking
      && video.readyState >= 3 && rect.width > 0 && rect.height > 0
      && rect.bottom > 0 && rect.top < host.innerHeight && rect.right > 0 && rect.left < host.innerWidth;
  };
  const probe = () => {
    cancel();
    if (!eligible()) return;
    const position = video.currentTime;
    let frames = 0;
    const presented: VideoFrameRequestCallback = () => {
      frame = undefined;
      if (++frames >= 2) cancel();
      else frame = video.requestVideoFrameCallback(presented);
    };
    frame = video.requestVideoFrameCallback(presented);
    timer = setTimeout(() => {
      // Distinguish missing pictures from a paused player or a network stall.
      const missing = eligible() && video.currentTime > position + .25;
      cancel();
      if (missing) onMissingFrames();
    }, 1600);
  };
  page.addEventListener('visibilitychange', probe);
  host.addEventListener('focus', probe);
  host.addEventListener('pageshow', probe);
  return () => {
    cancel();
    page.removeEventListener('visibilitychange', probe);
    host.removeEventListener('focus', probe);
    host.removeEventListener('pageshow', probe);
  };
}
