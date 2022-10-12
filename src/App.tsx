import { useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import { useAuthUser } from '@react-query-firebase/auth';
import { connectFirebase } from './db';
import { signInAnonymously, signOut } from 'firebase/auth';
import { collection, doc, writeBatch } from 'firebase/firestore';
import {
  useFirestoreCollectionMutation,
  useFirestoreDocumentDeletion,
  useFirestoreQuery,
  useFirestoreQueryData,
  useFirestoreWriteBatch,
} from '@react-query-firebase/firestore';
import Card from './Card';
import { PieChart } from 'react-minimal-pie-chart';

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

function App() {
  const [selectedNumber, setSelectedNumber] = useState<number>();
  const { auth, firestore } = connectFirebase();
  const user = useAuthUser(['user'], auth);
  const ref = collection(firestore, 'cards');

  // Provide the query to the hook
  const query = useFirestoreQuery(['cards'], ref, { subscribe: true });
  const mutation = useFirestoreCollectionMutation(ref);

  const batch = writeBatch(firestore);

  const mutationBatch = useFirestoreWriteBatch(batch);

  if (user.isLoading) {
    return <div>user loading...</div>;
  }

  function handleAnonymous() {
    signInAnonymously(auth);
  }

  function addCard(number: number) {
    setSelectedNumber(number);
    mutation.mutate({
      number: number,
    });
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

  query.data?.forEach((childSnapshot) => {
    const childNumber = childSnapshot.data().number;
    queryIds.push(childSnapshot.id);
    const found = numberMap.get(childNumber);

    if (found) {
      const updatedValue = found + 1;
      numberMap.set(childNumber, updatedValue);
    } else {
      numberMap.set(childNumber, 1);
    }
  });

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
    <div className='App'>
      {user.data ? (
        <div>Welcome {user.data.uid}!</div>
      ) : (
        <button onClick={handleAnonymous}>Sign in anonymous</button>
      )}

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
              buttonDisabled={
                mutationBatch.isLoading || typeof selectedNumber === 'number'
              }
              number={number}
              onCardClick={addCard}
              selectedNumber={selectedNumber}
            />
          );
        })}
      </div>

      {query.isLoading ? (
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
                    `${dataEntry.title} | ${
                      Math.round(dataEntry.percentage) + '%'
                    }`
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
      )}

      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <button onClick={resetSelection}>Reset Selection</button>

        <button disabled={mutationBatch.isLoading} onClick={resetCardData}>
          Reset card data
        </button>
      </div>
    </div>
  );
}

export default App;
