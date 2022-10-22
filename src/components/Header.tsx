import { connectFirebase } from '@/config/db';
import { DisplayNames, useUpdateRoom } from '@/hooks/rooms.hooks';
import { useRoomData } from '@/providers/RoomData.provider';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function HostHeader({
  roomData,
  roomName,
}: {
  roomData: DisplayNames | undefined;
  roomName: string;
}) {
  const roomMutation = useUpdateRoom({ roomName });
  let displayNames: string[] = [];

  useEffect(() => {
    if (roomData) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      displayNames = Array.from(Object.keys(roomData));
    }
  }, [roomData]);

  function resetCardData() {
    let newData: DisplayNames = {};

    displayNames.forEach((name) => {
      newData = { ...newData, [name]: { cardValue: 0 } };
    });

    roomMutation.mutate(newData);
  }

  return (
    <>
      <button
        // disabled={mutationBatch.isLoading}
        onClick={resetCardData}
      >
        Reset card data
      </button>
    </>
  );
}

function Header() {
  const navigate = useNavigate();
  const { roomData } = useRoomData();
  const { roomName } = useParams();
  const { state } = useLocation();
  const { auth } = connectFirebase();
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    if (roomData) {
      if (Object.keys(roomData).includes(state.displayName)) {
        const found = roomData[state.displayName];
        if (found.isHost) {
          setIsHost(found.isHost);
        }
      }
    }
  }, [roomData, state.displayName]);

  if (!roomName || !state || (state && !state.displayName)) {
    navigate('/noAuth');
    // TODO: Correct this...
    return <div>Routing to No Auth...</div>;
  }

  // TODO: Move this to a common header...
  function signOut() {
    if (auth.currentUser) {
      auth.signOut();
      navigate('/noAuth');
      // TODO: Correct this...
      return <div>Routing to No Auth...</div>;
    }
  }

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
