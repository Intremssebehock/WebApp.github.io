import './App.css';
import NavPanel from './Components/Navigation/NavPanel';
import Clicker from './Components/Sections/Clicker';
import Shop from './Components/Sections/Shop';
import Rating from './Components/Sections/Rating';
import Invitations from './Components/Sections/Invitations';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function App() {
  console.log(window.Telegram.WebApp.initData);
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/');
  }, []);

  return (
    <div className="App">
      <div className="App-container">
        <Routes>
          <Route path="/" element={<Clicker />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/rating" element={<Rating />} />
          <Route path="/invitations" element={<Invitations />} />
        </Routes>
        <NavPanel />
      </div>
    </div>
  );
}

export default App;
