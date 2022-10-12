import { CSSProperties } from 'react';

export default function Card({
  number,
  selectedNumber,
  buttonDisabled,
  onCardClick,
}: {
  number: number;
  selectedNumber: number | undefined;
  buttonDisabled: boolean;
  onCardClick: (number: number) => void;
}) {
  let style: CSSProperties = {
    border: '1px solid',
    height: '150px',
    width: '90px',
    margin: '5px',
    alignItems: 'center',
  };

  if (buttonDisabled) {
    style = { ...style, color: 'red', cursor: 'not-allowed' };
  }

  if (selectedNumber && selectedNumber === number) {
    style = { ...style, color: 'green' };
  }

  function handleCardClick() {
    onCardClick(number);
  }

  return (
    <button style={style} onClick={handleCardClick} disabled={buttonDisabled}>
      {number}
    </button>
  );
}
