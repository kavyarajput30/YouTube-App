import { Link } from "react-router-dom";
import styles from "../../styles/header.module.css";
const Header = ({ userData }) => {
  console.log(userData);
  return (
    <div className={styles.main_div}>
      <h2>MeTube</h2>
      <div style={{ display: "flex" , gap:'15px'}}>
        <Link to="/profile">  <div>Profile</div> </Link>
       
       
        <div>Dashboard</div>
        <div>Videos Info</div>
        <div>{userData.fullname}</div>
        <div>Logout</div>
      </div>
    </div>
  );
};
export default Header;
