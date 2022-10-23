import { connectFirebase } from '@/config/db';
import { DisplayWithId, useResetCardValues, useSetRoomLabel } from '@/hooks/rooms.hooks';
import { useRoomData } from '@/providers/RoomData.provider';
import { ChangeEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function HostHeader({
  displaysData,
  roomName,
  roomLabel,
}: {
  displaysData: DisplayWithId[] | undefined;
  roomName: string;
  roomLabel: string | undefined;
}) {
  const resetCardValuesMutation = useResetCardValues({ roomName });
  const setRoomLabelMutation = useSetRoomLabel({ roomName });
  const [label, setLabel] = useState(roomLabel || '');

  let displayNames: string[] = [];

  useEffect(() => {
    if (displaysData) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      displayNames = displaysData.map((room) => room.id);
    }
  }, [displaysData]);

  function resetCardData() {
    const newData: Pick<DisplayWithId, 'id' | 'cardValue'>[] = [];

    displayNames.forEach((name) => {
      newData.push({ id: name, cardValue: 0 });
    });
    resetCardValuesMutation.mutate({ displayData: newData });
  }

  function handleLabelChange(event: ChangeEvent<HTMLInputElement>) {
    const newLabel = event.target.value;
    setLabel(newLabel);
  }

  function updateLabel() {
    // TODO: Add verification on label...
    setRoomLabelMutation.mutate(label);
  }

  return (
    <>
      <button disabled={resetCardValuesMutation.isLoading} onClick={resetCardData}>
        Reset card data
      </button>
      <input
        disabled={setRoomLabelMutation.isLoading}
        type="text"
        value={label}
        onChange={handleLabelChange}
      />
      <button disabled={setRoomLabelMutation.isLoading} onClick={updateLabel}>
        Update label
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
  const displaysData = roomData.displays;

  useEffect(() => {
    if (displaysData) {
      const found = displaysData.find((room) => room.id === state.displayName);

      if (found) {
        if (found.isHost) {
          setIsHost(found.isHost);
        }
      }
    }
  }, [displaysData, state.displayName]);

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
      {isHost && (
        <HostHeader roomName={roomName} displaysData={displaysData} roomLabel={roomData.label} />
      )}
      {!isHost && <>Room Label: {roomData.label ? roomData.label : 'NONE'}</>}
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}

export default Header;
