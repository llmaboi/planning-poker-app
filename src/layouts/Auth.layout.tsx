import Header from '@/components/Header';
import { RoomDataProvider } from '@/providers/RoomData.provider';
import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <RoomDataProvider>
      <div
        style={{
          display: 'block',
          width: '100vw',
          margin: '1rem',
        }}
      >
        {/* <Header /> */}
      </div>
      <div>
        <Outlet />
      </div>
    </RoomDataProvider>
  );
}

export default AuthLayout;
