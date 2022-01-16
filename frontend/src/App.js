import React from 'react';
//import logo from './logo.svg';
import './App.css';
import CSVgenerator from "./Inventory";function App() {
  return (
    <div className="App">
      <header className="App-header">
        <CSVgenerator />
      </header>
    </div>
  );
}export default App;