
import React from 'react';
import './App.css';
import Header from './components/Header';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="App"> {/* Root container for styling */}
      <Header />
      <main className="content-area"> {/* Main content container */}
        <Outlet />
      </main>
    </div>
  );
}

export default App;
