import { connectFirebase } from '@/config/db';
import { displayFromFirestore, DisplayWithId } from '@/hooks/rooms.hooks';
import {
  collection,
  doc,
  DocumentSnapshot,
  onSnapshot,
  Unsubscribe,
  getDocs,
  query,
  where,
  QuerySnapshot,
} from 'firebase/firestore';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const RoomDataContext = createContext<{ roomData: DisplayWithId[] | undefined } | undefined>(
  undefined
);

function RoomDataProvider({ children }: { children: ReactNode }) {
  const { roomName } = useParams();
  const [roomData, setRoomData] = useState<DisplayWithId[]>();
  const { firestore } = connectFirebase();

  let unsub: Unsubscribe | undefined;

  useEffect(() => {
    return () => {
      typeof unsub === 'function' && unsub();
    };
  }, [unsub]);

  useEffect(() => {
    // TODO: This logic shouldn't live here...
    if (roomName) {
      const baseColRef = collection(firestore, 'rooms');
      const roomRef = doc(baseColRef, roomName);
      const displayRef = collection(roomRef, 'displays');
      const myQuery = query(displayRef);

      // eslint-disable-next-line react-hooks/exhaustive-deps
      unsub = onSnapshot(
        // TODO: I'm unsure how to solve this error...
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        myQuery,
        (
          querySnapshot: QuerySnapshot<{
            cardValue: number;
            isHost: boolean;
          }>
        ) => {
          const documents: DisplayWithId[] = [];
          querySnapshot.forEach((doc) => {
            const data = displayFromFirestore({ id: doc.id, ...doc.data() });
            if (data) {
              documents.push(data);
            }
          });
          setRoomData(documents);
        }
      );
    }
  }, []);

  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = { roomData };

  return <RoomDataContext.Provider value={value}>{children}</RoomDataContext.Provider>;
}

function useRoomData() {
  const context = useContext(RoomDataContext);
  if (context === undefined) {
    throw new Error('useRoomData must be used within a RoomDataProvider');
  }
  return context;
}

export { useRoomData, RoomDataProvider };
