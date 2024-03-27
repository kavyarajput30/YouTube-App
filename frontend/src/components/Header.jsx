import { Link } from "react-router-dom";
import styles from "../../styles/header.module.css";
import { useState } from "react";
import axios from "axios";
const Header = ({ userData }) => {
const [searchQuery, setSearchQuery] = useState("");
const [allvideos, setAllVideos] = useState([]);
 async function searchQueryFunction(e){
  e.preventDefault(); // Prevent page reload
    try{
      const response = await axios.get(
        `http://localhost:8000/api/v1/videos?query=${searchQuery}`
      );
      if(response){
        let allvideos= response.data.data;
        setAllVideos(allvideos);
        console.log(allvideos);
      }

    }catch(err){
      console.log('Error Fetching Data')
    }
 }
  return (
    <div className={styles.main_div}>
      <div>
        <h2>MeTube</h2>
      </div>

      <div>
        <form onSubmit={searchQueryFunction} >
          <input type="search" value={searchQuery}  autoComplete="off" onChange={(e) => setSearchQuery(e.target.value)} name="query" id="query" placeholder="search query"  style={{fontSize:"17px", padding:"2px 10px", outline:'none', borderRadius:'15px', border:'1px solid black', marginRight:'5px'}}/>
          <button type="submit" style={{ borderRadius:'13px', fontSize:"17px", padding:"5px 24px",border:'1px solid black', backgroundColor:'pink' }}>Search</button>
        </form>
      </div>
      <div style={{ display: "flex", gap: "15px" }}>
        <Link to="/profile">
          {" "}
          <div>Profile</div>{" "}
        </Link>
        <div>Videos Info</div>
        <div>{userData.fullname}</div>
        <div>Logout</div>
      </div>
    </div>
  );
};
export default Header;
