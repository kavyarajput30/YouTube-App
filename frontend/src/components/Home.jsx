import styles from "../../styles/home.module.css";
import Card from "./Card.jsx";
import { Link} from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";
const HomePage = () => {
 const [allVideos, setAllVideos] = useState([]);
  useEffect(() => {
   async function getAllData() {
    let result= await axios.get('http://localhost:8000/api/v1/home');
    if(result.data){
      // console.log(result.data.data);
      setAllVideos(result.data.data);
    }
    }
    getAllData();
  },[]);

  console.log("HOME 1")
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
