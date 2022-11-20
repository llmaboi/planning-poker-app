import { API_BASE, connectAxios } from '@/config/db';
import { ResponseData, DisplayRaw, ZodDisplayRaw, ZodRoomRaw, Room, Display } from '../../../types';
import { displayRawToDisplay } from './helpers';

// TODO: Implement react-query in the hooks...
// TODO: add transformers.
async function getRoomDisplays(roomId: number) {
  const { axiosInstance } = connectAxios();
  const roomDisplays = await axiosInstance.get<ResponseData<DisplayRaw[]>>(
    `/displays/room/${roomId}`
    // `${API_BASE}/displays/room/${roomId}`
  );

  const rawDisplays = roomDisplays.data.data.map((item) => ZodDisplayRaw.parse(item));
  return rawDisplays;
}

let websocket: WebSocket;
const WEBSOCKET_BASE = import.meta.env.VITE_WEBSOCKET_URL;

function connectWebsocket(urlAddition: string) {
  if (!websocket) {
    websocket = new WebSocket(WEBSOCKET_BASE + urlAddition);
  }

  return { websocket };
}

function websocketRoomDisplays(roomId: number, setDisplays: (data: Display[]) => void) {
  const { websocket } = connectWebsocket(`/displays/room/${roomId}/socket`);

  websocket.onmessage = (event) => {
    const json = JSON.parse(event.data);
    if (!json || (json && !json.data)) {
      console.log('No data to update...');
      return;
    }

    const { data }: { data: DisplayRaw[] } = json;

    const parsedDisplays = data.map((item) => ZodDisplayRaw.parse(item));
    console.log(parsedDisplays);
    // TODO: update provider...
    const transformedDisplays = parsedDisplays.map(displayRawToDisplay);
    setDisplays(transformedDisplays);
  };

  return { websocket };
}

async function getRoom(roomId: number) {
  const { axiosInstance } = connectAxios();
  // const roomDisplays = await axiosInstance.get<ResponseData<Room>>(`${API_BASE}/rooms/${roomId}`);
  const roomDisplays = await axiosInstance.get<ResponseData<Room>>(`/rooms/${roomId}`);

  const rawRoom = ZodRoomRaw.parse(roomDisplays.data.data);
  return rawRoom;
}

async function updateDisplay({ roomId, name, id, cardValue, isHost }: Display) {
  const { axiosInstance } = connectAxios();
  const displayData = await axiosInstance.patch<ResponseData<DisplayRaw>>(
    `/api/displays/${id}`,
    // `${API_BASE}/displays/${id}`,
    {
      cardValue,
      roomId,
      name,
      isHost,
    }
  );

  const rawDisplay = ZodDisplayRaw.parse(displayData.data.data);
  return rawDisplay;
}

export {
  //   displayFromFirestore,
  //   getDisplaysFromQuerySnapshot,
  getRoomDisplays,
  //   getRoomDisplaysSnapshotQuery,
  getRoom,
  //   getRoomSnapshotQuery,
  //   resetCardValues,
  //   setRoomLabel,
  updateDisplay,
  websocketRoomDisplays,
};
