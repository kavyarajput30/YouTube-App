import React, { useState } from "react";
import styles from "../../styles/dashboard.module.css";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
function Dashboard() {
  const { ownerId } = useParams();
  const [allvideos, setAllVideos] = useState([]);
  const [stats, setStats] = useState([]);
  const getAllVideos = async () => {
    const res = await axios.get(
      `http://localhost:8000/api/v1/dashboard/videos/${ownerId}`,

      { withCredentials: true }
    );
    if (res.data.success) {
      setAllVideos(res.data.data);
      //   console.log(res.data.data);
    }
  };

  const getAllStats = async () => {
    const res = await axios.get(
      `http://localhost:8000/api/v1/dashboard/stats/${ownerId}`,

      { withCredentials: true }
    );
    if (res.data.success) {
      setStats(res.data.data);
      console.log(res.data.data);
    }
  };

  useEffect(() => {
    getAllVideos();
    getAllStats();
  }, []);

  return (
    <>
      <div className={styles.main_div}>
        <div className={styles.stats_div}>
          <div className={styles.cover_div}>
            <img src={stats?.channelInfo?.coverImage} alt="Cover Image" />
          </div>
          <div className={styles.info_div}>
            <img src={stats?.channelInfo?.avatar} alt="Cover Image" />
            <h1>The Youtube App My Channel</h1>
          </div>
        </div>
        <div className={styles.videos_div}>
          {allvideos.map((video) => (
            <div key={video._id} className={styles.video_div_main}>
              <Link to={`/${video._id}`} key={video._id} className={styles.link}>
                <div className={styles.video_div}>
                  <img src={video.thumbnail} alt="Cat Image" width="400px" />
                </div>
                <div className={styles.video_info_div}>
                  <h2>{video.title}</h2>
                  <p>{video.description}</p>
                  <p>❤️{video.VideoLikesInfo.length}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
