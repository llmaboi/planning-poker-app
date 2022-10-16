import { useNavigate } from 'react-router-dom';

function NotAuthorized() {
  const navigate = useNavigate();

  function returnHome() {
    navigate('/');
  }

  return (
    <div>
      You are not authorized <button onClick={returnHome}>To Login</button>
    </div>
  );
}

export default NotAuthorized;
