import {
  useFirestoreCollectionMutation,
  useFirestoreDocument,
  useFirestoreQuery,
  useFirestoreWriteBatch,
} from '@react-query-firebase/firestore';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { useState } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Card from './Card';
import { connectFirebase } from './db';

const cards = [1, 2, 3, 5, 8, 13, 21, 34, 55];
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
  const { auth, firestore, database } = connectFirebase();
  // const collectionRef = collection(firestore, roomName);
  const ref = doc(firestore, 'rooms', roomName);
  // const cardCollection = collection(ref, 'cards');
  const allCardsQuery = useFirestoreDocument(['cards'], ref);
  // const allCards = useFirestoreDocument(
  //   ['cards'],
  //   ref
  //   // { subscribe: true }
  // );

  // const ref = collection(firestore, 'rooms')
  // // database. //, roomName);

  // // Provide the query to the hook
  // const query = useFirestoreQuery(['cards'], ref, { subscribe: true });
  // const mutation = useFirestoreCollectionMutation(ref);

  const batch = writeBatch(firestore);

  const mutationBatch = useFirestoreWriteBatch(batch);

  function addCard(number: number) {
    setSelectedNumber(number);
    // mutation.mutate({
    //   number: number,
    // });
  }

  function resetCardData() {
    // setDisableButtons(true);
    // todo
    const promises = queryIds.map((id) => {
      return batch.delete(doc(collection(firestore, 'cards'), id));
    });

    Promise.all(promises)
      .then(() => mutationBatch.mutateAsync())
      .catch(console.error)
      .finally(() => setSelectedNumber(undefined));
  }

  const queryIds: string[] = [];
  const numberMap = new Map<number, number>();

  // const userCard:
  /**
   * 1. Get all cards to populate pie chard
   *  -- 1. Associate cards with the user && value
   * 2. Get the card for this user (to update the card selection)
   */
  console.log(allCardsQuery);
  if (allCardsQuery.data) {
    console.log('allCards.data: ', allCardsQuery.data);
    console.log('test: ', allCardsQuery.data.data());
    const abc = allCardsQuery.data.data();
    console.log(typeof abc, abc);
    // abc.forEach((querySnapshot) => {
    //   console.log('querySnapshot: ', querySnapshot.data());
    // });
  }

  // query.data?.forEach((childSnapshot) => {
  //   const childNumber = childSnapshot.data().number;
  //   queryIds.push(childSnapshot.id);
  //   const found = numberMap.get(childNumber);

  //   if (found) {
  //     const updatedValue = found + 1;
  //     numberMap.set(childNumber, updatedValue);
  //   } else {
  //     numberMap.set(childNumber, 1);
  //   }
  // });

  function resetSelection() {
    setSelectedNumber(undefined);
  }

  const pieData = Array.from(numberMap.entries()).map(([key, val], index) => {
    return {
      title: key,
      label: () => key,
      value: val,
      color: cardColors[index],
    };
  });

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
              buttonDisabled={mutationBatch.isLoading || typeof selectedNumber === 'number'}
              number={number}
              onCardClick={addCard}
              selectedNumber={selectedNumber}
            />
          );
        })}
      </div>

      {/* {query.isLoading ? (
        <div>loading counts</div>
      ) : (
        <>
          {!pieData.length && <div>No cards found</div>}
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
        </>
      )} */}

      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <button onClick={resetSelection}>Reset Selection</button>

        <button disabled={mutationBatch.isLoading} onClick={resetCardData}>
          Reset card data
        </button>
      </div>
    </>
  );
}

export default function Room() {
  const { roomName } = useParams();
  const {
    state: { displayName },
  } = useLocation();

  if (!roomName || !displayName) {
    return <NoRoomOrDisplay />;
  }

  return <HasRoomAndDisplay roomName={roomName} displayName={displayName} />;
}
