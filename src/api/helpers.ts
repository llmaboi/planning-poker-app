import { DisplayWithId } from '@/providers/types';

function displayIsDisplay(display: unknown): display is DisplayWithId {
  if (display && typeof display === 'object') {
    if (
      Object.hasOwn(display, 'cardValue') &&
      Object.hasOwn(display, 'isHost') &&
      Object.hasOwn(display, 'id')
    ) {
      return true;
    }
  }
  return false;
}

export { displayIsDisplay };
