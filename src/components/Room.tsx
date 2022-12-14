import { useUpdateDisplay } from '@/hooks/rooms.hooks';
import { useRoomData } from '@/providers/RoomData.provider';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Card from './Card';
import NameVoted from './NameVoted';
import PieData from './PieData';
import '@/components/Room.css';

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
  const displayMutation = useUpdateDisplay({ roomName });
  const { roomData } = useRoomData();
  const displaysData = roomData.displays;

  useEffect(() => {
    if (displaysData) {
      const found = displaysData.find((display) => display.id === displayName);
      if (found) {
        setSelectedNumber(found.cardValue);
      }
    }
  }, [displaysData, displayName]);

  function addCard(number: number) {
    displayMutation.mutate({
      cardValue: number,
      id: displayName,
    });
  }

  function resetSelection() {
    displayMutation.mutate({
      cardValue: 0,
      id: displayName,
    });
  }

  return (
    <>
      <div className="cards-wrapper">
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

      {typeof roomData !== 'undefined' && <NameVoted />}

      {typeof roomData !== 'undefined' && <PieData />}

      <div className="reset-selection">
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
