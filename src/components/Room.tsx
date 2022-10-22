import { useUpdateRoom } from '@/hooks/rooms.hooks';
import { useRoomData } from '@/providers/RoomData.provider';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Card from './Card';
import NameVoted from './NameVoted';
import PieData from './PieData';

const cards = [1, 2, 3, 5, 8, 13, 21, 34, 55];

interface Card {
  number: number;
}

function NoRoomOrDisplay() {
  const navigate = useNavigate();

  function findRoom() {
    navigate('/');
  }

  return (
    <div>
      You must be logged in or authorized. <button onClick={findRoom}>Find Room</button>
    </div>
  );
}

function HasRoomAndDisplay({ roomName, displayName }: { roomName: string; displayName: string }) {
  const [selectedNumber, setSelectedNumber] = useState<number>();
  const roomMutation = useUpdateRoom({ roomName });
  const { roomData } = useRoomData();

  useEffect(() => {
    if (roomData) {
      if (Object.keys(roomData).includes(displayName)) {
        const found = roomData[displayName];
        setSelectedNumber(found.cardValue);
      }
    }
  }, [roomData, displayName]);

  function addCard(number: number) {
    roomMutation.mutate({
      [displayName]: {
        cardValue: number,
      },
    });
  }

  function resetSelection() {
    roomMutation.mutate({
      [displayName]: {
        cardValue: 0,
      },
    });
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
        }}
      >
        {cards.map((number) => {
          return (
            <Card
              key={number}
              buttonDisabled={typeof selectedNumber === 'number' && selectedNumber > 0}
              number={number}
              onCardClick={addCard}
              selectedNumber={selectedNumber}
            />
          );
        })}
      </div>

      {typeof roomData !== 'undefined' && <NameVoted roomData={roomData} />}

      {typeof roomData !== 'undefined' && <PieData roomData={roomData} />}

      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <button onClick={resetSelection}>Reset Selection</button>
      </div>
    </>
  );
}

export default function Room() {
  const { roomName } = useParams();
  const { state } = useLocation();

  if (!roomName || !state || (state && !state.displayName)) {
    return <NoRoomOrDisplay />;
  }

  return <HasRoomAndDisplay roomName={roomName} displayName={state.displayName} />;
}
