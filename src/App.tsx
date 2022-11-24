import '@/App.css';
import DisplayLogin from '@/components/DisplayLogin';
import NoPathFound from '@/components/NoPathFound';
import NotAuthorized from '@/components/NotAuthorized';
import Room from '@/components/Room';
import RoomLogin from '@/components/RoomLogin';
import AuthLayout from '@/layouts/Auth.layout';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/">
          {/* TODO: Enhance login experience... */}
          <Route element={<RoomLogin />} path="" />
          <Route element={<DisplayLogin />} path=":id" />
        </Route>
        <Route element={<AuthLayout />}>
          {/* <Route path="/room/:roomName" element={<Room />} /> */}
          <Route path="/room/:roomId" element={<Room />} />
        </Route>
        <Route path="/noAuth" element={<NotAuthorized />} />
        <Route path="*" element={<NoPathFound />} />
      </Routes>
    </div>
  );
}

export default App;
