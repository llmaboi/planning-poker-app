import { signInAnonymously } from '@firebase/auth';
import { useMutation } from 'react-query';

function useLoginMutation() {
  return useMutation(signInAnonymously);
}

export { useLoginMutation };
