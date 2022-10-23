import { useRoomData } from '@/providers/RoomData.provider';
import { useEffect, useState } from 'react';

function NameVoted() {
  const { roomData } = useRoomData();
  const [displayNameAndVoted, setDisplayNameAndVoted] = useState<{ name: string; voted: number }[]>(
    []
  );
  const displaysData = roomData.displays;

  useEffect(() => {
    const displayNameVoted: { name: string; voted: number }[] = [];
    if (roomData) {
      displaysData.forEach(({ id, cardValue }) => {
        displayNameVoted.push({
          name: id,
          voted: cardValue,
        });
      });
    }

    displayNameVoted.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    setDisplayNameAndVoted(displayNameVoted);
  }, [displaysData, roomData]);

  const nameVoted = displayNameAndVoted.filter(({ voted }) => voted);

  return (
    <>
      <h3>Display names voted results:</h3>
      <h5>
        {nameVoted.length} of {displayNameAndVoted.length} voted
      </h5>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
        }}
      >
        {displayNameAndVoted.length === 0 && <div>No data to display</div>}
        {displayNameAndVoted.length &&
          displayNameAndVoted.map(({ name, voted }, index) => {
            return (
              <div key={index}>
                {name}: {voted}
              </div>
            );
          })}
      </div>
    </>
  );
}

export default NameVoted;
