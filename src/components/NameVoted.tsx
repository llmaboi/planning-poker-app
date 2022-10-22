import { DisplayNames } from '@/hooks/rooms.hooks';
import { useEffect, useState } from 'react';

function NameVoted({ roomData }: { roomData: DisplayNames }) {
  const [displayNameAndVoted, setDisplayNameAndVoted] = useState<
    { name: string; voted: boolean }[]
  >([]);

  useEffect(() => {
    const displayNameVoted: { name: string; voted: boolean }[] = [];
    const roomDataEntries = Object.entries(roomData);
    roomDataEntries.forEach(([name, nameValue]) => {
      displayNameVoted.push({
        name,
        voted: typeof nameValue?.cardValue === 'number' && nameValue?.cardValue > 0,
      });
    });
    setDisplayNameAndVoted(displayNameVoted);
  }, [roomData]);

  //
  return (
    <>
      <h3>Display names voted results:</h3>
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
                {name}: {voted.toString()}
              </div>
            );
          })}
      </div>
    </>
  );
}

export default NameVoted;
