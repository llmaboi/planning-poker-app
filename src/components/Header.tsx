import { writeBatch } from '@firebase/firestore';
import { useFirestoreWriteBatch } from '@react-query-firebase/firestore';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { connectFirebase } from '../config/db';
import { DisplayNames, useSubscribeRoom, useUpdateRoom } from '../hooks/rooms.hooks';

function HostHeader({
  roomData,
  roomName,
}: {
  roomData: DisplayNames | undefined;
  roomName: string;
}) {
  const roomMutation = useUpdateRoom({ roomName });
  const { firestore } = connectFirebase();
  let displayNames: string[] = [];

  useEffect(() => {
    if (roomData) {
      displayNames = Array.from(Object.keys(roomData));
    }
  }, [roomData]);

  const batch = writeBatch(firestore);
  const mutationBatch = useFirestoreWriteBatch(batch);
  function resetCardData() {
    const promises = displayNames.map((name) => {
      return roomMutation.mutateAsync({
        [name]: {
          cardValue: 0,
        },
      });
    });

    Promise.all(promises)
      .then(() => mutationBatch.mutateAsync())
      .catch(console.error);
  }

  return (
    <>
      <button disabled={mutationBatch.isLoading} onClick={resetCardData}>
        Reset card data
      </button>
    </>
  );
}

function Header() {
  const navigate = useNavigate();
  const { roomName } = useParams();
  const { state } = useLocation();

  if (!roomName || !state || (state && !state.displayName)) {
    navigate('/noAuth');
    // TODO: Correct this...
    return <div>Routing to No Auth...</div>;
  }

  const { auth } = connectFirebase();
  const roomQuery = useSubscribeRoom({ roomName });

  // TODO: Move this to a common header...
  function signOut() {
    if (auth.currentUser) {
      auth.signOut();
      navigate('/noAuth');
      // TODO: Correct this...
      return <div>Routing to No Auth...</div>;
    }
  }

  const [isHost, setIsHost] = useState(false);

  const roomData = roomQuery?.data?.data();

  useEffect(() => {
    if (roomData) {
      if (Object.keys(roomData).includes(state.displayName)) {
        const found = roomData[state.displayName];
        if (found.isHost) {
          setIsHost(found.isHost);
        }
      }
    }
  }, [roomQuery]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
      }}
    >
      {isHost && <HostHeader roomName={roomName} roomData={roomData} />}
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}

export default Header;
