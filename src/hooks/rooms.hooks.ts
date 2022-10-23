import { connectFirebase } from '@/config/db';
import { doc, setDoc } from '@firebase/firestore';
import { collection, getDocs, writeBatch } from 'firebase/firestore';
import { useMutation, useQuery } from 'react-query';
/**
 * FB Collection
 * The DocumentID is the display name.
 */
interface Display {
  cardValue: number;
  isHost: boolean;
}

/**
 * Object I prefer to work with.
 */
interface DisplayWithId extends Display {
  id: string;
}

/**
 * FB Document
 */
interface NewRoom {
  // Collection
  displays: Display[];
  // item on room
  label?: string;
}

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

function displayFromFirestore(display: unknown): DisplayWithId | null {
  if (displayIsDisplay(display)) {
    return {
      ...display,
    };
  }
  return null;
}

function useGetRoomDisplays({ roomName }: { roomName: string }) {
  return useQuery(['room', roomName], async () => {
    const { firestore } = connectFirebase();
    const baseColRef = collection(firestore, 'rooms');
    const roomRef = doc(baseColRef, roomName);

    const colRef = collection(roomRef, 'displays');
    const displaysSnapshot = await getDocs(colRef);
    const documents: DisplayWithId[] = [];

    displaysSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data) {
        const convertedData = displayFromFirestore({ id: doc.id, ...data });
        convertedData && documents.push(convertedData);
      }
    });
    return documents;
  });
}
/**
 * Mutation hook to update a room
 */
function useUpdateDisplay({ roomName }: { roomName: string }) {
  return useMutation(
    ['room', roomName],
    ({ id, cardValue, isHost }: { id: string; cardValue: number; isHost?: boolean }) => {
      // Set only this doc...
      const { firestore } = connectFirebase();
      const baseColRef = collection(firestore, 'rooms');
      const roomRef = doc(baseColRef, roomName);
      const colRef = collection(roomRef, 'displays');
      const displayRef = doc(colRef, id);

      if (typeof isHost === 'boolean') {
        return setDoc<Display>(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          displayRef,
          { isHost, cardValue },
          { merge: true }
        );
      }

      return setDoc<Display>(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        displayRef,
        {
          cardValue,
        },
        { merge: true }
      );
    }
  );
}

function useResetCardValues({ roomName }: { roomName: string }) {
  return useMutation(
    ['room', roomName],
    ({ displayData }: { displayData: Pick<DisplayWithId, 'id' | 'cardValue'>[] }) => {
      const { firestore } = connectFirebase();
      const batch = writeBatch(firestore);

      displayData.forEach((newDisplay) => {
        const baseColRef = collection(firestore, 'rooms');
        const roomRef = doc(baseColRef, roomName);

        const colRef = collection(roomRef, 'displays');
        const displayRef = doc(colRef, newDisplay.id);
        batch.update(displayRef, { cardValue: newDisplay.cardValue });
      });

      return batch.commit();
    }
  );
}

export { displayFromFirestore, useGetRoomDisplays, useResetCardValues, useUpdateDisplay };
export type { DisplayWithId };

