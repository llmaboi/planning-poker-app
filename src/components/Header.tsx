import { connectFirebase } from '@/config/db';
import { DisplayWithId, useResetCardValues } from '@/hooks/rooms.hooks';
import { useRoomData } from '@/providers/RoomData.provider';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function HostHeader({
  roomData,
  roomName,
}: {
  roomData: DisplayWithId[] | undefined;
  roomName: string;
}) {
  const resetCardValuesMutation = useResetCardValues({ roomName });
  let displayNames: string[] = [];

  useEffect(() => {
    if (roomData) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      displayNames = roomData.map((room) => room.id);
    }
  }, [roomData]);

  function resetCardData() {
    const newData: Pick<DisplayWithId, 'id' | 'cardValue'>[] = [];

    displayNames.forEach((name) => {
      newData.push({ id: name, cardValue: 0 });
    });
    resetCardValuesMutation.mutate({ displayData: newData });
  }

  // TODO: Add option to update room "label"

  return (
    <>
      <button disabled={resetCardValuesMutation.isLoading} onClick={resetCardData}>
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
      const found = roomData.find((room) => room.id === state.displayName);

      if (found) {
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
      {!isHost && <>ROOM NAME WIP</>}
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}

export default Header;
