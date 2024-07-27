import './App.css';
import NavPanel from './Components/Navigation/NavPanel';
import Clicker from './Components/Sections/Clicker';
import Shop from './Components/Sections/Shop';
import Rating from './Components/Sections/Rating';
import Invitations from './Components/Sections/Invitations';
import { Routes, Route } from 'react-router-dom';

function App() {
  console.log(window.Telegram.WebApp.initData);

  return (
    <div className="App">
      <div className="App-container">
        <Clicker />
        <NavPanel />
      </div>
    </div>
  );
}

export default App;
