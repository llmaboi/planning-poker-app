import { signInAnonymously } from '@firebase/auth';
import { useMutation } from 'react-query';

// TODO: Next set of changes:
//   ADD:
//     -- More strict TS
//     -- Alias paths
//     -- Api files to contain core firestore logic
//     -- Add option to add "label" to the room...
//   Remove:
//     -- @react-query-firebase/auth
//     -- @react-query-firebase/firestore
//   Modify:
//     -- All endpoints to be base react-query calls
//     -- hooks to use "api files"

function useLoginMutation() {
  return useMutation(signInAnonymously);
}

export { useLoginMutation };
