import { useState, ChangeEvent, FormEvent } from 'react';
import { useUpdateDisplay } from '@/hooks/roomsFastify.hooks';
import { useNavigate, useParams } from 'react-router-dom';

// TODO: add to route with `id` as route param
function DisplayLogin() {
  const [displayName, setDisplayName] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [displayNameError, setDisplayNameError] = useState(false);
  const params = useParams();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const roomId = parseInt(params.id!);
  const updateDisplayMutation = useUpdateDisplay({ roomId });

  const navigate = useNavigate();

  const displayNameExists = displayName && displayName.length > 0;

  function handleDisplayChange(event: ChangeEvent<HTMLInputElement> | undefined) {
    if (event && event.target.value) {
      setDisplayName(event.target.value);
    }
  }

  function handleHost() {
    setIsHost(!isHost);
  }

  function handleCreateOrFindDisplay(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!displayNameExists) {
      setDisplayNameError(true);
      return;
    }

    updateDisplayMutation.mutate(
      { cardValue: 0, id: 1, isHost, name: displayName },
      {
        onSuccess: () => {
          // TODO: Do I need to set this data returned?

          // TODO: change this to use ID not name.
          navigate('/room/' + roomId, {
            //             state: {
            //               displayName,
            //             },
            //           });
          });
        },
      }
    );
  }

  return (
    <>
      <form
        onSubmit={handleCreateOrFindDisplay}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <label>
          Display Name:
          <input required type="text" value={displayName} onChange={handleDisplayChange} />
        </label>
        {displayNameError && <span style={{ color: 'red' }}>Display Name is required</span>}
        <label>
          Room Host:
          <input type="checkbox" checked={isHost} onChange={handleHost} />
        </label>
        <button disabled={!displayNameExists} type="submit">
          Join room
        </button>
      </form>
    </>
  );
}

export default DisplayLogin;
