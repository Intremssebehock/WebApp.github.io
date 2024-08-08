import './App.css';
import NavPanel from './Components/Navigation/NavPanel';
import Clicker from './Components/Sections/Clicker';
import Shop from './Components/Sections/Shop';
import Rating from './Components/Sections/Rating';
import Invitations from './Components/Sections/Invitations';
import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const { WebApp } = window.Telegram;

      // Установите WebApp в полный экран для максимальной высоты
      WebApp.expand();

      // Установите дополнительные настройки, если необходимо
      // Вы также можете использовать WebApp.getInsets(), чтобы учесть отступы
    }
  }, []);

  return (
    <div className="App">
      <div className="App-container">
        <Routes>
          <Route path="/" element={<Clicker />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/rating" element={<Rating />} />
          <Route path="/invitations" element={<Invitations />} />
          <Route path="*" element={<Clicker />} />
        </Routes>
        <NavPanel />
      </div>
    </div>
  );
}

export default App;
