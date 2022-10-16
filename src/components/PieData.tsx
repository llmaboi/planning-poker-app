import { PieChart } from 'react-minimal-pie-chart';
import { useGetRoom } from '../hooks/rooms.hooks';

const cardColors = [
  '#8D5A97',
  '#907F9F',
  '#A4A5AE',
  '#B0C7BD',
  '#B8EBD0',
  '#14342B',
  '#60935D',
  '#BAB700',
  '#BBDFC5',
];

function PieData({ roomName }: { roomName: string }) {
  const roomQuery = useGetRoom({ roomName, subscribe: true });

  const roomData = roomQuery?.data?.data();

  const numberMap = new Map<number, number>();
  /**
   * 1. Get all cards to populate pie chard
   *  -- 1. Associate cards with the user && value
   * 2. Get the card for this user (to update the card selection)
   */
  if (roomData) {
    Array.from(Object.entries(roomData)).forEach(([, displayNameData]) => {
      if (typeof displayNameData.cardValue === 'number') {
        if (displayNameData.cardValue > 0) {
          const found = numberMap.get(displayNameData.cardValue);

          if (found) {
            const updatedValue = found + 1;
            numberMap.set(displayNameData.cardValue, updatedValue);
          } else {
            numberMap.set(displayNameData.cardValue, 1);
          }
        }
      }
    });
  }

  const pieData = Array.from(numberMap.entries()).map(([key, val], index) => {
    return {
      title: key,
      label: () => key,
      value: val,
      color: cardColors[index],
    };
  });

  if (roomQuery.isLoading) {
    return <div>Data is loading...</div>;
  }

  if (!pieData.length) {
    return <div>No data found...</div>;
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {pieData.length > 0 && (
        <div
          style={{
            height: '400px',
            width: '400px',
          }}
        >
          <PieChart
            data={pieData}
            label={({ dataEntry }) =>
              `${dataEntry.title} | ${Math.round(dataEntry.percentage) + '%'}`
            }
            labelStyle={(index) => ({
              fill: cardColors[index],
              fontSize: '5px',
              fontFamily: 'sans-serif',
            })}
            radius={42}
            labelPosition={112}
            style={{ overflow: 'visible' }}
          />
        </div>
      )}
    </div>
  );
}

export default PieData;
