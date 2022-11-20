import { Display_Firebase } from '@/api/types';

/**
 * Object I prefer to work with.
 */
interface DisplayWithId_Firebase extends Display_Firebase {
  id: string;
}

export type { DisplayWithId_Firebase  };
