import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

function AuthLayout() {
  return (
    <>
      <div
        style={{
          display: 'block',
          width: '100vw',
          margin: '1rem',
        }}
      >
        <Header />
      </div>
      <div>
        <Outlet />
      </div>
    </>
  );
}

export default AuthLayout;
