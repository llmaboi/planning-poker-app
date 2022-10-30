/**
 * FireBase Collection
 * The DocumentID is the display name.
 */
interface Display {
  cardValue: number;
  isHost: boolean;
}

/**
 * FireBase Document
 */
interface Room {
  displays: Display[];
  label?: string;
}

export type { Display, Room };
