let currentAudio: HTMLAudioElement | null = null;

/** Pause any other playing audio, then mark this one as active. */
export function claimAudioPlayback(audio: HTMLAudioElement) {
  if (currentAudio && currentAudio !== audio) {
    currentAudio.pause();
  }
  currentAudio = audio;
}

/** Clear active audio when this element stops (if it was the active one). */
export function releaseAudioPlayback(audio: HTMLAudioElement) {
  if (currentAudio === audio) {
    currentAudio = null;
  }
}

/** Stop every registered audio player on the page (e.g. before opening video). */
export function stopAllAudioPlayback() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
}
