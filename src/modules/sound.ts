// sound.ts

import { soundEffects, backgroundMusic } from "./gameCore";
import { soundValueContainer } from "./ui";
import { desaturateEffect } from "./slot";

// Audio states
export enum AudioStates {
  MusicAndSounds, // 0
  SoundsOnly, // 1
  Muted, // 2
}
export let currentAudioState: AudioStates = AudioStates.MusicAndSounds;

export function initSound() {
  soundValueContainer.on("pointerdown", function () {
    const totalStates = Object.values(AudioStates).filter(
      (v) => typeof v === "number"
    ).length;

    currentAudioState = (currentAudioState + 1) % totalStates;

    const allSprite = soundValueContainer.children[0];
    const effectsSprite = soundValueContainer.children[1];
    const offSprite = soundValueContainer.children[2];

    if (currentAudioState === 0) {
      allSprite.visible = true;
      effectsSprite.visible = false;
      offSprite.visible = false;
      if (backgroundMusic) {
        backgroundMusic.play();
      }
    } else if (currentAudioState === 1) {
      allSprite.visible = false;
      effectsSprite.visible = true;
      offSprite.visible = false;
      if (backgroundMusic) {
        backgroundMusic.stop();
      }
    } else if (currentAudioState === 2) {
      allSprite.visible = true;
      effectsSprite.visible = false;
      offSprite.filters = [desaturateEffect];
      offSprite.visible = true;
      if (backgroundMusic) {
        backgroundMusic.stop();
      }
    }

    playSoundEffect("btn_click");
  });
}
export function playSoundEffect(effectName: string) {
  if (currentAudioState !== AudioStates.Muted) {
    soundEffects[effectName]?.play();
  }
}
