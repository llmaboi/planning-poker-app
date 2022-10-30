import { Display } from '@/api/types';

/**
 * Object I prefer to work with.
 */
interface DisplayWithId extends Display {
  id: string;
}

export type { DisplayWithId };
