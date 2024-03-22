import styles from "../../styles/home.module.css";
import Header from "./Header.jsx";
import Card from "./Card.jsx";

const HomePage = () => {
  return (
    <div className={styles.main_div}>
      <Header />
      <div className={styles.card_div}>
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
};

export default HomePage;
