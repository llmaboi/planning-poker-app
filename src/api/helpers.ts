import { DisplayWithId_Firebase } from '@/providers/types';
import { Display, DisplayRaw } from '../../../types';

function displayIsDisplay(display: unknown): display is DisplayWithId_Firebase {
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

function displayRawToDisplay({ card_value, is_host, room_id, ...rest }: DisplayRaw): Display {
  return {
    ...rest,
    cardValue: card_value,
    isHost: is_host === 1,
    roomId: room_id,
  };
}

export { displayIsDisplay, displayRawToDisplay };
