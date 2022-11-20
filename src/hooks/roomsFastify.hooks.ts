import { getRoomDisplays, updateDisplay } from '@/api/mysqlFastify';
import { useMutation, useQuery } from 'react-query';

function useGetRoomDisplays({ roomId }: { roomId: number }) {
  return useQuery(['room', roomId], async () => getRoomDisplays(roomId));
}

interface UpdateDisplayProps {
  id: number;
  cardValue: number;
  isHost: boolean;
  name: string;
}

/**
 * Mutation hook to update a room
 */
function useUpdateDisplay({ roomId }: { roomId: number }) {
  return useMutation(['room', roomId], ({ id, cardValue, isHost, name }: UpdateDisplayProps) =>
    updateDisplay({ roomId, id, cardValue, isHost, name })
  );
}

// function useResetCardValues({ roomName }: { roomName: string }) {
//   return useMutation(
//     ['room', roomName],
//     ({ displayData }: { displayData: Pick<DisplayWithId_Firebase, 'id' | 'cardValue'>[] }) =>
//       resetCardValues({ displayData, roomName })
//   );
// }

// function useSetRoomLabel({ roomName }: { roomName: string }) {
//   return useMutation(['room', roomName], (label: string) => setRoomLabel({ label, roomName }));
// }

export { useGetRoomDisplays, useUpdateDisplay };
export type { UpdateDisplayProps };
