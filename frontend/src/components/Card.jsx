import styles from '../../styles/card.module.css';
import catImg2 from '../../public/cat-img-2.jpg';
const Card = ()=>{

    return(
        <div className={styles.main_div}>
          <div className={styles.video_div}>
            <img src={catImg2} alt="Cat Image" width='300'/>
          </div>
          <div className={styles.info_div}>
            <div className={styles.like_div}>
              <span>❤️1000</span>  <span>👁️2400k</span>
            </div>
            <h3>Video Title</h3>
            <p>Lorem ipsum dolor sit amet. Velit facilis ea omnis placeat magni reiciendis odio accusamus dolorum, praesentium suscipit.</p>
          </div>
        </div>
    )
}
export default Card;