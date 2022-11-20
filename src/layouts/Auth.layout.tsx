import Header from '@/components/Header';
import { RoomDataProvider } from '@/providers/RoomData.provider';
import { Outlet } from 'react-router-dom';
import '@/layouts/Auth.layout.css';

function AuthLayout() {
  return (
    <RoomDataProvider>
      {/* <Header /> */}
      <section className="auth-body">
        <Outlet />
      </section>
    </RoomDataProvider>
  );
}

export default AuthLayout;
