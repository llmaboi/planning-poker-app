// import { useGetRoomByName } from '@/hooks/roomsFastify.hooks';
import { useState, FormEvent, ChangeEvent } from 'react';

function RoomLogin() {
  const [roomName, setRoomName] = useState('');
  const [roomNameError, setRoomNameError] = useState(false);
  // const roomNameQuery = useGetRoomByName({ roomName }); // TODO: needs to be a mutation

  const roomNameExists = roomName && roomName.length > 0;

  function handleRoomNameChange(event: ChangeEvent<HTMLInputElement> | undefined) {
    if (event && event.target.value) {
      setRoomName(event.target.value);
    }
  }

  function handleCreateOrFindRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!roomNameExists) {
      setRoomNameError(true);
      return;
    }
    setRoomNameError(false);
  }

  // console.log(roomNameQuery.data);

  return (
    <form onSubmit={handleCreateOrFindRoom} style={{ display: 'flex', flexDirection: 'column' }}>
      <label>
        Room Name: <input required type="text" value={roomName} onChange={handleRoomNameChange} />
      </label>
      {roomNameError && <span style={{ color: 'red' }}>Room Name is required</span>}
      <button disabled={!roomNameExists} type="submit">
        Find room
      </button>
    </form>
  );
}

export default RoomLogin;
