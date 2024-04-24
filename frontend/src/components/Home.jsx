import styles from "../../styles/home.module.css";
import Card from "./Card.jsx";
import { Link} from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";
import { useContext} from "react";
import UserContext from "../context/UserContext.js";
import VideoContext from "../context/HomeVideoContext.js";
const HomePage = () => {

 const {user} = useContext(UserContext);
 const {allVideos} = useContext(VideoContext);

  return (
    <div className={styles.main_div}>
      <div className={styles.card_div}>
      {allVideos.map((video) => (
        <Link to={`/${video._id}`} key={video._id} > <Card key={video._id} video={video} /> </Link>
      ))}
      </div>
    </div>
  );
};

export default HomePage;
