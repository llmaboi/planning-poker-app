import { connectFirebase } from '@/config/db';
import { displayFromFirestore, DisplayWithId } from '@/hooks/rooms.hooks';
import { collection, doc, onSnapshot, query, QuerySnapshot, Unsubscribe } from 'firebase/firestore';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface RoomData {
  label?: string;
  displays: DisplayWithId[];
}

const RoomDataContext = createContext<{ roomData: RoomData } | undefined>(undefined);

function RoomDataProvider({ children }: { children: ReactNode }) {
  const { roomName } = useParams();
  const [roomData, setRoomData] = useState<DisplayWithId[]>([]);
  const [roomLabel, setRoomLabel] = useState<string | undefined>();
  const { firestore } = connectFirebase();

  let unsubRoom: Unsubscribe | undefined;
  let unsubRoomDisplays: Unsubscribe | undefined;

  useEffect(() => {
    return () => {
      typeof unsubRoom === 'function' && unsubRoom();
      typeof unsubRoomDisplays === 'function' && unsubRoomDisplays();
    };
  }, [unsubRoom, unsubRoomDisplays]);

  useEffect(() => {
    // TODO: This logic shouldn't live here...
    if (roomName) {
      const baseColRef = collection(firestore, 'rooms');
      const roomRef = doc(baseColRef, roomName);
      const displayRef = collection(roomRef, 'displays');
      const myQuery = query(displayRef);

      // eslint-disable-next-line react-hooks/exhaustive-deps
      unsubRoom = onSnapshot(roomRef, (querySnapshot) => {
        const roomData = querySnapshot.data();
        if (roomData && Object.hasOwn(roomData, 'label')) {
          setRoomLabel(roomData.label);
        }
      });

      // eslint-disable-next-line react-hooks/exhaustive-deps
      unsubRoomDisplays = onSnapshot(
        // TODO: I'm not sure how to fix this...
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        myQuery,
        (querySnapshot: QuerySnapshot<{ cardValue: number; isHost: boolean }>) => {
          const documents: DisplayWithId[] = [];
          querySnapshot.forEach((doc) => {
            const data = displayFromFirestore({ id: doc.id, ...doc.data() });
            if (data) documents.push(data);
          });
          setRoomData(documents);
        }
      );
    }
  }, []);

  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value: { roomData: RoomData } = { roomData: { label: roomLabel, displays: roomData } };

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
