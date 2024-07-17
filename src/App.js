import './App.css';
import Clicker from './Components/Sections/Clicker';

function App() {
  console.log(window.Telegram.WebApp.initData);

  return (
    <div className="App">
      <div className="App-container">
        <Clicker />
      </div>
    </div>
  );
}

export default App;
