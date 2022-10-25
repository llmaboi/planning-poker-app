import { useRoomData } from '@/providers/RoomData.provider';
import { useEffect, useState } from 'react';
import '@/components/NameVoted.css';

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
    <section className="name-voted-wrapper">
      <h3>Room voting results:</h3>
      <h5>
        {nameVoted.length} of {displayNameAndVoted.length} voted
      </h5>
      <div className="voted-wrapper">
        {displayNameAndVoted.length === 0 && <div>No data to display</div>}
        {displayNameAndVoted.length &&
          displayNameAndVoted.map(({ name, voted }, index) => {
            return (
              <p key={index}>
                {name}: {voted}
              </p>
            );
          })}
      </div>
    </section>
  );
}

export default NameVoted;
