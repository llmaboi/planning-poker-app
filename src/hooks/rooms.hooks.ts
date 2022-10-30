import { getRoomDisplays, resetCardValues, setRoomLabel, updateDisplay } from '@/api/firebase';
import { DisplayWithId } from '@/providers/types';
import { useMutation, useQuery } from 'react-query';

function useGetRoomDisplays({ roomName }: { roomName: string }) {
  return useQuery(['room', roomName], async () => getRoomDisplays(roomName));
}

interface UpdateDisplayProps {
  id: string;
  cardValue: number;
  isHost?: boolean;
}

/**
 * Mutation hook to update a room
 */
function useUpdateDisplay({ roomName }: { roomName: string }) {
  return useMutation(['room', roomName], ({ id, cardValue, isHost }: UpdateDisplayProps) =>
    updateDisplay({ roomName, isHost, cardValue, id })
  );
}

function useResetCardValues({ roomName }: { roomName: string }) {
  return useMutation(
    ['room', roomName],
    ({ displayData }: { displayData: Pick<DisplayWithId, 'id' | 'cardValue'>[] }) =>
      resetCardValues({ displayData, roomName })
  );
}

function useSetRoomLabel({ roomName }: { roomName: string }) {
  return useMutation(['room', roomName], (label: string) => setRoomLabel({ label, roomName }));
}

export { useGetRoomDisplays, useResetCardValues, useSetRoomLabel, useUpdateDisplay };
export type { UpdateDisplayProps };
