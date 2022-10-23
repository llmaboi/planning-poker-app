import { PieChart } from 'react-minimal-pie-chart';
import { useRoomData } from '@/providers/RoomData.provider';

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

function PieData() {
  const { roomData } = useRoomData();
  const numberMap = new Map<number, number>();
  const displaysData = roomData.displays;

  /**
   * 1. Get all cards to populate pie chard
   *  -- 1. Associate cards with the user && value
   * 2. Get the card for this user (to update the card selection)
   */
  displaysData.forEach(({ cardValue }) => {
    if (typeof cardValue === 'number') {
      if (cardValue > 0) {
        const found = numberMap.get(cardValue);

        if (found) {
          const updatedValue = found + 1;
          numberMap.set(cardValue, updatedValue);
        } else {
          numberMap.set(cardValue, 1);
        }
      }
    }
  });

  const pieData = Array.from(numberMap.entries()).map(([key, val], index) => {
    return {
      title: key,
      label: () => key,
      value: val,
      color: cardColors[index],
    };
  });

  if (!pieData.length) {
    return null;
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
