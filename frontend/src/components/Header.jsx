import styles from "../../styles/header.module.css";
const Header = () => {
  return (
    <div className={styles.main_div}>
      <h2>MeTube</h2>
      <div style={{ display: "flex" , gap:'15px'}}>
        <div>Profile</div>
        <div>Dashboard</div>
        <div>Videos Info</div>
        <div>Contact Us</div>
        <div>Logout</div>
      </div>
    </div>
  );
};
export default Header;
