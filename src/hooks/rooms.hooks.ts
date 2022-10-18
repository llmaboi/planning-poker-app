import { doc, setDoc } from '@firebase/firestore';
import { useFirestoreDocument } from '@react-query-firebase/firestore';
import { DocumentReference, getDoc } from 'firebase/firestore';
import { useMutation, useQuery } from 'react-query';
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
function getRoom({ roomName }: RoomNameProps): DocumentReference<DisplayNames> {
  const { firestore } = connectFirebase();

  return doc(firestore, 'rooms', roomName);
}

type GetRoomProps = RoomNameProps;

/**
 * Query hook to get a room by name
 */
function useGetRoom({ roomName }: GetRoomProps) {
  return useQuery(['rooms', roomName], async () => {
    const foundDoc = await getDoc<DisplayNames>(getRoom({ roomName }));

    const myData = foundDoc.data();

    return myData;
  });
}

/**
 * Use the firestore react query package to subscribe to a snapshot.
 */
function useSubscribeRoom({ roomName }: GetRoomProps) {
  return useFirestoreDocument<DisplayNames>(['rooms', roomName], getRoom({ roomName }), {
    subscribe: true,
  });
}

type UpdateRoomProps = RoomNameProps;
/**
 * Mutation hook to update a room
 */
function useUpdateRoom({ roomName }: UpdateRoomProps) {
  return useMutation(['room', roomName], (newRoomData: DisplayNames) => {
    return setDoc<DisplayNames>(
      getRoom({ roomName }),
      {
        ...newRoomData,
      },
      { merge: true }
    );
  });
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
  // TODO: TS-ify me!
  return useMutation(({ roomName, displayName, isHost }: CreateRoomProps) => {
    return setDoc(
      getRoom({ roomName }),
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

export { useMutateRoomAndDisplayName, useGetRoom, useSubscribeRoom, useUpdateRoom };
export type { DisplayNames };
