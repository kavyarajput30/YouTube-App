import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import "./App.css";
import LoginPage from "./components/Login.jsx";
import RegisterPage from "./components/Register.jsx";
import HomePage from "./components/Home.jsx";
import Video from "./components/Video.jsx";
import Upload from "./components/Upload.jsx";
import Edit from "./components/Edit.jsx";
import Tweet from "./components/Tweet.jsx";
import Playlist from "./components/Playlist.jsx";
import Profile from "./components/Profile.jsx";
import TweetEditFrom from "./components/TweetEditForm.jsx"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}> {/* App as layout */}
          <Route index element={<HomePage />} /> {/* 'index' for default at path="/" */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/upload" element={<Upload/>} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="/tweet" element={<Tweet />} />
          <Route path="/tweet/edit/:id" element={<TweetEditFrom />} />
          <Route path="/playlist" element={<Playlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/:id" element={<Video/>} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
