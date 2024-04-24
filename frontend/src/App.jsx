import React from "react";
import "./App.css";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import UserContextProvider from "./context/UserContextProvider";
import VideoContextProvider from "./context/HomeVideoContextProvider";

function App() {
  
  return (
    <UserContextProvider>
      <VideoContextProvider>
        <div className="App">
          {" "}
          {/* Root container for styling */}
          <Header />
          <main className="content-area">
            {" "}
            {/* Main content container */}
            <Outlet />
          </main>
        </div>
      </VideoContextProvider>
    </UserContextProvider>
  );
}

export default App;
