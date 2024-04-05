import styles from '../../styles/card.module.css';
const Card = ({video})=>{

    return(
        <div className={styles.main_div}>
          <div className={styles.video_div}>
            <img src={video.thumbnail} alt="Cat Image" width='100%'/>
          </div>
          <div className={styles.info_div}>
            <div className={styles.like_div}>
              <span>❤️{video.likes.length}</span>  <span>👁️{video.views}</span>
            </div>
            <h3>{video.title}</h3>
            <p>{video.description}</p>
          </div>
        </div>
    )
}
export default Card;