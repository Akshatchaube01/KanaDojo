import { Howl } from 'howler';

const sounds = {
  flip: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'],
    volume: 0.5
  }),
  correct: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3'],
    volume: 0.5
  }),
  achievement: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'],
    volume: 0.7
  })
};

export const useSound = () => {
  const playSound = (soundName: keyof typeof sounds) => {
    sounds[soundName].play();
  };

  return { playSound };
};