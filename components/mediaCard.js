import styles from '../styles/mediaCard.module.css';

function MediaCard({movieData}){
  return(
    <div className={styles.cardContainer}>
      <p className={styles.movieTitle}>{movieData.Title}</p>
      <p className={styles.movieYear}>{movieData.Year}</p>
    </div> 
  )
}

export default MediaCard;
