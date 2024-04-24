import React from "react";
import VideoContext from "./HomeVideoContext.js";
import { useState, useEffect } from "react";
import axios from "axios";

const VideoContextProvider = ({ children }) => {
  const [allVideos, setAllVideos] = useState([]);
  useEffect(() => {
    async function getAllData() {
      let result = await axios.get("http://localhost:8000/api/v1/home");
      if (result.data) {
        setAllVideos(result.data.data);
      }
    }
    getAllData();
  }, []);

  return (
    <VideoContext.Provider value={{ allVideos, setAllVideos }}>
      {children}
    </VideoContext.Provider>
  );
};

export default VideoContextProvider;
