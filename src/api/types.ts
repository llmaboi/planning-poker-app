/**
 * FireBase Collection
 * The DocumentID is the display name.
 */
interface Display_Firebase {
  cardValue: number;
  isHost: boolean;
}

/**
 * FireBase Document
 */
interface Room_Firebase {
  displays: Display_Firebase[];
  label?: string;
}

export type { Display_Firebase, Room_Firebase };
