import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Room from './Room';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/">
          <Route element={<Login />} path="" />
          <Route path="/room/:roomName" element={<Room />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
