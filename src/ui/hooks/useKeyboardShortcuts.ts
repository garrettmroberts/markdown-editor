import { useEffect } from 'react';

type KeyCombo = {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
};

type KeyHandler = (event: KeyboardEvent) => void;

export const useKeyboardShortcuts = (shortcuts: Record<string, KeyHandler>) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const combo = [
        event.ctrlKey ? 'Ctrl+' : '',
        event.altKey ? 'Alt+' : '',
        event.shiftKey ? 'Shift+' : '',
        event.metaKey ? 'Meta+' : '',
        event.key
      ].join('');

      if (shortcuts[combo]) {
        event.preventDefault();
        shortcuts[combo](event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};
