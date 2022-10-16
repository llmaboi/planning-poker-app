import { useNavigate } from 'react-router-dom';

function NoPathFound() {
  const navigate = useNavigate();

  function returnHome() {
    navigate('/');
  }

  return (
    <div>
      No path found... <button onClick={returnHome}>To Login</button>
    </div>
  );
}

export default NoPathFound;
