import { connectFirebase } from '@/config/db';
import { DisplayNames } from '@/hooks/rooms.hooks';
import { doc, DocumentSnapshot, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const RoomDataContext = createContext<{ roomData: DisplayNames | undefined } | undefined>(
  undefined
);

function RoomDataProvider({ children }: { children: ReactNode }) {
  const { roomName } = useParams();
  const [roomData, setRoomData] = useState<DisplayNames>();
  const { firestore } = connectFirebase();

  let unsub: Unsubscribe | undefined;

  useEffect(() => {
    return () => {
      typeof unsub === 'function' && unsub();
    };
  }, [unsub]);

  useEffect(() => {
    if (roomName) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      unsub = onSnapshot<DisplayNames>(
        doc(firestore, 'rooms', roomName),
        (doc: DocumentSnapshot<DisplayNames>) => {
          setRoomData(doc.data());
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
