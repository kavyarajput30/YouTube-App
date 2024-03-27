import styles from "../../styles/home.module.css";
import Header from "./Header.jsx";
import Card from "./Card.jsx";
import { useLocation } from 'react-router-dom';

const HomePage = () => {
  // console.log(username , password)
  const location = useLocation();
  const userData = location.state?.userData; 
  return (
    <div className={styles.main_div}>
      <Header userData={userData} />
      <div className={styles.card_div}>
     
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>

      </div>
    </div>
  );
};

export default HomePage;
