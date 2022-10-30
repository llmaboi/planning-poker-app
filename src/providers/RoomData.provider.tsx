import {
  getDisplaysFromQuerySnapshot,
  getRoomDisplaysSnapshotQuery,
  getRoomLabel,
  getRoomSnapshotQuery,
} from '@/api/firebase';
import { DisplayWithId } from '@/providers/types';
import { DocumentSnapshot, onSnapshot, QuerySnapshot, Unsubscribe } from 'firebase/firestore';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface RoomData {
  label: string | null;
  displays: DisplayWithId[];
}

const RoomDataContext = createContext<{ roomData: RoomData } | undefined>(undefined);

function RoomDataProvider({ children }: { children: ReactNode }) {
  const { roomName } = useParams();
  const [roomData, setRoomData] = useState<DisplayWithId[]>([]);
  const [roomLabel, setRoomLabel] = useState<string | null>(null);

  let unsubRoom: Unsubscribe | undefined;
  let unsubRoomDisplays: Unsubscribe | undefined;

  useEffect(() => {
    return () => {
      typeof unsubRoom === 'function' && unsubRoom();
      typeof unsubRoomDisplays === 'function' && unsubRoomDisplays();
    };
  }, [unsubRoom, unsubRoomDisplays]);

  useEffect(() => {
    if (roomName) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      unsubRoom = onSnapshot(
        getRoomSnapshotQuery(roomName),
        (documentSnapshot: DocumentSnapshot) => {
          setRoomLabel(getRoomLabel(documentSnapshot));
        }
      );

      // eslint-disable-next-line react-hooks/exhaustive-deps
      unsubRoomDisplays = onSnapshot(
        // TODO: I'm not sure how to fix this...
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getRoomDisplaysSnapshotQuery(roomName),
        (querySnap: QuerySnapshot<{ cardValue: number; isHost: boolean }>) => {
          setRoomData(getDisplaysFromQuerySnapshot(querySnap));
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
