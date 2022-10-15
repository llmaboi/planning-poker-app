import { signInAnonymously } from '@firebase/auth';
import { collection } from '@firebase/firestore';
import { useAuthUser } from '@react-query-firebase/auth';
import { addDoc, doc, DocumentData, DocumentReference, getDoc } from 'firebase/firestore';
import { ChangeEvent, useState } from 'react';
import { useMutation } from 'react-query';
import { connectFirebase } from './db';
import { useNavigate } from 'react-router-dom';

// export declare function signInAnonymously(auth: Auth): Promise<UserCredential>;
async function getRoom({
  roomName,
  displayName,
}: {
  roomName: string;
  displayName: string;
}): Promise<DocumentReference<DocumentData>> {
  const { auth, firestore, database } = connectFirebase();

  const docRef = doc(firestore, 'rooms', roomName);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log('Document data:', docSnap.data());
    console.log('docRef:', docRef);
    return docRef;
  }

  console.log('No such document!');
  const newDocRef = await addDoc(collection(firestore, 'rooms'), {
    cards: {
      displayName: displayName,
    },
  });
  console.log('Document written with ID: ', newDocRef);
  return newDocRef;
}

function useMyRoom() {
  return useMutation(getRoom, {
    onSuccess: (data) => {
      console.log('room: ', data);
    },
  });
}

function useMyLogin() {
  return useMutation(signInAnonymously, {
    onSuccess: (data) => {
      console.log('login: ', data);
    },
  });
}

export default function Login() {
  const { auth, firestore, database } = connectFirebase();
  const user = useAuthUser(['user'], auth);
  const [displayName, setDisplayName] = useState<string>('');
  const [roomName, setRoomName] = useState<string>('');
  // const ref = collection(firestore, 'rooms');
  const loginMutation = useMyLogin();
  const roomMutation = useMyRoom();
  const navigate = useNavigate();

  if (user.isLoading) {
    return <div>user loading...</div>;
  }

  function handleAnonymous() {
    signInAnonymously(auth);
  }

  function signOut() {
    if (auth.currentUser) {
      auth.signOut();
    }
  }

  function handleRoomNameChange(event: ChangeEvent<HTMLInputElement> | undefined) {
    if (event && event.target.value) {
      setRoomName(event.target.value);
    }
  }

  function handleDisplayChange(event: ChangeEvent<HTMLInputElement> | undefined) {
    if (event && event.target.value) {
      setDisplayName(event.target.value);
    }
  }

  function handleRoomCheck() {
    // TODO: I cannot make requests without auth...
    //   take in  room && username
    console.log('roomCheck');
    loginMutation.mutate(auth, {
      onSuccess: (data) => {
        console.log('success data: ', data);
        roomMutation.mutate(
          { roomName, displayName },
          {
            onSuccess: (data2) => {
              console.log('data2: ', data2);
              navigate('/room/' + roomName, {
                state: {
                  displayName,
                },
              });
            },
          }
        );
      },
    });
  }

  // TODO: before they can login they must select a "room"
  //   If not selecting a room, then create a room
  //   And when they select a "room" they must add a "user-name"
  /**
   * 1. Require "room" code
   * 2. Setup room if none, otherwise join existing
   * 3. Require "display_name"
   * 4. Auth user && add the "display_name" to room.
   */

  const roomNameExists = roomName && roomName.length > 0;
  const displayNameExists = displayName && displayName.length > 0;
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label>
          Room Name: <input required type="text" value={roomName} onChange={handleRoomNameChange} />
        </label>
        {!roomNameExists && <span style={{ color: 'red' }}>Room Name is required</span>}
        <label>
          Display Name:
          <input required type="text" value={displayName} onChange={handleDisplayChange} />
        </label>
        {!displayNameExists && <span style={{ color: 'red' }}>Display Name is required</span>}
        <button onClick={handleRoomCheck}>Check for Room</button>
      </div>
      {/* {user.data ? (
        <>
          <div>Welcome {user.data.uid}!</div>
          <button onClick={signOut}>Sign out</button>
        </>
      ) : (
        <button onClick={handleAnonymous}>Sign in anonymous</button>
      )} */}
    </>
  );
}
