import { doc, setDoc } from '@firebase/firestore';
import {
  useFirestoreDocument,
  useFirestoreDocumentMutation,
  UseFirestoreHookOptions,
} from '@react-query-firebase/firestore';
import { useMutation } from 'react-query';
import { connectFirebase } from '../config/db';

/**
 * FB Collection
 */
// interface Rooms {
//   [key: string]: DisplayNames;
// }

/**
 * FB Collection
 */
interface DisplayNames {
  [key: string]: DisplayName;
}

/**
 * FB Document
 */
interface DisplayName {
  cardValue: number;
  isHost?: boolean;
}

interface RoomNameProps {
  roomName: string;
}

/**
 * Get a specific room DocumentReference
 */
function getRoom({ roomName }: RoomNameProps) {
  const { firestore } = connectFirebase();

  return doc(firestore, 'rooms', roomName);
}

type GetRoomProps = RoomNameProps & UseFirestoreHookOptions;

/**
 * Query hook to get a room by name
 */
function useGetRoom({ roomName, ...props }: GetRoomProps) {
  return useFirestoreDocument<DisplayNames>(['rooms', roomName], getRoom({ roomName }), {
    ...props,
  });
}

type UpdateRoomProps = RoomNameProps;
/**
 * Mutation hook to update a room
 */
function useUpdateRoom({ roomName }: UpdateRoomProps) {
  return useFirestoreDocumentMutation<DisplayNames>(getRoom({ roomName }), { merge: true });
}

type CreateRoomProps = RoomNameProps & { displayName: string; isHost: boolean }; // & DisplayNames;

/**
 * Get rooms CollectionReference
 */
// function getRooms({ roomName }: CreateRoomProps) {
//   const { firestore } = connectFirebase();

//   return collection(firestore, 'rooms', roomName);
// }

/**
 * Mutation hook to create or update a room
 * returns undefined (no data) // TODO: Figure out how to type this...
 */
function useMutateRoomAndDisplayName() {
  const { firestore } = connectFirebase();

  // TODO: TS-ify me!
  return useMutation(({ roomName, displayName, isHost }: CreateRoomProps) => {
    return setDoc(
      doc(firestore, 'rooms', roomName),
      {
        [displayName]: {
          cardValue: 0,
          isHost,
        },
      },
      { merge: true }
    );
  });
}

// function useGetDisplayNameByRoom() {
//   const { firestore } = connectFirebase();

//   return useQuery(
//     ['displayName'],
//     //
//     ({ queryKey }) => {
//       const colRef = collection(firestore, 'rooms', roomName);
//       const ref = doc(
//         colRef,
//         'rooms',
//         displayName
//         //
//       );

//       return getDoc(ref);
//     }
//   );
// }

export { useMutateRoomAndDisplayName, useGetRoom, useUpdateRoom };
export type { DisplayNames };
