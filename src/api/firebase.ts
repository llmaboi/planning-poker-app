import { displayIsDisplay } from '@/api/helpers';
import { Display_Firebase } from '@/api/types';
import { connectFirebase } from '@/config/db';
import { UpdateDisplayProps } from '@/hooks/roomsFirebase.hooks';
import { DisplayWithId_Firebase } from '@/providers/types';
import {
  collection,
  doc,
  DocumentSnapshot,
  getDocs,
  query,
  QuerySnapshot,
  setDoc,
  writeBatch,
} from 'firebase/firestore';

/**
 * Helper Functions
 */
function displayFromFirestore(display: unknown): DisplayWithId_Firebase | null {
  if (displayIsDisplay(display)) {
    return {
      ...display,
    };
  }
  return null;
}

/**
 * Firebase (API) Functions
 */
async function getRoomDisplays(roomName: string) {
  const { firestore } = connectFirebase();
  const baseColRef = collection(firestore, 'rooms');
  const roomRef = doc(baseColRef, roomName);

  const colRef = collection(roomRef, 'displays');
  const displaysSnapshot = await getDocs(colRef);
  const documents: DisplayWithId_Firebase[] = [];

  displaysSnapshot.forEach((doc) => {
    const data = doc.data();
    if (data) {
      const convertedData = displayFromFirestore({ id: doc.id, ...data });
      convertedData && documents.push(convertedData);
    }
  });
  return documents;
}

function getRoomSnapshotQuery(roomName: string) {
  const { firestore } = connectFirebase();
  const baseColRef = collection(firestore, 'rooms');
  return doc(baseColRef, roomName);
}

function getRoomLabel(docSnap: DocumentSnapshot) {
  let label: null | string = null;
  const roomData = docSnap.data();
  if (roomData && Object.hasOwn(roomData, 'label')) {
    label = roomData.label;
  }
  return label;
}

function getRoomDisplaysSnapshotQuery(roomName: string) {
  const { firestore } = connectFirebase();
  const baseColRef = collection(firestore, 'rooms');
  const roomRef = doc(baseColRef, roomName);
  const displayRef = collection(roomRef, 'displays');
  return query(displayRef);
}

function getDisplaysFromQuerySnapshot(
  querySnapshot: QuerySnapshot<{ cardValue: number; isHost: boolean }>
): DisplayWithId_Firebase[] {
  const documents: DisplayWithId_Firebase[] = [];
  querySnapshot.forEach((doc) => {
    const data = displayFromFirestore({ id: doc.id, ...doc.data() });
    if (data) documents.push(data);
  });
  return documents;
}

async function updateDisplay({
  roomName,
  isHost,
  cardValue,
  id,
}: UpdateDisplayProps & { roomName: string }) {
  // Set only this doc...
  const { firestore } = connectFirebase();
  const baseColRef = collection(firestore, 'rooms');
  const roomRef = doc(baseColRef, roomName);
  const colRef = collection(roomRef, 'displays');
  const displayRef = doc(colRef, id);

  if (typeof isHost === 'boolean') {
    return setDoc<Display_Firebase>(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      displayRef,
      { isHost, cardValue },
      { merge: true }
    );
  }

  return setDoc<Display_Firebase>(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    displayRef,
    {
      cardValue,
    },
    { merge: true }
  );
}

async function resetCardValues({
  displayData,
  roomName,
}: {
  displayData: Pick<DisplayWithId_Firebase, 'id' | 'cardValue'>[];
  roomName: string;
}) {
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

function setRoomLabel({ label, roomName }: { label: string; roomName: string }) {
  const { firestore } = connectFirebase();
  const baseColRef = collection(firestore, 'rooms');
  const roomRef = doc(baseColRef, roomName);

  return setDoc(roomRef, { label }, { merge: true });
}

export {
  displayFromFirestore,
  getDisplaysFromQuerySnapshot,
  getRoomDisplays,
  getRoomDisplaysSnapshotQuery,
  getRoomLabel,
  getRoomSnapshotQuery,
  resetCardValues,
  setRoomLabel,
  updateDisplay,
};
