import { useCallback } from 'react';

const useSoundEffects = () => {
  const playSound = useCallback((type) => {
    const audio = new Audio();
    
    switch (type) {
      case 'enter_dungeon':
        audio.src = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3';
        break;
      case 'complete_dungeon':
        audio.src = 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3';
        break;
      case 'level_up':
        audio.src = 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3';
        break;
      case 'skill_activate':
        audio.src = 'https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3';
        break;
      default:
        return;
    }

    audio.volume = 0.3;
    audio.play().catch(() => {
      // Ignore errors if sound can't be played
    });
  }, []);

  return { playSound };
};

export default useSoundEffects;
