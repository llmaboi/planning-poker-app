import { websocketRoomDisplays } from '@/api/mysqlFastify';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Display } from '../../../types';

interface RoomData {
  // label: string | null;
  displays: Display[];
}

const RoomDataContext = createContext<{ roomData: RoomData } | undefined>(undefined);

function RoomDataProvider({ children }: { children: ReactNode }) {
  const { roomId } = useParams();
  const [displays, setDisplays] = useState<Display[]>([]);

  // const [roomLabel, setRoomLabel] = useState<string | null>(null);

  let unSubDisplays: WebSocket | undefined;

  useEffect(() => {
    return () => {
      unSubDisplays && unSubDisplays.close();
    };
  }, [unSubDisplays]);

  useEffect(() => {
    if (roomId) {
      const parsedRoomId = parseInt(roomId);
      const { websocket } = websocketRoomDisplays(parsedRoomId, setDisplays);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      unSubDisplays = websocket;
    }
  }, [roomId]);

  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value: { roomData: RoomData } = { roomData: { displays: displays } };

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
