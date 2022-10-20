import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectFirebase } from '@/config/db';
import { useLoginMutation } from '@/hooks/login.hooks';
import { useMutateRoomAndDisplayName } from '@/hooks/rooms.hooks';

function Login() {
  const { auth } = connectFirebase();
  const createMutation = useMutateRoomAndDisplayName();
  const loginMutation = useLoginMutation();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [isHost, setIsHost] = useState(false);

  function handleRoomNameChange(event: ChangeEvent<HTMLInputElement> | undefined) {
    if (event && event.target.value) {
      setRoomName(event.target.value);
    }
  }

  function handleDisplayChange(event: ChangeEvent<HTMLInputElement> | undefined) {
    if (event && event.target.value) {
      setDisplayName(event.target.value);
    }
  }

  function handleHost() {
    setIsHost(!isHost);
  }

  function handleCreateOrUpdate() {
    loginMutation.mutate(auth, {
      onSuccess: () => {
        createMutation.mutate(
          {
            roomName,
            displayName,
            isHost,
          },
          {
            onSuccess: () => {
              navigate('/room/' + roomName, {
                state: {
                  displayName,
                },
              });
            },
          }
        );
      },
    });
  }

  if (createMutation.isLoading) {
    return <div>loading...</div>;
  }

  const roomNameExists = roomName && roomName.length > 0;
  const displayNameExists = displayName && displayName.length > 0;

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label>
          Room Name: <input required type="text" value={roomName} onChange={handleRoomNameChange} />
        </label>
        {!roomNameExists && <span style={{ color: 'red' }}>Room Name is required</span>}
        <label>
          Display Name:
          <input required type="text" value={displayName} onChange={handleDisplayChange} />
        </label>
        {!displayNameExists && <span style={{ color: 'red' }}>Display Name is required</span>}
        <label>
          Room Host:
          <input type="checkbox" checked={isHost} onChange={handleHost} />
        </label>
        <button disabled={!roomNameExists || !displayNameExists} onClick={handleCreateOrUpdate}>
          Create or Update Room
        </button>
      </div>
    </>
  );
}

export default Login;
