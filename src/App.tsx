import '@/App.css';
import Login from '@/components/Login';
import NoPathFound from '@/components/NoPathFound';
import NotAuthorized from '@/components/NotAuthorized';
import Room from '@/components/Room';
import AuthLayout from '@/layouts/Auth.layout';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/">
          <Route element={<Login />} path="" />
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
